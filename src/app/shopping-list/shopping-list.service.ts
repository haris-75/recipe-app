import {IngredientModel} from "../shared/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingListService {
  ingredientsChanged = new Subject<IngredientModel[]>();
  startEditing = new Subject<number>();

  private ingredientList: IngredientModel[] = [
    new IngredientModel('Apples', 5),
    new IngredientModel('Mangoes', 3),
  ];

  addIngredient(ingredient: IngredientModel) {
    this.ingredientList.push(ingredient);
    this.ingredientsChanged.next(this.ingredientList);
  }

  getIngredientList() {
    return this.ingredientList.slice();
  }

  getIngredient(index: number) {
    return this.ingredientList[index];
  }

  addIngredients(ingredientList: IngredientModel[]) {
    this.ingredientList.push(...ingredientList);
    this.ingredientsChanged.next(this.ingredientList);
  }

  updateIngredient(index: number, ingredient: IngredientModel) {
    this.ingredientList[index] = ingredient;
    this.ingredientsChanged.next(this.ingredientList.slice());
  }

  deleteIngredient(index: number) {
    this.ingredientList.splice(index, 1);
    this.ingredientsChanged.next(this.ingredientList.slice());
  }
}
