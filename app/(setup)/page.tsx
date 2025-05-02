import InititalModal from "@/components/modals/InititalModal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/InitialProfile";
import { redirect } from "next/navigation";

// import { ModeToggle } from "@/components/Mode-toggle";
// import { UserButton } from "@clerk/nextjs";

const SetupPage = async function name() {
  const profile = (await initialProfile()) as {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    email: string;
  } | null;

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InititalModal />;
};

export default SetupPage;
