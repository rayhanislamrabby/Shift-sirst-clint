import { useQuery } from "@tanstack/react-query";
import useAxiosSecures from "./useAxiosSecures";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecures();

  console.log("USER from useAuth:", user);
  console.log("authLoading:", authLoading);

  const {
    data: role = "", // default empty string
    isLoading: isRoleLoading,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email, // correct condition
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user.email}/role`);
      return response.data.role;
    },
  });

  return { role, isRoleLoading, refetchRole };
};

export default useUserRole;
