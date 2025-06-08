import type { User } from "@/models/user";

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
          <span className="rounded-full bg-secondary w-8 h-8 flex items-center justify-center text-secondary-foreground font-bold">
            JD
          </span>
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
