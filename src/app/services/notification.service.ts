import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from './message.service';
import Swal from 'sweetalert2';
import { API_URLS } from '../config/api-urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = API_URLS.api + '/Notifications';
    constructor(private toastr: ToastrService, private http: HttpClient, private messageService: MessageService) { }

    // getNotificationByUserId(userId: string): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/getNotificationByUserId/${userId}`);
    // }

    getNotification(userId?: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/getNotification`, {
            params: userId ? { userId } : {}
        });
    }

 
    markAsRead(notificationId: string): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/read/${notificationId}`,
            {}
        );
    }



    showWarning(code: string) {
        const messageContent = this.messageService.getMessageByCode(code);
        Swal.fire({
            icon: 'warning',
            title: '',
            text: messageContent,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.style.backgroundColor = "#FFA000";
                toast.style.color = "white";
                toast.style.fontWeight = "bold";
                toast.style.padding = "10px";
                toast.style.borderRadius = "8px";
            }
        });
    }

    // showSuccess(code: string) {
    //     const messageContent = this.messageService.getMessageByCode(code);
    //     this.toastr.success(messageContent, '', {
    //         positionClass: 'toast-top-right',
    //         timeOut: 3000,
    //         closeButton: true,
    //         progressBar: true
    //     });
    // }
    showSuccess(code: string) {
        const messageContent = this.messageService.getMessageByCode(code);
        Swal.fire({
            icon: 'success',
            title: '',
            text: messageContent,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.style.backgroundColor = "#4CAF50";
                toast.style.color = "white";
                toast.style.fontWeight = "bold";
                toast.style.padding = "10px";
                toast.style.borderRadius = "8px";
                // toast.style.zIndex ="10000"
            },
            // customClass: {
            //     popup: 'my-swal-toast' 
            // }
        });
    }

    showError(code: string) {
        const messageContent = this.messageService.getMessageByCode(code);
        Swal.fire({
            icon: 'error',
            title: '',
            text: messageContent,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.style.backgroundColor = "#D32F2F";
                toast.style.color = "white";
                toast.style.fontWeight = "bold";
                toast.style.padding = "10px";
                toast.style.borderRadius = "8px";
            }
        });
    }


    // showError(code: string) {
    //     const messageContent = this.messageService.getMessageByCode(code);
    //     this.toastr.error(messageContent, '', {
    //         positionClass: 'toast-top-right',
    //         timeOut: 3000,
    //         closeButton: true,
    //         progressBar: true
    //     });
    // }

    // showInfo(code: string) {
    //     const messageContent = this.messageService.getMessageByCode(code);
    //     this.toastr.info(messageContent, '', {
    //         positionClass: 'toast-top-right',
    //         timeOut: 3000,
    //         closeButton: true,
    //         progressBar: true
    //     });
    // }

    showInfo(code: string) {
        const messageContent = this.messageService.getMessageByCode(code);
        Swal.fire({
            icon: 'info',
            title: '',
            text: messageContent,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.style.backgroundColor = "#1976D2";
                toast.style.color = "white";
                toast.style.fontWeight = "bold";
                toast.style.padding = "10px";
                toast.style.borderRadius = "8px";
            }
        });
    }

}
