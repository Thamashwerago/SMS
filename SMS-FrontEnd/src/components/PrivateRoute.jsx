import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? children : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
