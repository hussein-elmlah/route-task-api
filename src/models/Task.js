const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['text', 'list'], default: 'text' },
  body: { type: String },
  listItems: [{ type: String }],
  shared: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{ timestamps: true, runValidators: true },
);

taskSchema.set('toJSON', {
transform(doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
},
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
