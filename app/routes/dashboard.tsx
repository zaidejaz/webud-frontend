import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/context/auth-context";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Webud" },
    { name: "description", content: "Webud Dashboard" },
  ];
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <div className="grid gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Your Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Email: {user?.email}</p>
            <p className="text-sm text-gray-500">
              Member since: {user?.created_at && new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-medium">Get Started</h3>
            <p className="text-sm text-gray-500 mt-1">
              This is your dashboard. You can start building your website by exploring the options available to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 