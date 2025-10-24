// src/pages/NewProject.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/projects', { title, description, status });
      if(res.data.success){
      alert('✅ Project created successfully!');
      navigate('/');}
      else{
        alert(res.data.message || '❌ Failed to create project');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center fw-bold">New Project</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="form-control"
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-control"
                placeholder="Enter project description"
                rows={4}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'active' | 'completed')}
                className="form-select"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary fw-semibold"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
