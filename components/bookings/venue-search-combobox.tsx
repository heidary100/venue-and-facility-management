"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
import { Venue } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface VenueSearchComboboxProps {
  venues: Venue[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function VenueSearchCombobox({
  venues,
  value,
  onValueChange,
  placeholder = "انتخاب سالن...",
}: VenueSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedVenue = venues.find((venue) => venue.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedVenue ? (
            <div className="flex items-center gap-2">
              <span>{selectedVenue.nameFa}</span>
              <Badge variant="secondary" className="text-xs">
                ظرفیت: {selectedVenue.capacity}
              </Badge>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="جستجوی سالن..." className="h-9" />
          <CommandList>
            <CommandEmpty>سالنی یافت نشد.</CommandEmpty>
            <CommandGroup>
              {venues.map((venue) => (
                <CommandItem
                  key={venue.id}
                  value={venue.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{venue.nameFa}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ظرفیت: {venue.capacity}</span>
                      <span>•</span>
                      <span>{venue.location.addressFa}</span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === venue.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
