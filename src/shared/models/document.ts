export type DteType = 'DTE 33' | 'DTE 34' | 'DTE 39';

export interface CreateDocumentInput {
  tipoDte: DteType;
  folio: number;
  rutReceptor: string;
  monto: number;
  fechaEmision: string;
}

export interface DocumentRecord extends CreateDocumentInput {
  id: string;
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';
  contactEmail: string | null;
  sendCopy: boolean;
  deliveryChannel: 'PORTAL' | 'EMAIL';
  observaciones: string | null;
  attachmentName: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateDocumentInput = Partial<Pick<
  DocumentRecord,
  | 'rutReceptor'
  | 'monto'
  | 'fechaEmision'
  | 'contactEmail'
  | 'sendCopy'
  | 'deliveryChannel'
  | 'observaciones'
  | 'attachmentName'
>>;
