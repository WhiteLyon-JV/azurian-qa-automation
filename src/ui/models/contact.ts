export interface DeliveryOptions {
  channel: 'PORTAL' | 'EMAIL';
  sendCopy: boolean;
}

export interface ContactStateEvidence {
  portalSeleccionado: boolean;
  correoSeleccionado: boolean;
  copiaSeleccionada: boolean;
  correoHabilitado: boolean;
  valor: string;
}
