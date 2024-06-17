import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldsControlService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAliasStruct(alias: string): Observable<any> {
    return this.httpClient.get(`/api/framework/v1/basicProtheusServices/fwformstructview?alias=${alias}`)
  }
}
