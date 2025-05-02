import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface serverIdPageProps {
  params: { serverId: string };
}

export default async function ServerIdPage(
  propsPromise: Promise<serverIdPageProps>,
) {
  const profile = await currentProfile();
  const { params } = await propsPromise;
  const { serverId } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}
