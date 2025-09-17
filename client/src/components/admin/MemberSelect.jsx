"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MemberSelect({ data = [], value, onChange }) {
  const [open, setOpen] = React.useState(false);

  const selected = data.find((m) => m.user?._id === value);
  console.log(data);

  return (
    <Popover className={" w-full"} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {selected ? (
            <span className="flex items-center gap-2">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full">
                {selected.name?.charAt(0).toUpperCase()}
              </Badge>
              <span>{selected.name}</span>
            </span>
          ) : (
            "Select member..."
          )}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command className={" w-full"}>
          <CommandInput placeholder="Search member..." className="h-9" />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup>
              {data?.map((dat) => (
                <CommandItem
                  key={dat?.user?._id}
                  value={dat?.user?._id}
                  onSelect={() => {
                    onChange(dat?.user?._id);
                    setOpen(false);
                  }}>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={dat.user.avatar} alt={dat.user.name} />
                      <AvatarFallback>
                        {dat.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{dat.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dat.user.email}
                      </p>
                    </div>
                  </div>
                 
                  <Check
                    className={cn(
                      "ml-auto",
                      value === dat?.user?._id ? "opacity-100" : "opacity-0"
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
