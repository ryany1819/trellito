import { Outlet } from "react-router-dom";
import UserAvatar from "./components/UserAvatar";
import reactLogo from "@/assets/react.svg";
import { useAuth } from "@/providers/auth-provider"

export default function Layout() {
  const {isLoggedIn, user} = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <img src={reactLogo} alt="Logo" className="h-8 inline-block mr-2" />
          <span className="font-bold">My Brand</span>
        </div>
        {/* User Avatar or Login Button */}
        <UserAvatar isLoggedIn={isLoggedIn} user={user} />
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4">
        <span>© 2023 My Brand</span>
        <span className="float-right">Privacy Policy</span>
      </footer>
    </div>
  );
}
