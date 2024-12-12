import { Schema, model, Document } from "mongoose";
import { IUser } from "../services/interfaces/user";

interface IUserDocument extends IUser, Document {}

export const UserSchema = new Schema<IUserDocument>({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    }
  },
  email: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    unique: true,
  },
  password: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  phone: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    unique:true,
  },
  CreatedAt: {
    type: Date,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    default: new Date(),
  },
  UpdatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// Método para excluir campos sensibles en la respuesta JSON
UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...data } = this.toObject();
  data.uid = _id; // Cambia _id a uid
  return data;
});


UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});


export const UserModel = model('User', UserSchema);

