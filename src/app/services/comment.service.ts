import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = API_URLS.api + '/Comments';
    constructor(private http: HttpClient) {
    }
    // Phương thức GET
    // getData(projectId?: string): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.apiUrl}/${projectId}`);
    // }
    getData(projectId?: string): Observable<any> {
        const url = projectId
            ? `${this.apiUrl}/commentbypjId/${projectId}`
            : `${this.apiUrl}/commentbypjId`; 

        return this.http.get<any>(url);
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
