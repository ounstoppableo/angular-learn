import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  constructor(public messagesService: MessagesService) { }
}
