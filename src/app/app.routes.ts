import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    //loadComponent: () => import('./visualizador/visualizador.page').then( m => m.VisualizadorPage)
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    //loadComponent: () => import('./visualizador/visualizador.page').then( m => m.VisualizadorPage)
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    //loadComponent: () => import('./visualizador/visualizador.page').then( m => m.VisualizadorPage)
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'visualizador/:parametro',
    loadComponent: () => import('./visualizador/visualizador.page').then( m => m.VisualizadorPage)
  },
  {
    path: 'resultados/:parametro',
    loadComponent: () => import('./resultados/resultados.page').then( m => m.ResultadosPage)
  },
  {
    path: 'subir-foto/:parametro',
    loadComponent: () => import('./subir-foto/subir-foto.page').then( m => m.SubirFotoPage)
  },
];
