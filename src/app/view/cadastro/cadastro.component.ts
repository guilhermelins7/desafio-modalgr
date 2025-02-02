import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CepComponent } from '../cep/cep.component';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CepComponent,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
    nameFormControl = new FormControl('', [Validators.required]);
    cpfFormControl = new FormControl('', [Validators.required]);
    dataFormControl = new FormControl('', [Validators.required]);

    emailFormControl = new FormControl('', [Validators.required, Validators.email]);

    matcher = new MyErrorStateMatcher();

    filtroNome(event: any) {
      const value = event.target.value;
    
      // Limita a quantidade de caracteres a 20 e remove qualquer caractere inválido, utilizando ASC
      const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '').slice(0, 150);
    
      event.target.value = sanitizedValue;
    }
}
