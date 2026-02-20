'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
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
  color: ${(props) => (props.variant === 'outline' ? '#333' : 'white')};
  background-color: ${(props) => {
        if (props.variant === 'danger') return '#ff4d4f';
        if (props.variant === 'success') return '#52c41a';
        if (props.variant === 'outline') return '#f0f0f0';
        return props.theme.colors.primary;
    }};
`;

const TotalText = styled.h3`
  text-align: right;
  color: #333;
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

    // Calcula o total automaticamente sempre que os itens mudam
    const valorTotalCalculado = useMemo(() => {
        return itens.reduce((acc, item) => {
            // Se for NaN (campo vazio), assume 0 para não quebrar o cálculo
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
            console.error(error);
            let mensagem = 'Erro ao criar orçamento.';

            // Verifica de forma segura se é um erro gerado pelo Axios
            if (axios.isAxiosError(error) && error.response?.data?.mensagem) {
                mensagem = error.response.data.mensagem;
            }

            alert(mensagem);
        }
    };

    return (
        <Container>
            <h2>Cadastrar Novo Orçamento</h2>
            <Button variant="outline" onClick={() => router.back()} style={{ marginBottom: '20px' }}>
                ← Voltar
            </Button>

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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Itens do Orçamento</h3>
                    <Button type="button" variant="success" onClick={handleAddItem}>+ Adicionar Item</Button>
                </div>

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
                                    // Se for NaN, deixa a string vazia para o usuário poder apagar
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
                            <Button type="button" variant="danger" onClick={() => handleRemoveItem(index)} style={{ marginTop: '10px' }}>
                                Remover Item
                            </Button>
                        )}
                    </ItemBox>
                ))}

                <TotalText>
                    Valor Total do Orçamento: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalCalculado)}
                </TotalText>

                <Button type="submit" style={{ marginTop: '10px', fontSize: '16px' }}>Salvar Orçamento</Button>
            </Form>
        </Container>
    );
}