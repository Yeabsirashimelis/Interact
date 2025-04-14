import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

type DeleteParams = Promise<{ channelId: string }>;

export const DELETE = async function (
  request: Request,
  { params }: { params: DeleteParams },
) {
  try {
    const profile = await currentProfile();
    const { channelId } = await params;
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new Response("Unauthorized", { status: 401 });

    if (!serverId) {
      return new Response("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new Response("Channel ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("internal error", { status: 500 });
  }
};

type PatchParams = Promise<{ channelId: string }>;

export const PATCH = async function (
  request: Request,
  { params }: { params: PatchParams },
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await request.json();
    const { channelId } = await params;
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new Response("Unauthorized", { status: 401 });

    if (!serverId) {
      return new Response("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new Response("Channel ID missing", { status: 400 });
    }
    if (name === "general") {
      return new Response("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("unable to edit channel", { status: 500 });
  }
};
