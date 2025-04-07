import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type PatchParams = Promise<{ serverId: string }>;

export const PATCH = async function (
  request: Request,
  { params }: { params: PatchParams },
) {
  try {
    const profile = await currentProfile();
    const { serverId } = await params;
    const { name, imageUrl } = await request.json();

    if (!profile) {
      return new Response("unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
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

type DeleteParams = Promise<{ serverId: string }>;

export const DELETE = async function (
  request: Request,
  { params }: { params: DeleteParams },
) {
  try {
    const profile = await currentProfile();
    const { serverId } = await params;

    if (!profile) {
      return new Response("unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
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
