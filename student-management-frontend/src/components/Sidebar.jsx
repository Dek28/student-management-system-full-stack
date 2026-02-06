// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const navLinkBase =
  "block px-4 py-2 rounded-md text-sm font-medium transition-colors";
const activeClasses = "bg-blue-800";
const inactiveClasses = "hover:bg-blue-500";


const Sidebar = () => {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/students", label: "Students" },
    { to: "/teachers", label: "Teachers" },
    { to: "/courses", label: "Courses" },
    { to: "/classes", label: "Classes" },
    { to: "/attendance", label: "Attendance" },
    { to: "/exams", label: "Exams" },
    { to: "/results", label: "Results" },
    { to: "/timetable", label: "Timetable" },
    { to: "/announcements", label: "Announcements" },
  ];

  return (
   <aside className="w-64 bg-gray-800 border-r min-h-screen sticky top-0 text-white">
      <div className="px-4 py-4 text-xl font-bold border-b">
        Student Manager
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
