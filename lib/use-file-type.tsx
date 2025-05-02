import { useEffect, useState } from "react";

interface UseFileTypeProps {
  fileUrl: string | null;
}

export const useFileType = ({ fileUrl }: UseFileTypeProps) => {
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const detectFileType = async () => {
      if (!fileUrl) {
        setFileType(null);
        return;
      }

      try {
        const res = await fetch(fileUrl, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        if (contentType) {
          if (contentType.startsWith("image/")) {
            setFileType("image");
          } else if (contentType === "application/pdf") {
            setFileType("pdf");
          } else {
            setFileType("unknown");
          }
        }
      } catch (error) {
        console.error("Error detecting file type:", error);
        setFileType("unknown");
      }
    };

    detectFileType();
  }, [fileUrl]);

  return fileType;
};
