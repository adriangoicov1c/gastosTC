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
    this.sub = this.cardService.cards$.subscribe(cs => this.tarjetas = cs);
    this.loadData();
  }



  loadData() {
    this.gastosMensuales = this.cardService.getGastosProyectados(this.selectedCardId ?? undefined);
    

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

  getGastosProyectados(cardId?: number) {
    const cardsToProcess = cardId
      ? this.tarjetas.filter(c => c.id === cardId)
      : this.tarjetas;

    const allGastos = cardsToProcess.reduce((acc, card) => acc.concat(card.gastos), [] as any[]);

    // Aquí tu misma lógica de proyección mensual con cuotas
    const proyeccion: { mes: string; total: number }[] = [];

    allGastos.forEach((gasto: any) => {
      const fecha = new Date(gasto.date);
      for (let i = 0; i < gasto.cuotas; i++) {
        const mes = new Date(fecha.getFullYear(), fecha.getMonth() + i, 1);
        const clave = this.formatFecha(mes.toISOString());

        const existente = proyeccion.find(p => p.mes === clave);
        if (existente) {
          existente.total += gasto.amount;
        } else {
          proyeccion.push({ mes: clave, total: gasto.amount });
        }
      }
    });

    return proyeccion.sort((a, b) =>
      new Date(a.mes).getTime() - new Date(b.mes).getTime()
    );
  }


  private mesANumero(mes: string): number {
    const meses: { [key: string]: number } = {
      enero: 1, febrero: 2, marzo: 3, abril: 4,
      mayo: 5, junio: 6, julio: 7, agosto: 8,
      septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
    };
    return meses[mes.toLowerCase()] || 1;
  }

  formatFecha(fecha: string): string {
    const d = new Date(fecha);

    // Esto da "mayo de 2024"
    let texto = d.toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric"
    });

    // Quitar " de"
    texto = texto.replace(" de", "");

    // Poner mayúscula en la primera letra
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }


}
