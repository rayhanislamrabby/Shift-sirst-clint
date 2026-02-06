import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecures();
  const queryClient = useQueryClient();

  /* ================= LOAD rider_assigned + in_transit ================= */
  const { data: parcels = [] } = useQuery({
    queryKey: ["pending-deliveries"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");

      // only show active delivery flow
      return res.data.filter(
        (p) =>
          p.delivery_status === "rider_assigned" ||
          p.delivery_status === "in_transit"
      );
    },
  });

  /* ================= STATUS UPDATE MUTATION ================= */
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/${id}/status`, { status });
      return res.data;
    },

    onSuccess: (_, variables) => {
      if (variables.status === "in_transit") {
        Swal.fire("Success!", "Parcel is now In Transit", "success");
      }

      if (variables.status === "delivered") {
        Swal.fire("Delivered!", "Parcel delivered successfully", "success");
      }

      // 🔄 refresh list
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
        nextStatus === "in_transit"
          ? "Start delivery?"
          : "Mark as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({
          id: parcel._id,
          status: nextStatus,
        });
      }
    });
  };

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

                <td>
                  <button
                    onClick={() => handleUpdate(parcel)}
                    className={`btn btn-xs md:btn-sm text-white ${
                      parcel.delivery_status === "rider_assigned"
                        ? "bg-green-600 hover:bg-green-700" // start
                        : "bg-blue-600 hover:bg-blue-700" // make delivery
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
