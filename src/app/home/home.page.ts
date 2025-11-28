import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  private data = inject(CreditCardService);
  tarjetas:any;
  private sub = new Subscription();

  selectedPdfFile: File | null = null;
  pdfSrc: string | ArrayBuffer | null = null;
  textContent: string = '';

  constructor(private cardService: CreditCardService) {
    this.tarjetas = this.data.getTarjetas();
   }

  ngOnInit() {
    this.sub = this.cardService.cards$.subscribe(cs => this.tarjetas = cs);
  }

  deleteCard(id: number) {
    this.cardService.deleteCard(id);
  }
  /*

  loadPdf(): void {
    if (this.selectedPdfFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result; // This will be the base64 or ArrayBuffer for the viewer
        this.extractText(this.selectedPdfFile!,"18172431");
      };
      reader.readAsArrayBuffer(this.selectedPdfFile); // Or reader.readAsDataURL() for base64

      
    }
  }
  
  async extractTextFromPdf(url: string): Promise<string> {

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((s: any) => s.str).join('');
        fullText += pageText + ' ';
      }
      return fullText;
    }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
      console.log(this.selectedPdfFile);
      this.loadPdf();
    }
  }
  
  async extractText(file: Blob, password?: string) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, password }).promise;
    

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map((s: any) => s.str).join(" ");

        let capture = false;
        // Recorremos línea por línea
        const lines = pageText.split("\n");
        for (const line of lines) {
          if (!capture && line.includes("Total de pagos a la cuenta")) {
            capture = true;
          }

          if (capture) {
            this.textContent += line + "\n";
            
          }
          console.log(line);

          if (capture && line.includes("Información de Pago")) {
            capture = false;
            break; // opcional: salir del bucle si ya encontramos el fin
          }
        }
      }
    
    return this.textContent;
  }*/


  
  
}
