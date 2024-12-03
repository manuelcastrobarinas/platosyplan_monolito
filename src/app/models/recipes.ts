import { Schema, model } from "mongoose";

export const RecipeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  create_region: {
    type: String,
    required: true,
  },
  calification: {
    type: Number,
    required: true,
  },
  time_create: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  nutricional_table: {
    type: Object,
    required: true,
  },
  utensils: {
    type: Array,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true
  },
  UpdatedAt: {
    type: Date,
    required: true,
  }, 
});

export const RecipeModel = model('Recipes', RecipeSchema);