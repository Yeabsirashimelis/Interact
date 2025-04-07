import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type DeleteParams = Promise<{ memberId: string }>;
export const DELETE = async function (
  request: Request,
  { params }: { params: DeleteParams },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const { memberId } = await params;
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new Response("server ID missing", { status: 400 });
    }

    if (!memberId) {
      return new Response("MemberId is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("internal error", { status: 500 });
  }
};

type PatchParams = Promise<{ memberId: string }>;
export const PATCH = async function (
  request: Request,
  { params }: { params: PatchParams },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const { role } = await request.json();
    const { memberId } = await params;

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new Response("server ID missing", { status: 400 });
    }

    if (!memberId) {
      return new Response("MemberId is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("internal error", { status: 500 });
  }
};
