import {Component, Inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
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
import { ViacepService } from '../../_services/viacep.service';

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
      nome: new FormControl(''),
      cpf: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
      cep: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      logradouro: new FormControl({ value: '', disabled: true }),
      bairro: new FormControl({ value: '', disabled: true }),
      cidade: new FormControl({ value: '', disabled: true }),
      estado: new FormControl({ value: '', disabled: true })
    });
    
    matcher = new MyErrorStateMatcher();

    filtroNome(event: any) {
      const value = event.target.value;
    
      // Limita a quantidade de caracteres a 20 e remove qualquer caractere inválido, utilizando ASC
      const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '').slice(0, 150);
    
      event.target.value = sanitizedValue;
    }

    constructor(
      public dialogRef: MatDialogRef<CadastroComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private viaCepService: ViacepService
    ) {}

    ngOnInit(): void {
      this.observePreenchimentoCep();
    }

    observePreenchimentoCep() {
      this.form.get('cep')?.valueChanges.subscribe(value => {
        if (value && value.length === 8) { // Verifica se value não é undefined
          this.buscarCep(value); // Faz a busca sempre que um CEP de 8 caracteres for digitado
        } else if (value && value.length < 8) { // Verifica se value não é undefined
          this.form.patchValue({
            logradouro: '',
            bairro: '',
            cidade: '',
            estado: ''
          });
        }
      });
    }

    buscarCep(cep: string) {
      this.viaCepService.getEnderecoByCep(cep).subscribe({
        next: (response) => {
          this.form.patchValue({
            logradouro: response.logradouro,
            bairro: response.bairro,
            cidade: response.localidade,
            estado: response.uf
          });
        },
        error: () => {
          alert("Erro ao buscar o CEP");
        }
      });
    }

    validarNome() : boolean {
      if(this.form.get('nome')?.value != '') return true;
      return false;
    }

    validarCpf(): boolean {
      const cpf = this.form.get('cpf')?.value;
      if (!cpf) return false;
    
      // Remove a máscara do CPF (pontos e traços)
      const cpfSemMascara = cpf.replace(/\D/g, '');
    
      // Verifica se o CPF tem 11 dígitos
      if (cpfSemMascara.length !== 11) {
        return false;
      }
    
      // Verifica se todos os dígitos são iguais (CPF inválido)
      if (/^(\d)\1{10}$/.test(cpfSemMascara)) {
        return false;
      }
    
      // Validação dos dígitos verificadores
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfSemMascara.charAt(i)) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpfSemMascara.charAt(9))) {
        return false;
      }
    
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfSemMascara.charAt(i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpfSemMascara.charAt(10))) {
        return false;
      }
      return true; // CPF válido
    }

    validarEmail(): boolean {
      const email: string = this.form.get('email')?.value ?? '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    salvarDados() {
      if (this.validarCpf() && 
      this.validarNome() && 
      this.validarEmail()) {
        const formularioCompleto = {
          ...this.form.value,
          logradouro: this.form.get('logradouro')?.value,
          bairro: this.form.get('bairro')?.value,
          cidade: this.form.get('cidade')?.value,
          estado: this.form.get('estado')?.value
        };
        this.dialogRef.close(formularioCompleto); // Retorna todos os dados do formulário
      }
    }
}
