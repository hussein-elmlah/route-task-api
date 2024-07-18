const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CustomError = require('../lib/customError');

const loginHistorySchema = new mongoose.Schema({
  success: { type: Boolean, required: true },
  timestamp: { type: Date, required: true },
  ip: { type: String },
  userAgent: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, minlength: 8 },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'The email you entered is not a valid email address!',
      },
    },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true, runValidators: true },
);

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // Remove the 'password' field from the JSON output for security reasons
    delete ret.password;
  },
});

// Hook to trim all input strings before validating
userSchema.pre('validate', function (next) {
  for (const key in this._doc) {
    if (this._doc.hasOwnProperty(key) && typeof this._doc[key] === 'string') {
      this._doc[key] = this._doc[key].trim();
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Validate in update
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    // Trim string fields in the update object
    for (const key in this._update) {
      if (
        this._update.hasOwnProperty(key)
        && typeof this._update[key] === 'string'
      ) {
        this._update[key] = this._update[key].trim();
      }
    }
    // Enable validation for the update operation
    this.options.runValidators = true;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post('findOneAndUpdate', async function (doc, next) {
  try {
    // Check if doc exists
    if (!doc) {
      // Handle the case where no user is found
      throw new CustomError('user not found', 404);
    }
    // Save the document to persist the changes
    if (
      this._update.$set.password
      && typeof this._update.$set.password === 'string'
    ) {
      // Access the document being updated and mark 'password' field as modified
      doc.markModified('password');
    }
    await doc.save();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
