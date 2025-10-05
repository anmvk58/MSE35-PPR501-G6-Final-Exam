import './global.css';
import "bootstrap/dist/css/bootstrap.css";
import "./assets/now-ui/scss/now-ui-dashboard.scss";
import "./assets/now-ui/css/demo.css";
import "./assets/css/mse35-dashboard.css";

import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import { usePathname } from './routes/hooks';
import { ThemeProvider } from './theme/theme-provider';

import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ApiTest from "./components/ApiTest";
import StudentList from "./components/StudentList";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";

function App() {
    useScrollToTop();

    return (
        <ThemeProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="api-test" element={<ApiTest />} />
                    <Route path="students" element={<StudentList />} />
                    <Route path="add-student" element={<AddStudent />} />
                    <Route path="edit-student/:id" element={<EditStudent />} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

function useScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default App;