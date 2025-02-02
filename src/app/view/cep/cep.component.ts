import { Component, Input, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {
  FormBuilder,
  FormControl,
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
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './cep.component.html',
  styleUrl: './cep.component.scss'
})
export class CepComponent implements OnInit {
  @Input() cepControl!: FormControl; // Recebe o FormControl de CEP do componente pai
  
  // Lidando com Forms:
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private viaCepService: ViacepService ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.observePreenchimentoCep();
  }

  initializeForm() {
    this.form = this.fb.group({
      logradouro: [{value: '', disabled: true}],
      bairro: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}]
    })
  }

  observePreenchimentoCep() {
    // Subscribe definine aqui o funcionamento do watcher
    this.cepControl.valueChanges.subscribe(value => {
      if (value?.length === 8) {
        this.buscarCep(value); // Faz a busca sempre que um CEP de 8 caracteres for digitado
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

  buscarCep(cep: string) {
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
