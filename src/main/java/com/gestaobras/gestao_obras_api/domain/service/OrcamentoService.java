package com.gestaobras.gestaoobrasapi.domain.service;

import com.gestaobras.gestaoobrasapi.domain.exception.RegraNegocioException;
import com.gestaobras.gestaoobrasapi.domain.model.Item;
import com.gestaobras.gestaoobrasapi.domain.model.Orcamento;
import com.gestaobras.gestaoobrasapi.domain.model.enums.StatusOrcamento;
import com.gestaobras.gestaoobrasapi.domain.repository.OrcamentoRepository;
import com.gestaobras.gestaoobrasapi.rest.dto.OrcamentoDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;

    @Transactional
    public Orcamento salvar(OrcamentoDTO dto) {
        // Regra: Protocolo único
        if (orcamentoRepository.existsByNumeroProtocolo(dto.getNumeroProtocolo())) {
            throw new RegraNegocioException("Já existe um orçamento com este protocolo.");
        }

        Orcamento orcamento = new Orcamento();
        orcamento.setNumeroProtocolo(dto.getNumeroProtocolo());
        orcamento.setTipoOrcamento(dto.getTipoOrcamento());
        orcamento.setValorTotal(dto.getValorTotal());
        orcamento.setDataCriacao(dto.getDataCriacao());
        orcamento.setStatus(StatusOrcamento.ABERTO);

        // Converte os itens do DTO para a Entidade e faz o vínculo
        if (dto.getItens() != null) {
            List<Item> itens = dto.getItens().stream().map(itemDto -> {
                Item item = new Item();
                item.setDescricao(itemDto.getDescricao());
                item.setQuantidade(itemDto.getQuantidade());
                item.setValorUnitario(itemDto.getValorUnitario());
                item.calcularValorTotal(); // Calcula total do item (qtd * unitario)
                item.setOrcamento(orcamento); 
                return item;
            }).collect(Collectors.toList());
            orcamento.setItens(itens);
        }

        validarTotais(orcamento);

        return orcamentoRepository.save(orcamento);
    }

    @Transactional
    public Orcamento finalizar(Long id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Orçamento não encontrado."));
        
        // Garante que os totais ainda batem antes de fechar
        validarTotais(orcamento);
        
        orcamento.setStatus(StatusOrcamento.FINALIZADO);
        return orcamentoRepository.save(orcamento);
    }

    public List<Orcamento> listarTodos() {
        return orcamentoRepository.findAll();
    }

    public Orcamento buscarPorId(Long id) {
        return orcamentoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Orçamento não encontrado."));
    }

    // O valor total do orçamento e a soma dos valores dos itens deve ser o mesmo.
    private void validarTotais(Orcamento orcamento) {
        BigDecimal somaItens = orcamento.getItens().stream()
                .map(Item::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // compareTo retorna 0 se forem matematicamente iguais
        if (orcamento.getValorTotal().compareTo(somaItens) != 0) {
            throw new RegraNegocioException("O valor total do orçamento (" + orcamento.getValorTotal() + 
                ") não confere com a soma dos itens (" + somaItens + ").");
        }
    }
}