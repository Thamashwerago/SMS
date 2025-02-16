import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Admin & Teacher can manage students */}
          {(user.role === "Admin" || user.role === "Teacher") && (
            <button
              onClick={() => navigate("/students")}
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
            >
              Manage Students
            </button>
          )}

          {/* All users can view AI predictions */}
          <button
            onClick={() => navigate("/performance")}
            className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
          >
            AI Performance Predictions
          </button>

          {/* Admin-only feature */}
          {user.role === "Admin" && (
            <button
              onClick={() => navigate("/users")}
              className="w-full bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700"
            >
              Manage Users
            </button>
          )}
        </div>

        <button
          onClick={logoutUser}
          className="mt-6 w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
