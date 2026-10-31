import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/model/user';
import { FilterPipe } from 'src/app/pipe/filter.pipe';
import { SorterPipe } from 'src/app/pipe/sorter.pipe';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';

export interface INgxTableColumn {
  title: string;
  key: string;
}

@Component({
  standalone: true,
  selector: 'ngx-data-table',
  templateUrl: './ngx-data-table.component.html',
  styleUrls: ['./ngx-data-table.component.scss'],
  imports: [
    CommonModule, // ngIf, ngFor
    FormsModule, // ngModel
    RouterModule, // routerLink
    TranslatePipe, // | translate
    FilterPipe,
    SorterPipe,
  ],
})
export class NgxDataTableComponent<T extends { [key: string]: any }>
  implements OnInit
{
  @Input() list: T[] = [];
  @Input() columns: INgxTableColumn[] = [];
  @Input() entity: string = '';

  @Output() selectOne = new EventEmitter<T>();
  @Output() deleteOne = new EventEmitter<T>();

  keys: { [key: string]: string } = {};
  phrase: string = '';
  filterKey: string = '';
  changeText = true;
  pageSize = 25;

  startSlice = 0;
  endSlice = 25;
  page = 1;
  isLoggedIn: boolean = false;

  get pageList(): number[] {
    const pageCount = Math.ceil(this.list.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  columnKey: string = '';
  sortDir = -1;

  user$: BehaviorSubject<User | null>;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private notifyService: NotificationService,
    public auth: AuthService,
    public router: Router,
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit(): void {
    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  onSelect(entity: T): void {
    this.selectOne.emit(entity);
  }

  onDelete(entity: T): void {
    if (this.auth.user$.getValue()) {
      const confirmed = confirm(
        'Do you really want to delete this record? This process cannot be undone.',
      );
      if (!confirmed) {
        return;
      }
      this.deleteOne.emit(entity);
    } else {
      this.router.navigate(['forbidden']);
    }
  }

  jumptoPage(pageNum: number): void {
    this.page = pageNum;
    this.startSlice = this.pageSize * (pageNum - 1);
    this.endSlice = this.startSlice + this.pageSize;
  }

  showInfoAboutSorting(): void {
    this.notifyService.showInfo(
      'Click the icons next to the column titles to sort the entire table by this column.',
      'Fizzingbrain v.1.0.0',
    );
  }
}
