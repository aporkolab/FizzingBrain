
import { Injectable } from '@angular/core';
import { INgxTableColumn } from '../common/data-table/ngx-data-table/ngx-data-table.component';

@Injectable({
  providedIn: 'root',
})

export class ConfigService {
  questionsColumn: INgxTableColumn[] = [
    { key: 'id', title: 'ID' },
    { key: 'hungarianQuestion', title: 'Hungarian question' },
    { key: 'englishQuestion', title: 'English question' },
    { key: 'hungarianAnswer', title: 'Hungarian answer' },
    { key: 'englishAnswer', title: 'English answer' },
    { key: 'descriptionHungarian', title: 'Description Hungarian' },
    { key: 'descriptionEnglish', title: 'Description English' },
  ];

  usersColumn: INgxTableColumn[] = [
    { key: 'id', title: 'ID' },
    { key: 'firstName', title: 'First name' },
    { key: 'lastName', title: 'Last name' },
    { key: 'email', title: 'E-mail' },
  ];

}