import type { DteType } from '../../shared/models/document';

export interface DocumentFormValues {
  tipoDte: DteType;
  folio: string;
  rutReceptor: string;
  monto: string;
  fechaEmision: string;
}

export type FormValidationField =
  | 'folio'
  | 'rutReceptor'
  | 'monto'
  | 'fechaEmision';

export interface InvalidFormCase {
  condition: string;
  values: DocumentFormValues;
  field: FormValidationField;
  message: string;
}
