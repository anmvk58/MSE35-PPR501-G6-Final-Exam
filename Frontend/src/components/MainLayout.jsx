import { useState } from 'react';
import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Avatar, Space, Typography, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const menuItems = [
  getItem('Học sinh', '3', <TeamOutlined />),
];

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        style={{
            background: '#1a2229',
        }}
      >
        <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', overflow: 'hidden' }}>
            QUẢN LÝ
        </div>
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #333', borderTop: '1px solid #333', display: 'flex', alignItems: 'center' }}>
            <Avatar size="large" icon={<UserOutlined />} />
            {!collapsed && (
                <div style={{ marginLeft: '10px' }}>
                    <Title level={5} style={{ color: 'white', margin: 0 }}>ronakd</Title>
                    <span style={{ color: '#52c41a' }}>● Online</span>
                </div>
            )}
        </div>
        <Menu 
            theme="dark" 
            defaultSelectedKeys={['3']} 
            mode="inline" 
            items={menuItems} 
            style={{ background: '#1a2229' }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Space>
                <Button type="primary" icon={<UserOutlined />}>Admin Area</Button>
            </Space>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Quản trị</Breadcrumb.Item>
            <Breadcrumb.Item>QUẢN LÝ HỌC SINH</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Student Management ©{new Date().getFullYear()} Created by Group 6
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;