import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type PatchParams = Promise<{ serverId: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: PatchParams },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!(await params).serverId) {
      return new Response("server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: (await params).serverId,
        profileId: profile.id,
      },
      data: { inviteCode: uuidv4() },
    });

    return NextResponse.json(server);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
