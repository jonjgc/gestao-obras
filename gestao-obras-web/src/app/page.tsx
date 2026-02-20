'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import { setCookie } from 'nookies';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { login, senha });
      const { token } = response.data;

      setCookie(undefined, 'gestaoobras.token', token, {
        maxAge: 60 * 60 * 2,
        path: '/',
      });

      dispatch(loginSuccess(token));

      router.push('/dashboard');
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert('Credenciais inválidas. Verifique os seus dados e tente novamente.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <h2>Acesso ao Sistema</h2>
        <Input 
          type="text" 
          placeholder="Utilizador" 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Palavra-passe" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
      </Form>
    </Container>
  );
}