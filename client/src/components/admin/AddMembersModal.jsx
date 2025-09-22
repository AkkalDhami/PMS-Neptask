import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
} from "@/components/ui/command";
import { X, Check, UserPlus } from "lucide-react";

// zod schema
const schema = z.object({
  members: z.array(z.string()).min(1, "Please select at least one member"),
});

export default function AddMembersModal({
  workspaceId = null,
  availableMembers = [],
  onAddMembers = async () => {},
  triggerLabel = "Add Members",
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { members: [] },
  });

  const { watch, setValue, handleSubmit, reset, formState } = form;
  const selected = watch("members");
  const [query, setQuery] = useState("");

  // Normalize incoming API members
  const normalizedMembers = availableMembers.map((member) => ({
    id: member.user._id,
    name: member.user.name,
    email: member.user.email,
    role: member.role,
    joinedAt: member.joinedAt,
  }));

  // Filtered list based on search query
  const filteredMembers = normalizedMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredMembers;
    return filteredMembers.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
      );
    });
  }, [filteredMembers, query]);

  function toggleSelect(id) {
    const current = form.getValues("members") || [];
    if (current.includes(id)) {
      setValue(
        "members",
        current.filter((c) => c !== id),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      setValue("members", [...current, id], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  async function onSubmit(values) {
    try {
      const payload = values.members.map((id) => {
        const member = filteredMembers.find((m) => m.id === id);
        return {
          user: member?.id,
          role: member?.role || "member",
        };
      });
      
      await onAddMembers(payload);
      reset();
      setQuery("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add members", err);
    }
  }

  function handleClose() {
    reset();
    setQuery("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add members to workspace</DialogTitle>
          <DialogDescription>
            Search and select multiple users to add to this workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {selected && selected.length > 0 ? (
                          selected.map((id) => {
                            const m = normalizedMembers.find(
                              (x) => x.id === id
                            );
                            if (!m) return null;
                            return (
                              <Badge
                                key={id}
                                className="inline-flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    {m.avatarUrl ? (
                                      <AvatarImage
                                        src={m.avatarUrl}
                                        alt={m.name}
                                      />
                                    ) : (
                                      <AvatarFallback>
                                        {m.name?.[0] ?? "?"}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <span className="text-sm">{m.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleSelect(id)}
                                  aria-label={`Remove ${m.name}`}
                                  className="-mr-1 p-0.5">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            );
                          })
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No members selected
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <Command>
                          <CommandInput
                            placeholder="Search users by name or email..."
                            value={query}
                            onValueChange={(v) => setQuery(v)}
                          />
                          <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                              {filtered.map((m) => {
                                const isSelected = selected?.includes(m.id);
                                return (
                                  <CommandItem
                                    key={m.id}
                                    onSelect={() => toggleSelect(m.id)}
                                    className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-6 w-6">
                                        {m.avatarUrl ? (
                                          <AvatarImage
                                            src={m.avatarUrl}
                                            alt={m.name}
                                          />
                                        ) : (
                                          <AvatarFallback>
                                            {m.name?.[0] ?? "?"}
                                          </AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                          {m.name}
                                        </span>
                                        {m.email && (
                                          <span className="text-xs text-muted-foreground">
                                            {m.email}
                                          </span>
                                        )}
                                        {m.role && (
                                          <span className="text-xs text-muted-foreground">
                                            Role: {m.role}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {isSelected ? (
                                      <Check className="h-4 w-4" />
                                    ) : null}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-1 text-sm" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="ghost" onClick={handleClose} type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={formState.isSubmitting}>
                Add {selected?.length ? `(${selected.length})` : ""}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/*
Usage example:
<AddMembersModal
  workspaceId={workspace._id}
  availableMembers={workspaceMembersFromAPI}
  onAddMembers={async (workspaceId, memberIds) => {
    await api.post(`/workspaces/${workspaceId}/members`, { members: memberIds });
  }}
/>
*/
