'use client';

import {
  Sparkles,
  Bold,
  Italic,
  Underline,
  Palette,
  AlignLeft,
  Link2,
  Image as ImageIcon,
  Film,
  Table as TableIcon,
  List,
  ListOrdered,
  Code,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Tooltip } from './tooltip';

export function RichEditorToolbar({
  onAiGenerate,
}: Readonly<{
  onAiGenerate?: () => void;
}>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200/90 bg-neutral-50/70 px-2.5 py-1.5 dark:border-neutral-800 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-400">
      {/* AI Generate Magic button */}
      <Tooltip label={t('richEditor.aiGenerate')}>
        <button
          type="button"
          onClick={onAiGenerate}
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 hover:text-purple-600 dark:hover:bg-neutral-800 text-purple-600 dark:text-purple-400 transition-colors"
          aria-label={t('richEditor.aiGenerate')}
        >
          <Sparkles size={14} />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Paragraph Dropdown */}
      <button
        type="button"
        className="flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
      >
        <span>{t('richEditor.paragraph')}</span>
        <ChevronDown size={12} />
      </button>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Basic Text Formats */}
      <Tooltip label={t('richEditor.bold')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.bold')}
        >
          <Bold size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.italic')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.italic')}
        >
          <Italic size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.underline')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.underline')}
        >
          <Underline size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.color')}>
        <button
          type="button"
          className="flex items-center gap-0.5 rounded px-1.5 py-1 hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.color')}
        >
          <Palette size={13} />
          <ChevronDown size={10} />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Alignment */}
      <Tooltip label={t('richEditor.alignment')}>
        <button
          type="button"
          className="flex items-center gap-0.5 rounded px-1.5 py-1 hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.alignment')}
        >
          <AlignLeft size={13} />
          <ChevronDown size={10} />
        </button>
      </Tooltip>

      {/* Insert items */}
      <Tooltip label={t('richEditor.insertLink')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.insertLink')}
        >
          <Link2 size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.insertImage')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.insertImage')}
        >
          <ImageIcon size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.insertVideo')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.insertVideo')}
        >
          <Film size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.insertTable')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.insertTable')}
        >
          <TableIcon size={13} />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Lists */}
      <Tooltip label={t('richEditor.bulletList')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.bulletList')}
        >
          <List size={13} />
        </button>
      </Tooltip>

      <Tooltip label={t('richEditor.numberedList')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
          aria-label={t('richEditor.numberedList')}
        >
          <ListOrdered size={13} />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Code */}
      <Tooltip label={t('richEditor.showHtml')}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 ml-auto"
          aria-label={t('richEditor.showHtml')}
        >
          <Code size={13} />
        </button>
      </Tooltip>
    </div>
  );
}
