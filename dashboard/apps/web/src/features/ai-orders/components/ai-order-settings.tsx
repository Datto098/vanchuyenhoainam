'use client';

import { useState, type FormEvent } from 'react';
import { KeyRound, Pencil, Plus } from 'lucide-react';
import type { OpenAiKeyConfig, SaveOpenAiKeyInput } from '@auto-tags/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, TableScroll } from '@/components/ui/data-table';
import { Checkbox, Field, Input } from '@/components/ui/form-control';
import { ContentState, LoadingState } from '@/components/ui/feedback';
import { AnimatePresence, Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/layout/page-header';
import { useTranslation } from '@/lib/i18n';
import { useCreateOpenAiKey, useOpenAiKeys, useUpdateOpenAiKey } from '../hooks/use-ai-orders';

export function AiOrderSettingsPanel() {
  const keys = useOpenAiKeys();
  const [editing, setEditing] = useState<OpenAiKeyConfig | null | undefined>();
  const { t, formatDateTime } = useTranslation();

  if (keys.isPending) return <LoadingState label={t('aiKeys.loading')} />;
  if (keys.isError)
    return <ContentState title={t('aiKeys.loadError')} description={t('common.errorDesc')} />;

  return (
    <div className="max-w-6xl space-y-4">
      <PageHeader
        title={t('aiKeys.title')}
        description={t('aiKeys.description')}
        action={
          <Button variant="primary" onClick={() => setEditing(null)}>
            <Plus size={14} /> {t('aiKeys.add')}
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle title={t('aiKeys.list')} description={t('aiKeys.encrypted')} />
        </CardHeader>
        <TableScroll>
          <DataTable>
            <thead>
              <tr>
                <th>{t('aiKeys.columns.name')}</th>
                <th>{t('aiKeys.columns.key')}</th>
                <th>{t('aiKeys.columns.model')}</th>
                <th>{t('aiKeys.columns.pricing')}</th>
                <th>{t('aiKeys.columns.status')}</th>
                <th>{t('aiKeys.updated')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {keys.data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="font-medium">{item.name}</div>
                    {item.isDefault ? <Badge tone="info">{t('aiKeys.default')}</Badge> : null}
                  </td>
                  <td className="font-mono text-xs">
                    {item.keyLastFour
                      ? `sk-••••${item.keyLastFour}`
                      : item.apiKeyConfigured
                        ? t('aiKeys.environment')
                        : t('aiKeys.missing')}
                  </td>
                  <td>{item.model}</td>
                  <td>
                    <div>Input ${item.inputPricePerMillion}</div>
                    <div className="text-[11px] text-neutral-500">
                      Cached ${item.cachedInputPricePerMillion} · Output $
                      {item.outputPricePerMillion}
                    </div>
                  </td>
                  <td>
                    <Badge tone={item.enabled ? 'success' : 'neutral'}>
                      {item.enabled ? t('aiKeys.active') : t('aiKeys.disabled')}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap">{formatDateTime(item.updatedAt)}</td>
                  <td>
                    <Button size="xs" onClick={() => setEditing(item)}>
                      <Pencil size={12} /> {t('common.actions.edit')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </TableScroll>
      </Card>
      <AnimatePresence>
        {editing !== undefined ? (
          <KeyEditor
            key={editing?.id ?? 'new'}
            value={editing}
            onClose={() => setEditing(undefined)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function KeyEditor({ value, onClose }: { value: OpenAiKeyConfig | null; onClose: () => void }) {
  const create = useCreateOpenAiKey();
  const update = useUpdateOpenAiKey();
  const { t } = useTranslation();
  const [name, setName] = useState(value?.name ?? t('aiKeys.primaryName'));
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(value?.model ?? 'gpt-6-luna');
  const [inputPrice, setInputPrice] = useState(value?.inputPricePerMillion ?? 0.1);
  const [cachedPrice, setCachedPrice] = useState(value?.cachedInputPricePerMillion ?? 0.01);
  const [outputPrice, setOutputPrice] = useState(value?.outputPricePerMillion ?? 0.5);
  const [enabled, setEnabled] = useState(value?.enabled ?? true);
  const [isDefault, setIsDefault] = useState(value?.isDefault ?? true);
  const pending = create.isPending || update.isPending;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const input: SaveOpenAiKeyInput = {
      name,
      model,
      inputPricePerMillion: inputPrice,
      cachedInputPricePerMillion: cachedPrice,
      outputPricePerMillion: outputPrice,
      enabled,
      isDefault,
      ...(apiKey ? { apiKey } : {}),
    };
    if (value) await update.mutateAsync({ id: value.id, input });
    else await create.mutateAsync({ ...input, apiKey });
    onClose();
  }

  return (
    <Modal
      title={value ? t('aiKeys.editTitle') : t('aiKeys.addTitle')}
      description={t('aiKeys.modalDescription')}
      onClose={onClose}
      size="lg"
    >
      <form className="space-y-4 p-5" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('aiKeys.name')} required>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label={t('aiKeys.model')} required>
            <Input value={model} onChange={(e) => setModel(e.target.value)} required />
          </Field>
        </div>
        <Field
          label={t('aiKeys.apiKey')}
          required={!value}
          hint={value ? t('aiKeys.keepKey') : undefined}
        >
          <div className="relative">
            <KeyRound className="absolute left-3 top-2 text-neutral-400" size={14} />
            <Input
              className="pl-9"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required={!value}
              placeholder="sk-…"
            />
          </div>
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <PriceInput label="Input / 1M" value={inputPrice} onChange={setInputPrice} />
          <PriceInput label="Cached / 1M" value={cachedPrice} onChange={setCachedPrice} />
          <PriceInput label="Output / 1M" value={outputPrice} onChange={setOutputPrice} />
        </div>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-xs">
            <Checkbox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />{' '}
            {t('aiKeys.enable')}
          </label>
          <label className="flex items-center gap-2 text-xs">
            <Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />{' '}
            {t('aiKeys.makeDefault')}
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <Button onClick={onClose}>{t('common.actions.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? t('common.actions.saving') : t('aiKeys.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} required>
      <Input
        type="number"
        min="0"
        step="0.001"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        required
      />
    </Field>
  );
}
