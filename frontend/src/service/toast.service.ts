import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toasts: string[] = [];

    add(toast: string) {
        if(this.toasts.length >= 5)
            this.toasts.shift();
        this.toasts.push(toast);
        setTimeout(() => {
            this.toasts.shift();   
        }, 5000);
    }
}