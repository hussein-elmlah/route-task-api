const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{ timestamps: true, runValidators: true },
);

categorySchema.set('toJSON', {
transform(doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
},
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
