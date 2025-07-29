import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div> Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  console.log(user);

if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
