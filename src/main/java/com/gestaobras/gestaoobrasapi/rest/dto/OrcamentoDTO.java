package com.gestaobras.gestaoobrasapi.rest.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrcamentoDTO {
    private String numeroProtocolo;
    private String tipoOrcamento;
    private BigDecimal valorTotal;
    private LocalDate dataCriacao;
    private List<ItemDTO> itens;
}