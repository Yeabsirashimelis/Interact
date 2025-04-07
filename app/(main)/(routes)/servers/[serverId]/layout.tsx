import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type GetParams = Promise<{ serverId: string }>;

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: GetParams;
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return RedirectToSignIn({ afterSignInUrl: "/" });
  }

  const { serverId } = await params;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: { some: { profileId: profile.id } },
    },
  });

  if (!server) {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
