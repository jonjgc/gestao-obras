package com.gestaobras.gestaoobrasapi.domain.service;

import com.gestaobras.gestaoobrasapi.domain.exception.RegraNegocioException;
import com.gestaobras.gestaoobrasapi.domain.model.Item;
import com.gestaobras.gestaoobrasapi.domain.model.Medicao;
import com.gestaobras.gestaoobrasapi.domain.model.Orcamento;
import com.gestaobras.gestaoobrasapi.domain.repository.ItemRepository;
import com.gestaobras.gestaoobrasapi.domain.repository.MedicaoRepository;
import com.gestaobras.gestaoobrasapi.domain.repository.OrcamentoRepository;
import com.gestaobras.gestaoobrasapi.rest.dto.ItemMedicaoDTO;
import com.gestaobras.gestaoobrasapi.rest.dto.MedicaoDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicaoServiceTest {

    @Mock
    private MedicaoRepository medicaoRepository;

    @Mock
    private OrcamentoRepository orcamentoRepository;

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private MedicaoService medicaoService;

    @Test
    @DisplayName("Deve salvar a medição com sucesso quando a quantidade for válida")
    void deveSalvarMedicaoComSucesso() {
        // 1. Cenário (Arrange)
        Long orcamentoId = 1L;
        Long itemId = 1L;

        Orcamento orcamento = new Orcamento();
        orcamento.setId(orcamentoId);

        Item item = new Item();
        item.setId(itemId);
        item.setQuantidade(new BigDecimal("100.00")); // Limite total do item
        item.setQuantidadeAcumulada(new BigDecimal("50.00")); // Já mediu 50 antes
        item.setValorUnitario(new BigDecimal("10.00"));

        ItemMedicaoDTO itemDto = new ItemMedicaoDTO();
        itemDto.setItemId(itemId);
        itemDto.setQuantidadeMedida(new BigDecimal("20.00")); // Tentando medir mais 20

        MedicaoDTO dto = new MedicaoDTO();
        dto.setOrcamentoId(orcamentoId);
        dto.setItensMedidos(List.of(itemDto));

        // Simulando o comportamento do banco de dados (Mockito)
        when(orcamentoRepository.findById(orcamentoId)).thenReturn(Optional.of(orcamento));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(medicaoRepository.save(any(Medicao.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. Ação (Act)
        Medicao medicaoSalva = medicaoService.salvar(dto);

        // 3. Verificação (Assert)
        assertNotNull(medicaoSalva);
        assertEquals(new BigDecimal("70.00"), item.getQuantidadeAcumulada()); // 50 + 20
        verify(itemRepository, times(1)).save(item);
        verify(medicaoRepository, times(1)).save(any(Medicao.class));
    }

    @Test
    @DisplayName("Deve lançar RegraNegocioException quando a medição ultrapassar o saldo do item")
    void deveLancarExcecaoQuandoUltrapassarSaldo() {
        // 1. Cenário (Arrange)
        Long orcamentoId = 1L;
        Long itemId = 1L;

        Orcamento orcamento = new Orcamento();
        orcamento.setId(orcamentoId);

        Item item = new Item();
        item.setId(itemId);
        item.setDescricao("Cimento");
        item.setQuantidade(new BigDecimal("100.00")); // Limite total
        item.setQuantidadeAcumulada(new BigDecimal("90.00")); // Já mediu 90

        ItemMedicaoDTO itemDto = new ItemMedicaoDTO();
        itemDto.setItemId(itemId);
        itemDto.setQuantidadeMedida(new BigDecimal("15.00")); // Tentando medir 15 (90+15 = 105 -> Estourou!)

        MedicaoDTO dto = new MedicaoDTO();
        dto.setOrcamentoId(orcamentoId);
        dto.setItensMedidos(List.of(itemDto));

        when(orcamentoRepository.findById(orcamentoId)).thenReturn(Optional.of(orcamento));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        // 2 e 3. Ação e Verificação (Act & Assert)
        RegraNegocioException exception = assertThrows(RegraNegocioException.class, () -> {
            medicaoService.salvar(dto);
        });

        assertTrue(exception.getMessage().contains("A medida excede a quantidade disponível"));
        verify(medicaoRepository, never()).save(any(Medicao.class)); // Garante que não salvou no banco
    }
}