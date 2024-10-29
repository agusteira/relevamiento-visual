import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js'; // Importa Chart y registerables

// Registra todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ResultadosPage implements OnInit {
  parametro: any;
  public chart: any;
  public photoLikes: any[] = []; // Array para almacenar los likes de las fotos
  modal: boolean = false

  constructor(private route: ActivatedRoute, public navCtrl: NavController, public fbSvc: FirebaseService) {
    this.route.params.subscribe(params => {
      this.parametro = params['parametro']; // Acceder al parámetro
    });
  }

  async ngOnInit() {
    await this.cargarDatosGrafico();
  }

  irA(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
  }

  async cargarDatosGrafico() {
    const fotos = await this.fbSvc.traerImagenes(this.parametro);
    
    for (const foto of fotos) {
      const likesCount = await this.fbSvc.getLikesCount(foto.id, this.parametro);
      this.photoLikes.push({ id: foto.id, likes: likesCount, usuario: foto.usuario, hora: foto.Fecha });
    }

    this.crearGrafico(this.parametro);
  }

  crearGrafico(tipo: string) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const labels = this.photoLikes.map(photo => photo.hora); // Utiliza el ID como etiqueta
    const data = this.photoLikes.map(photo => photo.likes);

    const chartType = tipo === 'feas' ? 'bar' : 'pie'; // Selecciona el tipo de gráfico basado en el parámetro

    this.chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Likes por Foto',
          data: data,
          backgroundColor: tipo === 'feas' 
            ? [
              'rgba(255, 99, 132)',  // Rojo suave
              'rgba(54, 162, 235)',  // Azul suave
              'rgba(255, 206, 86)',  // Amarillo suave
              'rgba(75, 192, 192)',  // Verde suave
              'rgba(153, 102, 255)', // Morado suave
              'rgba(255, 159, 64)'   // Naranja suave
            ]
            : [
              'rgba(75, 192, 192)',  // Verde suave
              'rgba(54, 162, 235)',  // Azul suave
              'rgba(255, 159, 64)',  // Naranja suave
              'rgba(153, 102, 255)', // Morado suave
              'rgba(255, 99, 132)',  // Rojo suave
              'rgba(255, 206, 86)'   // Amarillo suave
            ], // Color diferente para cada opción en el gráfico de torta
          borderColor: tipo === 'feas' 
            ? [
              'rgba(255, 99, 132, 1)',    // Rojo fuerte
              'rgba(54, 162, 235, 1)',    // Azul fuerte
              'rgba(255, 206, 86, 1)',    // Amarillo fuerte
              'rgba(75, 192, 192, 1)',    // Verde fuerte
              'rgba(153, 102, 255, 1)',   // Morado fuerte
              'rgba(255, 159, 64, 1)'     // Naranja fuerte
            ]
            : [
              'rgba(75, 192, 192, 1)',    // Verde fuerte
              'rgba(54, 162, 235, 1)',    // Azul fuerte
              'rgba(255, 159, 64, 1)',    // Naranja fuerte
              'rgba(153, 102, 255, 1)',   // Morado fuerte
              'rgba(255, 99, 132, 1)',    // Rojo fuerte
              'rgba(255, 206, 86, 1)'     // Amarillo fuerte
            ], // Bordes contrastantes para cada opción en el gráfico de torta
          borderWidth: 1
        }]
      },
      options: {
        scales: tipo === 'feas' ? {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#FFFFFF' // Cambia el color de los números del eje Y
            }
          },
          x: {
            ticks: {
              color: '#FFFFFF' // Cambia el color de los números del eje X
            }
          }
        } : {},
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF',  // Cambia el color de los labels a blanco
              font: {
                size: 14,  // Ajusta el tamaño de la fuente
                family: 'Arial'  // Cambia la fuente si es necesario
              }
            }
          }
        }
      }
    });
    
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
