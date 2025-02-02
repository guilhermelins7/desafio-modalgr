import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ViacepService } from '../../_services/viacep.service';

@Component({
  selector: 'app-cep',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './cep.component.html',
  styleUrl: './cep.component.scss'
})
export class CepComponent implements OnInit {
  
  // Lidando com Forms:
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private viaCepService: ViacepService ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.observePreenchimentoCep();
  }

  initializeForm() {
    this.form = this.fb.group({
      cep: ['', [Validators.required]],
      logradouro: [{value: '', disabled: true}],
      bairro: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}]
    })
  }

  observePreenchimentoCep() {
    // Subscribe definine aqui o funcionamento do watcher
    this.form.get('cep')?.valueChanges.subscribe(value => {
      if (value?.length === 8) {
        this.buscarCep(); // Faz a busca sempre que um CEP de 8 caracteres for digitado
      } else if (value?.length < 8) {
        this.form.patchValue({
          logradouro: '',
          bairro: '',
          cidade: '',
          estado: ''
        });
      }
    });
  }

  buscarCep() {
    var cep = this.form.get('cep')?.value;
    this.viaCepService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        this.form.patchValue({
          logradouro: response.logradouro,
          bairro: response.bairro,
          cidade: response.localidade,
          estado: response.uf
        })
      },
      error: () => {
        //tratar erro.
        alert("Erro ao buscar o CEP");
      }
    });
  }
}
