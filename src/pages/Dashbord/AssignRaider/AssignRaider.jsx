
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const AssignRider = () => {
  const axiosSecure = useAxiosSecures();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [assigningId, setAssigningId] = useState(null); // 🔥 only clicked rider loading

  /* ================= LOAD PARCELS ================= */
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assign-rider-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

  /* ================= FILTER ================= */
  const filteredParcels = parcels.filter(
    (p) => p.payment_status === "paid" && p.delivery_status === "not_collected"
  );

  /* ================= LOAD RIDERS ================= */
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderServiceCenter],
    enabled: !!selectedParcel,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/available?serviceCenter=${selectedParcel.senderServiceCenter}`
      );
      return res.data;
    },
  });

  /* ================= ASSIGN MUTATION ================= */
  const assignMutation = useMutation({
    mutationFn: async (rider) => {
      setAssigningId(rider._id);

      const payload = {
        riderId: rider._id,
        riderName: rider.name,
        riderEmail: rider.email,
      };

      const res = await axiosSecure.patch(
        `/parcels/assign/${selectedParcel._id}`,
        payload
      );

      return res.data;
    },

    onSuccess: async () => {
      await Swal.fire({
        icon: "success",
        title: "Rider Assigned!",
        text: "Parcel is now in transit.",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpenModal(false);
      setSelectedParcel(null);
      setAssigningId(null);

      queryClient.invalidateQueries(["assign-rider-parcels"]);
    },

    onError: () => {
      setAssigningId(null);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not assign rider",
      });
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading parcels...</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
        Assign Rider
      </h2>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th className="hidden md:table-cell">Parcel</th>
              <th>Route</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredParcels.map((parcel, i) => (
              <tr key={parcel._id}>
                <td>{i + 1}</td>
                <td className="font-semibold">{parcel.tracking_id}</td>

                <td className="hidden md:table-cell">{parcel.parcelTitle}</td>

                <td>
                  {parcel.senderDistrict} → {parcel.receiverDistrict}
                </td>

                <td>
                  <span className="badge badge-info text-black">
                    Not Collected
                  </span>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedParcel(parcel);
                      setOpenModal(true);
                    }}
                    className="btn btn-xs md:btn-sm btn-primary text-black"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredParcels.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No paid & not-collected parcels
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {openModal && selectedParcel && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2">
          <div className="bg-white w-full max-w-md rounded-lg p-5">
            <h3 className="font-bold text-lg text-center mb-3">Select Rider</h3>

            <p className="text-center text-sm text-gray-500 mb-2">
              Service Center: <b>{selectedParcel.senderServiceCenter}</b>
            </p>

            {ridersLoading ? (
              <p className="text-center">Loading riders...</p>
            ) : riders.length === 0 ? (
              <p className="text-center text-red-500">No available riders</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {riders.map((rider) => (
                  <div
                    key={rider._id}
                    className="border p-2 flex justify-between items-center rounded"
                  >
                    <div>
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-xs text-gray-500">{rider.email}</p>
                    </div>

                    <button
                      onClick={() => assignMutation.mutate(rider)}
                      disabled={assigningId === rider._id}
                      className="btn btn-xs btn-success"
                    >
                      {assigningId === rider._id ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setOpenModal(false)}
              className="btn btn-sm mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
