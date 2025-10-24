const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { projectId, title, description, dueDate, status } = req.body;
    const project = await Project.findById(projectId);
    console.log(req.user);
    if (!project || project.user.toString() !== req.user.id) return res.status(200).json({ message: 'Project not found' });

    const task = await Task.create({ title, description, dueDate, status, project: projectId });
    res.status(201).json(task);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const getTasksByProject = async (req, res) => {
  try {
    const { status } = req.query;

    const project = await Project.findById(req.params.projectId);
    if (!project || project.user.toString() !== req.user.id) return res.status(200).json({ message: 'Project not found' });

    const q = { project: req.params.projectId };
    if (status) q.status = status;
    const tasks = await Task.find(q);
    res.json({ success: true, tasks });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const updateTask = async (req, res) => {
  try {
    const { id, title, description, dueDate, status } = req.body;

    // Find the task using the ID from the body
    const task = await Task.findById(id).populate('project');

    if (!task || task.project.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields only if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task || task.project.user.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { deleteTask, updateTask, getTasksByProject, createTask };
