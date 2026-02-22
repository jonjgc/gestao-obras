'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Container = styled.div`
  padding: 15px;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ItemBox = styled.div`
  border: 1px dashed #ccc;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fafafa;
`;

const Button = styled.button<{ variant?: 'danger' | 'success' | 'outline' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.variant === 'outline' ? '#333' : 'white')};
  background-color: ${(props) => {
        if (props.variant === 'danger') return '#ff4d4f';
        if (props.variant === 'success') return '#52c41a';
        if (props.variant === 'outline') return '#f0f0f0';
        return props.theme.colors.primary;
    }};

  @media (min-width: 768px) {
    width: auto;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TotalText = styled.h3`
  text-align: left;
  color: #333;
  margin-top: 15px;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

interface ItemForm {
    descricao: string;
    quantidade: number;
    valorUnitario: number;
}

export default function NovoOrcamento() {
    const router = useRouter();
    const [protocolo, setProtocolo] = useState('');
    const [tipo, setTipo] = useState('Obra de Edificação');
    const [dataCriacao, setDataCriacao] = useState(() => {
        if (typeof window === 'undefined') return '';
        return new Date().toISOString().split('T')[0];
    });
    const [itens, setItens] = useState<ItemForm[]>([{ descricao: '', quantidade: 1, valorUnitario: 0 }]);

    const valorTotalCalculado = useMemo(() => {
        return itens.reduce((acc, item) => {
            const qtd = Number(item.quantidade) || 0;
            const vlr = Number(item.valorUnitario) || 0;
            return acc + (qtd * vlr);
        }, 0);
    }, [itens]);

    const handleAddItem = () => {
        setItens([...itens, { descricao: '', quantidade: 1, valorUnitario: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItens(itens.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof ItemForm, value: string | number) => {
        const novosItens = [...itens];
        novosItens[index] = { ...novosItens[index], [field]: value };
        setItens(novosItens);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (itens.length === 0) {
            alert('Adicione pelo menos um item ao orçamento.');
            return;
        }

        try {
            await api.post('/api/orcamentos', {
                numeroProtocolo: protocolo,
                tipoOrcamento: tipo,
                valorTotal: valorTotalCalculado,
                dataCriacao,
                itens
            });

            alert('Orçamento criado com sucesso!');
            router.push('/dashboard');
        } catch (error) {
            console.error("Erro detalhado da API:", error);
            let mensagem = 'Erro ao criar orçamento.';
            if (axios.isAxiosError(error) && error.response?.data?.mensagem) {
                mensagem = error.response.data.mensagem;
            }
            alert(mensagem);
        }
    };

    return (
        <Container>
            <h2>Cadastrar Novo Orçamento</h2>
            <div style={{ marginBottom: '20px' }}>
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    ← Voltar
                </Button>
            </div>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <InputGroup>
                        <Label>Número do Protocolo</Label>
                        <Input required value={protocolo} onChange={(e) => setProtocolo(e.target.value)} placeholder="Ex: 43022.123456/2026-01" />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data de Criação</Label>
                        <Input type="date" required value={dataCriacao} onChange={(e) => setDataCriacao(e.target.value)} />
                    </InputGroup>
                </Row>

                <InputGroup>
                    <Label>Tipo de Orçamento</Label>
                    <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="Obra de Edificação">Obra de Edificação</option>
                        <option value="Obra de Rodovias">Obra de Rodovias</option>
                        <option value="Outros">Outros</option>
                    </Select>
                </InputGroup>

                <hr style={{ width: '100%', border: '0.5px solid #eee', margin: '10px 0' }} />

                <SectionHeader>
                    <h3 style={{ margin: 0 }}>Itens do Orçamento</h3>
                    <Button type="button" variant="success" onClick={handleAddItem}>+ Adicionar Item</Button>
                </SectionHeader>

                {itens.map((item, index) => (
                    <ItemBox key={index}>
                        <Row>
                            <InputGroup style={{ flex: 2 }}>
                                <Label>Descrição</Label>
                                <Input required value={item.descricao} onChange={(e) => handleItemChange(index, 'descricao', e.target.value)} />
                            </InputGroup>
                            <InputGroup>
                                <Label>Quantidade</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    value={Number.isNaN(item.quantidade) ? '' : item.quantidade}
                                    onChange={(e) => handleItemChange(index, 'quantidade', parseFloat(e.target.value))}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>Valor Unitário (R$)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={Number.isNaN(item.valorUnitario) ? '' : item.valorUnitario}
                                    onChange={(e) => handleItemChange(index, 'valorUnitario', parseFloat(e.target.value))}
                                />
                            </InputGroup>
                        </Row>
                        {itens.length > 1 && (
                            <Button type="button" variant="danger" onClick={() => handleRemoveItem(index)} style={{ marginTop: '15px' }}>
                                Remover Item
                            </Button>
                        )}
                    </ItemBox>
                ))}

                <TotalText>
                    Valor Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalCalculado)}
                </TotalText>

                <Button type="submit" style={{ marginTop: '10px', fontSize: '16px' }}>Salvar Orçamento</Button>
            </Form>
        </Container>
    );
}