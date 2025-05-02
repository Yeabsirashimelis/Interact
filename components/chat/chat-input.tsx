"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal_store";
import EmojiPicker from "../emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>; //means an object of key of string and value of any type
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export default function ChatInput({
  apiUrl,
  query,
  name,
  type,
}: ChatInputProps) {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {
                      onOpen("messageFile", { apiUrl, query });
                    }}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="dark:text-200 border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75"
                    placeholder={`Message ${type == "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute right-8 top-7">
                    <EmojiPicker
                      onchange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
