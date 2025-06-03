import { useAuth } from "@/providers/auth-provider";
import { useNavigate } from "react-router-dom";

export default function UserAvatar() {
  // Replace with your actual login/avatar logic
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

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
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
}
