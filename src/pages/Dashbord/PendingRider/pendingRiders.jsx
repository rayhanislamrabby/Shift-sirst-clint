import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecures();

  /* ================= FETCH PENDING RIDERS ================= */
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/riders/pending");
      return data;
    },
  });

  /* ================= VIEW RIDER ================= */
  const handleView = (rider) => {
    Swal.fire({
      title: rider?.name || "Rider Details",
      html: `
        <div style="text-align:left">
          <img 
            src="${rider?.photoURL || "/default-avatar.png"}"
            style="width:80px;height:80px;border-radius:50%;margin-bottom:10px"
          />
          <p><b>Email:</b> ${rider?.email || "N/A"}</p>
          <p><b>Phone:</b> ${rider?.phone || "N/A"}</p>
          <p><b>Age:</b> ${rider?.age || "N/A"}</p>
          <p><b>Region:</b> ${rider?.region || "N/A"}</p>
          <p><b>District:</b> ${rider?.district || "N/A"}</p>
          <p><b>Bike Brand:</b> ${rider?.bike_brand || "N/A"}</p>
          <p><b>Bike Reg:</b> ${rider?.bike_registration || "N/A"}</p>
          <p><b>NID:</b> ${rider?.nid || "N/A"}</p>
          <p><b>Applied At:</b> ${
            rider?.applied_at
              ? new Date(rider.applied_at).toLocaleString()
              : "N/A"
          }</p>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  /* ================= ACCEPT / REJECT ================= */
  const handleUpdateStatus = async (id, status, email) => {
    const isAccept = status === "active";

    const result = await Swal.fire({
      title: isAccept ? "Accept Rider?" : "Reject Rider?",
      text: `Are you sure you want to ${
        isAccept ? "accept" : "reject"
      } this rider?`,
      icon: isAccept ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isAccept ? "Accept" : "Reject",
      confirmButtonColor: isAccept ? "#3085d6" : "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/status/${id}`, {
        status,
        email, // remove if backend doesn't need it
      });

      Swal.fire(
        "Success!",
        `Rider ${isAccept ? "accepted" : "rejected"} successfully`,
        "success"
      );

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to update rider status",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Pending Riders ({riders.length})
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Name</th>
             
              <th>Region</th>
              <th>District</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <th>{index + 1}</th>
                <td className="capitalize">{rider.name}</td>
             
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>
                  <span className="badge badge-warning text-black">
                    Pending
                  </span>
                </td>
                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(rider)}
                    className="btn btn-xs btn-info"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        rider._id,
                        "active",
                        rider.email
                      )
                    }
                    className="btn btn-xs btn-success"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        rider._id,
                        "rejected",
                        rider.email
                      )
                    }
                    className="btn btn-xs btn-error"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {riders.map((rider) => (
          <div
            key={rider._id}
            className="border rounded-lg p-4 shadow bg-base-100"
          >
            <div className="flex items-center gap-3">
              <img
                src={rider?.photoURL || "/default-avatar.png"}
                alt="rider"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h3 className="font-semibold">{rider.name}</h3>
                <p className="text-sm text-gray-500">
                  {rider.region}, {rider.district}
                </p>
              </div>
            </div>

            <span className="badge badge-warning text-black mt-3">
              Pending
            </span>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleView(rider)}
                className="btn btn-xs btn-info"
              >
                View
              </button>

              <button
                onClick={() =>
                  handleUpdateStatus(
                    rider._id,
                    "active",
                    rider.email
                  )
                }
                className="btn btn-xs btn-success"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  handleUpdateStatus(
                    rider._id,
                    "rejected",
                    rider.email
                  )
                }
                className="btn btn-xs btn-error"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {riders.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No pending riders found
        </p>
      )}
    </div>
  );
};

export default PendingRiders;