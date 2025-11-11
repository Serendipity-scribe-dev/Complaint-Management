import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ComplaintStats from "@/components/ComplaintStats";
import ComplaintList from "@/components/ComplaintList";
import ComplaintForm from "@/components/ComplaintForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Plus, ClipboardList, Home } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Clear local storage and navigate
      localStorage.clear();
      navigate("/auth", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-background">

      {/* ===== NAVBAR ===== */}
<nav className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
  <div className="container mx-auto flex items-center justify-between py-4 px-6">
    {/* Logo + Name */}
    <div className="flex items-center gap-2">
      <ClipboardList className="w-6 h-6 text-blue-600" />
      <h1 className="text-xl font-semibold">
        Smart Complaint Management {isAdmin && "(Admin)"}
      </h1>
    </div>

    {/* Desktop Menu */}
    <div className="hidden md:flex gap-4 items-center">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="text-gray-700 hover:text-blue-600"
      >
        <Home size={16} className="mr-1" />
        Home
      </Button>
      <Button
        variant="outline"
        onClick={handleSignOut}
        className="text-gray-700 hover:bg-red-500 hover:text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>

    {/* Mobile Menu Toggle */}
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" />
          </svg>
        )}
      </Button>
    </div>
  </div>

  {/* Mobile Menu Items */}
  {menuOpen && (
    <div className="md:hidden bg-white shadow-md py-3 space-y-2 text-center">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="w-full justify-center text-gray-700 hover:text-blue-600"
      >
        <Home size={16} className="mr-1" />
        Home
      </Button>
      <Button
        variant="outline"
        onClick={handleSignOut}
        className="w-full justify-center text-gray-700 hover:bg-red-500 hover:text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )}
</nav>


      {/* ===== DASHBOARD CONTENT ===== */}
      <main className="container mx-auto px-4 py-10 flex-grow space-y-8">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome, {user?.email}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Admin Dashboard - Manage all complaints" : "User Dashboard - Track your complaints"}
          </p>
        </motion.div>

        <ComplaintStats userId={user?.id} isAdmin={isAdmin} />

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Complaints</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
              </DialogHeader>
              <ComplaintForm
                userId={user?.id || ""}
                onSuccess={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ComplaintList userId={user?.id} isAdmin={isAdmin} />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 text-center py-5 mt-10">
        <div className="container mx-auto">
          <p className="text-sm">
            © {new Date().getFullYear()} Complaint Management System. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <a href="#privacy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white">
              Terms of Service
            </a>
            <a href="mailto:support@complaintsys.com" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
