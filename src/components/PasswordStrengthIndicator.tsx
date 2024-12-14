import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      setStrength(score);
    };

    calculateStrength();
  }, [password]);

  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <Progress value={(strength / 5) * 100} className={`h-2 ${getColor()}`} />
      <p className="mt-1 text-xs text-muted-foreground">
        {strength <= 2 && "Weak"}
        {strength > 2 && strength <= 4 && "Medium"}
        {strength > 4 && "Strong"}
      </p>
    </div>
  );
}
