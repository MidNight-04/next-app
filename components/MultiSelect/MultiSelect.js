'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '../ui/command';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MultiSelectDropdown({
  title = 'Select options...',
  optionsList = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleOption = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    handleSelect();
  };

  const handleSelect = () => {
    const selectedOptions = optionsList.filter(option =>
      selected.includes(option._id)
    );
    onChange(selectedOptions);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-80 justify-between hover:bg-secondary"
        >
          {selected.length > 0
            ? `${selected.length} item(s) selected`
            : `${title}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {optionsList.map(option => (
              <CommandItem
                key={option._id}
                onSelect={() => toggleOption(option._id)}
                className={cn(
                  'flex items-center justify-between',
                  selected.includes(option._id)
                    ? 'bg-secondary text-primary'
                    : 'hover:bg-secondary hover:text-primary'
                )}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selected.includes(option._id)}
                    onCheckedChange={() => toggleOption(option._id)}
                    id={`checkbox-${option._id}`}
                    className="h-4 w-4 rounded-sm border-primary-foreground text-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label
                    htmlFor={`checkbox-${option._id}`}
                    className="text-sm leading-none"
                  >
                    {option.name}
                  </label>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
