"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal_store";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "atachement is required" }),
});

export default function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", fileUrl: "" },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, { ...values, content: values.fileUrl });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 sm:max-w-md">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold text-zinc-700">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Sned a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 px-6">
              <div className="flex items-center justify-center text-center">
                <div className="group relative">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant="primary"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
