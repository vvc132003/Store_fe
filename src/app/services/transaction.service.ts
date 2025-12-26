import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = API_URLS.api + '/Transactions';
    constructor(private http: HttpClient) {
    }



    // Phương thức GET

    getWithdrawTransactions(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/withdraw-transactions`);
    }

    getHistoryTransactions(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/history-transactions/${userId}`);
    }

    // Phương thức PUT
    updateData(data: any): Observable<any> {
        return this.http.put<any>(this.apiUrl, data);
    }

    // Phương thức DELETE
    deleteData(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

}
