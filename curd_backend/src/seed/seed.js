require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project_management';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // 🧹 Clear existing data
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});

  // 👤 Create dummy user
  const hashedPassword = await bcrypt.hash('Test@123', 10);
  const user = await User.create({
    email: 'test@example.com',
    password: hashedPassword,
   
  });
  console.log('👤 Created user:', user.email);

  // 📁 Create fake projects
  const projects = await Project.create([
    { title: 'Marketing Website', description: 'A landing page for the new product launch', user: user._id },
    { title: 'Mobile App Redesign', description: 'Redesign the main screens for better UX', user: user._id },
    { title: 'Internal Dashboard', description: 'Analytics and reporting dashboard for team insights', user: user._id }
  ]);

  console.log('📂 Created projects:', projects.map(p => p.title).join(', '));

  // 🧩 Add 3 fake tasks per project
  for (const project of projects) {
    await Task.create([
      {
        title: `${project.title} - Research`,
        description: `Research phase for ${project.title}`,
        status: 'todo',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        project: project._id
      },
      {
        title: `${project.title} - Development`,
        description: `Development work for ${project.title}`,
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        project: project._id
      },
      {
        title: `${project.title} - Review`,
        description: `Final review and testing for ${project.title}`,
        status: 'done',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        project: project._id
      }
    ]);
    console.log(`🧱 Added 3 dummy tasks to ${project.title}`);
  }

  console.log('\n✅ Dummy data seeding complete!');
  console.log('Login with → Email: dummy@example.com | Password: Test@123');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
