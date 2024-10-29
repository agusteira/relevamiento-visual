import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{
  constructor( private platform: Platform, private router: Router) {
    this.initializeApp();
  }
  async initializeApp(){

    setTimeout(() => {
      this.router.navigateByUrl('/login'); // Redirige a la página principal después del splash
    }, 3000); // Muestra el splash por 3 segundos
  }

  ngOnInit(): void{
    this.platform.ready().then(()=>{
      SplashScreen.hide();
    })
  }
}