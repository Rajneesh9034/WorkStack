import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/Api";
import type{ Task } from "../types/Task";
import type{ Project } from "../types/Project";
import { useForm } from "react-hook-form";

interface TaskForm {
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
}

const ProjectTaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<TaskForm>({
    defaultValues: { status: "todo" },
  });

  const loadTasks = async (statusFilter?: string) => {
    try {
      const q = statusFilter ? `?status=${statusFilter}` : "";
      const res = await api.get(`/project/${id}${q}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const p = await api.get(`/project/${id}`);
        
        setProject(p.data);
        await loadTasks(filter);
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
      }
    })();
  }, [id, filter]);

  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
    setValue("title", task.title);
    setValue("description", task.description || "");
    setValue("dueDate", task.dueDate ? task.dueDate.slice(0, 10) : "");
    setValue("status", task.status);
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/task/${taskId}`);
      await loadTasks(filter);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const onSubmit = async (data: TaskForm) => {
    try {
       if (editingTask) {
      // 🟡 Update existing task
      await api.post('/task/update', {
  id: editingTask._id,
  ...data
});
      alert("Task updated successfully!");
    } else {
      // 🟢 Create new task
      await api.post("/task", { ...data, projectId: id });
      alert("Task created successfully!");
    }

      reset({ title: "", description: "", dueDate: "", status: "todo" });
      setShowForm(false);
       setEditingTask(null);
      await loadTasks(filter);
    } catch (err) {
      console.error(err);
      alert(editingTask ? "Failed to update task" : "Failed to create task");
    }
  };

  if (!project) return <div className="p-5">Loading...</div>;

  return (
    <div className="container py-4">
      <h1 className="h3 fw-bold mb-2">{project.title}</h1>
      <p className="text-muted mb-4">{project.description}</p>

      {/* Filter and Add Task */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <label className="me-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select d-inline-block w-auto"
          >
            <option value="">All</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border rounded p-4 bg-light mb-4"
        >
          <div className="mb-3">
            <input
              {...register("title", { required: true })}
              placeholder="Task title"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <textarea
              {...register("description")}
              placeholder="Description"
              className="form-control"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                {...register("dueDate")}
                type="date"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <select {...register("status")} className="form-select">
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            {editingTask ? "Update Task" : "Create Task"}
          </button>
        </form>
      )}

      {/* Task List */}
  {/* Task List */}
<div className="d-flex flex-column gap-3">
  {tasks.map((t) => (
    <div key={t._id} className="card shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-start">
        {/* Task info on the left */}
        <div>
          <h5 className="card-title">{t.title}</h5>
          <p className="card-text text-muted">{t.description}</p>
          <small className="text-secondary">
            Status: {t.status} | Due: {t.dueDate ? t.dueDate.slice(0, 10) : "N/A"}
          </small>
        </div>

        {/* Right-hand buttons */}
        <div className="d-flex flex-column ms-3">
          <button
            className="btn btn-sm btn-warning mb-2"
            onClick={() => handleEdit(t)}
          >
            Update
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(t._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default ProjectTaskDetails;
