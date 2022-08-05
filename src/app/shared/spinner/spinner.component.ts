import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: '<div class="loader">Loading...</div>',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
