import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableModule } from 'src/app/common/data-table/data-table.module';
import { User } from 'src/app/model/user';
import { ConfigService } from 'src/app/service/config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [CommonModule, DataTableModule],
})
export class UsersComponent {
  private config = inject(ConfigService);
  private userService = inject(UserService);
  private router = inject(Router);
  private notifyService = inject(NotificationService);

  columns = this.config.usersColumn;
  list$ = this.userService.getAll();
  entity: string = 'User';

  showSuccessDelete() {
    this.notifyService.showSuccess(
      `${this.entity} delete successfully!`,
      'Fizzingbrain v.1.0.0',
    );
  }

  showError(err: String) {
    this.notifyService.showError(
      'Something went wrong. Details:' + err,
      'Fizzingbrain v.1.0.0',
    );
  }

  onSelectOne(user: User): void {
    this.router.navigate(['/', 'user', 'edit', user.id]);
  }

  onDeleteOne(user: User) {
    this.userService.delete(user).subscribe({
      next: () => (this.list$ = this.userService.getAll()),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessDelete(),
    });
  }
}
