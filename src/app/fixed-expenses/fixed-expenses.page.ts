import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavController, IonicModule } from '@ionic/angular';
import { ClpCurrencyPipe } from '../pipes/clp-currency.pipe';
import { CreditCardService } from '../services/credit-card.service';
import { MonthlyExpense } from '../models/credit-card.model';


@Component({
  selector: 'app-fixed-expenses',
  templateUrl: './fixed-expenses.page.html',
  styleUrls: ['./fixed-expenses.page.scss'],
  standalone: true,
  imports: [      CommonModule, FormsModule,  FormsModule, ClpCurrencyPipe, IonicModule]
})
export class FixedExpensesPage implements OnInit {

  private data = inject(CreditCardService);
  gastosMensuales: MonthlyExpense[] = [];
  tarjetas:any;
  
  constructor(private navCtrl: NavController) { 
    this.tarjetas = this.data.getTarjetas();
    this.gastosMensuales = this.data.getGastosProyectados(0);
  }

  ngOnInit() {

    
    console.log(this.gastosMensuales);
  }

   goBack() {
      this.navCtrl.back(); // vuelve a la página anterior en el stack
    }

}
