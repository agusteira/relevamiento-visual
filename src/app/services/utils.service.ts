import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);

  //==============LOADING================
  loading(){
    return this.loadingCtrl.create({spinner: "crescent"});
  }

  //==============LOADING================
  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create({
      message: "your settings have been saved.",
      duration: 2000
    });
    toast.present;
  }
}
