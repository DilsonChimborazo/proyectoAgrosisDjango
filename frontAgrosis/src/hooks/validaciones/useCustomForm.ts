// src/hooks/useCustomForm.ts
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useCustomForm<T extends z.Schema>(
  schema: T,
  defaultValues: z.infer<T>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}