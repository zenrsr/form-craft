import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface SocialLoginProps {
  action: "Login" | "Signup";
}

export function SocialLogin({ action }: SocialLoginProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Button variant="outline" className="w-full">
        <Github className="mr-2 h-4 w-4" />
        {action} with GitHub
      </Button>
    </div>
  );
}
