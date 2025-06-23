import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<any>();
  // baseUrl: any = `https://localhost:7084/`;
  baseUrl: any = `https://smartHealth.bsite.net`;

  constructor(private authSvc: AuthenticationService, private http: HttpClient) {}

  public startConnection(userEmail: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('Connection already active');
      return;
    }
    const token = this.authSvc.getToken(); 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://smartHealth.bsite.net/chat`, {
        accessTokenFactory: () => token ?? '',
        withCredentials: false
      })
      .withAutomaticReconnect()
      .build();
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl(`https://localhost:7084/chat`, {
    //     accessTokenFactory: () => token ?? '',
    //     withCredentials: false
    //   })
    //   .withAutomaticReconnect()
    //   .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection established.'))
      .catch(err => console.log('Error establishing connection: ', err));

    this.hubConnection.on("ReceiveMessage", (fromEmail, toEmail, message, created, status) => {
      this.messageSubject.next({ fromEmail, toEmail, message, created, status });
    });
  }

  public sendMessage(fromEmail: string, toEmail: string, message: string) {
    const created = new Date();
    const status = 'sent';

    this.hubConnection.invoke("SendMessage", fromEmail, toEmail, message, created, status)
      .catch(err => console.error(err));
  }


  public onMessageReceived() {
    return this.messageSubject.asObservable();
  }

  public stopConnection() {
    this.hubConnection?.stop();
  }

  saveMessages(data:any){
    return this.http.post(`${this.baseUrl}Chat/save-messages`, data);
  }

  getUserChats(currentUserEmail: string, partnerEmail: string){
    return this.http.get(`${this.baseUrl}Chat/getUserChats/${currentUserEmail}/${partnerEmail}`);
  }

}
