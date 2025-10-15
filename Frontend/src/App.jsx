import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import StudentManagement from './pages/StudentMangement.jsx'; 
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

function App() {
    return (
        <ConfigProvider locale={viVN}>
            <Router>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<StudentManagement />} />
                    </Routes>
                </MainLayout>
            </Router>
        </ConfigProvider>
    );
}

export default App;