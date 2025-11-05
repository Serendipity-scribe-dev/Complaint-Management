import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ComplaintFormProps {
  userId: string;
  complaint?: {
    id: string;
    title: string;
    description: string;
  };
  onSuccess: () => void;
}

const ComplaintForm = ({ userId, complaint, onSuccess }: ComplaintFormProps) => {
  const [title, setTitle] = useState(complaint?.title || "");
  const [description, setDescription] = useState(complaint?.description || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (complaint) {
      setTitle(complaint.title);
      setDescription(complaint.description);
    }
  }, [complaint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (complaint) {
      // Update existing complaint
      const { error } = await supabase
        .from("complaints")
        .update({ title, description })
        .eq("id", complaint.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Complaint updated successfully",
        });
        onSuccess();
      }
    } else {
      // Create new complaint
      const { error } = await supabase.from("complaints").insert({
        user_id: userId,
        title,
        description,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Complaint submitted successfully",
        });
        setTitle("");
        setDescription("");
        onSuccess();
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of your complaint"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of your complaint"
          rows={6}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : complaint ? "Update Complaint" : "Submit Complaint"}
      </Button>
    </form>
  );
};

export default ComplaintForm;