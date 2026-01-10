import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private apiUrl = API_URLS.api + '/Settings';
    constructor(private http: HttpClient) {
    }

    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    updateData(key: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${key}`, data);
    }

    uploadLogo(logo?: File, avatar?: File): Observable<any> {
        const formData = new FormData();

        if (logo) formData.append('logo', logo);
        if (avatar) formData.append('avatar', avatar);

        return this.http.post<any>(`${this.apiUrl}/Uploadlogo`, formData);
    }



}
