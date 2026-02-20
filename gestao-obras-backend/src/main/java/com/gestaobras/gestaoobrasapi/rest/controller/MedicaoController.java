package com.gestaobras.gestaoobrasapi.rest.controller;

import com.gestaobras.gestaoobrasapi.domain.model.Medicao;
import com.gestaobras.gestaoobrasapi.domain.service.MedicaoService;
import com.gestaobras.gestaoobrasapi.rest.dto.MedicaoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medicoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicaoController {

    private final MedicaoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Medicao criar(@RequestBody MedicaoDTO dto) {
        return service.salvar(dto);
    }
}