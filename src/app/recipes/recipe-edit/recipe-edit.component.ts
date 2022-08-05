import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {RecipeModel} from "../recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  recipeId: number = -1;
  editMode: boolean = false;
  recipeForm: FormGroup = new FormGroup({});

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      this.editMode = ![null, undefined].includes(params['id']);
      this.initForm();
    })

  }

  private initForm() {
    let recipeName = '';
    let imageUrl = '';
    let description = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.recipeId);
      recipeName = recipe.name;
      imageUrl = recipe.imagePath;
      description = recipe.description;
      if (recipe['ingredientList']) {
        for (let ingredient of recipe.ingredientList) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
            })
          )
        }
      }
    }

    this
      .recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imageUrl, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredientList': recipeIngredients
    })

  }

  onSubmit() {
    // const newRecipe = new RecipeModel(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['ingredientList']
    // )
    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeId, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onClearForm();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredientList'))?.push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredientList')).removeAt(index);
  }

  onClearForm() {
    this.recipeForm.reset();
    this.editMode = false;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get ingredientsControls() {
    return (<FormArray>this.recipeForm.get('ingredientList')).controls
  }
}
