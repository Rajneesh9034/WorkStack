const express = require('express');
let router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');

router.post('/register', register);
router.post('/login', login);
router.post('/projects', auth, ctrl.createProject);
router.get('/projectById', auth, ctrl.getProject);
router.post('/projects/update', auth, ctrl.updateProject);
router.get('/project/delete', auth, ctrl.deleteProject);
router.get('/projects', auth, ctrl.getProjects);
router.post('/task', auth, taskCtrl.createTask);



// get tasks for a project (query param status optional)
router.get('/project/:projectId', auth, taskCtrl.getTasksByProject);

// update / delete
router.post('/task/update', auth, taskCtrl.updateTask);
router.delete('/task/:id', auth, taskCtrl.deleteTask);

const initWebRouter = (app) => {
    app.use('/api', router);
};

module.exports = initWebRouter;
