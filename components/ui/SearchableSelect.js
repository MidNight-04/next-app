'use client';
import { useState, useRef, useEffect } from 'react';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { defaultTo } from 'lodash';

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(0);

  // Get trigger width on mount and resize
  useEffect(() => {
    if (triggerRef.current) {
      const updateWidth = () => {
        setTriggerWidth(triggerRef.current.offsetWidth);
      };
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          className="w-full justify-between hover:bg-secondary hover:text-primary"
        >
          {selectedLabel || placeholder || 'Select option'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: triggerWidth }}
        className="p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={`Search ${placeholder || ''}...`} />
          <CommandEmpty>No option found.</CommandEmpty>
          <ScrollArea className="h-48">
            <CommandGroup>
              {options.map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
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
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
