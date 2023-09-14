import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from './hero.type';
import { FormsModule } from '@angular/forms'
import { HeroDetailComponent } from '../hero-detail/hero-detail.component'
import { HeroService } from '../hero.service';
import { MessagesService } from '../messages.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroDetailComponent, RouterModule],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heros: Hero[] = []
  constructor(private heroService: HeroService, private messagesService: MessagesService) {
  }
  getHeros() {
    this.heroService.getHeros().subscribe(heroes => {
      this.heros = heroes
    })
  }
  ngOnInit(): void {
    this.getHeros()
  }
}
