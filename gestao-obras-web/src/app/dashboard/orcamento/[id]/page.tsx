'use client';

import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { api } from '../../../../services/api';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

// --- Interfaces ---
interface Item {
    id: number;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    quantidadeAcumulada: number;
}

interface OrcamentoDetalhado {
    id: number;
    numeroProtocolo: string;
    tipoOrcamento: string;
    valorTotal: number;
    dataCriacao: string;
    status: string;
    itens: Item[];
}

// --- Estilos ---
const Container = styled.div`
  padding: 15px;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 1em;
  font-weight: bold;
  background-color: ${(props) => (props.$status === 'ABERTO' ? '#e6f7ff' : '#f6ffed')};
  color: ${(props) => (props.$status === 'ABERTO' ? '#1890ff' : '#52c41a')};
`;

const Button = styled.button<{ $variant?: 'primary' | 'success' | 'outline' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.$variant === 'outline' ? '#333' : 'white')};
  background-color: ${(props) => {
        if (props.$variant === 'success') return '#52c41a';
        if (props.$variant === 'outline') return '#f0f0f0';
        return props.theme.colors.primary;
    }};
  
  @media (min-width: 768px) {
    width: auto;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const GridInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoItem = styled.div`
  p { margin: 5px 0; }
  strong { color: #555; }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 600px;
`;

const Th = styled.th`
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

// --- Componente Principal ---
export default function OrcamentoDetalhes() {
    const { id } = useParams();
    const router = useRouter();

    const [orcamento, setOrcamento] = useState<OrcamentoDetalhado | null>(null);
    const [loading, setLoading] = useState(true);

    const [itemMedicao, setItemMedicao] = useState<Item | null>(null);
    const [quantidadeMedicao, setQuantidadeMedicao] = useState<number | ''>('');

    const carregarOrcamento = useCallback(async () => {
        try {
            const response = await api.get(`/api/orcamentos/${id}`);
            setOrcamento(response.data);
        } catch (error) {
            console.error("Erro detalhado da API:", error);
            alert('Orçamento não encontrado!');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        carregarOrcamento();
    }, [carregarOrcamento]);

    const handleFinalizar = async () => {
        const confirmar = window.confirm('Tem a certeza que deseja finalizar esta obra? Não será possível adicionar mais medições.');
        if (!confirmar) return;

        try {
            await api.put(`/api/orcamentos/${id}/finalizar`);
            alert('Orçamento finalizado com sucesso!');
            await carregarOrcamento();
        } catch (error) {
            let msg = 'Erro ao finalizar o orçamento.';
            if (axios.isAxiosError(error) && error.response?.data?.mensagem) {
                msg = error.response.data.mensagem;
            }
            alert(msg);
        }
    };

    const handleSalvarMedicao = async () => {
        if (!itemMedicao || quantidadeMedicao === '' || quantidadeMedicao <= 0) {
            alert('Informe uma quantidade válida!');
            return;
        }

        try {
            await api.post('/api/medicoes', {
                orcamentoId: orcamento?.id,
                itensMedidos: [
                    {
                        itemId: itemMedicao.id,
                        quantidadeMedida: Number(quantidadeMedicao)
                    }
                ]
            });

            alert('Medição registrada com sucesso!');
            setItemMedicao(null);
            setQuantidadeMedicao('');
            await carregarOrcamento();
        } catch (error) {
            let msg = 'Erro ao registrar medição. Verifique se a quantidade não ultrapassa o total.';
            if (axios.isAxiosError(error) && error.response?.data?.mensagem) {
                msg = error.response.data.mensagem;
            }
            alert(msg);
        }
    };

    if (loading) return <Container>A carregar detalhes...</Container>;
    if (!orcamento) return null;

    return (
        <Container>
            <div style={{ marginBottom: '20px' }}>
                <Button $variant="outline" onClick={() => router.push('/dashboard')}>
                    ← Voltar ao Dashboard
                </Button>
            </div>

            <Card>
                <HeaderBox>
                    <h2 style={{ margin: 0 }}>Detalhes do Orçamento #{orcamento.id}</h2>
                    <StatusBadge $status={orcamento.status}>{orcamento.status}</StatusBadge>
                </HeaderBox>

                <GridInfo>
                    <InfoItem>
                        <p><strong>Protocolo:</strong> {orcamento.numeroProtocolo}</p>
                        <p><strong>Tipo:</strong> {orcamento.tipoOrcamento}</p>
                    </InfoItem>
                    <InfoItem>
                        <p><strong>Data de Criação:</strong> {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Valor Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valorTotal)}</p>
                    </InfoItem>
                </GridInfo>

                {orcamento.status === 'ABERTO' && (
                    <div style={{ marginTop: '30px' }}>
                        <Button $variant="success" onClick={handleFinalizar}>
                            ✔ Finalizar Obra
                        </Button>
                    </div>
                )}
            </Card>

            <Card>
                <h3 style={{ marginTop: 0 }}>Itens do Orçamento</h3>
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Descrição</Th>
                                <Th>Qtd. Total</Th>
                                <Th>Já Medido</Th>
                                <Th>Valor Unitário</Th>
                                <Th>Ação</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {orcamento.itens?.map(item => (
                                <tr key={item.id}>
                                    <Td>{item.descricao}</Td>
                                    <Td>{item.quantidade}</Td>
                                    <Td style={{ color: item.quantidadeAcumulada >= item.quantidade ? 'green' : 'black', fontWeight: 'bold' }}>
                                        {item.quantidadeAcumulada || 0}
                                    </Td>
                                    <Td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorUnitario)}</Td>
                                    <Td>
                                        {orcamento.status === 'ABERTO' && item.quantidadeAcumulada < item.quantidade && (
                                            <Button $variant="primary" onClick={() => setItemMedicao(item)}>
                                                Medir
                                            </Button>
                                        )}
                                        {item.quantidadeAcumulada >= item.quantidade && (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Concluído</span>
                                        )}
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Card>

            {itemMedicao && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px'
                }}>
                    <Card style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
                        <h3 style={{ marginTop: 0 }}>Registrar Medição</h3>
                        <p><strong>Item:</strong> {itemMedicao.descricao}</p>
                        <p><strong>Falta medir:</strong> {itemMedicao.quantidade - (itemMedicao.quantidadeAcumulada || 0)}</p>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>Quantidade a medir hoje:</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={quantidadeMedicao}
                                onChange={e => setQuantidadeMedicao(Number(e.target.value))}
                                style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                            />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <Button $variant="primary" onClick={handleSalvarMedicao} style={{ flex: 1 }}>
                                    Salvar
                                </Button>
                                <Button $variant="outline" onClick={() => setItemMedicao(null)} style={{ flex: 1 }}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Container>
    );
}