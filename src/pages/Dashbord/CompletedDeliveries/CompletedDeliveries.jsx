import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import useAuth from "../../../hook/useAuth";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecures();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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



/* ================= CASHOUT MUTATION ================= */
const cashoutMutation = useMutation({
  mutationFn: async (parcelId) => {
    const res = await axiosSecure.patch(`/parcels/cashout/${parcelId}`);
    return res.data;
  },

  onSuccess: () => {
    Swal.fire("Success!", "Cashout completed successfully", "success");
    queryClient.invalidateQueries(["completed-parcels"]);
  },
});

/* ================= HANDLE CASHOUT WITH CONFIRM ================= */
const handleCashout = (parcelId) => {
  Swal.fire({
    title: "Confirm Cashout?",
    text: "You will receive this delivery earning.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Cashout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      cashoutMutation.mutate(parcelId);
    }
  });
};











  /* ================= CALCULATE EARNING BEFORE CASHOUT ================= */
  const calculateEarning = (parcel) => {
    const sameDistrict = parcel.senderDistrict === parcel.receiverDistrict;

    return sameDistrict
      ? parcel.deliveryCost * 0.8
      : parcel.deliveryCost * 0.3;
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        Completed Deliveries ({parcels.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>Parcel</th>
              <th>Route</th>
              <th>Cost</th>
              <th>Your Earning</th>
              <th>Cashout</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => {
              const earning =
                parcel.rider_earning ?? calculateEarning(parcel);

              return (
                <tr key={parcel._id}>
                  <td>{parcel.parcelTitle}</td>

                  <td>
                    {parcel.senderDistrict} → {parcel.receiverDistrict}
                  </td>

                  <td>৳ {parcel.deliveryCost}</td>

              
                  <td className="font-semibold text-green-600">
                    ৳ {earning.toFixed(2)}
                  </td>

                  <td>
              <button
  disabled={parcel.cashout_status === "paid"}
  onClick={() => handleCashout(parcel._id)}
  className={`btn btn-xs md:btn-sm text-white ${
    parcel.cashout_status === "paid" ? "bg-green-500" : "bg-blue-500"
  }`}
>
  {parcel.cashout_status === "paid" ? "Cashed Out" : "Cash Out"}
</button>
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
  );
};

export default CompletedDeliveries;