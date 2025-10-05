import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
} from "reactstrap";

const Dashboard = () => {
  const stats = [
    {
      title: "Tổng số sinh viên",
      value: "1,234",
      icon: "users_single-02",
      color: "primary",
      change: "+12%",
      changeColor: "success"
    },
    {
      title: "Điểm trung bình",
      value: "8.2",
      icon: "education_agenda-bookmark",
      color: "success", 
      change: "+0.3",
      changeColor: "success"
    },
    {
      title: "Tỷ lệ đậu",
      value: "92%",
      icon: "business_chart-bar-32",
      color: "info",
      change: "+5%",
      changeColor: "success"
    },
    {
      title: "Lớp học hoạt động",
      value: "28",
      icon: "education_hat",
      color: "warning",
      change: "+3",
      changeColor: "success"
    },
  ];

  const recentActivities = [
    {
      student: "Nguyễn Văn A",
      action: "Đã nộp bài tập lập trình",
      time: "2 phút trước",
      type: "success"
    },
    {
      student: "Trần Thị B",
      action: "Vắng mặt buổi học hôm nay",
      time: "1 giờ trước", 
      type: "warning"
    },
    {
      student: "Lê Văn C",
      action: "Đăng ký học phần mới",
      time: "3 giờ trước",
      type: "info"
    },
    {
      student: "Phạm Thị D",
      action: "Hoàn thành bài kiểm tra",
      time: "5 giờ trước",
      type: "success"
    }
  ];

  const subjectStats = [
    { subject: "Lập trình Web", students: 45, avgScore: 8.5, progress: 85 },
    { subject: "Cơ sở dữ liệu", students: 38, avgScore: 7.8, progress: 78 },
    { subject: "Mạng máy tính", students: 42, avgScore: 8.1, progress: 81 },
    { subject: "Thuật toán", students: 35, avgScore: 7.2, progress: 72 },
  ];

  return (
    <>
      <div className="panel-header panel-header-sm">
      </div>
      <div className="content">
        <Row>
          {stats.map((stat, index) => (
            <Col lg="3" md="6" sm="6" key={index}>
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className={`now-ui-icons ${stat.icon} text-${stat.color}`} />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{stat.title}</p>
                        <CardTitle tag="p">{stat.value}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardBody>
                  <hr />
                  <div className="stats">
                    <i className={`fa fa-arrow-up text-${stat.changeColor}`} />
                    <span className={`text-${stat.changeColor}`}>{stat.change}</span> từ tháng trước
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  <i className="now-ui-icons ui-2_time-alarm text-primary" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="timeline">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-info">
                        <span className={`badge badge-${activity.type}`}>
                          {activity.student}
                        </span>
                        <p className="mb-1">{activity.action}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
          
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  <i className="now-ui-icons education_agenda-bookmark text-success" />
                  Thống kê môn học
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Môn học</th>
                      <th>SL SV</th>
                      <th>Điểm TB</th>
                      <th>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectStats.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.subject}</td>
                        <td>{subject.students}</td>
                        <td>
                          <span className={`badge badge-${
                            subject.avgScore >= 8 ? 'success' : 
                            subject.avgScore >= 7 ? 'warning' : 'danger'
                          }`}>
                            {subject.avgScore}
                          </span>
                        </td>
                        <td>
                          <div className="progress-wrapper">
                            <span className="progress-percentage">{subject.progress}%</span>
                            <div className="progress progress-xs">
                              <div 
                                className={`progress-bar bg-${
                                  subject.progress >= 80 ? 'success' :
                                  subject.progress >= 60 ? 'warning' : 'danger'
                                }`}
                                style={{ width: `${subject.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  <i className="now-ui-icons design_bullet-list-67 text-info" />
                  Thông báo hệ thống
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="alert alert-info">
                  <span className="alert-inner--icon">
                    <i className="now-ui-icons ui-1_bell-53" />
                  </span>
                  <span className="alert-inner--text">
                    <strong>Thông báo!</strong> Hệ thống sẽ bảo trì từ 23:00 - 01:00 đêm nay.
                  </span>
                </div>
                <div className="alert alert-success">
                  <span className="alert-inner--icon">
                    <i className="now-ui-icons ui-2_like" />
                  </span>
                  <span className="alert-inner--text">
                    <strong>Hoàn thành!</strong> Cập nhật điểm số học kỳ 1 đã hoàn tất.
                  </span>
                </div>
                <div className="alert alert-warning">
                  <span className="alert-inner--icon">
                    <i className="now-ui-icons ui-1_bell-53" />
                  </span>
                  <span className="alert-inner--text">
                    <strong>Nhắc nhở!</strong> Hạn nộp báo cáo cuối kỳ là ngày 15/12.
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
