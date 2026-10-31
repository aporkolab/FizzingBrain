import { Component } from '@angular/core';
import { IconModule } from 'src/app/common/icon/icon.module';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [IconModule],
})
export class ContactComponent {
}
