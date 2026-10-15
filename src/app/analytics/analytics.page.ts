import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CreditCardService } from '../services/credit-card.service';
import { CreditCard, MonthlyExpense } from '../models/credit-card.model';
import { Subscription } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import localeEsCl from '@angular/common/locales/es-CL';

registerLocaleData(localeEsCl, 'es-CL');

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BaseChartDirective, FormsModule],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
})
export class AnalyticsPage implements OnInit {

  tarjetas: CreditCard[] = [];
  private sub = new Subscription();

  selectedCardId: number = 0;

  gastosMensuales: MonthlyExpense[] = [];

  chartType: ChartType = 'bar';

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['mayo 2024', 'junio 2024', 'julio 2024', 'agosto 2024'],
    datasets: [
      {
        data: [130000, 130000, 130000, 80000],
        label: 'Gastos proyectados'
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };
  
  constructor(private cardService: CreditCardService) { }

  ngOnInit() {
    this.sub = this.cardService.cards$.subscribe(cs => {
      this.tarjetas = cs;
      this.loadData();
    });
  }



  loadData() {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const ahora = new Date();
    const mesActual = ahora.getFullYear() * 12 + ahora.getMonth();

    this.gastosMensuales = this.cardService
      .getGastosProyectados(Number(this.selectedCardId) || 0)
      .filter(gasto => {
        const [nombreMes, anio] = gasto.mes.toLowerCase().split(' ');
        const indiceMes = meses.indexOf(nombreMes);
        return indiceMes >= 0 && Number(anio) * 12 + indiceMes >= mesActual;
      });
    

    this.chartData = {
      labels: this.gastosMensuales.map(g => g.mes),
      datasets: [
        {
          data: this.gastosMensuales.map(g => g.total),
          label: this.selectedCardId != 0 ? 'Gastos de esta tarjeta' : 'Gastos totales',
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }

  onCardChange() {
    console.log('Tarjeta seleccionada:', this.selectedCardId);
    this.loadData();
  }

}
