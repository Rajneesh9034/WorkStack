// src/pages/UpdateProject.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/Api';

const UpdateProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);

  // Load existing project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get('/projectById', { params: { id } });
        if(res.data.success){
          const p = res.data.data;

          console.log('check:',p);
          setTitle(p.title);
          setDescription(p.description);
          setStatus(p.status);
        } else {
          alert(res.data.message || 'Failed to load project1');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load project2');
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/projects/update`, { id, title, description, status });
      if(res.data.success){
        alert('✅ Project updated successfully!');
        navigate('/');
      } else {
        alert(res.data.message || '❌ Failed to update project');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if(loadingProject) return <div className="text-center p-5">Loading project...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center fw-bold">Update Project</h2>
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
                className="btn btn-warning fw-semibold"
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
