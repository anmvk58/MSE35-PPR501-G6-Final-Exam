import { useStudents } from '../hooks/useStudents';
import { useState, useEffect } from 'react';
import '../assets/analytics.css';

const Analytics = () => {
  const { students } = useStudents();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (students.length > 0) {
      // Prepare data for visualization
      const averageScores = {
        math: 0,
        literature: 0,
        english: 0
      };
      
      students.forEach(student => {
        averageScores.math += parseFloat(student.mathScore || 0);
        averageScores.literature += parseFloat(student.literatureScore || 0);
        averageScores.english += parseFloat(student.englishScore || 0);
      });
      
      // Calculate averages
      averageScores.math = (averageScores.math / students.length).toFixed(2);
      averageScores.literature = (averageScores.literature / students.length).toFixed(2);
      averageScores.english = (averageScores.english / students.length).toFixed(2);
      
      setChartData(averageScores);
    }
  }, [students]);

  // Function to get performance category
  const getPerformanceCategory = (score) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5.5) return 'Average';
    if (score >= 4) return 'Below Average';
    return 'Poor';
  };

  // Calculate performance distribution
  const calculatePerformanceDistribution = () => {
    const distribution = {
      excellent: 0,
      good: 0,
      average: 0,
      belowAverage: 0,
      poor: 0
    };
    
    students.forEach(student => {
      const avgScore = (
        parseFloat(student.mathScore || 0) + 
        parseFloat(student.literatureScore || 0) + 
        parseFloat(student.englishScore || 0)
      ) / 3;
      
      const category = getPerformanceCategory(avgScore);
      
      switch(category) {
        case 'Excellent':
          distribution.excellent++;
          break;
        case 'Good':
          distribution.good++;
          break;
        case 'Average':
          distribution.average++;
          break;
        case 'Below Average':
          distribution.belowAverage++;
          break;
        case 'Poor':
          distribution.poor++;
          break;
        default:
          break;
      }
    });
    
    return distribution;
  };

  // Get top performers
  const getTopPerformers = () => {
    return [...students]
      .map(student => ({
        ...student,
        averageScore: (
          (parseFloat(student.mathScore || 0) + 
           parseFloat(student.literatureScore || 0) + 
           parseFloat(student.englishScore || 0)) / 3
        ).toFixed(2)
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  };

  if (students.length === 0) {
    return (
      <div className="card">
        <h2>Analytics</h2>
        <p>No student data available for analysis. Please add students first.</p>
      </div>
    );
  }

  const performanceDistribution = calculatePerformanceDistribution();
  const topPerformers = getTopPerformers();

  return (
    <div>
      <h2>Student Performance Analytics</h2>
      
      <div className="analytics-grid">
        {/* Average Scores Card */}
        <div className="card">
          <h3>Average Scores</h3>
          {chartData && (
            <div className="chart-container">
              <div className="bar-chart">
                <div className="bar-container">
                  <div className="bar-label">Math</div>
                  <div className="bar" style={{ width: `${chartData.math * 10}%`, backgroundColor: '#4361ee' }}>
                    {chartData.math}
                  </div>
                </div>
                <div className="bar-container">
                  <div className="bar-label">Literature</div>
                  <div className="bar" style={{ width: `${chartData.literature * 10}%`, backgroundColor: '#3a0ca3' }}>
                    {chartData.literature}
                  </div>
                </div>
                <div className="bar-container">
                  <div className="bar-label">English</div>
                  <div className="bar" style={{ width: `${chartData.english * 10}%`, backgroundColor: '#7209b7' }}>
                    {chartData.english}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Performance Distribution Card */}
        <div className="card">
          <h3>Performance Distribution</h3>
          <div className="distribution-chart">
            <div className="distribution-item">
              <div className="distribution-label">Excellent</div>
              <div className="distribution-bar" style={{ 
                width: `${(performanceDistribution.excellent / students.length) * 100}%`,
                backgroundColor: '#06d6a0'
              }}>
                {performanceDistribution.excellent}
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-label">Good</div>
              <div className="distribution-bar" style={{ 
                width: `${(performanceDistribution.good / students.length) * 100}%`,
                backgroundColor: '#1b9aaa'
              }}>
                {performanceDistribution.good}
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-label">Average</div>
              <div className="distribution-bar" style={{ 
                width: `${(performanceDistribution.average / students.length) * 100}%`,
                backgroundColor: '#f9c74f'
              }}>
                {performanceDistribution.average}
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-label">Below Average</div>
              <div className="distribution-bar" style={{ 
                width: `${(performanceDistribution.belowAverage / students.length) * 100}%`,
                backgroundColor: '#f8961e'
              }}>
                {performanceDistribution.belowAverage}
              </div>
            </div>
            <div className="distribution-item">
              <div className="distribution-label">Poor</div>
              <div className="distribution-bar" style={{ 
                width: `${(performanceDistribution.poor / students.length) * 100}%`,
                backgroundColor: '#ef476f'
              }}>
                {performanceDistribution.poor}
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Performers Card */}
        <div className="card">
          <h3>Top Performers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Average Score</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map(student => (
                <tr key={student.id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.averageScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;