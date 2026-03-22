import { Navigate } from "react-router-dom";
import AuthService from "../services/authService";

export default function PrivateRoute({ children }) {
    const authService = new AuthService();
    return authService.getToken() ? children : <Navigate to="/login" />;
}