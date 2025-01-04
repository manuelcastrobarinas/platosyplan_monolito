import { Schema, model } from "mongoose";

const IngredientsRecipeSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  }
}, { _id: false });

const NutritionalTableElement = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  }
}, {_id: false});

const NutritionalTableRecipeSchema = new Schema({
  calories         : { type: NutritionalTableElement, required: true }, 
    fat            : { type: NutritionalTableElement, required: true }, 
    satured_fat    : { type: NutritionalTableElement, required: true }, 
    carbohidrate   : { type: NutritionalTableElement, required: true }, 
    sugar          : { type: NutritionalTableElement, required: true }, 
    dietary_fiber  : { type: NutritionalTableElement, required: true }, 
    protein        : { type: NutritionalTableElement, required: true }, 
    cholesterol    : { type: NutritionalTableElement, required: true }, 
    sodium         : { type: NutritionalTableElement, required: true }, 
}, {_id: false});

const UtensilsRecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
}, {_id: false});

const CookingStepsRecipeSchema = new Schema({
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  utensilios_steps: {
    type: [UtensilsRecipeSchema],
    required: true,
  },
  ingredients_steps: {
    type: [IngredientsRecipeSchema],
    required: true
  }
}, { _id: false });

export const RecipeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
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
  active: {
    type: Boolean,
    required: true,
  },
  ingredients: {
    type: [IngredientsRecipeSchema],
    required: true,
  },
  nutricional_table: {
    type: NutritionalTableRecipeSchema,
    required: true,
  },
  utensils: [UtensilsRecipeSchema],
  steps: {
    type: [CookingStepsRecipeSchema],
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