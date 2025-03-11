import { inject, Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  private alert: any;
  private interval: any;
  private animationEnd: number = 0;
  private duration: number = 5 * 1000; // Duración predeterminada (10 segundos)
  private defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  private dialog = inject(DialogService);

  constructor() { }

  async showConfettiAlert(title: string, message: string, duration: number = 10) {
    this.duration = duration * 1000;
    this.startConfetti();

    this.alert = await this.dialog.showAlert({
      header: title,
      message: `<div class="image"><img src = "./assets/images/birthday.svg" width="35px" height="35px"></div>${message}`,
      cssClass: 'success-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => this.stopConfetti()
        }
      ]
    });

    // Cierra automáticamente después de 20 segundos
    setTimeout(() => {
      this.closeAlert();
    }, 15000); // 15 segundos
  }
  /**
   * Inicia la animación del confetti.
   */
  private startConfetti() {
    this.stopConfetti(); // Asegura que no haya una animación previa corriendo
    this.animationEnd = Date.now() + this.duration;

    this.interval = setInterval(() => {
      const timeLeft = this.animationEnd - Date.now();

      if (timeLeft <= 0) {
        this.stopConfetti();
        return;
      }

      const particleCount = 50 * (timeLeft / this.duration);
      // Lado izquierdo
      confetti(Object.assign({}, this.defaults, {
        particleCount,
        origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      // Lado derecho
      confetti(Object.assign({}, this.defaults, {
        particleCount,
        origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  }
  /**
   * Detiene la animación del confetti y limpia el canvas.
   */
  stopConfetti() {
    if (this.interval) {
      clearInterval(this.interval);
      confetti.reset(); // Detiene y limpia el canvas de confetti
    }
  }
  /**
     * Cierra el alert si está abierto.
     */
  private async closeAlert() {
    if (this.alert) {
      await this.alert.dismiss();
      this.alert = null;
    }
  }
  /**
   * Genera un número aleatorio dentro de un rango.
   */
  private randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

}
