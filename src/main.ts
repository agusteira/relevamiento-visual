import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp({
      "projectId": "relevamiento-visual-d3f58",
      "appId": "1:913859179072:web:67ea3ea003873872f725a5",
      "storageBucket": "relevamiento-visual-d3f58.appspot.com",
      "apiKey": "AIzaSyCorV2zdAa85oGoDuNPF01I4071sm-eGnk",
      "authDomain": "relevamiento-visual-d3f58.firebaseapp.com",
      "messagingSenderId": "913859179072",
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
});
