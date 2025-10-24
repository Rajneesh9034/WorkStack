import React, { useEffect, useState } from 'react';
import api from '../services/Api';
import { Link } from 'react-router-dom';
import type { Project } from '../types/Project';

const Dashboard: React.FC = () => {
const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/projects');
        console.log(res);
        if(res.data.success){setProjects(res.data.data);}
        else{
            alert(res.data.message || 'Failed to load projects');
        }
        
      } catch (err) {
        console.error(err);
        alert('Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (Id: string) => {
      if (!window.confirm("Are you sure you want to delete this project?")) return;
      try {
        const res = await api.get(`project/delete`, { params: { id: Id } });
        if (res.data.success) {
          alert("Project deleted successfully");
          setProjects(prev => prev.filter(p => p._id !== Id));
        } else {
          alert(res.data.message || "Failed to delete project");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete project");
      }
    }

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">My Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">New Project</Link>
      </div>

      {projects.length === 0 && (
        <div className="alert alert-info">No projects yet.</div>
      )}

     <div className="row g-4">
  {projects.map((p) => (
    <div className="col-12 col-md-6" key={p._id}>
      <div className="card h-100 shadow-sm d-flex flex-column">
        <div className="card-body d-flex justify-content-between align-items-start">
          {/* Project info */}
          <div>
            <Link to={`/projects/${p._id}`} className="text-decoration-none text-dark">
              <h5 className="card-title">{p.title}</h5>
              <p className="card-text text-muted">{p.description}</p>
            </Link>
          </div>

          {/* Right-hand buttons */}
          <div className="d-flex flex-column ms-3">
            <Link to={`/projects/edit/${p._id}`} className="btn btn-sm btn-warning mb-2">
              Update
            </Link>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(p._id)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="card-footer bg-transparent border-top-0">
          <span className="badge bg-secondary">{p.status}</span>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default Dashboard;
