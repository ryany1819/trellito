import { Button } from "@/components/ui/button";

function LoginPage() {
  return (
    <div className="p-4">
      <Button variant="default">Login</Button>
      <Button variant="outline" className="ml-2">Cancel</Button>
    </div>
  );
}

export default LoginPage;
