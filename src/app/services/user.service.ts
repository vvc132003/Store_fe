import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = API_URLS.api + '/Users';
    private hubUrl = API_URLS.hub;
    private hubConnection1: signalR.HubConnection;

    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
        this.hubConnection1 = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .configureLogging(signalR.LogLevel.Error)
            .build();
    }


    private _showWarning$ = new BehaviorSubject<boolean>(false);
    showWarning$ = this._showWarning$.asObservable();

    show() {
        this._showWarning$.next(true);
    }

    hide() {
        this._showWarning$.next(false);
    }

    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }
    getUserById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    postRegister(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, data);
    }

    postLogin(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, data);
    }


    // Phương thức PUT
    updateData(data: any): Observable<any> {
        return this.http.put<any>(this.apiUrl, data);
    }

    // Phương thức DELETE
    deleteData(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    ////AuthService 

    private logoutTimeout: any;





    setToken(token: string) {
        // Lưu cookie
        this.cookieService.set('access_token', token, {
            path: '/',
            secure: false,        // dev localhost, HTTPS: true
            sameSite: 'Lax',      // dev localhost, HTTPS: 'None'
            expires: 0.5           // 12 giờ
        });

        // Tự động logout
        this.autoLogout(token);
    }

    autoLogout(token: string) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Nếu backend có exp
            const expiresIn = payload.exp ? payload.exp * 1000 - Date.now() : 60000; // fallback 1 phút
            this.logoutTimeout = setTimeout(() => this.logout(), expiresIn);
        } catch (error) {
            console.error('Token decode error', error);
        }
    }

    logout() {
        clearTimeout(this.logoutTimeout);
        this.cookieService.delete('access_token', '/');
        this.router.navigate(['/dang-nhap']);
    }

    // getToken(): string {
    //     return this.cookieService.get('access_token');
    // }




    /// mở kết nối đến websoket
    startConnection1(nameid: string): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection1
                .start()
                .then(() => {
                    this.hubConnection1.invoke('JoinGropsLogin', nameid);
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    // console.error('Error connecting to SignalR hub:', error);
                    observer.error(error);
                });
        });
    }

    /// ngắt kết nối websoket 
    stopConnection1(): void {
        if (this.hubConnection1) {
            this.hubConnection1.off("RemoveToken");
            this.hubConnection1.stop();
        }
    }
    /// lắng nghe sự kiện từ server
    removeToken(): Observable<void> {
        return new Observable(observer => {
            this.hubConnection1.on('RemoveToken', () => {
                // console.log("ddd");
                observer.next();
            });
        });
    }



}
