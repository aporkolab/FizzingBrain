import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  imports: [CommonModule, TranslatePipe],
})
export class RulesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
