import { Pipe, PipeTransform } from '@angular/core';
import { ListTareaDTO } from './list-tarea-dto';

@Pipe({
  name: 'filtroTareas',
  standalone: true
})
export class FiltroTareasPipe implements PipeTransform {
  transform(tareas: ListTareaDTO[] | null, query: string | null): ListTareaDTO[] {
    if (!originalArrayIsValid(tareas)) {
      return [];
    }
    if (!query) {
      return tareas;
    }
    const lowerQuery = query.toLowerCase().trim();
    return tareas.filter(t => t.descripcion.toLowerCase().includes(lowerQuery));
  }
}

function originalArrayIsValid(array: ListTareaDTO[] | null): array is ListTareaDTO[] {
  return Array.isArray(array);
}
