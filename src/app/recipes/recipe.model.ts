import {IngredientModel} from "../shared/ingredient.model";

export class RecipeModel {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredientList: IngredientModel[];

  constructor (name: string, description: string, imagePath: string, ingredientList: IngredientModel[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredientList = ingredientList;
  }
}
