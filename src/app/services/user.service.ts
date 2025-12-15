import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = API_URLS.api + '/Users';
    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    }
    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
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

}
