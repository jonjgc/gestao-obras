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
import java.time.LocalDate;
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
        
        Orcamento orcamento = orcamentoRepository.findById(dto.getOrcamentoId())
                .orElseThrow(() -> new RegraNegocioException("Orçamento não encontrado."));

        // Gera dados automáticos se o frontend não enviou
        String numeroMedicao = dto.getNumeroMedicao() != null ? dto.getNumeroMedicao() : "MED-" + System.currentTimeMillis();
        LocalDate dataMedicao = dto.getDataMedicao() != null ? dto.getDataMedicao() : LocalDate.now();

        // Valida unicidade do número da medição
        if (medicaoRepository.existsByNumeroMedicao(numeroMedicao)) {
            throw new RegraNegocioException("Já existe uma medição com este número.");
        }

        // Prepara a Medição
        Medicao medicao = new Medicao();
        medicao.setNumeroMedicao(numeroMedicao);
        medicao.setDataMedicao(dataMedicao);
        medicao.setObservacao(dto.getObservacao() != null ? dto.getObservacao() : "Medição realizada pelo sistema.");
        medicao.setOrcamento(orcamento);
        medicao.setStatus(StatusMedicao.ABERTA);

        BigDecimal valorTotalMedicao = BigDecimal.ZERO;
        List<ItemMedicao> itensMedidosEntidade = new ArrayList<>();

        // Processa cada item medido
        for (ItemMedicaoDTO itemDto : dto.getItensMedidos()) {
            Item itemOrcamento = itemRepository.findById(itemDto.getItemId())
                    .orElseThrow(() -> new RegraNegocioException("Item de orçamento não encontrado: ID " + itemDto.getItemId()));

            // Evita que a quantidade que vem do Front seja nula
            BigDecimal qtdSendoMedida = itemDto.getQuantidadeMedida() != null ? itemDto.getQuantidadeMedida() : BigDecimal.ZERO;
            if (qtdSendoMedida.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RegraNegocioException("A quantidade medida deve ser maior que zero.");
            }

            BigDecimal qtdAcumuladaAtual = itemOrcamento.getQuantidadeAcumulada() != null 
                    ? itemOrcamento.getQuantidadeAcumulada() 
                    : BigDecimal.ZERO;

            //Verifica se estoura o saldo
            BigDecimal novaAcumulada = qtdAcumuladaAtual.add(qtdSendoMedida);
            
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
            itemMedicao.setQuantidadeMedida(qtdSendoMedida);
            
            // Calcula valor monetário deste item na medição
            BigDecimal valorItemMedido = qtdSendoMedida.multiply(itemOrcamento.getValorUnitario());
            itemMedicao.setValorTotalMedido(valorItemMedido);

            valorTotalMedicao = valorTotalMedicao.add(valorItemMedido);
            itensMedidosEntidade.add(itemMedicao);
        }

        medicao.setValorMedicao(valorTotalMedicao);
        medicao.setItensMedidos(itensMedidosEntidade);

        return medicaoRepository.save(medicao);
    }
}