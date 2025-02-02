import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from './view/cadastro/cadastro.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HomeComponent } from './view/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CadastroComponent,
    MatSlideToggleModule,
    NgxMaskDirective,
    NgxMaskPipe,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
}