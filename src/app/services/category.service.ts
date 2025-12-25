import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = API_URLS.api + '/Categorys';
    constructor(private http: HttpClient) {
    }
    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }

    exportFavoritesExcel(): Observable<any> {
        return this.http.get(`${this.apiUrl}/export-favorites-excel`, { responseType: 'blob' });
    }

    exportFavoritesPdf(): Observable<any> {
        return this.http.get(`${this.apiUrl}/export-favorites-pdf`, { responseType: 'blob' });
    }

    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
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
