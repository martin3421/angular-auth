import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../../_services/auth.service';
import { TaskService } from '../../_services/task.service';
import { User } from '../../_interfaces/user.interface';
import { Task } from '../../_interfaces/task.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  userSub: Subscription;
  taskList$: Observable<Task[]>;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe((user: User) => {
      this.user = user;
      this.taskList$ = this.taskService.getTaskList();
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
