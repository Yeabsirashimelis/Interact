"use client";

import Image from "next/image";
import { ActionTooltip } from "../ui/action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationitemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationitemProps) => {
  const params = useParams();
  const router = useRouter();

  function onClick() {
    router.push(`/servers/${id}`);
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="realtive group flex items-center">
        <div
          className={cn(
            "absolute left-0 w-[4px] rounded-r-full bg-primary transition-all",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params?.serverId == id &&
              "rounded-[16px] bg-primary/10 text-primary",
          )}
        >
          <img className="object-contain" src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};
