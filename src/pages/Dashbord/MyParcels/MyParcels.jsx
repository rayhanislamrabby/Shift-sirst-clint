import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hook/useAuth";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecures();
  const naviget = useNavigate();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      console.log("Database response:", res.data);
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
      try {
        const res = await axiosSecure.delete(
          `/parcels/${id}?email=${user.email}`,
        );

        console.log(res.data);

        await refetch();

        Swal.fire("Deleted!", "Parcel removed", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete parcel", "error");
      }
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
      naviget(`/dashbord/payment/${id}`);
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
              <th>Name</th>
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
                <td className="capitalize">{parcel.parcelTitle || parcel.parcelName || "N/A"}</td>
                <td className="capitalize">
                  {parcel.parcelType ? parcel.parcelType.replace("-", " ") : "N/A"}
                </td>
                <td>৳ {parcel.deliveryCost}</td>
                <td>
                  <span
                    className={`badge text-black ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
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
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold capitalize text-lg">
                  {parcel.parcelTitle || parcel.parcelName || "N/A"}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {parcel.parcelType ? parcel.parcelType.replace("-", " ") : "N/A"}
                </p>
              </div>
              <span
                className={`badge text-black ${
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
        <p className="text-center mt-6 text-gray-500">No parcels found</p>
      )}
    </div>
  );
};

export default MyParcels;
