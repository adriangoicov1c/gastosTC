import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CreditCard } from '../models/credit-card.model';
import { CreditCardService } from '../services/credit-card.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, CommonModule],
})
export class HomePage {

  tarjetas: CreditCard[] = [];
  private sub = new Subscription();

  constructor(private cardService: CreditCardService) { }

  ngOnInit() {
    this.sub = this.cardService.cards$.subscribe(cs => this.tarjetas = cs);
  }

  deleteCard(id: number) {
    this.cardService.deleteCard(id);
  }
}
