import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerSearch from "./server-search";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  if (!server) {
    return redirect("/");
  }

  const role =
    server.members.find((member) => member.profileId === profile.id)?.role ??
    MemberRole.GUEST;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="mt-2">
        <ServerSearch
          data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },

            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },

            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
