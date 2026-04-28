import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;