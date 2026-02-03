import { useQuery } from "@tanstack/react-query";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const AssignRider = () => {
  const axiosSecure = useAxiosSecures();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assign-rider-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data;
    },
  });

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
            {parcels.map((parcel, index) => (
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
                  <span className="mx-1">→</span>
                  {parcel.receiverDistrict}
                </td>

                <td>
                  <span
                    className={`badge text-black ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge text-black ${
                      parcel.delivery_status === "delivered"
                        ? "badge-success"
                        : parcel.delivery_status === "in_transit"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {parcel.delivery_status}
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
                    disabled
                    className="btn btn-xs md:btn-sm btn-primary bg-primary text-black font-bold cursor-not-allowed"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No parcels available
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignRider;
