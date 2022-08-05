import {Component, Input, OnInit} from '@angular/core';
import {RecipeModel} from "../../recipe.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe = new RecipeModel('', '', '', []);
  @Input() index = -1;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

}
