// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";

const getCount = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d.length;
  if (Array.isArray(d?.data)) return d.data.length;
  return 0;
};

// ✅ Adjust this if your student "class" field is different
const getClassLabel = (s) => {
  if (s.className) return s.className;              // e.g. "Grade 10A"
  if (typeof s.class === "string") return s.class;  // e.g. "Form 2"
  if (s.classId?.name) return s.classId.name;       // e.g. populated class
  return "Unassigned";
};

const Dashboard = () => {
  const [counts, setCounts] = useState({
    teachers: 0,
    courses: 0,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [studentsRes, teachersRes, coursesRes] = await Promise.all([
          client.get("/students"),
          client.get("/teachers"),
          client.get("/courses"),
        ]);

        const studentsData = Array.isArray(studentsRes?.data)
          ? studentsRes.data
          : Array.isArray(studentsRes?.data?.data)
          ? studentsRes.data.data
          : [];

        setStudents(studentsData);

        setCounts({
          teachers: getCount(teachersRes),
          courses: getCount(coursesRes),
        });
      } catch (err) {
        console.error("Failed to load dashboard counts:", err);
      }
    };

    loadCounts();
  }, []);

  // ✅ Build class -> count from students
  const classCards = useMemo(() => {
    const map = new Map();

    for (const s of students) {
      const cls = getClassLabel(s);
      map.set(cls, (map.get(cls) || 0) + 1);
    }

    // Sort class names A-Z (you can customize ordering later)
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count }));
  }, [students]);

  const totalStudents = students.length;

  // Base cards + class cards
  const cards = [
    { label: "Students", count: totalStudents },
    { label: "Teachers", count: counts.teachers },
    { label: "Courses", count: counts.courses },
    ...classCards.map((c) => ({ label: c.label, count: c.count })),
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col"
          >
            <span className="text-sm text-gray-500">{card.label}</span>
            <span className="mt-2 text-3xl font-bold text-blue-600">
              {card.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
