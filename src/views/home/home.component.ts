import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import {Router} from '@angular/router';
import {Task} from '../../models/task';
import {TaskService} from '../../services';
import {User} from '../../app/models/user';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  tasks: Task[];
  users: User[];
  errorMessage: string;

  pageNumber: number;
  project: string;

  constructor(private taskService: TaskService,
              private userService: UserService,
              public router: Router) {
    this.pageNumber = 1;
  }

  ngOnInit() {
    this.getTasks('');
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe(
      users => this.setUsers(users),
      error => {
        // Remove once the user endpoint is live
        const users: User[] = [];
        for (let i = 0; i < 5; i++) {
          const username = `User ${i}`;
          users[i] = new User(i, username, username + '@openmastery.org');
        }
        this.users = users;
      });
  }

  getTasks(project) {
    this.project = project;
    this.taskService.getTasks(project)
      .subscribe(
        tasks => this.setTasks(tasks),
        error => this.errorMessage = <any>error);
  }

  goToUserIfms(user) {
    // TODO: Toast not yet implemented
    // this.router.navigate([`/task/user???/${user.id}`]);
  }

  goToTask(task) {
    if (task.hasOwnProperty('id')) {
      this.router.navigate([`/task/${task.id}`]);
    }
  }

  private setUsers(response) {
    this.users = response;
  }

  private setTasks(response) {
    this.tasks = response;
  }

  private sortTasks(list, property) {
    list.sort(function (a, b) {
      let nameA = a[property];
      let nameB = b[property];
      nameA = (typeof nameA === 'string') ? nameA.toUpperCase() : nameA;
      nameB = (typeof nameB === 'string') ? nameB.toUpperCase() : nameB;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return list;
  }
}
