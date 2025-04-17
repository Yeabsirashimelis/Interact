import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIOServer } from "socket.io";

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

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};

/*
we're using Socket.IO in a Next.js API Route (probably under /pages/api/socket.ts or similar), and you're trying to extend the default NextApiResponse type so that it includes the Socket.IO server instance.

✅ Breakdown of NextApiResponseServerIo:

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};
This creates a custom type for your res object (response) in an API route that lets TypeScript know you're attaching Socket.IO to the HTTP server.

Here's what's happening layer by layer:
This creates a custom type for your res object (response) in an API route that lets TypeScript know you're attaching Socket.IO to the HTTP server.

Here's what's happening layer by layer:

*/
