import { ChannelType, Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
  channels: {
    serverId: string;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    type: ChannelType;
  }[];
};
