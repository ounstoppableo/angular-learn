import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './heroes/hero.type'
import { Observable, of } from 'rxjs'
import { MessagesService } from './messages.service';
@Injectable()
export class HeroService {
  getHeros(): Observable<Hero[]> {
    const heros = of(HEROES)
    this.messagesService.add('HeroService: fetched heroes');
    return heros
  }
  getHeroDetailById(id: number) {
    const hero = HEROES.find(item => item.id === id)
    return of(hero)
  }
  constructor(
    private messagesService: MessagesService) { }

}
