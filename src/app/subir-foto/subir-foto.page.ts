import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, ActionSheetController, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-subir-foto',
  templateUrl: './subir-foto.page.html',
  styleUrls: ['./subir-foto.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SubirFotoPage implements OnInit {
  @ViewChild('inputFile', { static: false }) inputFile!: ElementRef;
  parametro: any;
  selectedImage: any; // Aquí se guardará la URL de la imagen seleccionada
  selectedFile: any; // Para almacenar el archivo seleccionado
  modal:boolean = false;
  isLoading:boolean = false;
  fotoSubida:boolean = false;

  constructor(
    private route: ActivatedRoute, 
    public navCtrl: NavController, 
    public fbSvc: FirebaseService,
    private actionSheetController: ActionSheetController // Añadido ActionSheetController
  ) {
    this.route.params.subscribe(params => {
      this.parametro = params['parametro']; // Acceder al parámetro
    });
  }

  ngOnInit() {}

  irA(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
  }

  // Método para subir la imagen a Firestore
  async uploadImage() {
    this.isLoading = true;
    if (this.selectedFile) {
      console.log('Subiendo archivo:', this.selectedFile);
      await this.fbSvc.uploadImage(this.selectedFile, this.parametro);
      this.selectedImage = undefined; // Resetear la imagen seleccionada
      this.selectedFile = undefined; // Resetear el archivo seleccionado
    } else {
      console.log("Error: No hay archivo seleccionado");
    }
    this.isLoading = false;
    this.fotoSubida = true;
  }

  // Método para manejar la selección de imagen desde el input
  subirImagen($event: any) {
    const file = $event.target.files[0];
    if (file) {
      this.selectedFile = file; // Guardar el archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string; // Guardar la imagen seleccionada como URL
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    } else {
      console.log("Error: No se pudo seleccionar un archivo");
    }
  }

  // Método para manejar el clic en la tarjeta y abrir la cámara o galería
  async onCardClick() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar imagen',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          },
        },
        {
          text: 'Galería',
          handler: () => {
            this.takePicture(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Método para tomar una foto con la cámara o seleccionar de la galería
  async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

       // Generar un nombre único para la imagen
        const timestamp = new Date().getTime(); // Obtener el timestamp actual
        const imageName = `image_${timestamp}.png`; // Crear un nombre de archivo único


      this.selectedImage = image.dataUrl; // Guardar la imagen seleccionada
      this.selectedFile = this.dataURLtoFile(image.dataUrl, imageName); // Convertir la URL de datos a un archivo
    } catch (error) {
      console.error("Error tomando la foto:", error);
    }
  }

  // Método para convertir una URL de datos a un archivo
  private dataURLtoFile(dataUrl: any, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  cerrarSesion(){
    this.modal = true;
    console.log("hola")
  }

  closeModal(){
    this.modal = false;
    this.fotoSubida = false;
  }

  desloguearse(){
    this.navCtrl.navigateRoot("/login");
    this.modal = false;
  }
  
}
