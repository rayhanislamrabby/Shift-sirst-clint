import { useQuery } from "@tanstack/react-query";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const RaiderDashbord = () => {
  const axiosSecure = useAxiosSecures();

  /* ===== LOAD DELIVERY STATUS COUNT ===== */
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading rider dashboard...</p>;
  }

  /* ===== TOTAL ===== */
  const total = stats.reduce((sum, item) => sum + item.count, 0);

  /* ===== PIE DATA WITH % ===== */
  const pieData = stats.map((item, index) => {
    const percent = total ? ((item.count / total) * 100).toFixed(1) : 0;

    return {
      id: index,
      value: item.count,
      label: `${item._id.replace("_", " ").toUpperCase()} (${percent}%)`,
    };
  });

  /* ===== HELPER ===== */
  const getCount = (status) =>
    stats.find((s) => s._id === status)?.count || 0;

  /* ===== REMAINING DELIVERY ===== */
  const remaining =
    getCount("rider_assigned") + getCount("in_transit");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Typography variant="h4" fontWeight="bold">
        Rider Delivery Overview
      </Typography>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Assigned" value={getCount("rider_assigned")} />
        <Stat title="In Transit" value={getCount("in_transit")} />
        <Stat title="Delivered" value={getCount("delivered")} />
        <Stat title="Remaining" value={remaining} />
      </div>

      {/* ===== PIE CHART ===== */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Rider Delivery Percentage
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

/* ===== STAT CARD ===== */
const Stat = ({ title, value }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default RaiderDashbord;
