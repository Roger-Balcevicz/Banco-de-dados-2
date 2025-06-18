import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
    coditem: number;
    codingrediente: number;
    quantidade: number;
    preco_unitario: number;
    ingrediente: {
        nome: string;
        unidade_medida: string;
    };
}

interface EditableOrderItem extends OrderItem {
    editedQuantidade: number;
    editedPrecoUnitario: number;
}

interface Status {
    id: number;
    nome: string;
}

interface OrderInfo {
    codordem: number;
    data_ordem: string;
    codfornecedor: number;
    codsetor: number;
    status_id: number;
    // unidade_peso?: string; // Adicione este campo se existir na sua tabela
}

interface EditOrderItemsDialogProps {
    codordem: number;
    onOrderUpdated?: () => void;
}

export function EditOrderItemsDialog({ codordem, onOrderUpdated }: EditOrderItemsDialogProps) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<EditableOrderItem[]>([]);
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number>(0);
    // const [unidadePeso, setUnidadePeso] = useState<string>(''); // Para unidade de peso
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Buscar informações da ordem
            const { data: orderData, error: orderError } = await supabase
                .from('ordem_compra')
                .select('*')
                .eq('codordem', codordem)
                .single();

            if (orderError) throw orderError;
            setOrderInfo(orderData);
            setSelectedStatusId(orderData.status_id);
            // setUnidadePeso(orderData.unidade_peso || ''); // Se existir o campo

            // Buscar itens da ordem
            const { data: itemsData, error: itemsError } = await supabase
                .from('item_ordem_compra')
                .select(`
                    *,
                    ingrediente (
                        nome,
                        unidade_medida
                    )
                `)
                .eq('codordem', codordem);

            if (itemsError) throw itemsError;

            // Inicializa os campos editáveis com os valores atuais
            const editableItems = (itemsData || []).map(item => ({
                ...item,
                editedQuantidade: item.quantidade,
                editedPrecoUnitario: item.preco_unitario
            }));

            setItems(editableItems);

            // Buscar status disponíveis
            const { data: statusData, error: statusError } = await supabase
                .from('status')
                .select('*')
                .order('nome');

            if (statusError) throw statusError;
            setStatuses(statusData || []);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, codordem]);

    const handleQuantidadeChange = (coditem: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        setItems(prev => prev.map(item => 
            item.coditem === coditem 
                ? { ...item, editedQuantidade: numValue }
                : item
        ));
    };

    const handlePrecoChange = (coditem: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        setItems(prev => prev.map(item => 
            item.coditem === coditem 
                ? { ...item, editedPrecoUnitario: numValue }
                : item
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Atualizar informações da ordem (status e unidade de peso)
            const { error: orderError } = await supabase
                .from('ordem_compra')
                .update({
                    status_id: selectedStatusId,
                    // unidade_peso: unidadePeso // Se existir o campo
                })
                .eq('codordem', codordem);

            if (orderError) throw orderError;

            // Atualizar itens que foram modificados
            const updates = items.filter(item => 
                item.editedQuantidade !== item.quantidade || 
                item.editedPrecoUnitario !== item.preco_unitario
            );

            for (const item of updates) {
                const { error } = await supabase
                    .from('item_ordem_compra')
                    .update({
                        quantidade: item.editedQuantidade,
                        preco_unitario: item.editedPrecoUnitario
                    })
                    .eq('coditem', item.coditem);

                if (error) throw error;
            }

            // Callback para atualizar a lista pai
            onOrderUpdated?.();
            setOpen(false);
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Restaura os valores originais
        setItems(prev => prev.map(item => ({
            ...item,
            editedQuantidade: item.quantidade,
            editedPrecoUnitario: item.preco_unitario
        })));
        
        if (orderInfo) {
            setSelectedStatusId(orderInfo.status_id);
            // setUnidadePeso(orderInfo.unidade_peso || '');
        }
        
        setOpen(false);
    };

    const total = items.reduce((sum, item) => sum + (item.editedQuantidade * item.editedPrecoUnitario), 0);
    
    const hasChanges = items.some(item => 
        item.editedQuantidade !== item.quantidade || 
        item.editedPrecoUnitario !== item.preco_unitario
    ) || (orderInfo && selectedStatusId !== orderInfo.status_id);
    // || unidadePeso !== (orderInfo?.unidade_peso || ''); // Se existir o campo

    const currentStatus = statuses.find(s => s.id === selectedStatusId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Ordem #{codordem}</DialogTitle>
                </DialogHeader>
                
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Informações da Ordem */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informações da Ordem</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status</label>
                                        <Select value={selectedStatusId.toString()} onValueChange={(value) => setSelectedStatusId(parseInt(value))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status.id} value={status.id.toString()}>
                                                        {status.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    {/* Adicione este campo se existir unidade_peso na tabela */}
                                    {/*
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Unidade de Peso</label>
                                        <Input
                                            value={unidadePeso}
                                            onChange={(e) => setUnidadePeso(e.target.value)}
                                            placeholder="Ex: KG, G, T"
                                        />
                                    </div>
                                    */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Itens da Ordem */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Itens da Ordem</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ingrediente</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Unidade</TableHead>
                                            <TableHead>Preço Unit.</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.coditem}>
                                                <TableCell className="font-medium">
                                                    {item.ingrediente?.nome || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.editedQuantidade}
                                                        onChange={(e) => handleQuantidadeChange(item.coditem, e.target.value)}
                                                        step="0.01"
                                                        min="0"
                                                        className="w-20"
                                                    />
                                                </TableCell>
                                                <TableCell>{item.ingrediente?.unidade_medida || 'UN'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="mr-1">R$</span>
                                                        <Input
                                                            type="number"
                                                            value={item.editedPrecoUnitario}
                                                            onChange={(e) => handlePrecoChange(item.coditem, e.target.value)}
                                                            step="0.01"
                                                            min="0"
                                                            className="w-24"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    R$ {(item.editedQuantidade * item.editedPrecoUnitario).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {items.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        Nenhum item encontrado para esta ordem
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Total */}
                        {items.length > 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Total da Ordem:</span>
                                        <span>R$ {total.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Botões de Ação */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button 
                                variant="outline" 
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}