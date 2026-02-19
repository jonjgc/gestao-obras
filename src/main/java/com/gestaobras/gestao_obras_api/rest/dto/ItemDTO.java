package com.gestaobras.gestaoobrasapi.rest.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemDTO {
    private String descricao;
    private BigDecimal quantidade;
    private BigDecimal valorUnitario;
}