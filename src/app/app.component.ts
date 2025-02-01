import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from './view/cadastro/cadastro.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CadastroComponent,
    MatSlideToggleModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
}