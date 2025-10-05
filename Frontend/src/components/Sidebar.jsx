import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">🎓 Student Management</h2>
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    📋 Students
                </NavLink>
                <NavLink to="/students/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    ➕ Add Student
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    📊 Analytics
                </NavLink>
                <NavLink to="/api-test" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    🔌 API Test
                </NavLink>
                <button onClick={logout} className="btn-logout">🚪 Logout</button>
            </nav>
        </aside>
    );
};

export default Sidebar;
