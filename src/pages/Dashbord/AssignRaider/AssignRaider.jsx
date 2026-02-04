import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const AssignRider = () => {
  const axiosSecure = useAxiosSecures();
  const queryClient = useQueryClient();

  // ================= STATE =================
  const [openModal, setOpenModal] = useState(false);
  const [selectedParcel, setSelectedParcel] =
    useState(null);
  const [assignLoading, setAssignLoading] =
    useState(false);

  /* ================= LOAD PARCELS ================= */
  const { data: parcels = [], isLoading } =
    useQuery({
      queryKey: ["assign-rider-parcels"],
      queryFn: async () => {
        const res = await axiosSecure.get(
          "/parcels"
        );
        return res.data;
      },
    });

  /* ================= FILTER PARCELS ================= */
  // ✅ only paid + not_collected
  const filteredParcels = parcels.filter(
    (p) =>
      p.payment_status === "paid" &&
      p.delivery_status === "not_collected"
  );

  /* ================= LOAD AVAILABLE RIDERS ================= */
  const {
    data: riders = [],
    isLoading: ridersLoading,
  } = useQuery({
    queryKey: [
      "available-riders",
      selectedParcel?.senderServiceCenter,
    ],
    enabled: !!selectedParcel,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/available?serviceCenter=${selectedParcel.senderServiceCenter}`
      );
      return res.data;
    },
  });

  /* ================= ASSIGN HANDLER ================= */
  const handleAssignRider = async (riderId) => {
    try {
      setAssignLoading(true);

      // 🔥 backend call
      await axiosSecure.patch("/assign-rider", {
        parcelId: selectedParcel._id,
        riderId,
      });

      // ✅ success modal
      await Swal.fire({
        icon: "success",
        title: "Rider Assigned!",
        text: "Parcel is now in transit.",
        confirmButtonText: "OK",
      });

      // close modal
      setOpenModal(false);
      setSelectedParcel(null);

      // refresh parcel list
      queryClient.invalidateQueries([
        "assign-rider-parcels",
      ]);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not assign rider",
      });
    } finally {
      setAssignLoading(false);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading parcels...
      </p>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Assign Rider
      </h2>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th className="hidden md:table-cell">
                Parcel
              </th>
              <th className="hidden lg:table-cell">
                Type
              </th>
              <th>From → To</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th className="hidden lg:table-cell">
                Cost
              </th>
              <th className="hidden lg:table-cell">
                Date
              </th>
              <th className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredParcels.map(
              (parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>

                  <td className="font-semibold">
                    {parcel.tracking_id}
                  </td>

                  <td className="hidden md:table-cell">
                    {parcel.parcelTitle}
                  </td>

                  <td className="hidden lg:table-cell capitalize">
                    {parcel.parcelType}
                  </td>

                  <td>
                    {parcel.senderDistrict}
                    <span className="mx-1">
                      →
                    </span>
                    {parcel.receiverDistrict}
                  </td>

                  <td>
                    <span className="badge badge-success text-black">
                      Paid
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-info text-black">
                      Not Collected
                    </span>
                  </td>

                  <td className="hidden lg:table-cell">
                    {parcel.deliveryCost} ৳
                  </td>

                  <td className="hidden lg:table-cell">
                    {new Date(
                      parcel.creation_date
                    ).toLocaleDateString()}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => {
                        setSelectedParcel(
                          parcel
                        );
                        setOpenModal(true);
                      }}
                      className="btn btn-xs md:btn-sm btn-primary text-black font-bold"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              )
            )}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white w-full max-w-md rounded-lg p-5">
            <h3 className="text-lg font-bold text-center mb-2">
              Assign Rider
            </h3>

            <p className="text-sm text-center text-gray-500 mb-3">
              Service Center:{" "}
              <b>
                {
                  selectedParcel.senderServiceCenter
                }
              </b>
            </p>

            {ridersLoading ? (
              <p className="text-center text-gray-500">
                Loading riders...
              </p>
            ) : riders.length === 0 ? (
              <p className="text-center text-red-500">
                No available riders
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {riders.map((rider) => (
                  <div
                    key={rider._id}
                    className="border rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {rider.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {rider.phone}
                      </p>
                      <p className="text-xs text-gray-400">
                        District:{" "}
                        {rider.district}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleAssignRider(
                          rider._id
                        )
                      }
                      disabled={assignLoading}
                      className="btn btn-xs btn-success text-black"
                    >
                      {assignLoading
                        ? "Assigning..."
                        : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedParcel(null);
                }}
                className="btn btn-sm btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
