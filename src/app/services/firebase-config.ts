// firebase-config.ts
import { initializeApp } from 'firebase/app';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCorV2zdAa85oGoDuNPF01I4071sm-eGnk",
    authDomain: "relevamiento-visual-d3f58.firebaseapp.com",
    projectId: "relevamiento-visual-d3f58",
    storageBucket: "relevamiento-visual-d3f58.appspot.com",
    messagingSenderId: "913859179072",
    appId: "1:913859179072:web:67ea3ea003873872f725a5"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export default app;
