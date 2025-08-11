"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Register, Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(email, password, role);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
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
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </Button>

      <Input
        type="text"
        placeholder="first name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="last name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        required
      />
      <Select
        label="Role"
        value={role}
        onValueChange={setRole}
        options={roleOptions}
        disabled={isLoading}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Registering..." : "Register"}
      </Button>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">Already have an account?</span>
        <a
          href="/login"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Login
        </a>
      </div>
    </form>
  );
}
