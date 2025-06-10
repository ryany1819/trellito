import type { User } from "@/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function UserAvatar({isLoggedIn = false, user, navLogin}: {
  isLoggedIn?: boolean;
  user?: User;
  navLogin?: () => void;
}) {
  // Replace with your actual login/avatar logic
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Avatar>
            <AvatarImage className="rounded-full w-8 h-8" src={user?.avatar} alt={user?.name}/>
            <AvatarFallback className="rounded-full bg-secondary w-8 h-8 flex items-center justify-center text-secondary-foreground font-bold">JD</AvatarFallback>
          </Avatar>
          <span>{user?.name}</span>
        </>
      ) : (
        <button
          className="bg-accent text-accent-foreground px-3 py-1 rounded"
          onClick={navLogin}
        >
          Login
        </button>
      )}
    </div>
  );
}
