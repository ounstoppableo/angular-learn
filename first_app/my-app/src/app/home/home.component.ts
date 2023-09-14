import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component'
import type { HousingLocation } from '../housing-location/housinglocation'
import { HousingService } from '../housing.service'
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent, FormsModule],
  template: `
  <section>
    <form>
      <input type="text" placeholder="Filter by city" [(ngModel)]="city" [ngModelOptions]="{standalone:true}">
      <button class="primary" type="button" (click)="search()">Search</button>
    </form>
  </section>
  <section class="results" >
    <app-housing-location *ngFor="let housingLocation of housingLocationList" [housingLocation]="housingLocation"></app-housing-location>
  </section>
`,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  housingService: HousingService = inject(HousingService)
  housingLocationList: HousingLocation[] = []
  city: string = ''
  constructor() {
    this.housingLocationList = this.housingService.getHousingLocationList()
  }
  search() {
    this.housingLocationList = this.housingService.getHousingLocationList().filter(item => item.city.toLowerCase().includes(this.city.toLowerCase()))
    this.city = ''
  }
}
