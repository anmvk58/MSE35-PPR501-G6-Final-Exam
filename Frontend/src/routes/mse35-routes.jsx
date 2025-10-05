import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import StudentList from "../pages/StudentList.jsx";



export const mse35Routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/analytics", 
    name: "Analytics",
    icon: "business_chart-bar-32",
    component: Analytics,
    layout: "/admin"
  },
  {
    path: "/students",
    name: "Student List", 
    icon: "users_single-02",
    component: StudentList,
    layout: "/admin"
  },
  {
    path: "/add-student",
    name: "Add Student",
    icon: "ui-1_simple-add",
    component: AddStudent,
    layout: "/admin"
  },
  {
    path: "/edit-student/:id",
    name: "Edit Student",
    icon: "ui-2_settings-gear-65",
    component: EditStudent,
    layout: "/admin",
    invisible: true // Hide from sidebar
  },
  {
    path: "/api-test",
    name: "API Test",
    icon: "tech_settings-gear-65", 
    component: ApiTest,
    layout: "/admin"
  }
];

export default mse35Routes;