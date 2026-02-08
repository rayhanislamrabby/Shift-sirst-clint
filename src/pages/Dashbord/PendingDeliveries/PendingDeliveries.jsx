import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import useTrackingLogger from "../../../hook/useTrackingLogger";
import useAuth from "../../../hook/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecures();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { logTracking } = useTrackingLogger();

  /* ================= LOAD ACTIVE PARCELS ================= */
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["pending-deliveries"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");

      return res.data.filter(
        (p) =>
          p.delivery_status === "rider_assigned" ||
          p.delivery_status === "in_transit"
      );
    },
  });

  /* ================= STATUS UPDATE ================= */
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/${id}/status`, { status });
      return res.data;
    },

    onSuccess: async (_, variables) => {
      const { parcel, status } = variables;

      // success alert
      if (status === "in_transit") {
        Swal.fire("Success!", "Parcel picked up successfully", "success");
      }

      if (status === "delivered") {
        Swal.fire("Delivered!", "Parcel delivered successfully", "success");
      }

      // ✅ TRACKING LOG
      await logTracking({
        tracking_id: parcel.tracking_id,
        status,
        details:
          status === "in_transit"
            ? `Picked up by ${user.displayName}`
            : "Parcel delivered successfully",
        updated_by: user.email,
      });

      queryClient.invalidateQueries(["pending-deliveries"]);
    },
  });

  /* ================= CLICK HANDLER ================= */
  const handleUpdate = (parcel) => {
    let nextStatus = "";

    if (parcel.delivery_status === "rider_assigned") {
      nextStatus = "in_transit";
    } else if (parcel.delivery_status === "in_transit") {
      nextStatus = "delivered";
    }

    Swal.fire({
      title:
        nextStatus === "in_transit" ? "Start delivery?" : "Mark as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({
          id: parcel._id,
          status: nextStatus,
          parcel, // 🔥 parcel pass করা হলো
        });
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Pending Deliveries ({parcels.length})
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>Title</th>
              <th>Sender</th>
              <th>Address</th>
              <th>Service Center</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.parcelTitle}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.senderAddress}</td>
                <td>{parcel.receiverServiceCenter}</td>
                <td>৳ {parcel.deliveryCost}</td>
                <td>{parcel.delivery_status}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(parcel)}
                    className={`btn btn-xs md:btn-sm text-white ${
                      parcel.delivery_status === "rider_assigned"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {parcel.delivery_status === "rider_assigned"
                      ? "Start Delivery"
                      : "Make Delivery"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No pending deliveries
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingDeliveries;
