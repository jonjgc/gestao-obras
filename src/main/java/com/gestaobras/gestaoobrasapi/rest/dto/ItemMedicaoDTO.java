package com.gestaobras.gestaoobrasapi.rest.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemMedicaoDTO {
    private Long itemId; // Referência ao ID do Item do Orçamento
    private BigDecimal quantidadeMedida;
}