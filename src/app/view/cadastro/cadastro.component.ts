import {Component, Inject} from '@angular/core';
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
  FormGroup,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

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
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
    form = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

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

    constructor(
      public dialogRef: MatDialogRef<CadastroComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    validarNome() : boolean {
      if(this.form.get('nome')?.value != '') return true;
      return false;
    }

    validarCpf() : boolean {
      const cpf = this.form.get('cpf')?.value;
      if (cpf?.length == 11) return true;
      return false;
    }

    salvarDados() {
        if (this.validarCpf() && this.validarNome()) {
          const formularioCompleto = this.form.value;
          this.dialogRef.close(formularioCompleto); 
        }

        if(this.form.valid) {
          const nome = this.form.get('nome')?.value ?? '';
          this.dialogRef.close(nome); // Fecha o diálogo e retorna o nome
        }
        // if(this.validarCpf()) {
        //   const nome = this.form.get('cpf')?.value ?? '';
        //   this.dialogRef.close(nome); // Fecha o diálogo e retorna o nome
        // }
    }
}
