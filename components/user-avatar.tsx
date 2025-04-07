import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}
export const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("md:w-10, h-7 w-auto md:h-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};
