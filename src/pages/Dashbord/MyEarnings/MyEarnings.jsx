import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hook/useAuth";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import { useMemo } from "react";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecures();

  /* ================= LOAD COMPLETED PARCELS ================= */
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completed-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${user.email}`
      );
      return res.data;
    },
  });

  /* ================= CALCULATIONS ================= */
  const stats = useMemo(() => {
    let total = 0;
    let today = 0;
    let month = 0;
    let year = 0;

    let cashout = 0;
    let pending = 0;

    const now = new Date();

    parcels.forEach((p) => {
      const cost = Number(p.deliveryCost) || 0;

      // earning rule
      const earning =
        p.senderDistrict === p.receiverDistrict ? cost * 0.8 : cost * 0.3;

      total += earning;

      const d = new Date(p.delivered_at);

      // today
      if (d.toDateString() === now.toDateString()) {
        today += earning;
      }

      // this month
      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        month += earning;
      }

      // this year
      if (d.getFullYear() === now.getFullYear()) {
        year += earning;
      }

      // 🔥 cashout vs pending
      if (p.cashout_status === "paid") {
        cashout += earning;
      } else {
        pending += earning;
      }
    });

    return { total, today, month, year, cashout, pending };
  }, [parcels]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading earnings...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">💰 My Earnings</h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total" value={stats.total} color="text-green-600" />
        <StatCard title="Cashout" value={stats.cashout} color="text-blue-600" />
        <StatCard title="Pending" value={stats.pending} color="text-red-500" />

        <StatCard title="Today" value={stats.today} color="text-purple-600" />
        <StatCard
          title="This Month"
          value={stats.month}
          color="text-orange-500"
        />
        <StatCard title="This Year" value={stats.year} color="text-teal-600" />
      </div>

      {/* ================= COMPLETED LIST ================= */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-3">Completed Deliveries</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra text-sm">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th>Tracking</th>
                <th>Route</th>
                <th>Fee</th>
                <th>Earning</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((p) => {
                const earning =
                  p.senderDistrict === p.receiverDistrict
                    ? p.deliveryCost * 0.8
                    : p.deliveryCost * 0.3;

                const isPaid = p.cashout_status === "paid";

                return (
                  <tr key={p._id}>
                    <td>{p.tracking_id}</td>

                    <td>
                      {p.senderDistrict} → {p.receiverDistrict}
                    </td>

                    <td>৳ {p.deliveryCost}</td>

                    <td className="text-green-600 font-semibold">
                      ৳ {Number(earning).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          isPaid ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td>
                      {p.delivered_at
                        ? new Date(p.delivered_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {parcels.length === 0 && (
            <p className="text-center mt-6 text-gray-500">
              No completed deliveries
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE STAT CARD ================= */
const StatCard = ({ title, value, color }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 text-center hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className={`text-xl md:text-2xl font-bold ${color}`}>
      ৳ {Math.round(value)}
    </h3>
  </div>
);

export default MyEarnings;
