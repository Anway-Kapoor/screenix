import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";

import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;