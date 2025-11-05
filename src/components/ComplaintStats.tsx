import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";

interface ComplaintStatsProps {
  userId?: string;
  isAdmin: boolean;
}

const ComplaintStats = ({ userId, isAdmin }: ComplaintStatsProps) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      let query = supabase.from("complaints").select("status", { count: "exact" });

      if (!isAdmin && userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (!error && data) {
        const newStats = {
          total: data.length,
          pending: data.filter((c) => c.status === "pending").length,
          in_progress: data.filter((c) => c.status === "in_progress").length,
          resolved: data.filter((c) => c.status === "resolved").length,
          rejected: data.filter((c) => c.status === "rejected").length,
        };
        setStats(newStats);
      }
    };

    fetchStats();

    const channel = supabase
      .channel("complaints_stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin]);

  const statCards = [
    { title: "Total", value: stats.total, icon: ClipboardList, color: "text-blue-500" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { title: "In Progress", value: stats.in_progress, icon: Clock, color: "text-orange-500" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-500" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplaintStats;