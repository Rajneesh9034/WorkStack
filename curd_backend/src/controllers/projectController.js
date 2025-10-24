const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(200).json({ success: false, message: 'All fields are required' });
    }
    const project = await Project.create({ title, description, status, user: req.user.id });
    res.status(201).json({ success: true, data: project });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    if (projects.length === 0) {
        return res.status(200).json({ success: false, message: 'No projects found' });
    }
    res.status(200).json({ success: true, data: projects });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
};

const getProject = async (req, res) => {
  try {
     
      const { id } = req.query;
    const project = await Project.findById(id);
   
    if (!project || project.user.toString() !== req.user.id) return res.status(200).json({ message: 'Not found' });
    res.json({ success: true, data: project });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const updateProject = async (req, res) => {
  try {
    const { id, title, description, status } = req.body;
    const project = await Project.findById(id);
    console.log('check:', project);
    if (!project || project.user.toString() !== req.user.id) return res.status(200).json({ success: false, message: 'Not found' });
   
    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.status = status ?? project.status;
    await project.save();
    res.json({ success: true, data: project, message: 'Updated successfully' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.query;
    const project = await Project.findById(id);
    if (!project || project.user.toString() !== req.user.id) return res.status(200).json({ success: false, message: 'Not found' });
    await project.deleteOne();
    res.json({success: true, message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { deleteProject, updateProject, getProject, createProject ,getProjects};
