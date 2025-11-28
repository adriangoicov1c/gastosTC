import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private _storage: Storage | null = null;
  private readonly TARJETAS_KEY = 'tarjetas';
  private readonly GASTOS_KEY = 'gastos';

  private _initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this._initPromise = this.init();
  }

  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }


  async getTarjetas(): Promise<any[]> {
    await this._initPromise;
    return (await this._storage?.get(this.TARJETAS_KEY)) || [];
  }

  async getGastos(): Promise<any[]> {
    await this._initPromise;
    return (await this._storage?.get(this.GASTOS_KEY)) || [];
  }

  async setTarjetas(tarjetas: any[]): Promise<void> {

    await this._initPromise;
    await this._storage?.set(this.TARJETAS_KEY, tarjetas);
  }

  async setGastos(gastos: any[]): Promise<void> {
    await this._initPromise;
    await this._storage?.set(this.GASTOS_KEY, gastos);
  }
}
