import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CreditCardService } from '../services/credit-card.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewExpensePage implements OnInit {

  expense = {
    id: 0,
    name: 'Gasto de prueba',
    amount: 30000,
    date: '2024-05-15',
    cuotas: 3,
    total: 90000
  };

  idCreditCard: number = 0;

  constructor(private navCtrl: NavController,private cardService: CreditCardService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.idCreditCard = this.route.snapshot.queryParams['id'];    
    
  }

  goBack() {
    this.navCtrl.back(); // vuelve a la página anterior en el stack
  }

  addExpense() {
    this.expense.amount = this.expense.total / this.expense.cuotas;
    this.cardService.createExpense(this.idCreditCard, this.expense);
    this.goBack();
  }

}
