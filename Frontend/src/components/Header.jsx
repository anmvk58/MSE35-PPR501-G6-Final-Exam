import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <h1>Student Management System</h1>
      <div className="user-info">
        Welcome, {user?.name || 'User'}
      </div>
    </header>
  );
};

export default Header;