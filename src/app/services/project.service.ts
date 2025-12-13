import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = API_URLS.api + '/Projects';
    constructor(private http: HttpClient) {
    }
    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getProject_list(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/project-list`);
    }

    getProjectBySlug(slug: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/project-by-slug/${slug}`);
    }

    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    uploadZip(file_zip: File, file_img: File, fileName_zip: string, fileName_thumnai: string, imageFiles: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('zipFile', file_zip);
        formData.append('thumbnailUrl', file_img);
        formData.append('fileName_zip', fileName_zip);
        formData.append('fileName_thumnai', fileName_thumnai);
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        return this.http.post<any>(`${this.apiUrl}/UploadZip`, formData);
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
