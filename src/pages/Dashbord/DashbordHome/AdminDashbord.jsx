import { useQuery } from "@tanstack/react-query";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const AdminDashbord = () => {
  const axiosSecure = useAxiosSecures();

  /* ===== LOAD STATUS COUNT FROM API ===== */
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  /* ===== TOTAL COUNT ===== */
  const total = stats.reduce((sum, item) => sum + item.count, 0);

  /* ===== PREPARE PIE DATA WITH % ===== */
  const pieData = stats.map((item, index) => {
    const percent = total ? ((item.count / total) * 100).toFixed(1) : 0;

    return {
      id: index,
      value: item.count,
      label: `${item._id.replace("_", " ").toUpperCase()} (${percent}%)`,
    };
  });

  /* ===== HELPER FUNCTION ===== */
  const getCount = (status) =>
    stats.find((s) => s._id === status)?.count || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Typography variant="h4" fontWeight="bold">
        Admin Delivery Dashboard
      </Typography>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Delivered" value={getCount("delivered")} />
        <Stat title="In Transit" value={getCount("in_transit")} />
        <Stat title="Rider Assigned" value={getCount("rider_assigned")} />
        <Stat title="Pending" value={getCount("not_collected")} />
      </div>

      {/* ===== PIE CHART ===== */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Delivery Status Percentage
          </Typography>

          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 50,
                outerRadius: 110,
                paddingAngle: 3,
                cornerRadius: 5,
              },
            ]}
            height={320}
          />
        </CardContent>
      </Card>
    </div>
  );
};

/* ===== REUSABLE STAT CARD ===== */
const Stat = ({ title, value }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default AdminDashbord;
