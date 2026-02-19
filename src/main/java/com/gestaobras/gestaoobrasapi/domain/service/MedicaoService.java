package com.gestaobras.gestaoobrasapi.domain.service;

import com.gestaobras.gestaoobrasapi.domain.exception.RegraNegocioException;
import com.gestaobras.gestaoobrasapi.domain.model.*;
import com.gestaobras.gestaoobrasapi.domain.model.enums.StatusMedicao;
import com.gestaobras.gestaoobrasapi.domain.repository.ItemRepository;
import com.gestaobras.gestaoobrasapi.domain.repository.MedicaoRepository;
import com.gestaobras.gestaoobrasapi.domain.repository.OrcamentoRepository;
import com.gestaobras.gestaoobrasapi.rest.dto.ItemMedicaoDTO;
import com.gestaobras.gestaoobrasapi.rest.dto.MedicaoDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicaoService {

    private final MedicaoRepository medicaoRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public Medicao salvar(MedicaoDTO dto) {
        // 1. Valida se o Orçamento existe
        Orcamento orcamento = orcamentoRepository.findById(dto.getOrcamentoId())
                .orElseThrow(() -> new RegraNegocioException("Orçamento não encontrado."));

        // 2. Valida unicidade do número da medição
        if (medicaoRepository.existsByNumeroMedicao(dto.getNumeroMedicao())) {
            throw new RegraNegocioException("Já existe uma medição com este número.");
        }

        // 3. Prepara a Medição
        Medicao medicao = new Medicao();
        medicao.setNumeroMedicao(dto.getNumeroMedicao());
        medicao.setDataMedicao(dto.getDataMedicao());
        medicao.setObservacao(dto.getObservacao());
        medicao.setOrcamento(orcamento);
        medicao.setStatus(StatusMedicao.ABERTA);

        BigDecimal valorTotalMedicao = BigDecimal.ZERO;
        List<ItemMedicao> itensMedidosEntidade = new ArrayList<>();

        // 4. Processa cada item medido
        for (ItemMedicaoDTO itemDto : dto.getItensMedidos()) {
            Item itemOrcamento = itemRepository.findById(itemDto.getItemId())
                    .orElseThrow(() -> new RegraNegocioException("Item de orçamento não encontrado: ID " + itemDto.getItemId()));

            // A Lógica Crítica: Verifica se estoura o saldo
            BigDecimal novaAcumulada = itemOrcamento.getQuantidadeAcumulada().add(itemDto.getQuantidadeMedida());
            
            if (novaAcumulada.compareTo(itemOrcamento.getQuantidade()) > 0) {
                throw new RegraNegocioException("A medida excede a quantidade disponível para o item: " + itemOrcamento.getDescricao());
            }

            // Atualiza o acumulado no Item original
            itemOrcamento.setQuantidadeAcumulada(novaAcumulada);
            itemRepository.save(itemOrcamento);

            // Cria o registro do ItemMedicao
            ItemMedicao itemMedicao = new ItemMedicao();
            itemMedicao.setItem(itemOrcamento); 
            itemMedicao.setMedicao(medicao);    
            itemMedicao.setQuantidadeMedida(itemDto.getQuantidadeMedida());
            
            // Calcula valor monetário deste item na medição
            BigDecimal valorItemMedido = itemDto.getQuantidadeMedida().multiply(itemOrcamento.getValorUnitario());
            itemMedicao.setValorTotalMedido(valorItemMedido);

            valorTotalMedicao = valorTotalMedicao.add(valorItemMedido);
            itensMedidosEntidade.add(itemMedicao);
        }

        medicao.setValorMedicao(valorTotalMedicao);
        medicao.setItensMedidos(itensMedidosEntidade);

        return medicaoRepository.save(medicao);
    }
}