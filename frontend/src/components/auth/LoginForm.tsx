"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LogIn, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  // Debug: Log auth state changes
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, user: !!user });

    // Auto-redirect if already authenticated
    if (isAuthenticated && user) {
      console.log("User is authenticated, redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  //const { login } = useAuth();

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Attempting login with:", { email, role });

    try {
      if (!email || !password || !role) {
        setError("Please fill in all fields");
        return;
      }
      console.log("Calling login function...");
      await login({ email, password, role });
      console.log("Login successful!");
      setTimeout(() => {
        console.log("Attempting redirect to dashboard...");
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: "admin" | "user") => {
    if (userType === "admin") {
      setEmail("admin@example.com");
      setPassword("admin123");
      setRole("admin");
    } else {
      setEmail("user@example.com");
      setPassword("user123");
      setRole("user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Input
        type="email"
        placeholder="Enter your email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <Select
        label="Role"
        value={role}
        onValueChange={(value) => setRole(value as "user" | "admin")}
        options={roleOptions}
        disabled={isLoading}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !email || !password || !role}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>

      {/* Quick Login Buttons */}
      <div className="space-y-2 pt-4">
        <p className="text-sm text-gray-600 text-center">Quick demo login:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("user")}
            disabled={isLoading}
          >
            Demo User
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("admin")}
            disabled={isLoading}
          >
            Demo Admin
          </Button>
        </div>
      </div>
    </form>
  );
}
