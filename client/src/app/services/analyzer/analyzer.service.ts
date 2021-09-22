import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AnalyzerResponse } from './analyzer';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerService {
  constructor(private http: HttpClient) {}

  analyze(userData): Observable<AnalyzerResponse> {
    return this.http.post<AnalyzerResponse>('/api/analyze', userData);
  }
}
