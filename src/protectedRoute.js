import {Navigate} from 'react-router-dom'
import NoPage from './general/noPage';


const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
  children,
}) => {
  if (!parseInt(isAllowed)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <NoPage />;
};
export default ProtectedRoute