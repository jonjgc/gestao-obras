package com.gestaobras.gestaoobrasapi.rest.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class TokenJWTDTO {
    private String token;
}