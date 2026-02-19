package com.gestaobras.gestaoobrasapi.rest.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class MedicaoDTO {
    private String numeroMedicao;
    private LocalDate dataMedicao;
    private String observacao;
    private Long orcamentoId; // ID do Orçamento vinculado
    private List<ItemMedicaoDTO> itensMedidos;
}