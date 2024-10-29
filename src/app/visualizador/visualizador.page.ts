import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.page.html',
  styleUrls: ['./visualizador.page.scss'],
  standalone: true,
  imports: [IonButton, IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class VisualizadorPage implements OnInit {
  parametro: string = "lindo";
  items: any;
  modal:boolean = false;
  isLoading: boolean = true; // Controla la visibilidad del overlay de carga

  constructor(private route: ActivatedRoute, public navCtrl: NavController, public fbSvc: FirebaseService) {
    this.route.params.subscribe(params => {
      this.parametro = params['parametro']; // Acceder al parámetro
    });
  }

  async ngOnInit() {
    this.items = await this.fbSvc.traerImagenes(this.parametro)
    this.isLoading = false;
    this.updateLikes();
  }

  irA(ruta:string){
    this.navCtrl.navigateRoot(ruta);
  }

  async toggleLike(photoId: string) {
    const userId = this.fbSvc.getCurrentUserId(); // Obtén el ID del usuario actual

    await this.fbSvc.toggleLike(photoId, userId!, this.parametro); // Cambia el estado de like
    this.updateLikes(); // Actualiza los contadores de likes
  }


  async updateLikes() {
    // Lógica para actualizar el estado de likes/dislikes en items
    for (const item of this.items) {
      item.likesCount = await this.fbSvc.getLikesCount(item.id,  this.parametro); // Método para obtener el conteo de likes
      item.hasLiked = await this.fbSvc.checkUserLike(item.id, this.fbSvc.getCurrentUserId()!,  this.parametro); // Actualiza el estado de like
    }
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
