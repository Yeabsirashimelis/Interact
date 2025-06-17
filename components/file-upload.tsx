"use client";

import { UploadButton } from "@/utils/uploadthing";
import { Cloud, FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps {
  endpoint: string;
  value: string;
  onChange: (url: string) => void;
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileType, setFileType] = useState<string | null>(null);

  const isImage = fileType?.match(/(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = fileType === "pdf";

  if (value && isImage) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => {
            onChange("");
            setFileType(null);
          }}
          className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && isPdf) {
    return (
      <div className="relative mt-2 rounded-md bg-background/10 p-4">
        <div className="flex items-center">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 break-all text-sm text-indigo-500 hover:underline dark:text-indigo-400"
          >
            {value}
          </a>
        </div>
        <button
          onClick={() => {
            onChange("");
            setFileType(null);
          }}
          className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-zinc-200">
        <Cloud className="h-10 w-10 text-zinc-500" />
        <div className="mt-1 text-xs text-zinc-500">Loading...</div>
      </div>
      <div className="absolute">
        <UploadButton
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          endpoint={endpoint as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClientUploadComplete={(res: any) => {
            const fileUrl = res?.[0].url;
            const fileName = res?.[0].name || "";
            const extension = fileName.split(".").pop()?.toLowerCase() || null;

            setFileType(extension);
            if (fileUrl) {
              onChange(fileUrl);
            }
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
          className="h-20 w-20 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
