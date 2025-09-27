import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CreditCardService } from '../services/credit-card.service';

@Component({
  selector: 'app-new-credit-card',
  templateUrl: './new-credit-card.page.html',
  styleUrls: ['./new-credit-card.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,]
})
export class NewCreditCardPage implements OnInit {

  constructor(private navCtrl: NavController,private cardService: CreditCardService) { }

  public cardName: string = '';
  public cardExpirationDate: string = '';

  ngOnInit() {
  }

  goBack() {
      this.navCtrl.back(); // vuelve a la página anterior en el stack
    }

    addCreditCard() {
      this.cardService.addCard({
        id: Math.floor(Math.random() * 10000), // Genera un ID aleatorio
        name: this.cardName,
        gastos: []
      });

      this.goBack(); // vuelve a la página anterior en el stack
    }
}
