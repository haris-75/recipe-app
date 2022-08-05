import {Component, OnDestroy, OnInit} from '@angular/core';
import {IngredientModel} from "../shared/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredientList: IngredientModel[] = [];
  ingredientSub: Subscription = new Subscription();

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.ingredientList = this.shoppingListService.getIngredientList();
    this.ingredientSub = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: IngredientModel[]) => {
        this.ingredientList = ingredients;
      }
    )
  }

  ngOnDestroy() {
    this.ingredientSub.unsubscribe();
  }

  onEditIngredient(index: number) {
    this.shoppingListService.startEditing.next(index);
  }

}
