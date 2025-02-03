import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
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
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ViacepService } from '../../_services/viacep.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
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
    MatIconModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  constructor(
    public dialogRef: MatDialogRef<CadastroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private viaCepService: ViacepService,
    private snackBar: MatSnackBar
  ) {}

  form = new FormGroup({
    nome: new FormControl(''),
    cpf: new FormControl('', [Validators.required]),
    data: new FormControl('', [Validators.required]),
    cep: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    logradouro: new FormControl({ value: '', disabled: true }),
    bairro: new FormControl({ value: '', disabled: true }),
    cidade: new FormControl({ value: '', disabled: true }),
    estado: new FormControl({ value: '', disabled: true }),
    idade: new FormControl({ value: 0, disabled: true }),
  });

  matcher = new MyErrorStateMatcher();

  filtroNome(event: any) {
    const value = event.target.value;

    const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '').slice(0, 150);

    event.target.value = sanitizedValue;
  }

  ngOnInit(): void {
    this.observePreenchimentoCep();
  }

  observePreenchimentoCep() {
    this.form.get('cep')?.valueChanges.subscribe((value) => {
      if (value && value.length === 8) {
        // Verifica se value não é undefined
        this.buscarCep(value); // Faz a busca sempre que um CEP de 8 caracteres for digitado
      } else if (value && value.length < 8) {
        // Verifica se value não é undefined
        this.form.patchValue({
          logradouro: '',
          bairro: '',
          cidade: '',
          estado: '',
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
          estado: response.uf,
        });
      },
      error: () => {
        alert('Erro ao buscar o CEP');
      },
    });
  }

  validarNome(): boolean {
    if (this.form.get('nome')?.value != '') return true;
    return false;
  }

  validarCpf(): boolean {
    const cpf = this.form.get('cpf')?.value;
    if (!cpf) return false;

    const cpfSemMascara = cpf.replace(/\D/g, '');

    if (cpfSemMascara.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpfSemMascara)) {
      return false;
    }

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

  validarCep(): boolean {
    if (this.form.get('cidade')?.value == '' || this.form.get('cidade')?.value == undefined) return false;
    return true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  salvarDados() {
    if (this.form.valid && 
      this.validarCep() &&
      this.validarCpf()
    ) {
      const dados = this.form.getRawValue();
      if (dados.data) {
        // Aplicar "macara":
        dados.data = dados.data.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
        dados.idade = this.calcularIdade(dados.data);
      }

      this.dialogRef.close(dados);
    } else {
      this.exibirAlertaCamposInvalidos();
    }
  }

  calcularIdade(dataNascimento: string): number {
    if (!dataNascimento || dataNascimento.length < 10) return 0;

    const [dia, mes, ano] = dataNascimento.split('/').map(Number);

    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    if (nascimento > hoje || isNaN(nascimento.getTime())) return 0;

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (
      hoje.getMonth() < mes - 1 ||
      (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)
    ) {
      idade--;
    }

    return idade;
  }

  exibirAlertaCamposInvalidos() {
    let mensagem = 'Campos inválidos:\n';

    if (!this.validarNome()) {
      mensagem += '| Nome\n';
    }

    if (!this.validarCpf()) {
      mensagem += '| CPF\n';
    }

    if (this.form.get('data')?.invalid) {
      mensagem += '| Data de nascimento\n';
    }

    if (this.form.get('email')?.invalid) {
      mensagem += '| E-mail\n';
    }

    if (!this.validarCep()) {
      mensagem += '| CEP\n';
    }

    this.exibirSnackbar(mensagem); // Exibe o Snackbar com a mensagem
  }

  exibirSnackbar(
    mensagem: string,
    acao: string = 'Fechar',
    duracao: number = 5000
  ) {
    this.snackBar.open(mensagem, acao, {
      duration: duracao, // Duração em milissegundos (5 segundos por padrão)
      horizontalPosition: 'center', // Posição horizontal (center, start, end)
      verticalPosition: 'bottom', // Posição vertical (top, bottom)
    });
  }
}
