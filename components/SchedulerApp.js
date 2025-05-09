'use client';
import { useState } from 'react';
import { format, addDays } from 'date-fns';

const crewList = [
  { name: "Crew A", email: "a@example.com" },
  { name: "Crew B", email: "b@example.com" },
  { name: "Sub - Electrical", email: "elec@example.com" },
  { name: "Sub - Plumbing", email: "plumb@example.com" }
];

const phases = ["Site Prep", "Foundation", "Framing", "Roofing", "HVAC", "Electrical", "Plumbing", "Drywall", "Paint"];

function generateTasks(projectId) {
  const base = new Date();
  return phases.map((phase, index) => {
    const start = addDays(base, index * 3);
    const end = addDays(start, 2);
    const crew = crewList[index % crewList.length];
    return {
      id: `${projectId}-${index}`,
      phase,
      startDate: format(start, 'yyyy-MM-dd'),
      duration: 3,
      endDate: format(end, 'yyyy-MM-dd'),
      assignedTo: crew.name,
      email: crew.email
    };
  });
}

export default function SchedulerApp() {
  const [projectId, setProjectId] = useState("0");
  const [projects, setProjects] = useState(() => {
    const data = {};
    for (let i = 1; i <= 15; i++) data[i] = generateTasks(i);
    return data;
  });

  const updateTask = (id, field, value) => {
    const updated = [...projects[projectId]];
    const index = updated.findIndex(t => t.id === id);
    updated[index] = { ...updated[index], [field]: value };
    if (field === "startDate" || field === "duration") {
      const start = new Date(updated[index].startDate);
      updated[index].endDate = format(addDays(start, parseInt(updated[index].duration)), 'yyyy-MM-dd');
    }
    setProjects({ ...projects, [projectId]: updated });
  };

  return (
    <div>
      <select onChange={e => setProjectId(e.target.value)} value={projectId}>
        <option value="0">📅 Master Calendar</option>
        {Object.keys(projects).map(id => (
          <option key={id} value={id}>Project {id}</option>
        ))}
      </select>

      {projectId === "0" ? (
        <div>
          <h2>Master Calendar</h2>
          <ul>
            {Object.entries(projects).map(([id, tasks]) => (
              <li key={id}><strong>Project {id}:</strong> {tasks[0].startDate} → {tasks[tasks.length-1].endDate}</li>
            ))}
          </ul>
        </div>
      ) : (
        <table border="1" cellPadding="6" style={{ marginTop: 10 }}>
          <thead>
            <tr><th>Phase</th><th>Start</th><th>Duration</th><th>End</th><th>Assigned</th></tr>
          </thead>
          <tbody>
            {projects[projectId].map(task => (
              <tr key={task.id}>
                <td>{task.phase}</td>
                <td><input type="date" value={task.startDate} onChange={e => updateTask(task.id, 'startDate', e.target.value)} /></td>
                <td><input type="number" value={task.duration} onChange={e => updateTask(task.id, 'duration', e.target.value)} /></td>
                <td>{task.endDate}</td>
                <td>
                  <select value={task.assignedTo} onChange={e => {
                    const selected = crewList.find(c => c.name === e.target.value);
                    updateTask(task.id, 'assignedTo', selected.name);
                    updateTask(task.id, 'email', selected.email);
                  }}>
                    {crewList.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
