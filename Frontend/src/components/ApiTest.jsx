import { useState, useEffect } from 'react';
import apiService from '../utils/api';

const ApiTest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const testApiConnection = async () => {
        setLoading(true);
        setError(null);

        try {
            // You can replace this with any endpoint you want to test
            const response = await apiService.getStudents();
            setData(response.data);
            console.log('API connection successful:', response.data);
        } catch (err) {
            setError(err.message || 'Failed to connect to API');
            console.error('API connection error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">API Connection Test</h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={testApiConnection}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Testing...' : 'Test API Connection'}
                </button>
            </div>

            {error && (
                <div style={{ color: 'var(--danger-color)', marginBottom: '20px' }}>
                    <strong>Error:</strong> {error}
                    <p>
                        Make sure your backend server is running at the URL specified in the API service.
                        <br />
                        <code>baseURL: 'http://localhost:5000/api'</code> in <code>src/utils/api.js</code>
                    </p>
                </div>
            )}

            {data && (
                <div>
                    <h3>API Response:</h3>
                    <pre style={{
                        background: '#f1f5f9',
                        padding: '15px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        maxHeight: '300px'
                    }}>
            {JSON.stringify(data, null, 2)}
          </pre>
                </div>
            )}
        </div>
    );
};

export default ApiTest;