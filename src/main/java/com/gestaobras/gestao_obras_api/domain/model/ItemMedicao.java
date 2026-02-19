package com.gestaobras.gestaoobrasapi.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "item_medicao")
public class ItemMedicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantidade_medida", nullable = false)
    private BigDecimal quantidadeMedida; // 

    @Column(name = "valor_total_medido", nullable = false)
    private BigDecimal valorTotalMedido; // 

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item; // 

    @ManyToOne
    @JoinColumn(name = "medicao_id", nullable = false)
    private Medicao medicao; // 
}