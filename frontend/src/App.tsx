import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            {/* Protected routes that require authentication */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
