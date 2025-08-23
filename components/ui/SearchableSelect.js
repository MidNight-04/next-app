'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command';
import { ScrollArea } from './scroll-area';
import { Button } from './button';
import { Check, ChevronsUpDown, X, Plus, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { defaultTo } from 'lodash';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  createOptionApi, // async fn(label) => { label, value }
  queryKey = ['options'], // react-query key to refetch/update
  placeholder,
  clearable = true,
  addNewOption = true, // Show option to add new
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [localOptions, setLocalOptions] = useState(options);

  const queryClient = useQueryClient();

  // Sync localOptions if parent updates props
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  // Observe trigger size
  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setTriggerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  const selectedLabel = useMemo(
    () => defaultTo(localOptions.find(opt => opt.value === value)?.label, ''),
    [localOptions, value]
  );

  const normalizedOptions = useMemo(
    () =>
      localOptions.map(opt => ({
        ...opt,
        label: String(opt.label).trim(),
        value: String(opt.value).trim(),
      })),
    [localOptions]
  );

  // const optionExists = normalizedOptions.some(
  //   opt => opt.label.toLowerCase() === searchTerm.toLowerCase()
  // );

  const optionExists = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return normalizedOptions.some(
      opt =>
        opt.label.toLowerCase() === term || opt.value.toLowerCase() === term
    );
  }, [normalizedOptions, searchTerm]);

  // Mutation for adding new option
  const mutation = useMutation({
    mutationFn: async label => {
      if (!createOptionApi) throw new Error('No createOptionApi provided');
      return await createOptionApi(label);
    },
    onSuccess: newOption => {
      // Update local immediately
      setLocalOptions(prev => [...prev, newOption]);

      // Update query cache if list is managed by react-query
      queryClient.setQueryData(queryKey, (old = []) => [...old, newOption]);

      // Select it
      onChange(newOption.value);
      setOpen(false);
      setSearchTerm('');
    },
    onError: () => {
      toast.error('Failed to add option');
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="searchable-select-options"
          className="w-full justify-between hover:bg-secondary hover:text-primary"
        >
          {selectedLabel || placeholder || 'Select option'}
          <div className="flex items-center gap-1">
            {clearable && value && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation(); // prevent popover toggle
                  e.preventDefault(); // prevent default button behavior
                  onChange(null);
                  setSearchTerm('');
                  setOpen(false);
                }}
                className="p-0 m-0"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: triggerWidth }}
        className="p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder || ''}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {/* <CommandEmpty>No option found.</CommandEmpty> */}
          <ScrollArea className="h-48">
            <CommandGroup id="searchable-select-options">
              {normalizedOptions.map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === opt.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}

              {/* Add new option if missing */}
              {!!searchTerm && !optionExists && addNewOption && (
                <CommandItem
                  className="text-primary cursor-pointer"
                  onSelect={() => mutation.mutate(searchTerm)}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {mutation.isPending ? 'Adding...' : `Add “${searchTerm}”`}
                </CommandItem>
              )}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
