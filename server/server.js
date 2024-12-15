const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
const Task = require('./models/Task'); 
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: 'https://admirable-treacle-99a153.netlify.app/', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid token' });
      }
      req.userId = user.userId;
      req.user = user;
      next();
  });
};

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.log(error);
    }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user._id, email: user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/tasks', authenticateToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

app.post('/tasks', authenticateToken, async (req, res) => {
  const { title, priority, status, startTime, endTime } = req.body;
  const newTask = new Task({ title, priority, status, startTime, endTime, userId: req.user.id });
  await newTask.save();
  res.status(201).json(newTask);
});

app.post('/add', authenticateToken, async (req, res) => {
    const { title, priority, status, startTime, endTime } = req.body;
    const newTask = new Task({
      title,
      priority,
      status,
      startTime,
      endTime,
      userId: req.user.id
    });
    await newTask.save();
    res.status(201).json(newTask);
});

app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'Complete' });
    const pendingTasks = totalTasks - completedTasks;

    const percentCompleted = (completedTasks / totalTasks) * 100;
    const percentPending = (pendingTasks / totalTasks) * 100;

    const tasks = await Task.find({ userId, status: 'Pending' });
    const currentTime = new Date();

    const timeStats = tasks.reduce(
        (acc, task) => {
            const elapsed = (currentTime - task.startTime) / (1000 * 60 * 60);
            const remaining = Math.max(0, (task.endTime - currentTime) / (1000 * 60 * 60));
            acc.elapsed += elapsed;
            acc.remaining += remaining;
            return acc;
        },
        { elapsed: 0, remaining: 0 }
    );

    const completedTaskDetails = await Task.find({ userId, status: 'Complete' });
    const totalCompletionTime = completedTaskDetails.reduce((acc, task) => {
        acc += (task.endTime - task.startTime) / (1000 * 60 * 60);
        return acc;
    }, 0);

    const averageCompletionTime = completedTasks ? totalCompletionTime / completedTasks : 0;

    res.status(200).json({
        totalTasks,
        percentCompleted,
        percentPending,
        timeStats,
        averageCompletionTime,
    });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { title, priority, status, startTime, endTime } = req.body;
  const task = await Task.findById(req.params.id);
  
  if (!task || task.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  task.title = title || task.title;
  task.priority = priority || task.priority;
  task.status = status || task.status;
  task.startTime = startTime || task.startTime;
  task.endTime = endTime || task.endTime;

  await task.save();
  res.json(task);
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this task' });
  }

  await task.deleteOne({ _id: req.params.id });
  res.json({ message: 'Task deleted' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
