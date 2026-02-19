package com.gestaobras.gestaoobrasapi.rest.controller;

import com.gestaobras.gestaoobrasapi.domain.model.Usuario;
import com.gestaobras.gestaoobrasapi.domain.repository.UsuarioRepository;
import com.gestaobras.gestaoobrasapi.infra.security.TokenService;
import com.gestaobras.gestaoobrasapi.rest.dto.LoginDTO;
import com.gestaobras.gestaoobrasapi.rest.dto.TokenJWTDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final AuthenticationManager manager;
    private final TokenService tokenService;
    private final UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity efeturarLogin(@RequestBody @Valid LoginDTO dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.getLogin(), dados.getSenha());
        var authentication = manager.authenticate(authenticationToken);

        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        return ResponseEntity.ok(new TokenJWTDTO(tokenJWT));
    }

    // Endpoint auxiliar APENAS para criar o primeiro usuário (remova em produção se quiser)
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid LoginDTO dados) {
        if(repository.findByLogin(dados.getLogin()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(dados.getSenha());
        Usuario newUser = new Usuario(dados.getLogin(), encryptedPassword);

        repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}