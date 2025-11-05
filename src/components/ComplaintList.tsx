import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";
import ComplaintForm from "./ComplaintForm";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface ComplaintListProps {
  userId?: string;
  isAdmin: boolean;
}

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  resolved: "bg-green-500",
  rejected: "bg-red-500",
};

const ComplaintList = ({ userId, isAdmin }: ComplaintListProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    let query = supabase.from("complaints").select("*").order("created_at", { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (!error && data) {
      setComplaints(data);
    }
  };

  useEffect(() => {
    fetchComplaints();

    const channel = supabase
      .channel("complaints_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
        },
        () => {
          fetchComplaints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin]);

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("id", complaintId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    }
  };

  const handleDelete = async (complaintId: string) => {
    const { error } = await supabase.from("complaints").delete().eq("id", complaintId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete complaint",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {complaints.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No complaints found
          </CardContent>
        </Card>
      ) : (
        complaints.map((complaint) => (
          <Card key={complaint.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{complaint.title}</CardTitle>
                  <CardDescription>
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                  {complaint.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{complaint.description}</p>
              
              <div className="flex gap-2 flex-wrap">
                {isAdmin && (
                  <>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(complaint.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {!isAdmin && userId === complaint.user_id && (
                  <Dialog open={editingComplaint?.id === complaint.id} onOpenChange={(open) => !open && setEditingComplaint(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingComplaint(complaint)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Complaint</DialogTitle>
                      </DialogHeader>
                      <ComplaintForm
                        userId={userId || ""}
                        complaint={editingComplaint || undefined}
                        onSuccess={() => setEditingComplaint(null)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ComplaintList;