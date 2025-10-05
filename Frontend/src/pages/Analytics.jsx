import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import mockApiService from '../utils/mockApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await mockApiService.getStudents();
      setStudents(data);
    } catch (err) {
      setError('Không thể tải dữ liệu sinh viên');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    if (students.length === 0) return null;

    const stats = {
      totalStudents: students.length,
      avgMathScore: 0,
      avgLiteratureScore: 0,
      avgEnglishScore: 0,
      avgOverallScore: 0,
      excellentStudents: 0,
      goodStudents: 0,
      averageStudents: 0,
      weakStudents: 0,
    };

    let totalMath = 0, totalLiterature = 0, totalEnglish = 0;

    students.forEach(student => {
      const math = parseFloat(student.mathScore) || 0;
      const literature = parseFloat(student.literatureScore) || 0;
      const english = parseFloat(student.englishScore) || 0;

      totalMath += math;
      totalLiterature += literature;
      totalEnglish += english;

      const avg = (math + literature + english) / 3;
      
      if (avg >= 8) stats.excellentStudents++;
      else if (avg >= 6.5) stats.goodStudents++;
      else if (avg >= 5) stats.averageStudents++;
      else stats.weakStudents++;
    });

    stats.avgMathScore = (totalMath / students.length).toFixed(2);
    stats.avgLiteratureScore = (totalLiterature / students.length).toFixed(2);
    stats.avgEnglishScore = (totalEnglish / students.length).toFixed(2);
    stats.avgOverallScore = ((totalMath + totalLiterature + totalEnglish) / (students.length * 3)).toFixed(2);

    return stats;
  };

  const stats = calculateStats();

  // Chart data
  const subjectScoresData = {
    labels: ['Toán', 'Văn', 'Anh'],
    datasets: [
      {
        label: 'Điểm trung bình',
        data: stats ? [stats.avgMathScore, stats.avgLiteratureScore, stats.avgEnglishScore] : [],
        backgroundColor: [
          'rgba(249, 99, 50, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(52, 144, 220, 0.8)',
        ],
        borderColor: [
          'rgba(249, 99, 50, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(52, 144, 220, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const performanceDistributionData = {
    labels: ['Xuất sắc (≥8)', 'Khá (6.5-7.9)', 'Trung bình (5-6.4)', 'Yếu (<5)'],
    datasets: [
      {
        data: stats ? [stats.excellentStudents, stats.goodStudents, stats.averageStudents, stats.weakStudents] : [],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(249, 99, 50, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(249, 99, 50, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Đang tải...</span>
                </div>
                <p className="mt-3">Đang tải dữ liệu...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Lỗi!</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">
                <button className="btn btn-outline-danger" onClick={fetchStudents}>
                  <i className="now-ui-icons loader_refresh"></i> Thử lại
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || students.length === 0) {
    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-center">
                <i className="now-ui-icons files_single-copy-04 text-muted" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Không có dữ liệu</h4>
                <p className="text-muted">Chưa có sinh viên nào trong hệ thống để phân tích.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card card-stats">
            <div className="card-body">
              <div className="row">
                <div className="col-5 col-md-4">
                  <div className="icon-big text-center icon-warning">
                    <i className="now-ui-icons users_single-02 text-warning"></i>
                  </div>
                </div>
                <div className="col-7 col-md-8">
                  <div className="numbers">
                    <p className="card-category">Tổng số sinh viên</p>
                    <p className="card-title">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="now-ui-icons arrows-1_refresh-69"></i>
                Cập nhật vừa xong
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card card-stats">
            <div className="card-body">
              <div className="row">
                <div className="col-5 col-md-4">
                  <div className="icon-big text-center icon-warning">
                    <i className="now-ui-icons education_atom text-success"></i>
                  </div>
                </div>
                <div className="col-7 col-md-8">
                  <div className="numbers">
                    <p className="card-category">Điểm TB Toán</p>
                    <p className="card-title">{stats.avgMathScore}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="now-ui-icons arrows-1_refresh-69"></i>
                Cập nhật vừa xong
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card card-stats">
            <div className="card-body">
              <div className="row">
                <div className="col-5 col-md-4">
                  <div className="icon-big text-center icon-warning">
                    <i className="now-ui-icons files_paper text-info"></i>
                  </div>
                </div>
                <div className="col-7 col-md-8">
                  <div className="numbers">
                    <p className="card-category">Điểm TB Văn</p>
                    <p className="card-title">{stats.avgLiteratureScore}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="now-ui-icons arrows-1_refresh-69"></i>
                Cập nhật vừa xong
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card card-stats">
            <div className="card-body">
              <div className="row">
                <div className="col-5 col-md-4">
                  <div className="icon-big text-center icon-warning">
                    <i className="now-ui-icons tech_world text-primary"></i>
                  </div>
                </div>
                <div className="col-7 col-md-8">
                  <div className="numbers">
                    <p className="card-category">Điểm TB Anh</p>
                    <p className="card-title">{stats.avgEnglishScore}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="now-ui-icons arrows-1_refresh-69"></i>
                Cập nhật vừa xong
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">📊 Điểm trung bình theo môn</h4>
            </div>
            <div className="card-body">
              <Bar data={subjectScoresData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">🎯 Phân bố kết quả học tập</h4>
            </div>
            <div className="card-body">
              <Pie data={performanceDistributionData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">📈 Tổng quan điểm số</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="stat-item">
                    <h3 className="text-success">{stats.excellentStudents}</h3>
                    <p>Xuất sắc (≥8.0)</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="stat-item">
                    <h3 className="text-warning">{stats.goodStudents}</h3>
                    <p>Khá (6.5-7.9)</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="stat-item">
                    <h3 className="text-info">{stats.averageStudents}</h3>
                    <p>Trung bình (5.0-6.4)</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="stat-item">
                    <h3 className="text-danger">{stats.weakStudents}</h3>
                    <p>Yếu (&lt;5.0)</p>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-md-12 text-center">
                  <h4>Điểm trung bình chung: <span className="text-primary">{stats.avgOverallScore}</span></h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;