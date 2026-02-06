import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import StudentList from "./pages/students/StudentList";
import TeacherList from "./pages/teachers/TeacherList";
import CourseList from "./pages/courses/CourseList";
import ClassList from "./pages/classes/ClassList";
import ExamList from "./pages/exams/ExamList";
import AttendanceList from "./pages/attendance/AttendanceList";
import ResultList from "./pages/results/ResultList";
import AnnouncementList from "./pages/announcements/AnnouncementList";
import Profile from "./pages/profile/Profile"; 


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root decides where to go */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/students" element={<Layout><StudentList /></Layout>} />
        <Route path="/teachers" element={<Layout><TeacherList /></Layout>} />
        <Route path="/courses" element={<Layout><CourseList /></Layout>} />
        <Route path="/classes" element={<Layout><ClassList /></Layout>} />
        <Route path="/exams" element={<Layout><ExamList /></Layout>} />
        <Route path="/attendance" element={<Layout><AttendanceList /></Layout>} />
        <Route path="/results" element={<Layout><ResultList /></Layout>} />
        <Route path="/announcements" element={<Layout><AnnouncementList /></Layout>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
