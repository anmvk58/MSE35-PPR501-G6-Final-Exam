import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ApiTest from './components/ApiTest';
// Import our new components
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/students" />} />
        <Route path="students" element={<StudentList />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="edit-student/:id" element={<EditStudent />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="api-test" element={<ApiTest />} />
      </Route>
    </Routes>
  );
}

export default App;