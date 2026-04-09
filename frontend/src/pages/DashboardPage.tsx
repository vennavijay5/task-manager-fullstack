import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, deleteTask, Task } from '../store/taskSlice';
import { logout } from '../store/authSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { items } = useSelector((s: RootState) => s.tasks);
  const { username } = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState<Task>({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });

  useEffect(() => { dispatch(fetchTasks()); }, [dispatch]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createTask(form));
    setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
  };

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  const statusColor: Record<string, string> = { TODO: '#f0ad4e', IN_PROGRESS: '#5bc0de', DONE: '#5cb85c' };

  return (
    <div className="dashboard">
      <header>
        <h1>Task Manager</h1>
        <span>Logged in as: <strong>{username}</strong></span>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <form className="task-form" onSubmit={handleAdd}>
        <input placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})}>
          <option>LOW</option><option>MEDIUM</option><option>HIGH</option>
        </select>
        <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
        <button type="submit">Add Task</button>
      </form>
      <div className="task-grid">
        {['TODO', 'IN_PROGRESS', 'DONE'].map(col => (
          <div key={col} className="task-column">
            <h3 style={{ color: statusColor[col] }}>{col.replace('_', ' ')}</h3>
            {items.filter((t: any) => t.status === col).map((t: any) => (
              <div key={t.id} className="task-card">
                <strong>{t.title}</strong>
                <p>{t.description}</p>
                <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
                {t.dueDate && <small> Due: {t.dueDate}</small>}
                <button onClick={() => dispatch(deleteTask(t.id))}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
