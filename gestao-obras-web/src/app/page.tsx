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
  padding: 20px;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
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
        <Title>Acesso ao Sistema</Title>
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