import { AuthContext } from "../Context/auth";
import { useContext } from "react";
export const useAuth = () => {
  return useContext(AuthContext);
};
