import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CadastroComponent } from '../cadastro/cadastro.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  nomeRecebido: string = '';
  
  openDialog(): void {
    const dialogRef = this.dialog.open(CadastroComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.nomeRecebido = result; // Recebe o nome retornado pelo diálogo
      }
    });
  }
}
