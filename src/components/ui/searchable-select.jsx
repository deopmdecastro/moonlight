import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Selecionar…',
  searchPlaceholder = 'Pesquisar…',
  className,
  disabled = false,
} = {}) {
  const [open, setOpen] = useState(false);
  const hasOptions = Array.isArray(options) && options.length > 0;
  const effectiveDisabled = disabled || !hasOptions;
  const effectivePlaceholder = hasOptions ? placeholder : 'Sem dados ainda';

  const selected = useMemo(() => {
    return (options ?? []).find((o) => String(o?.value) === String(value));
  }, [options, value]);

  const label = selected?.label ?? '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between rounded-none font-body text-sm', className)}
          disabled={effectiveDisabled}
        >
          <span className={cn('truncate', !label && 'text-muted-foreground')}>{label || effectivePlaceholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{hasOptions ? 'Sem resultados.' : 'Sem dados ainda.'}</CommandEmpty>
            <CommandGroup>
              {(options ?? []).map((opt) => {
                const optValue = String(opt?.value ?? '');
                const isSelected = String(value ?? '') === optValue;
                return (
                  <CommandItem
                    key={optValue}
                    value={String(opt?.label ?? optValue)}
                    onSelect={() => {
                      onChange?.(optValue);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                    {opt?.label ?? optValue}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
