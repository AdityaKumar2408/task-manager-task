const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  priority: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Create the Task model based on the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
