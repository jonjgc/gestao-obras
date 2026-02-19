package com.gestaobras.gestaoobrasapi.domain.model;

import com.gestaobras.gestaoobrasapi.domain.model.enums.StatusMedicao;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "medicao")
public class Medicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_medicao", unique = true, nullable = false)
    private String numeroMedicao; // 

    @Column(name = "data_medicao", nullable = false)
    private LocalDate dataMedicao; // 

    @Column(name = "valor_medicao", nullable = false)
    private BigDecimal valorMedicao; // 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMedicao status = StatusMedicao.ABERTA; // 

    @Column(columnDefinition = "TEXT")
    private String observacao; // 

    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    private Orcamento orcamento; // 

    @OneToMany(mappedBy = "medicao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemMedicao> itensMedidos = new ArrayList<>();
}