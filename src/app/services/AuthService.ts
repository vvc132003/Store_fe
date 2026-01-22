import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URLS } from "../config/api-urls";
import { BehaviorSubject, Observable, tap } from "rxjs";
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'buyer' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private apiUrl = API_URLS.api + '/Users';
    private userSubject = new BehaviorSubject<AuthUser | null>(null);

    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    logout() {
        return this.http.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        });
    }

    session(): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.apiUrl}/session`,
            { withCredentials: true }
        );
    }



    me(): Observable<AuthUser> {
        return this.http.get<AuthUser>(
            `${this.apiUrl}/me`,
            { withCredentials: true }
        ).pipe(
            tap(user => this.userSubject.next(user))
        );
    }

    clear() {
        this.userSubject.next(null);
    }
}
