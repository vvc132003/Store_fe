import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable, EMPTY, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    private hubUrl = API_URLS.hub;
    private apiUrl = API_URLS.api + '/Conversation';
    private apiUrlChat = API_URLS.api + '/Chat';

    private hubConnection1: signalR.HubConnection;
    private hubConnection2: signalR.HubConnection;



    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.hubConnection1 = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .configureLogging(signalR.LogLevel.Error)
            .build();
        this.hubConnection2 = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .configureLogging(signalR.LogLevel.Error)
            .build();
    }


    /// mở kết nối đến websoket
    startConnection1(conversationId: string): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection1
                .start()
                .then(() => {
                    // console.log('Connection established with SignalR hub');
                    this.hubConnection1.invoke('JoinGropsChat', conversationId);
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    // console.error('Error connecting to SignalR hub:', error);
                    observer.error(error);
                });
        });
    }

    startConnection2(userId: string): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection2
                .start()
                .then(() => {
                    // console.log('Connection established with SignalR hub');
                    this.hubConnection2.invoke('JoinGropsChatConversation', userId);
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
            this.hubConnection1.off("LoadMessage");
            this.hubConnection1.stop();
        }
    }

    // stopConnection1(): void {
    //     if (this.hubConnection1) {
    //         this.hubConnection1.stop().catch();
    //     }
    // }

    stopConnection2(): void {
        if (this.hubConnection2) {
            this.hubConnection1.off("LoadConversation");
            this.hubConnection2.stop()
        }
    }


    /// lắng nghe sự kiện LoadMessage từ server
    onaddupChat(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnection1.on('LoadMessage', (data: any) => {
                observer.next(data);
                // console.log(data);
            });
        });
    }

    onaddupChatAL(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnection1.on('LoadMessagesAL', (data: any) => {
                observer.next(data);
                // console.log(data);
            });
        });
    }

    loadConversation(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnection2.on('LoadConversation', (data: any) => {
                observer.next(data);
                // console.log(data);
            });
        });
    }

    logTyping(): Observable<any> {
        return new Observable((observer) => {
            this.hubConnection2.on('ReceiveTypingStatus', (data: any) => {
                observer.next(data);
                // console.log(data);
            });
        });
    }


    postlogTyping(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/log-typing`, data);
    }


    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Phương thức POST
    private parseJwt(token: string): any {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        const utf8 = decodeURIComponent(
            decoded
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(utf8);
    }


    postData_Chat(): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        const role = decoded.role;

        const data = {
            userId2: decoded.nameid,
            role: role
        };

        return this.http.post<any>(`${this.apiUrl}/createConverstation`, data);
    }


    postData_Chat_AI(): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        const role = decoded.role;

        const data = {
            userId2: decoded.nameid,
            role: role
        };


        return this.http.post<any>(`${this.apiUrl}/createConverstationAI`, data);
    }

    postChat(data: any): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        const role = decoded.role;

        // const data = {
        //     userId2: decoded.nameid,
        //     role: role
        // };


        return this.http.post<any>(`${this.apiUrl}/createChat`, data);
    }

    postChatAI(data: any): Observable<any> {
        // const token = this.cookieService.get('access_token');
        // const decoded: any = jwt_decode(token);
        // const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        // const data = {
        //     userId2: decoded.id,
        //     role: role
        // };

        return this.http.post<any>(`${this.apiUrlChat}/createChatAI`, data);
    }

    postChatReply(data: any): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        const role = decoded.role;

        // const data = {
        //     userId2: decoded.nameid,
        //     role: role
        // };


        return this.http.post<any>(`${this.apiUrl}/replyMessage`, data);
    }



    getConversations(): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        const role = decoded.role;

        // const data = {
        //     userId2: decoded.nameid,
        //     role: role
        // };

        return this.http.get<any>(`${this.apiUrl}/getConversations/${decoded.nameid}`);
    }

    // getMessages(conversationId: string): Observable<any> {
    //     const token = this.cookieService.get('access_token');
    //     const decoded: any = jwt_decode(token);
    //     return this.http.get<any>(`${this.apiUrl}/getMessages/${conversationId}/${decoded.id}`);
    // }
    getMessages(conversationId: string, page: number, pageSize: number): Observable<any> {
        const token = this.cookieService.get('access_token');
        const decoded = this.parseJwt(token);
        return this.http.get<any>(`${this.apiUrl}/getMessages/${conversationId}/${decoded.nameid}?page=${page}&pageSize=${pageSize}`);
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
