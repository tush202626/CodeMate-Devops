import { Navigate } from "react-router-dom";
import AuthService from "../services/authService";

export default function AuthRoute({ children }) {
    const authService = new AuthService();
    return authService.getToken() ? <Navigate to="/dashboard" replace /> : children;
}