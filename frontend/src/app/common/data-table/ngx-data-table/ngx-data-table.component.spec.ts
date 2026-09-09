import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDataTableComponent } from './ngx-data-table.component';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';

type Row = { [key: string]: unknown };

describe('NgxDataTableComponent', () => {
  let component: NgxDataTableComponent<Row>;
  let fixture: ComponentFixture<NgxDataTableComponent<Row>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDataTableComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user$: new BehaviorSubject(null) } },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['showInfo']) },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
