import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Hero } from '../heroes/hero.type';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  hero!: Hero
  constructor(private routes: ActivatedRoute, private heroService: HeroService, private location: Location) { }
  getHeros() {
    const id = this.routes.snapshot.params['id']
    this.heroService.getHeroDetailById(Number(id)).subscribe(hero => this.hero = hero as Hero)
  }
  ngOnInit(): void {
    this.getHeros()
  }
  goBack(): void {
    this.location.back()
  }
}
