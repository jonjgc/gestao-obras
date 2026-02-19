package com.gestaobras.gestaoobrasapi.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao; // 

    @Column(nullable = false)
    private BigDecimal quantidade; // 

    @Column(name = "valor_unitario", nullable = false)
    private BigDecimal valorUnitario; // 

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal; // 

    @Column(name = "quantidade_acumulada")
    private BigDecimal quantidadeAcumulada = BigDecimal.ZERO; // 

    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    private Orcamento orcamento; // 
    
    // Método auxiliar para atualizar o total automaticamente
    public void calcularValorTotal() {
        if (this.quantidade != null && this.valorUnitario != null) {
            this.valorTotal = this.quantidade.multiply(this.valorUnitario);
        }
    }
}