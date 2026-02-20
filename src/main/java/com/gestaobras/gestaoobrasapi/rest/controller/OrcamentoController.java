package com.gestaobras.gestaoobrasapi.rest.controller;

import com.gestaobras.gestaoobrasapi.domain.model.Orcamento;
import com.gestaobras.gestaoobrasapi.domain.service.OrcamentoService;
import com.gestaobras.gestaoobrasapi.rest.dto.OrcamentoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orcamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrcamentoController {

    private final OrcamentoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Orcamento criar(@RequestBody OrcamentoDTO dto) {
        return service.salvar(dto);
    }

    @GetMapping
    public List<Orcamento> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Orcamento buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}/finalizar")
    public Orcamento finalizar(@PathVariable Long id) {
        return service.finalizar(id);
    }
}