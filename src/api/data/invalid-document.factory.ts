import type { CreateDocumentInput } from '../../shared/models/document';
import { buildDocument } from '../../shared/data/document.factory';

export function buildInvalidDocument(
  condition: string
): Partial<CreateDocumentInput> {
  const valid = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  const payload: Partial<CreateDocumentInput> = { ...valid };

  switch (condition) {
    case 'monto ausente':
      delete payload.monto;
      return payload;

    case 'RUT con dígito verificador inválido':
      payload.rutReceptor =
        valid.rutReceptor.slice(0, -1) +
        (valid.rutReceptor.endsWith('0') ? '1' : '0');

      return payload;

    default:
      throw new Error(`Condición de validación desconocida: ${condition}`);
  }
}
