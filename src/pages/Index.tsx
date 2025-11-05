import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="text-center space-y-6 p-8">
        <ClipboardList className="h-20 w-20 mx-auto text-primary" />
        <h1 className="text-4xl font-bold">Complaint Management System</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Efficiently manage and track complaints with role-based access control
        </p>
        <Button size="lg" onClick={() => navigate("/auth")}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
