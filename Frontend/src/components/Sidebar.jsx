import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <h2 className="mb-4">Student Management</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li className="mb-2">
            <NavLink to="/" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            } end>
              Students
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/students/add" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              Add Student
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/analytics" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              Analytics
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/api-test" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              API Test
            </NavLink>
          </li>
          <li className="mt-4">
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;