import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoute = ({ children }) => {
    const [cookies] = useCookies(["AuthToken"]);

    if (!cookies.AuthToken) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;