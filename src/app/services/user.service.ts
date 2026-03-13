import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = API_URLS.api + '/Users';
    private hubUrl = API_URLS.hub;
    private hubConnection?: signalR.HubConnection;
    private hubConnectionMoney?: signalR.HubConnection;

    constructor(private http: HttpClient, private cookieService: CookieService, private auth: AuthService, private router: Router) {
        // this.hubConnection1 = new signalR.HubConnectionBuilder()
        //     .withUrl(this.hubUrl, {
        //         withCredentials: true
        //     }).withAutomaticReconnect()
        //     .configureLogging(signalR.LogLevel.Error)
        //     .build();
    }

    private createConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(API_URLS.hub, { withCredentials: true })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Error)
            .build();
        this.hubConnectionMoney = new signalR.HubConnectionBuilder()
            .withUrl(API_URLS.hub, { withCredentials: true })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Error)
            .build();
    }


    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }
    // getUserById(): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}`,
    //         { withCredentials: true });
    // }

    getUserById(): Observable<any | null> {
        return this.http.get<any>(`${this.apiUrl}`, {
            withCredentials: true
        }).pipe(
            catchError(err => {
                if (err.status === 401) return of(null);
                throw err;
            })
        );
    }


    toggleStatusUser(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/toggleStatusUser/${id}`);
    }

    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    postRegister(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, data);
    }

    passwordreset(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/password_reset`, data);
    }

    forgotPassword(data: any) {
        return this.http.post(`${this.apiUrl}/forgot-password`, data);
    }

    resetPassword(data: any) {
        return this.http.post(`${this.apiUrl}/reset-password`, data);
    }

    updateBalanceMoney(userId: string, amount: number) {
        const body = {
            userId: userId,
            amount: amount
        };
        return this.http.post(`${this.apiUrl}/update-balance`, body);
    }


    // postLogin(data: any): Observable<any> {
    //     return this.http.post<any>(`${this.apiUrl}/login`, data);
    // }

    postLogin(data: any) {
        return this.http.post(
            `${this.apiUrl}/login`,
            data,
            { withCredentials: true }
        );
    }


    uploadImg(file_img: File, fileName_thumnai: string): Observable<any> {
        const formData = new FormData();
        formData.append('thumbnailUrl', file_img);
        formData.append('fileName_thumnai', fileName_thumnai);

        return this.http.post<any>(`${this.apiUrl}/UploadImg`, formData);
    }

    // Phương thức PUT
    updateData(data: any): Observable<any> {
        return this.http.put<any>(this.apiUrl, data);
    }

    updateUser(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
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



    startConnection(userId: string): Observable<void> {
        return new Observable(observer => {

            // 🔥 tạo mới nếu chưa có hoặc đã stop
            if (!this.hubConnection ||
                this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
                this.createConnection();
            }

            // 🚫 nếu đang connected / connecting thì bỏ qua
            if (this.hubConnection?.state !== signalR.HubConnectionState.Disconnected) {
                observer.next();
                observer.complete();
                return;
            }

            this.hubConnection.start()
                .then(() => this.hubConnection!.invoke('JoinGropsLogin', userId))
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    startConnectionMoney(userId: string): Observable<void> {
        return new Observable(observer => {

            // 🔥 tạo mới nếu chưa có hoặc đã stop
            if (!this.hubConnectionMoney ||
                this.hubConnectionMoney.state === signalR.HubConnectionState.Disconnected) {
                this.createConnection();
            }

            // 🚫 nếu đang connected / connecting thì bỏ qua
            if (this.hubConnectionMoney?.state !== signalR.HubConnectionState.Disconnected) {
                observer.next();
                observer.complete();
                return;
            }

            this.hubConnectionMoney.start()
                .then(() => this.hubConnectionMoney!.invoke('JoinGroupsMoneyUpdate', userId))
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    listenForceLogout(onLogout: () => void) {
        this.hubConnection?.off('ForceLogout');
        this.hubConnection?.on('ForceLogout', () => {
            onLogout();
        });
    }


    /// ngắt kết nối websoket 
    stopConnection(): void {
        if (this.hubConnection) {
            this.hubConnection.off('ForceLogout');

            if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
                this.hubConnection.stop();
            }

            this.hubConnection = undefined; // 🔥 CỰC KỲ QUAN TRỌNG
        }
    }


    loadMoney(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnectionMoney?.on('BalanceUpdated', (data: any) => {
                observer.next(data);
            });
        });
    }

    stopConnectionMoney(): void {
        if (this.hubConnectionMoney) {
            this.hubConnectionMoney.off('BalanceUpdated');

            if (this.hubConnectionMoney.state !== signalR.HubConnectionState.Disconnected) {
                this.hubConnectionMoney.stop();
            }

            this.hubConnectionMoney = undefined; // 🔥 CỰC KỲ QUAN TRỌNG
        }
    }

    private balanceSource = new Subject<number>();
    balance$ = this.balanceSource.asObservable();

    updateBalance(price: number) {
        this.balanceSource.next(price);
    }

}
