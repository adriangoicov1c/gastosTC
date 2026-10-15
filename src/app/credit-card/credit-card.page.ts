import { Component, OnInit, Input, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CreditCardService } from '../services/credit-card.service';
import { CreditCard } from '../models/credit-card.model';
import localeEsCl from '@angular/common/locales/es-CL';


registerLocaleData(localeEsCl, 'es-CL');

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.page.html',
  styleUrls: ['./credit-card.page.scss'],
  standalone: true,
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  imports: [  CommonModule, FormsModule,IonicModule,RouterLink],

  
})
export class CreditCardPage implements OnInit {

  @Input() message!: string;
  @Input() id!: number;
  tarjeta!: CreditCard ;
  totalAmount: number = 0;

  constructor(private route: ActivatedRoute, private cardService: CreditCardService, private navCtrl: NavController, private alertController: AlertController) { }

   ngOnInit() {
    
    this.id = this.route.snapshot.queryParams['id'];

    this.cardService.cards$.subscribe(data => {
      this.tarjeta = data.find(t => t.id == this.id) as CreditCard;
      this.totalAmount = this.tarjeta?.gastos.reduce((sum, gasto) => sum + Number(gasto.total || 0), 0) || 0;
    });

    
   }

    goBack() {
      this.navCtrl.back(); // vuelve a la página anterior en el stack
    }

    deleteCreditCard(id: number) {
      // Lógica para eliminar la tarjeta de crédito

      
      
      this.cardService.deleteCard(id);
  
      this.navCtrl.back(); // vuelve a la página anterior en el stack
    }

    async deleteExpense(expenseId: number, expenseName: string) {
      const alert = await this.alertController.create({
        header: 'Eliminar gasto',
        message: `¿Quieres eliminar “${expenseName}”?`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', role: 'destructive', handler: () => this.cardService.deleteExpense(this.id, expenseId) }
        ]
      });
      await alert.present();
    }

}
