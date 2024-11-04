import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
    Firestore,
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    collectionData,
    doc,
    deleteDoc,
    where,
    query,
} from '@angular/fire/firestore';
import { Cliente, Mesa, UserDetails } from '../interfaces/app.interface';
import { Observable } from 'rxjs';
import { CollectionsNames } from '../utils/firebase-names.enum';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    constructor(private firestore: Firestore) {}

    agregarCliente(cliente: Cliente): void | null {
        const clientesCol = collection(
            this.firestore,
            CollectionsNames.USUARIOS
        );
        doc(clientesCol);
    }

    actualizarCliente(cliente: Cliente): void {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, cliente.uid);

        updateDoc(documento, { ...cliente });
    }

    //Devolvemos un observable para que "escuche" los cambios
    //Observable -> tipo de dato que puede variar
    traerClientesPendientes(): Observable<Cliente[]> {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        const clientes = query(col, where('aprobado', '==', 'pendiente'));

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(clientes, { idField: 'uid' }) as Observable<
            Cliente[]
        >;
    }
    //Luego para utilizarlo nos suscribimos al metodo asi mientras esta en ejecucion y se agrega un cliente
    //este se va a actualizar

    async getCliente(correo: string, clave: string) {
        const clienteQuery = query(
            collection(this.firestore, CollectionsNames.USUARIOS),
            where('correo', '==', correo),
            where('clave', '==', clave)
        );
        const clienteDocs = await getDocs(clienteQuery);
        return clienteDocs;
    }

    traerClientesEspera(): Observable<Cliente[]> {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        const clientes = query(col, where('situacion', '==', 'enEspera'));

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(clientes, { idField: 'uid' }) as Observable<
            Cliente[]
        >;
    }

    traerMesas(): Observable<Mesa[]> {
        const col = collection(this.firestore, CollectionsNames.MESAS);

        const mesas = query(col);

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(mesas, { idField: 'uid' }) as Observable<
            Mesa[]
        >;
    }

    // Funcion para agregar cualquier falopa harcodeada en firestore mas facil que hacerlo a mano
    public agregarFalopaaaaaa(data: any, path: string) {
        const coleccion = collection(this.firestore, path);

        addDoc(coleccion, data);
    }

    updateUserWithTokenForPushNotifications(
        usuario: UserDetails,
        token: string
    ): void {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, usuario.uid);

        // seteo el token para identificar al usuario para mandar push notifications
        updateDoc(documento, { ...usuario, token });
    }
}
