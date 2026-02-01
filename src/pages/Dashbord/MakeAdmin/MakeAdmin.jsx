import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaUserShield, FaUserTimes } from "react-icons/fa";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import useAuth from "../../../hook/useAuth";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecures();
  const { user } = useAuth(); // logged admin

  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  /* ================= DEBOUNCE INPUT ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(searchEmail.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchEmail]);

  /* ================= LIVE SEARCH QUERY ================= */
  const {
    data: users = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["users-search", debouncedEmail],
    enabled: !!debouncedEmail, // only when there's text
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?email=${debouncedEmail}`
      );
      return res.data;
    },
  });

  /* ================= ROLE MUTATION ================= */
  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/users/${id}/role`, {
        role,
        adminEmail: user?.email,
      });
    },
    onSuccess: () => {
      toast.success("Role updated");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  /* ================= HANDLER FOR ROLE CHANGE ================= */
  const handleRoleChange = async (id, currentRole) => {
    const isAdmin = currentRole === "admin";
    const newRole = isAdmin ? "remove-admin" : "admin";
    const title = isAdmin ? "Remove Admin" : "Make Admin";

    const confirm = await Swal.fire({
      title,
      text: isAdmin
        ? "This user will lose admin privileges"
        : "This user will gain admin privileges",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: title,
    });

    if (!confirm.isConfirmed) return;

    await updateRole({ id, role: newRole });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-base-100 rounded shadow">

      {/* ================= HEADER ================= */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Make Admin
      </h2>

      {/* ================= SEARCH BOX ================= */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Type email to search..."
          className="input input-bordered w-full md:w-64"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {/* ================= LOADING ================= */}
      {isFetching && (
        <p className="text-center text-gray-500">Searching...</p>
      )}

      {/* ================= TABLE VIEW ================= */}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`badge text-black ${
                        u.role === "admin"
                          ? "badge-success"
                          : "badge-info"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() =>
                        handleRoleChange(u._id, u.role)
                      }
                      className={`btn btn-sm text-black ${
                        u.role === "admin"
                          ? "btn-error"
                          : "btn-success"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <>
                          <FaUserTimes className="mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <FaUserShield className="mr-1" />
                          Make Admin
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= NO RESULTS ================= */}
      {!isFetching && debouncedEmail && users.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No matching users found
        </p>
      )}
    </div>
  );
};

export default MakeAdmin;
