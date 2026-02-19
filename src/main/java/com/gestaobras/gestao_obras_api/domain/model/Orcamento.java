package com.gestaobras.gestaoobrasapi.domain.model;

import com.deltacode.gestaoobrasapi.domain.model.enums.StatusOrcamento;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orcamento")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_protocolo", unique = true, nullable = false)
    private String numeroProtocolo; // 

    @Column(name = "tipo_orcamento", nullable = false)
    private String tipoOrcamento; // 

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal; // 

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao; // 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusOrcamento status = StatusOrcamento.ABERTO; // 

    // Cascade ALL garante que se salvar o orçamento, salva os itens.
    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> itens = new ArrayList<>(); // 
}