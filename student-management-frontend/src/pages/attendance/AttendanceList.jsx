// src/pages/attendance/AttendanceList.jsx
import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";

const STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  PERMISSION: "AbsentWithPermission",
};

const AttendanceList = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // { studentId: { status, remark } }
  const [draft, setDraft] = useState({});

  const selectedClassLabel = useMemo(() => className || "—", [className]);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await client.get("/classes");
        setClasses(res.data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load classes");
      }
    };
    loadClasses();
  }, []);

  // Load students when className changes
  useEffect(() => {
    const loadStudents = async () => {
      if (!className) {
        setStudents([]);
        setDraft({});
        return;
      }

      setLoadingStudents(true);
      try {
        const res = await client.get(
          `/students?className=${encodeURIComponent(className)}`
        );
        const list = res.data || [];
        setStudents(list);

        const init = {};
        for (const s of list) {
          init[s._id] = { status: STATUS.PRESENT, remark: "" };
        }
        setDraft(init);
      } catch (e) {
        console.error(e);
        alert("Failed to load students for this class");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [className]);

  const setStatus = (studentId, status) => {
    setDraft((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const setRemark = (studentId, remark) => {
    setDraft((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remark },
    }));
  };

  const markAll = (status) => {
    setDraft((prev) => {
      const next = { ...prev };
      for (const id of Object.keys(next)) {
        next[id] = { ...next[id], status };
      }
      return next;
    });
  };

  const saveAttendance = async () => {
    if (!className) return alert("Select a class");
    if (!date) return alert("Select a date");
    if (!students.length) return alert("No students in this class");

    const records = students.map((s) => ({
      studentId: s._id,
      status: draft[s._id]?.status || STATUS.PRESENT,
      remark: draft[s._id]?.remark || "",
    }));

    setSaving(true);
    try {
      await client.post("/attendance/bulk", { className, date, records });
      alert("Attendance saved!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const statusBtn = (active) =>
    [
      "px-2.5 py-1 rounded-full text-xs font-semibold border transition",
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
      "focus:outline-none focus:ring-2 focus:ring-blue-500",
    ].join(" ");

  const canSave = !saving && !loadingStudents && className;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Attendance</h2>
          <p className="text-sm text-gray-500">
            Select a class, mark each student, then save.
          </p>
        </div>

        <button
          onClick={saveAttendance}
          disabled={!canSave}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      {/* Controls Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select class...</option>
              {classes.map((c) => {
                const label = c.name || c.className || c.title;
                return (
                  <option key={c._id || label} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3 flex items-end gap-2">
            <button
              type="button"
              onClick={() => markAll(STATUS.PRESENT)}
              disabled={!students.length}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll(STATUS.ABSENT)}
              disabled={!students.length}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Small summary */}
        <div className="mt-3 text-sm text-gray-600">
          Class: <span className="font-medium text-gray-800">{selectedClassLabel}</span>{" "}
          • Date: <span className="font-medium text-gray-800">{date}</span>{" "}
          • Students:{" "}
          <span className="font-medium text-gray-800">{students.length}</span>
        </div>
      </div>

      {/* Content */}
      {loadingStudents ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <LoadingSpinner />
        </div>
      ) : !className ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <div className="text-sm text-gray-600">
            Select a class to display students for attendance.
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <div className="text-sm text-gray-600">
            No students found in <span className="font-semibold">{className}</span>.
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">{className}</div>
            <div className="text-sm text-gray-600">{students.length} students</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-left text-gray-700">
                  <th className="px-4 py-3 font-semibold">Student name</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, idx) => {
                  const row = draft[s._id] || {
                    status: STATUS.PRESENT,
                    remark: "",
                  };

                  return (
                    <tr
                      key={s._id}
                      className={[
                        "border-t",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {s.name}
                        <div className="text-xs text-gray-500">
                          Reg: {s.regNo || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-700">{date}</td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className={statusBtn(row.status === STATUS.PRESENT)}
                            onClick={() => setStatus(s._id, STATUS.PRESENT)}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            className={statusBtn(row.status === STATUS.ABSENT)}
                            onClick={() => setStatus(s._id, STATUS.ABSENT)}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            className={statusBtn(row.status === STATUS.PERMISSION)}
                            onClick={() => setStatus(s._id, STATUS.PERMISSION)}
                          >
                            Permission
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={row.remark}
                          onChange={(e) => setRemark(s._id, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Reason / permission details..."
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Tip: Use “All Present” then mark only absent students.
            </div>
            <button
              onClick={saveAttendance}
              disabled={!canSave}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
