import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/toast';
import { Eye, Plus, Pencil, Trash2, Truck } from 'lucide-react';

const emptySupplier = { name: '', email: '', phone: '', link: '', address: '', notes: '' };

function safeJson(value) {
  if (value === null || value === undefined) return null;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}

export default function AdminSuppliers() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(emptySupplier);
  const [jsonText, setJsonText] = useState('');

  const { data: suppliers = [] } = useQuery({
    queryKey: ['admin-suppliers'],
    queryFn: () => base44.entities.Supplier.list('-created_date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Supplier.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      setDialogOpen(false);
      toast.success('Fornecedor criado');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível criar.')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Supplier.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      setDialogOpen(false);
      toast.success('Fornecedor atualizado');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível atualizar.')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Supplier.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      toast.success('Fornecedor removido');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível remover.')),
  });

  const openCreate = () => {
    setEditing(null);
    setViewing(null);
    setForm(emptySupplier);
    setJsonText('');
    setDialogOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setViewing(null);
    setForm({
      name: s.name ?? '',
      email: s.email ?? '',
      phone: s.phone ?? '',
      link: s.link ?? '',
      address: s.address ?? '',
      notes: s.notes ?? '',
    });
    setJsonText('');
    setDialogOpen(true);
  };

  const openView = (s) => {
    setViewing(s);
    setEditing(null);
    setForm({
      name: s.name ?? '',
      email: s.email ?? '',
      phone: s.phone ?? '',
      link: s.link ?? '',
      address: s.address ?? '',
      notes: s.notes ?? '',
    });
    setJsonText('');
    setDialogOpen(true);
  };

  const submit = () => {
    if (!form.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
	    const data = {
	      name: form.name.trim(),
	      email: form.email?.trim() || null,
	      phone: form.phone?.trim() || null,
	      link: form.link?.trim() || null,
	      address: form.address?.trim() || null,
	      notes: form.notes?.trim() || null,
	    };
	    if (editing) updateMutation.mutate({ id: editing.id, data });
	    else createMutation.mutate(data);
	  };

  const applyJson = () => {
    const parsed = safeJson(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      toast.error('JSON inválido');
      return;
    }
    const obj = parsed;
    const link = obj.link ?? obj.url ?? obj.website ?? obj.site ?? '';
    setForm((p) => ({
      ...p,
      name: obj.name ?? p.name,
      email: obj.email ?? p.email,
      phone: obj.phone ?? p.phone,
      link: link ?? p.link,
      address: obj.address ?? p.address,
      notes: obj.notes ?? p.notes,
    }));
    toast.success('JSON aplicado');
  };

  const isView = Boolean(viewing);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-heading text-3xl">Fornecedores</h1>
        <Button onClick={openCreate} className="rounded-none font-body text-sm gap-2">
          <Plus className="w-4 h-4" /> Novo
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Nome</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Contacto</th>
              <th className="text-right p-3 font-body text-xs text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-3">
                  <p className="font-body text-sm font-medium">{s.name}</p>
                  {s.address ? <p className="font-body text-xs text-muted-foreground mt-1">{s.address}</p> : null}
                </td>
	                <td className="p-3 font-body text-sm text-muted-foreground">
	                  {s.email || s.phone ? (
	                    <div className="space-y-1">
	                      {s.email ? <div>{s.email}</div> : null}
	                      {s.phone ? <div>{s.phone}</div> : null}
	                      {s.link ? (
	                        <a
	                          href={s.link}
	                          target="_blank"
	                          rel="noreferrer"
	                          className="underline underline-offset-2"
	                          title={s.link}
	                        >
	                          Link
	                        </a>
	                      ) : null}
	                    </div>
	                  ) : (
	                    '-'
	                  )}
	                </td>
	                <td className="p-3 text-right whitespace-nowrap">
	                  <Button variant="ghost" size="icon" onClick={() => openView(s)} title="Ver">
	                    <Eye className="w-4 h-4" />
	                  </Button>
	                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} title="Editar">
	                    <Pencil className="w-4 h-4" />
	                  </Button>
	                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(s.id)} title="Remover">
	                    <Trash2 className="w-4 h-4" />
	                  </Button>
	                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && (
          <div className="text-center py-10">
            <Truck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">Sem fornecedores</p>
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditing(null);
            setViewing(null);
            setJsonText('');
          }
        }}
      >
	        <DialogContent className="max-w-lg">
	          <DialogHeader>
	            <DialogTitle className="font-heading text-xl">
	              {viewing ? 'Fornecedor' : editing ? 'Editar' : 'Novo'} fornecedor
	            </DialogTitle>
	          </DialogHeader>
	          <div className="space-y-3">
	            {!isView ? (
	              <div>
	                <Label className="font-body text-xs">JSON (opcional)</Label>
	                <Textarea
	                  value={jsonText}
	                  onChange={(e) => setJsonText(e.target.value)}
	                  className="rounded-none mt-1 min-h-[90px] font-mono text-xs"
	                  placeholder='Ex: {"name":"Fornecedor X","email":"x@ex.com","link":"https://..."}'
	                />
	                <div className="flex justify-end mt-2">
	                  <Button variant="outline" className="rounded-none font-body text-xs" onClick={applyJson} disabled={!jsonText.trim()}>
	                    Aplicar JSON
	                  </Button>
	                </div>
	              </div>
	            ) : null}
	            <div>
	              <Label className="font-body text-xs">Nome *</Label>
	              <Input
	                value={form.name}
	                onChange={(e) => setForm({ ...form, name: e.target.value })}
	                className="rounded-none mt-1"
	                disabled={isView}
	              />
	            </div>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
	              <div>
	                <Label className="font-body text-xs">Email</Label>
	                <Input
	                  value={form.email}
	                  onChange={(e) => setForm({ ...form, email: e.target.value })}
	                  className="rounded-none mt-1"
	                  disabled={isView}
	                />
	              </div>
	              <div>
	                <Label className="font-body text-xs">Telefone</Label>
	                <Input
	                  value={form.phone}
	                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
	                  className="rounded-none mt-1"
	                  disabled={isView}
	                />
	              </div>
	            </div>
	            <div>
	              <Label className="font-body text-xs">Link</Label>
	              <Input
	                value={form.link}
	                onChange={(e) => setForm({ ...form, link: e.target.value })}
	                className="rounded-none mt-1"
	                disabled={isView}
	              />
	              {isView && form.link ? (
	                <a href={form.link} target="_blank" rel="noreferrer" className="text-xs underline underline-offset-2 mt-2 inline-block">
	                  Abrir link
	                </a>
	              ) : null}
	            </div>
	            <div>
	              <Label className="font-body text-xs">Morada</Label>
	              <Input
	                value={form.address}
	                onChange={(e) => setForm({ ...form, address: e.target.value })}
	                className="rounded-none mt-1"
	                disabled={isView}
	              />
	            </div>
	            <div>
	              <Label className="font-body text-xs">Notas</Label>
	              <Textarea
	                value={form.notes}
	                onChange={(e) => setForm({ ...form, notes: e.target.value })}
	                className="rounded-none mt-1 min-h-[120px]"
	                disabled={isView}
	              />
	            </div>
	            {isView ? (
	              <Button
	                variant="outline"
	                className="w-full rounded-none font-body text-sm tracking-wider"
	                onClick={() => openEdit(viewing)}
	              >
	                Editar
	              </Button>
	            ) : (
	              <Button onClick={submit} className="w-full rounded-none font-body text-sm tracking-wider">
	                {editing ? 'Guardar' : 'Criar'}
	              </Button>
	            )}
	          </div>
	        </DialogContent>
	      </Dialog>
    </div>
  );
}
