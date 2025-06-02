import type React from "react";
import UserAvatar from "./UserAvatar";
import reactLogo from "@/assets/react.svg";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">   
        <header className="bg-primary text-primary-foreground p-4 flex justify-between">
            {/* Logo and Brand Name */}
            <div className="flex items-center">
                <img src={reactLogo} alt="Logo" className="h-8 inline-block mr-2" />
                <span className="font-bold">My Brand</span>
            </div>
            {/* User Avatar or Login Button */}
            <UserAvatar />
        </header>
        <main className="flex-1 p-4">
            {children}
        </main>
        <footer className="bg-secondary text-secondary-foreground p-4">
            <span>© 2023 My Brand</span>
            <span className="float-right">Privacy Policy</span>
        </footer>
    </div>
  );
}