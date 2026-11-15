"use client";
import FacultyManager from "@/components/FacultyManager";

import { useEffect, useState } from "react";
const call = (url: string, method: string, body?: any) =>
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const d = await r.json();
    return Array.isArray(d) ? d : { ok: r.ok, ...d };
  });
const toggleRole = (r: string, roles: string[]) =>
  roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r];
export default function CoordinatorClient() {
  const [tab, setTab] = useState<"students" | "faculty">("students");
  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roles: ["SUPERVISOR"] as string[],
  });
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const load = async () => {
    setStudents((await call("/api/coordinator/students", "GET")) as any);
    setFaculty((await call("/api/coordinator/faculty", "GET")) as any);
  };
  useEffect(() => {
    load();
  }, []);
  const act = async (url: string, body: any) => {
    await call(url, "PATCH", body);
    load();
  };
  async function create(e: React.FormEvent) {
    e.preventDefault();
    const d: any = await call("/api/coordinator/faculty", "POST", form);
    setMsg(
      d.ok
        ? {
            t: "ok",
            m: d.warning || "Account created and credentials emailed.",
          }
        : { t: "err", m: d.error },
    );
    if (d.ok) {
      setForm({ name: "", email: "", roles: ["SUPERVISOR"] });
      load();
    }
  }
  const pending = students.filter(
    (s) => s.status === "PENDING_APPROVAL",
  ).length;
  return (
    <div className="wrap">
      <h1>Coordinator dashboard</h1>
      <div className="muted">
        Manage student approvals and faculty access.{" "}
        <a href="/coordinator/projects">
          <b>Projects and supervisor assignment</b>
        </a>
      </div>
      <div className="tabs">
        <button
          className={"tab " + (tab === "students" ? "on" : "")}
          onClick={() => setTab("students")}
        >
          Students ({pending} pending)
        </button>
        <button
          className={"tab " + (tab === "faculty" ? "on" : "")}
          onClick={() => setTab("faculty")}
        >
          Faculty &amp; board
        </button>
      </div>
      {tab === "students" && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.studentId}</td>
                  <td>{s.email}</td>
                  <td>
                    <span className={"badge " + s.status}>
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="row">
                      {s.status === "PENDING_APPROVAL" && (
                        <>
                          <button
                            className="btn sm green"
                            onClick={() =>
                              act("/api/coordinator/students", {
                                id: s.id,
                                action: "approve",
                              })
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn sm red"
                            onClick={() =>
                              act("/api/coordinator/students", {
                                id: s.id,
                                action: "reject",
                              })
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {s.status === "ACTIVE" && (
                        <button
                          className="btn sm ghost"
                          onClick={() =>
                            act("/api/coordinator/students", {
                              id: s.id,
                              action: "deactivate",
                            })
                          }
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "faculty" && <FacultyManager />}
    </div>
  );
}
