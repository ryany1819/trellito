import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
	const { isLoggedIn, login, error } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
	// TODO: get the returnUrl from query params.
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl') || '/';

	// TODO: Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(returnUrl);
    }
  }, [isLoggedIn]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
    login &&  await login(email, password);
    // if (!login) return;
    // try {
    //   const res = await login(email, password);
    //   // if (!res.) {
    //   //   setError(res.message || "Login failed");
    //   // }
    // }
    // catch (err: any) {
    //   setError(err.message || "Login failed");
    // }
		console.log("Login form submitted", { email, password });
	};

	return (
		<div className="flex justify-center items-center min-h-svh bg-background">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm mx-auto bg-card p-6 rounded-xl shadow"
			>
				<h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && (<p className="mb-4 text-red-600 text-sm font-medium">{error}</p>)}
				<div className="flex flex-col gap-6">
					<div className="grid gap-3">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="grid gap-3">
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							// className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required
						/>
					</div>
					<div className="flex flex-col gap-3">
						<Button variant="default" type="submit">
							Login
						</Button>
						<Button variant="outline">
							Cancel
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default LoginPage;
