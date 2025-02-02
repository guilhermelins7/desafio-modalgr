import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EmailComponent } from '../email/email.component';
import { CepComponent } from '../cep/cep.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    NgxMaskDirective,
    NgxMaskPipe,
    EmailComponent,
    CepComponent
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
}
