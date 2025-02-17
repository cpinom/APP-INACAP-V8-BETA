import { Injectable } from "@angular/core";
import { PrivateService } from "./private.service";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class InacapMailService extends PrivateService {

  public override storagePrefix: string = 'InacapMail-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/api`;
  }
  getMailSummary(folderId?: string) {
    return this.get(`${this.baseUrl}/v4/inacapmail/summary?folderId=${folderId}`);
  }
  getMailSubscription() {
    return this.post(`${this.baseUrl}/v5/inacapmail/suscripcion`, {});
  }
  deleteMailSubscription() {
    return this.delete(`${this.baseUrl}/v5/inacapmail/suscripcion`, {});
  }
  getUsers() {
    return this.get(`${this.baseUrl}/v3/inacapmail/users`);
  }
  getPrincipal() {
    return this.get(`${this.baseUrl}/v4/inacapmail/principal`);
  }
  getMessages(folderId: any) {
    return this.get(`${this.baseUrl}/v3/inacapmail/messages/${folderId}`);
  }
  getListMessages(params: any) {
    return this.post(`${this.baseUrl}/v3/inacapmail/messages`, params);
  }
  getListMessagesV5(folderId: string, pageSize: number, skip: number) {
    return this.get(`${this.baseUrl}/v5/inacapmail/messages?folderId=${folderId}&pageSize=${pageSize}&skip=${skip}`);
  }
  sarchMessagesV5(folderId: string, query: string) {
    query = encodeURIComponent(query);
    return this.get(`${this.baseUrl}/v5/inacapmail/search?folderId=${folderId}&query=${query}`);
  }
  getMessage(messageId: any) {
    return this.get(`${this.baseUrl}/v4/inacapmail/message/${messageId}`);
  }
  getMessageV5(messageId: string) {
    return this.get(`${this.baseUrl}/v5/inacapmail/message?messageId=${messageId}`);
  }
  // markRead(messageId) {
  //   return this.get(`${this.baseUrl}/v3/inacapmail/mark-read/${messageId}`);
  // }
  markReadV5(messageId: any) {
    return this.patch(`${this.baseUrl}/v5/inacapmail/mark-read?messageId=${messageId}`);
  }
  // deleteMessage(messageId) {
  //   return this.get(`${this.baseUrl}/v3/inacapmail/delete-message/${messageId}`);
  // }
  deleteMessageV5(messageId: any) {
    return this.delete(`${this.baseUrl}/v5/inacapmail/delete-message?messageId=${messageId}`);
  }
  createMessage(params: any) {
    return this.post(`${this.baseUrl}/v4/inacapmail/create-message`, params);
  }
  createReply(params: any) {
    return this.post(`${this.baseUrl}/v4/inacapmail/create-reply`, params);
  }
  addAttachmentWeb(data: FormData, params: any): Promise<any> {
    return Promise.resolve({})
    // return this.uploadWeb(`${this.baseUrl}/v4/inacapmail/add-attachment`, data, params);
  }
  addAttachment(filepath: string, filename: string, params: any): Promise<any> {
    return Promise.resolve({})
    // return this.upload(`${this.baseUrl}/v4/inacapmail/add-attachment`, filepath, filename, params);
  }
  removeAttachment(params: any) {
    return this.post(`${this.baseUrl}/v4/inacapmail/remove-attachment`, params);
  }
  updateMessageV5(params: any) {
    return this.patch(`${this.baseUrl}/v5/inacapmail/update-message`, params);
  }
  sendMessage(params: any) {
    return this.post(`${this.baseUrl}/v4/inacapmail/send-message`, params);
  }
  sendMessageV5(params: any) {
    return this.post(`${this.baseUrl}/v5/inacapmail/send-message`, params);
  }
  replyMessage(params: any) {
    return this.post(`${this.baseUrl}/v3/inacapmail/reply-message`, params);
  }
  replyAllMessageV5(params: any) {
    return this.post(`${this.baseUrl}/v5/inacapmail/reply-all-message`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-user` });
    await Preferences.remove({ key: `${this.storagePrefix}-folders` });
    await Preferences.remove({ key: `${this.storagePrefix}-inboxId` });
    await Preferences.remove({ key: `${this.storagePrefix}-subscription` });
  }

}