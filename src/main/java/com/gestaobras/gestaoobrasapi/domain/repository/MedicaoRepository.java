package com.gestaobras.gestaoobrasapi.domain.repository;

import com.gestaobras.gestaoobrasapi.domain.model.Medicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicaoRepository extends JpaRepository<Medicao, Long> {
    boolean existsByNumeroMedicao(String numeroMedicao);
}