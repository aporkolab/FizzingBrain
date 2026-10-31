import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  imports: [TranslatePipe],
})
export class RulesComponent {
}
