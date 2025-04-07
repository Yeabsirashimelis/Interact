import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal_store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export default function InviteModal() {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";

  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/{server?.id}/invite-code`,
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black sm:max-w-md">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            htmlFor="invite-link"
            className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
          >
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <div className="relative flex-1">
              <Input
                disabled={isLoading}
                id="invite-link"
                className="border-0 bg-zinc-300/50 pr-10 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                value={inviteUrl}
                readOnly
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={onCopy}
                disabled={isLoading}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            variant="link"
            size="sm"
            className="flex items-center gap-x-2 text-xs text-zinc-500"
            disabled={isLoading}
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
