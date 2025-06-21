import { Injectable } from "@angular/core";
import { ToastController, ToastOptions } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    //Utilizziamo i toasts di Ionic e non di Capacitor in quanto i primi possono essere modificati con lo stile che vogliamo e gli ultimi preservano lo stile nativo del sistema operativo di riferimento. In più, per utilizzare quelli Capacitor dovremmo aggiungere complessità computazionale sfruttando @ionic/pwa-elements, per essere in grado di mostrare i toasts sul web.

    constructor(private toastController: ToastController) { }

    async presentToast(options: ToastOptions) {
        const toast = await this.toastController.create({ ...options, cssClass: 'custom-toast' });
        await toast.present();
    }

    presentSuccessToast(message: string) {
        const options: ToastOptions = {
            message: message,
            duration: 3000, // Durata del toast in millisecondi
            position: 'top',
            color: 'success', // Colore predefinito di Ionic per il successo
            icon: 'checkmark-circle-outline'
        };
        this.presentToast(options);
    }

    presentErrorToast(message: string) {
        const options: ToastOptions = {
            message: message,
            duration: 3000,
            position: 'top',
            color: 'danger', // Colore predefinito di Ionic per l'errore
            icon: 'alert-circle-outline'
        };
        this.presentToast(options);
    }
}