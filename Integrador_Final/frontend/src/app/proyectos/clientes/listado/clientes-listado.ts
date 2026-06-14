import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { ClientesListadoApiClient } from "./clientes-listado-api-client";
import { ListClienteDTO } from "./list-cliente-dto";
import { DialogModule } from "primeng/dialog";
import { GestionCliente } from "../gestion/gestion-cliente";
import * as XLSX from 'xlsx';



@Component({
  selector: "app-clientes-listado",
  templateUrl: "./clientes-listado.html",
  styleUrls: ["./clientes-listado.css"],
  imports: [TableModule, ButtonModule, DialogModule, GestionCliente]
})
export class ClientesListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  visible: ModelSignal<boolean> = model(false);

  private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

  clientes: WritableSignal<ListClienteDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  clienteSeleccionado: WritableSignal<ListClienteDTO | null> = signal<ListClienteDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes' });
      }
    });
  }

  crearCliente(): void {
    this.dialogVisible.set(true);
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.dialogVisible.set(true);
    this.clienteSeleccionado.set(cliente);
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }


  exportarExcel(): void {
  const clientes = this.clientes();
  
  const datosExcel = clientes.map(cliente => ({
    'Nombre': cliente.nombre,
    'Estado': cliente.estado,
    'Telefono': cliente.telefono,
    'Email': cliente.email
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  XLSX.writeFile(workbook, `clientes${new Date().toISOString().slice(0,19)}.xlsx`);
}

exportarCSV(): void {
  const clientes = this.clientes();
  
  const datosCSV = clientes.map(cliente => ({
    'Nombre': cliente.nombre,
    'Estado': cliente.estado,
    'Telefono': cliente.telefono,
    'Email': cliente.email
  }));

  let csvData = this.convertirACSV(datosCSV);
  
  // BOM para los acentos en excel
  const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `clientes_${new Date().toISOString().slice(0,19)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


private convertirACSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]?.toString() || '';
      value = value.replace(/"/g, '""');
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}


}