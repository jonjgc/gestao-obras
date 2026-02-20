package com.gestaobras.gestaoobrasapi.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "itens")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String descricao;

    private BigDecimal quantidade;

    private BigDecimal valorUnitario;

    private BigDecimal valorTotal;

    private BigDecimal quantidadeAcumulada = BigDecimal.ZERO;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    private Orcamento orcamento;

    public void calcularValorTotal() {
        if (quantidade != null && valorUnitario != null) {
            this.valorTotal = quantidade.multiply(valorUnitario);
        } else {
            this.valorTotal = BigDecimal.ZERO;
        }
    }
}