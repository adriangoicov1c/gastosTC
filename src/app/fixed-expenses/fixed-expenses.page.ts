import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavController, IonicModule } from '@ionic/angular';
import { ClpCurrencyPipe } from '../pipes/clp-currency.pipe';
import { CreditCardService } from '../services/credit-card.service';
import { FixedExpense, MonthlyExpense } from '../models/credit-card.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-fixed-expenses',
  templateUrl: './fixed-expenses.page.html',
  styleUrls: ['./fixed-expenses.page.scss'],
  standalone: true,
  imports: [      CommonModule, FormsModule,  FormsModule, ClpCurrencyPipe, IonicModule]
})
export class FixedExpensesPage implements OnInit {

  private cardService = inject(CreditCardService);
  gastosMensuales: MonthlyExpense[] = [];
  gastosFijos:any;
  showModal = false;
  tarjetas:any;

  public fixedExpensedName: string = '';
  public fixedExpensedAmount: number = 0;
  private sub = new Subscription();
  
  
  constructor(private navCtrl: NavController) { 
    this.tarjetas = this.cardService.getTarjetas();
    this.gastosFijos =  this.cardService.loadGastos();
    this.gastosMensuales = this.cardService.getGastosProyectados(0);
  }

  ngOnInit() {

    this.sub = this.cardService.gastos$.subscribe(cs => this.gastosFijos = cs);
    this.tarjetas = this.cardService.getTarjetas();
    console.log(this.gastosFijos);
    //console.log(this.gastosMensuales);
  }

   goBack() {
      this.navCtrl.back(); // vuelve a la página anterior en el stack
    }

  closeModal() {
    this.fixedExpensedName = '';
    this.fixedExpensedAmount = 0;
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }

  deleteGasto(id: number) {
    this.cardService.deleteExpense(id);
    this.ngOnInit();
    // Lógica para eliminar el gasto fijo
  }

  saveFixedExpense() {
     this.cardService.addGasto({
        id: Math.floor(Math.random() * 10000), // Genera un ID aleatorio
        name: this.fixedExpensedName,
        amount: this.fixedExpensedAmount
      });
    // Lógica para guardar el gasto fijo
    this.closeModal();
  }

}
