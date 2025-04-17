import { Menu } from "lucide-react";
import { Button } from "./button";
import { NavigationSidebar } from "../navigation/navigation-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import ServerSidebar from "../server/server-sidebar";

export default function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
