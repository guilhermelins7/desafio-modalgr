import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
} from '@angular/material/dialog';
import { CadastroComponent } from '../cadastro/cadastro.component';
import {MatTableModule} from '@angular/material/table';
import { Data } from '@angular/router';

export interface Funcionario {
  nome: string;
  email: string;
  idade: Data;
  cpf: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const ELEMENT_DATA: Funcionario[] = [
  // {nome: 'Teste', email: 'teste@mail', cpf: "1111", cep: "1111"}
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  readonly dialog = inject(MatDialog);
  
  openDialog(): void {
    const dialogRef = this.dialog.open(CadastroComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = [...this.dataSource, result];
        // alert(JSON.stringify(this.formulario, null, 2))
      }
    });
  }

  displayedColumns: string[] = ['nome', 'email', 'idade', 'cpf', 'cep', 'logradouro', 'bairro', 'cidade', 'estado'];
  dataSource = ELEMENT_DATA;
}
