import { Schema, model } from "mongoose";

export const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  CreatedAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  UpdatedAt: {
    type: Date,
    required: true,
    default: new Date()
  }, 
});

UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...data } = this.toObject();
  data.uid = _id;
  return data
});

export const UserModel = model('User', UserSchema);