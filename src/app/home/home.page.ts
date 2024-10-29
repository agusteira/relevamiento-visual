import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class HomePage {
  public modal: boolean = false
  constructor(public navCtrl: NavController) {}

  ir(ruta:string){
    this.navCtrl.navigateRoot(`/visualizador/${ruta}`);
  }

  cerrarSesion(){
    this.modal = true;
    console.log("hola")
  }

  closeModal(){
    this.modal = false;
  }

  desloguearse(){
    this.navCtrl.navigateRoot("/login");
    this.modal = false;
  }
}

/*
Amarillo: F7D002
Azul: 004080
 */