import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hook/useAuth";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecures();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  /* ❌ Delete */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Parcel?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes Delete",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/parcels/${id}`);
      refetch();
      Swal.fire("Deleted!", "Parcel removed", "success");
    }
  };

  /* 💳 Pay */
  const handlePay = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Payment?",
      text: "Proceed to payment?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Pay Now",
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`/parcels/pay/${id}`);
      refetch();
      Swal.fire("Paid!", "Payment successful", "success");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        My Parcels ({parcels.length})
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td className="capitalize">
                  {parcel.parcelType.replace("-", " ")}
                </td>
                <td>৳ {parcel.deliveryCost}</td>
                <td>
                  <span
                    className={`badge text-white ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td>
                  {new Date(parcel.creation_date).toLocaleDateString()}
                </td>
                <td className="flex gap-2 justify-center">
                  <button className="btn btn-xs btn-info">View</button>

                  {parcel.payment_status === "unpaid" && (
                    <button
                      onClick={() => handlePay(parcel._id)}
                      className="btn btn-xs btn-warning"
                    >
                      Pay
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {parcels.map((parcel) => (
          <div
            key={parcel._id}
            className="border rounded-lg p-4 shadow-sm bg-base-100"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold capitalize">
                {parcel.parcelType.replace("-", " ")}
              </h3>
              <span
                className={`badge text-white ${
                  parcel.payment_status === "paid"
                    ? "badge-success"
                    : "badge-warning"
                }`}
              >
                {parcel.payment_status}
              </span>
            </div>

            <p className="mt-2 text-sm">
              Cost: <strong>৳ {parcel.deliveryCost}</strong>
            </p>

            <p className="text-sm text-gray-500">
              {new Date(parcel.creation_date).toLocaleDateString()}
            </p>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-xs btn-info">View</button>

              {parcel.payment_status === "unpaid" && (
                <button
                  onClick={() => handlePay(parcel._id)}
                  className="btn btn-xs btn-warning"
                >
                  Pay
                </button>
              )}

              <button
                onClick={() => handleDelete(parcel._id)}
                className="btn btn-xs btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {parcels.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No parcels found
        </p>
      )}
    </div>
  );
};

export default MyParcels;
