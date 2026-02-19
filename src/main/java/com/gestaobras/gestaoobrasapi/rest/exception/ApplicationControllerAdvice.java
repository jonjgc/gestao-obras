package com.gestaobras.gestaoobrasapi.rest.exception;

import com.gestaobras.gestaoobrasapi.domain.exception.RegraNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationControllerAdvice {

    @ExceptionHandler(RegraNegocioException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRegraNegocioException(RegraNegocioException ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Regra de Negócio");
        erro.put("mensagem", ex.getMessage());
        return erro;
    }
}