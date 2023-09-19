import { Navigate } from "react-router-dom";
import { FC } from "react";
import { useAuth } from "../hooks/useAuth";
interface PrivateRouteProps {
  children: React.ReactElement;
}
const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  console.log(user);
  if (!user) {
    return <Navigate to="/signup" replace={true} />;
  }
  return children;
};

export default PrivateRoute;
