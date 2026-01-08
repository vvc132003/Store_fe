import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from './message.service';
import Swal from 'sweetalert2';
import { API_URLS } from '../config/api-urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private hubUrl = API_URLS.hub;
    private apiUrl = API_URLS.api + '/Notifications';
    private hubConnection1: signalR.HubConnection;

    constructor(private toastr: ToastrService, private http: HttpClient, private messageService: MessageService) {
        this.hubConnection1 = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .configureLogging(signalR.LogLevel.Error)
            .build();
    }

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

    /// mở kết nối đến websoket
    startConnection1(userId: string): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection1
                .start()
                .then(() => {
                    // console.log(userId);
                    this.hubConnection1.invoke('JoinGropsNotification', userId);
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    // console.error('Error connecting to SignalR hub:', error);
                    observer.error(error);
                });
        });
    }


    loadNotification(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnection1.on('LoadNotification', (data: any) => {
                observer.next(data);
                // console.log(data);
            });
        });
    }

    stopConnection1(): void {
        if (this.hubConnection1) {
            this.hubConnection1.off("LoadNotification");
            this.hubConnection1.stop();
        }
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


    showToastNotification(fullname: string, messageContent: string, duration: number = 3000) {
        const currentTime = new Date();
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Tạo HTML string
        const htmlContent = `
      <div class="content">
        <p class="username">${fullname}</p>
        <div>${messageContent}</div>
        <span class="time">${timeString}</span>
      </div>
    `;

        Swal.fire({
            icon: 'warning',
            html: htmlContent,  // dùng html thay vì text
            toast: true,
            position: 'top-end',
            timer: duration,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.style.backgroundColor = "#FFA000";
                toast.style.color = "white";
                toast.style.fontWeight = "bold";
                toast.style.padding = "10px";
                toast.style.borderRadius = "8px";

                // Nếu muốn, thêm style cho nội dung bên trong
                const contentEl = toast.querySelector('.content') as HTMLElement;
                if (contentEl) {
                    contentEl.style.display = 'flex';
                    contentEl.style.flexDirection = 'column';
                }
            }
        });
    }



}
