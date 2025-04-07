"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal_store";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().min(1, { message: "Server image is required" }),
});

export default function CreateServerModal() {
  const { isOpen, onClose, type } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "createServer";
  const [serverName, setServerName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post("/api/servers", values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isMounted) return null;

  return (
    isModalOpen && (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Customize your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 px-6">
                <div className="flex items-center justify-center text-center">
                  <div className="group relative">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              endpoint="serverImage"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-zinc-500">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="border border-zinc-200 bg-zinc-100/50 text-black focus-visible:ring-1 focus-visible:ring-offset-1"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                  variant="primary"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {isLoading ? "Creating..." : "Create Server"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );

  //   return (
  //     // Modal UI with Tailwind CSS
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  //       <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
  //         {/* Modal Header */}
  //         <div className="relative px-6 pb-4 pt-8">
  //           <button className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="20"
  //               height="20"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeWidth="2"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //             >
  //               <line x1="18" y1="6" x2="6" y2="18"></line>
  //               <line x1="6" y1="6" x2="18" y2="18"></line>
  //             </svg>
  //           </button>
  //           <h2 className="text-center text-2xl font-bold text-gray-900">
  //             Create Your Server
  //           </h2>
  //           <p className="mt-2 text-center text-sm text-gray-500">
  //             Give your server a personality with a name and an image. You can
  //             always change it later.
  //           </p>
  //         </div>

  //         {/* Form */}
  //         <div>
  //           <div className="space-y-8 px-6 py-4">
  //             {/* Image Upload */}
  //             <div className="flex items-center justify-center text-center">
  //               <div>
  //                 {/* Empty state - upload UI */}
  //                 <div>
  //                   <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100">
  //                     <div className="flex flex-col items-center justify-center pb-6 pt-5">
  //                       <svg
  //                         xmlns="http://www.w3.org/2000/svg"
  //                         className="mb-2 h-10 w-10 text-gray-400"
  //                         width="24"
  //                         height="24"
  //                         viewBox="0 0 24 24"
  //                         fill="none"
  //                         stroke="currentColor"
  //                         strokeWidth="2"
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                       >
  //                         <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
  //                         <path d="M12 12v9"></path>
  //                         <path d="m16 16-4-4-4 4"></path>
  //                       </svg>
  //                       <p className="mb-2 text-sm text-gray-700">
  //                         <span className="font-semibold">Click to upload</span>{" "}
  //                         or drag and drop
  //                       </p>
  //                       <p className="text-xs text-gray-500">
  //                         SVG, PNG, JPG or GIF (MAX. 800x400px)
  //                       </p>
  //                     </div>
  //                     <input type="file" className="hidden" />
  //                   </label>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* <FileUpload
  //               endpoint="serverImage"
  //               value={"uyri"}
  //               onChange={() => {}}
  //             /> */}

  //             {/* Server Name Input */}
  //             <div>
  //               <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
  //                 Server Name
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="Enter server name"
  //                 className="w-full rounded-md border-0 bg-gray-100 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //               />
  //               {/* Error message example */}
  //               {/* <p className="mt-1 text-xs text-red-500">Server name is required</p> */}
  //             </div>
  //           </div>

  //           {/* Footer */}
  //           <div className="flex justify-end rounded-b-lg bg-gray-50 px-6 py-4">
  //             <button
  //               type="button"
  //               className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  //             >
  //               Create
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
