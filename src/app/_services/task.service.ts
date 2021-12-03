import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Task } from '../_interfaces/task.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTaskList(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/todo_api`);
  }
}
