import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housing-location/housinglocation';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <article>
    <img class="listing-photo" [src]="'../assets/example-house.jpg'"
      alt="Exterior photo of {{housingLocation!.name}}"/>
    <section class="listing-description">
      <h2 class="listing-heading">{{housingLocation!.name}}</h2>
      <p class="listing-location">{{housingLocation!.city}}, {{housingLocation!.state}}</p>
    </section>
    <section class="listing-features">
      <h2 class="section-heading">About this housing location</h2>
      <ul>
        <li>Units available: {{housingLocation!.availableUnits}}</li>
        <li>Does this location have wifi: {{housingLocation!.wifi}}</li>
        <li>Does this location have laundry: {{housingLocation!.laundry}}</li>
      </ul>
    </section>
    <section class="listing-apply">
      <h2 class="section-heading">Apply now to live here</h2>
      <form [formGroup]="applyForm" (submit)="submitApplication()">
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" formControlName="firstName">
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" formControlName="lastName">
      <label for="email">Email</label>
      <input type="text" id="email" formControlName="email">
      <button type="submit" class="primary">Apply now</button>
      </form>
    </section>
  </article>
`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  housingLocationId!: number
  housingLocation!: HousingLocation
  applyForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required]
  })
  constructor(private routes: ActivatedRoute, private housingService: HousingService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.housingLocationId = Number(this.routes.snapshot.params['id'])
    this.housingLocation = this.housingService.getHousingLocationById(this.housingLocationId) as HousingLocation
  }
  submitApplication() {
    if (this.applyForm.status === "INVALID") return
    this.housingService.submitApplication(
      this.applyForm.value.firstName!,
      this.applyForm.value.lastName!,
      this.applyForm.value.email!,
    )
    this.applyForm.reset()
  }
}
