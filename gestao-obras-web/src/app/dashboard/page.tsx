'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';

// --- Interfaces ---
interface Orcamento {
    id: number;
    numeroProtocolo: string;
    tipoOrcamento: string;
    valorTotal: number;
    dataCriacao: string;
    status: string;
}

// --- Estilos ---

const TrClicavel = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.text};
`;

const LogoutButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #d9363e;
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;

  &:hover {
    background-color: #005bb5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 15px;
  text-align: left;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  background-color: ${(props) => (props.$status === 'ABERTO' ? '#e6f7ff' : '#f6ffed')};
  color: ${(props) => (props.$status === 'ABERTO' ? '#1890ff' : '#52c41a')};
`;

export default function Dashboard() {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const router = useRouter();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        // Se estiver autenticado, vai buscar os orçamentos
        const fetchOrcamentos = async () => {
            try {
                const response = await api.get('/api/orcamentos');

                console.log('Resposta real da API:', response.data);

                if (Array.isArray(response.data)) {
                    setOrcamentos(response.data);
                } else {
                    console.error('Atenção: A API não devolveu uma lista!', response.data);
                    setOrcamentos([]); 
                }

            } catch (error) {
                console.error('Erro ao buscar orçamentos:', error);
                setOrcamentos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrcamentos();
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        destroyCookie(undefined, 'gestaoobras.token', { path: '/' });
        dispatch(logout()); 
        router.push('/');
    };

    if (loading) {
        return <Container>A carregar...</Container>;
    }

    return (
        <Container>
            <Header>
                <Title>Gestão de Obras - Dashboard</Title>
                <LogoutButton onClick={handleLogout}>Sair (Logout)</LogoutButton>
            </Header>
            <ActionButton onClick={() => router.push('/dashboard/novo')}>
                + Novo Orçamento
            </ActionButton>
            <h2>Lista de Orçamentos</h2>

            {orcamentos.length === 0 ? (
                <p>Nenhum orçamento encontrado.</p>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Protocolo</Th>
                            <Th>Tipo</Th>
                            <Th>Valor Total</Th>
                            <Th>Data de Criação</Th>
                            <Th>Status</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {orcamentos.map((orcamento) => (
                            <TrClicavel 
                                key={orcamento.id} 
                                onClick={() => router.push(`/dashboard/orcamento/${orcamento.id}`)}
                            >
                                <Td>{orcamento.id}</Td>
                                <Td>{orcamento.numeroProtocolo}</Td>
                                <Td>{orcamento.tipoOrcamento}</Td>
                                <Td>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(orcamento.valorTotal)}
                                </Td>
                                <Td>{new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</Td>
                                <Td>
                                    <StatusBadge $status={orcamento.status}>{orcamento.status}</StatusBadge>
                                </Td>
                            </TrClicavel>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}