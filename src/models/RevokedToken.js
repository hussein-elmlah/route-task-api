const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
});

revokedTokenSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);

module.exports = RevokedToken;
