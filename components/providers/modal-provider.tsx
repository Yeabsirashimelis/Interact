"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal_store";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members.modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {type === "createServer" && <CreateServerModal />}
      {type === "invite" && <InviteModal />}
      {type === "editServer" && <EditServerModal />}
      {type === "members" && <MembersModal />}
      {type === "createChannel" && <CreateChannelModal />}
      {type === "leaveServer" && <LeaveServerModal />}
      {type === "deleteServer" && <DeleteServerModal />}
    </>
  );
};
