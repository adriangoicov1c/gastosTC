import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private _storage: Storage | null = null;
  private readonly TARJETAS_KEY = 'tarjetas';

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


  async setTarjetas(tarjetas: any[]): Promise<void> {

    await this._initPromise;
    await this._storage?.set(this.TARJETAS_KEY, tarjetas);
  }
}
