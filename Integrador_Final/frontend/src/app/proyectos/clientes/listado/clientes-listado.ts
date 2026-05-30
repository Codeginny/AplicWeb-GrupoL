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











//  Exportar a Excel
  exportarExcel(): void {
  const clientes = this.clientes();
  
  // Mapear los datos a un formato plano para Excel
  const datosExcel = clientes.map(cliente => ({
    'Nombre': cliente.nombre,
    'Estado': cliente.estado,
    'Telefono': cliente.telefono,
    'Email': cliente.email
  }));

  // Crear hoja de trabajo y libro
  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  // Generar archivo y forzar descarga
  XLSX.writeFile(workbook, `clientes${new Date().toISOString().slice(0,19)}.xlsx`);
}

//Exportar a CSV
exportarCSV(): void {
  const clientes = this.clientes();
  
  // Mapear los datos a un formato plano para CSV
  const datosCSV = clientes.map(cliente => ({
    'Nombre': cliente.nombre,
    'Estado': cliente.estado,
    'Telefono': cliente.telefono,
    'Email': cliente.email
  }));


  // Convertir a CSV
  let csvData = this.convertirACSV(datosCSV);
  
  // Agregar BOM (Byte Order Mark) para caracteres UTF-8
  // Esto es crucial para que Excel y otros programas lean bien los acentos
  const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
  
  // Crear link y descargar
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


// Método auxiliar para convertir JSON a CSV
private convertirACSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  // Obtener las cabeceras
  const headers = Object.keys(data[0]);
  
  // Crear fila de cabeceras
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  // Crear filas de datos
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]?.toString() || '';
      // Escapar comillas dobles y envolver en comillas si contiene comas
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