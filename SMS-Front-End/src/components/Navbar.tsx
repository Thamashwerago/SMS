import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">School Management</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/students" className="hover:underline">Students</Link>
          <Link to="/add-student" className="hover:underline">Add Student</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
