import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../Service/chat.service';
import { AuthenticationService } from '../Service/authentication.service';
import { MessageModel } from '../Models/MessageModel.model';
import $ from 'jquery';

@Component({
  selector: 'app-all-chats',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-chats.component.html',
  styleUrl: './all-chats.component.css'
})
export class AllChatsComponent implements OnDestroy {
  currentUserEmail: string = '';
  partnerEmail: string = '';
  partnerName: string = '';
  userRole: 'doctor' | 'patient' = 'patient'; 
  messageText: string = '';
  messages: { sender: string,senderEmail: string, receiverEmail: string, text: string, timestamp: Date }[] = [];
  newMessage?: MessageModel;

  private messageSubscription!: Subscription;

  constructor(private route:ActivatedRoute, private chatService:ChatService, private authSvc:AuthenticationService, private routes: Router) {
    this.route.queryParams.subscribe(params => {
      this.partnerName = params['partnerName'];
      this.partnerEmail = params['partnerEmail'];
      this.userRole = params['userRole'];
      this.currentUserEmail = this.authSvc.UserEmail;

      this.chatService.getUserChats(this.currentUserEmail, this.partnerEmail).subscribe({
        next: (res:any)=>{
          this.messages = res.map((msg:any) => ({
            sender: msg.senderEmail === this.currentUserEmail ? this.userRole : 'other',
            text: msg.text,
            timestamp: new Date(msg.timeStamp)
          }));
          setTimeout(() => this.scrollToBottom(), 100);
          // console.log("response",res);
        },
        error: (err:any)=>{
          console.log(err);
        }
      });
      this.chatService.startConnection(this.currentUserEmail);

      this.messageSubscription = this.chatService.onMessageReceived().subscribe((msg: any) => {
        if (
          (msg.fromEmail === this.currentUserEmail && msg.toEmail === this.partnerEmail) ||
          (msg.fromEmail === this.partnerEmail && msg.toEmail === this.currentUserEmail)
        ) {
          this.messages.push({
            sender: msg.fromEmail === this.currentUserEmail ? this.userRole : 'other',
            senderEmail: msg.fromEmail,
            receiverEmail: msg.toEmail,
            text: msg.message,
            timestamp: new Date(msg.created)
          });
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });
    });
  }

  onback(){
    if(this.userRole == 'doctor'){
      this.routes.navigateByUrl('messages');
    }else{
      this.routes.navigateByUrl('patient-messages');
    }
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.currentUserEmail, this.partnerEmail, this.messageText);
      this.newMessage = {
        Sender: this.userRole,
        SenderEmail: this.currentUserEmail,
        ReceiverEmail: this.partnerEmail,
        Text: this.messageText,
        TimeStamp: new Date(new Date().getTime()+19800000)
      }

      this.chatService.saveMessages(this.newMessage).subscribe({
        next: (res)=>{
          console.log("Message Saved");
        },
        error: (err)=>{
          console.log("Message not saved", err);
        }
      });
      // console.log("messages",this.messages);
    }
    this.messageText = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }


  scrollToBottom() {
    $('#chat-scroll').stop().animate({
      scrollTop: $('#chat-scroll')[0].scrollHeight
    }, 300);
  }

  ngOnDestroy(): void {
    this.chatService.stopConnection();
    this.messageSubscription?.unsubscribe();
  }
}
