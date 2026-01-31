"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MODEL_GROUPS } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 font-mono text-sm bg-background"
        >
          <span className="truncate">{selectedModel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search models..." className="h-9" />
          <CommandList className="max-h-[280px]">
            <CommandEmpty>No model found.</CommandEmpty>
            {MODEL_GROUPS.map((group) => (
              <CommandGroup key={group.provider} heading={group.provider}>
                {group.models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.name} ${model.id} ${model.provider}`}
                    onSelect={() => {
                      onModelChange(model.id);
                      setOpen(false);
                    }}
                    className="text-sm justify-between"
                  >
                    <span className="font-mono truncate">{model.id}</span>
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        selectedModel === model.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
