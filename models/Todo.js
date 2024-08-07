const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;