import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpServicesProvider {

  private url:string = 'http://zaitetecnologia1.tempsite.ws/myPetAPI';

  constructor(public http: Http) {
    console.log('Hello HttpServicesProvider Provider');
  }

  get(endpoint){
    return this.http.get(`${this.url}/${endpoint}`)
    .map(res => {
      return res.json()
    });

  }

}
