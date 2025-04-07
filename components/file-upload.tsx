"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import { FileRouter } from "uploadthing/types";

interface FileUploadProps {
  endpoint: string;
  value: string;
  onChange: (url: string) => void;
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value || "/placeholder.svg"}
          alt="Upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <UploadButton<FileRouter>
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
        className={{
          container: "relative inline-flex",
          button:
            "ut-ready:bg-indigo-500 ut-uploading:cursor-not-allowed ut-ready:hover:bg-indigo-600 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm",
          allowedContent:
            "flex h-8 flex-col items-center justify-center px-2 text-xs text-gray-500",
        }}
      />
    </div>
  );
};
