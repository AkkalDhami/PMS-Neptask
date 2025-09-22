"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAddSubtasksMutation } from "../../features/task/taskApi";
import toast from "react-hot-toast";
import { is } from "zod/v4/locales";

// Validation schema
const SubtaskItem = z.object({
  title: z.string().min(1, "Subtask title is required"),
  completed: z.boolean().default(false),
});

const formSchema = z.object({
  subtasks: z.array(SubtaskItem).min(1, "Add at least one subtask"),
  newTitle: z.string().optional(),
});

export default function AddSubtaskModal({ taskId }) {
  const [addSubtasks, { isLoading }] = useAddSubtasksMutation();
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { subtasks: [], newTitle: "" },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "subtasks",
  });

  const newTitle = watch("newTitle");

  // Focus input on error
  useEffect(() => {
    if (form.formState.errors.newTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [form.formState.errors.newTitle]);

  const handleAdd = () => {
    if (!newTitle.trim()) {
      setError("newTitle", {
        type: "manual",
        message: "Subtask title is required",
      });
      return;
    }
    append({ title: newTitle.trim(), completed: false });
    setValue("newTitle", "");
    clearErrors("newTitle");
    if (inputRef.current) inputRef.current.focus();
  };

  const submitHandler = async (data) => {
    setOpen(false);
    // onSubmit(data);
    console.log(data);

    try {
      const res = await addSubtasks({
        taskId,
        subtasks: data?.subtasks,
      }).unwrap();
      console.log(res);
      toast.success(res?.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || error.error || "Failed to add subtasks"
      );
    } finally {
      reset({ subtasks: [], newTitle: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Subtasks</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subtasks</DialogTitle>
          <DialogDescription>
            Add subtasks, mark them complete, or delete.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            {/* Input for adding new subtask */}
            <FormField
              control={control}
              name="newTitle"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="New subtask..."
                        {...field}
                        ref={inputRef}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleAdd}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtask list */}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between border p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name={`subtasks.${index}.completed`}
                      render={({ field: checkboxField }) => (
                        <Checkbox
                          checked={checkboxField.value}
                          onCheckedChange={(v) => {
                            checkboxField.onChange(!!v);
                            update(index, {
                              ...field,
                              completed: !!v,
                            });
                          }}
                        />
                      )}
                    />
                    <span
                      className={`${
                        field.completed ? "line-through text-gray-400" : ""
                      }`}>
                      {field.title}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Show error if no subtasks */}
            {form.formState.errors.subtasks && (
              <p className="text-sm text-red-500">
                {form.formState.errors.subtasks.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset({ subtasks: [], newTitle: "" });
                  setOpen(false);
                }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
