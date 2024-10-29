import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ]
})
export class LoginPage {

  firebaseSvc = inject(FirebaseService);

  public correo: string; // El correo que sube el usuario
  public clave: string; // La clave que sube el usuario
  public logueo: string; // Mensaje para el usuario sobre el estado del logueo
  public mostrar: boolean; // Controla la visibilidad del mensaje
  public botonLoguear: boolean; // Controla la visibilidad del botón de login
  public isLoading: boolean; // Controla la visibilidad del overlay de carga
  public modal:boolean = false;

  constructor(public navCtrl: NavController) {
    this.correo = "";
    this.clave = "";
    this.logueo = "";
    this.mostrar = false;
    this.botonLoguear = true;
    this.isLoading = false; // Inicialmente no está cargando
  }

  async IniciarSesion(correo: string, clave: string) {
    //this.navCtrl.navigateRoot("/home");
    // Iniciar sesión y navegar a la página principal si es exitoso
    
    this.isLoading = true; // Muestra el overlay de carga

    if (await this.FirebaseVerification(correo, clave)) {
      this.navCtrl.navigateRoot("/home");
    } else {
      this.mostrar = true;
      this.correo = correo;
      this.clave = clave;
      this.botonLoguear = false;
      
    }
    this.isLoading = false; // Oculta el overlay de carga*/
  }

  async FirebaseVerification(correo: string, clave: string) {
    console.log("Iniciando verificación de Firebase");

    let retorno = false;
    

    // Validar credenciales antes de intentar iniciar sesión
    if (this.validateCredentials(correo, clave)) {
      try {
        await this.firebaseSvc.signIn(correo, clave);
        console.log("Inicio de sesión exitoso");
        retorno = true;
      } catch (error) {
        console.log(error)
        this.logueo = "Usuario y/o contraseña incorrectos"; // Muestra el error ocurrido
        this.modal = true;
      }
    } else {
      this.logueo = "Credenciales inválidas";
      console.log(this.logueo);
    }

    return retorno;
  }

  private validateCredentials(correo: string, clave: string): boolean {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const claveValida = clave.length >= 6;
    return correoValido && claveValida;
  }

  public accesoRapido(correo: string, clave: string) {
    this.correo = correo;
    this.clave = clave;
  }

  closeModal() {
    this.modal = false;
  }
}
