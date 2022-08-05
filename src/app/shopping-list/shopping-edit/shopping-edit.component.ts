import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {IngredientModel} from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) ingredientForm: NgForm = new NgForm([], []);
  subscription: Subscription = new Subscription();
  editMode = false;
  editItemIndex = -1;
  editedItem: IngredientModel = new IngredientModel('', -1);

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.ingredientForm.setValue({name: this.editedItem.name, amount: this.editedItem.amount});
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    let value = this.ingredientForm.value;
    let newIngredient = new IngredientModel(this.ingredientForm.value.name, this.ingredientForm.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient({
        name: value.name,
        amount: value.amount,
      })
    }
    this.onClearForm();
  }

  onClearForm() {
    this.editMode = false;
    this.ingredientForm.reset();
    this.editItemIndex = -1;
  }

  onDeleteIngredient() {
    this.onClearForm();
    this.shoppingListService.deleteIngredient(this.editItemIndex);

  }

}
