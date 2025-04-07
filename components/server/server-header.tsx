"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal_store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
            {server.name}
            <ChevronDown className="ml-auto h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => {
                onOpen("invite", { server });
              }}
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm text-indigo-600 outline-none hover:bg-zinc-700/10 dark:text-indigo-400 dark:hover:bg-zinc-700/50"
            >
              Invite People
              <UserPlus className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm outline-none hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              onClick={() => onOpen("editServer", { server })}
            >
              Server Settings
              <Settings className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm outline-none hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              onClick={() => onOpen("members", { server })}
            >
              Manage Members
              <Users className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}

          {isModerator && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm outline-none hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              onClick={() => {
                onOpen("createChannel");
              }}
            >
              Create Channel
              <PlusCircle className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}

          {isModerator && <DropdownMenuSeparator />}

          {isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm text-rose-500 outline-none hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              onClick={() => {
                onOpen("deleteServer", { server });
              }}
            >
              Delete Server
              <Trash className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}

          {!isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer items-center space-x-3 px-3 py-2 text-sm text-rose-500 outline-none hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              onClick={() => onOpen("leaveServer", { server })}
            >
              Leave Server
              <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
