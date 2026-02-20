package com.gestaobras.gestaoobrasapi.domain.repository;

import com.gestaobras.gestaoobrasapi.domain.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    boolean existsByNumeroProtocolo(String numeroProtocolo);
    Optional<Orcamento> findByNumeroProtocolo(String numeroProtocolo);
}