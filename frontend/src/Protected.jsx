import { Navigate } from "react-router";

export function Protected({ accessToken, children }) {
  if (!accessToken) {
    return <Navigate to="/client/login" />;
  }
  return children;
}
