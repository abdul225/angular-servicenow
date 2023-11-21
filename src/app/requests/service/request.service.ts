import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient:HttpClient) { }

  createRequest(url, request)
  {
      return this.httpClient.post(url,request);
  }

  getRequestChoices(url:string)
  {
    return this.httpClient.get(url);
  }

}
