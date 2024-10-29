import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import app from '../services/firebase-config'
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { addDoc, collection, Firestore, query, getDocs, where, orderBy, limit, getDoc, setDoc, doc } from '@angular/fire/firestore';
import { getStorage } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor( private firestore: Firestore) { }
  private auth = getAuth(app); // Usa la app inicializada
  private storage = getStorage(app)

  //============== Autenticacion ==============

  async signIn(correo:string, clave:string){
    return await signInWithEmailAndPassword(getAuth(), correo, clave)
  }
  async register(correo:string, clave:string){
    return await createUserWithEmailAndPassword(getAuth(), correo, clave)
  }

  async signOut(){
    return await signOut(getAuth())
  }

  //============== Autenticacion ==============

  async traerImagenes(tipo:string){
    const col = collection(this.firestore, tipo);
    const q = query(col, orderBy('datetime', 'desc'));

    const querySnapshot = await getDocs(q);
    console.log("COnsulta obteniendo fotos")
    const mensajes: any[] = [];

    querySnapshot.forEach((doc) => {
      mensajes.push({ id: doc.id, ...doc.data() });
    });

    return mensajes
  }

  async uploadImage(file: File, tipo: string) {
    try {
      const imgRef = ref(this.storage, `${tipo}/${file.name}`);
      
      // Subir la imagen a Firebase Storage
      const response = await uploadBytes(imgRef, file);
      console.log('Imagen subida con éxito:', response);
  
      // Obtener la URL de descarga de la imagen subida
      const downloadURL = await getDownloadURL(imgRef);
      console.log('URL de la imagen:', downloadURL);
  
      // Obtener la fecha y hora actual
      const ahora = new Date();
      const dia = ahora.getDate().toString().padStart(2, '0');
      const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
      const hora = ahora.getHours().toString().padStart(2, '0');
      const minuto = ahora.getMinutes().toString().padStart(2, '0');
      const fechaHoraActual = `${dia}/${mes} ${hora}:${minuto}`;
  
      // Obtener el correo del usuario autenticado
      const auth = getAuth();
      const user = auth.currentUser;
      let username = user && user.email ? user.email.split('@')[0] : '';
  
      // Crear referencia a la colección y añadir el documento
      const col = collection(this.firestore, tipo);
  
      // Añadir los datos a Firestore
      await addDoc(col, {
        url: downloadURL,
        tipo: tipo,
        Fecha: fechaHoraActual,
        datetime: Date.now(),
        usuario: username
      });
  
      console.log("Metadata subida con éxito a Firestore");
    } catch (error) {
      console.error('Error al subir la imagen o la metadata:', error);
    }
  }
  
  
  async toggleLike(photoId: string, userId: string, tipo: string) {
    const photoRef = doc(this.firestore, tipo, photoId); // Cambia 'Feas' por 'Lindas' si corresponde
    const docSnap = await getDoc(photoRef);

    const photoData = docSnap.exists() ? docSnap.data() : null;

    if (!photoData) {
        console.log("La foto no existe.");
        return;
    }

    const likes = photoData['likes'] || {}; // Inicializa likes si no existe

    console.log(likes[userId])

    // Si el usuario ya ha dado like, lo quitamos
    if (likes[userId]) {
      console.log("El usuario ya ha dado like a esta foto. Se quitará el like.");
      likes[userId] = false; // Elimina el like del usuario del objeto likes
      await setDoc(photoRef, { likes }, { merge: true }); // Solo actualiza la parte de likes del documento
      console.log(`Like quitado por el usuario ${userId}`);
      console.log(likes[userId])
      return;
  }else{
    likes[userId] = true; // Establece el like o dislike
    await setDoc(photoRef, { likes }, { merge: true }); // Guarda los likes en el documento de la foto
    console.log(`Like dado por el usuario ${userId}`);
  }
  }


  async getLikesCount(photoId: string, tipo:string) {
    const photoRef = doc(this.firestore, tipo, photoId); // Cambia 'Feas' por 'Lindas' si corresponde
    const docSnap = await getDoc(photoRef);
    
    if (!docSnap.exists()) {
      console.log("La foto no existe.");
      return 0;
    }

    const likes = docSnap.data()['likes'] || {};
    return Object.values(likes).filter(v => v).length; // Contar solo los likes
  }


  async checkUserLike(photoId: string, userId: string,tipo:string): Promise<boolean> {
    //const photoRef = doc(this.firestore, 'feas', photoId); // Cambia 'Feas' por 'Lindas' si corresponde
    const photoRef = doc(this.firestore, tipo, photoId); // Cambia 'Feas' por 'Lindas' si corresponde

    // Obtener el documento de la foto
    const docSnap = await getDoc(photoRef);
    

    
    if (!docSnap.exists()) {
      console.log("La foto no existe.");
      return false;
    }
    
    // Obtener el campo de likes
    const likes = docSnap.data()!['likes'] || {};
    
    // Verifica si el usuario ha dado like
    return !!likes[userId];
  }
  


  getCurrentUserId(){
    const auth = getAuth();
    const user = auth.currentUser;
    return user?.email;
  }
}
