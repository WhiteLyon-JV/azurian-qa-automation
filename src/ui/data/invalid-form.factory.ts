import assert from 'node:assert/strict';
import { buildDocument } from '../../shared/data/document.factory';
import type {
  DocumentFormValues,
  FormValidationField,
  InvalidFormCase
} from '../models/document-form';

interface FieldViolation {
  field: FormValidationField;
  value: string;
  message: string;
}

export function buildInvalidFormCase(condition: string): InvalidFormCase {
  const document = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  const values: DocumentFormValues = {
    tipoDte: document.tipoDte,
    folio: String(document.folio),
    rutReceptor: document.rutReceptor,
    monto: String(document.monto),
    fechaEmision: document.fechaEmision
  };

  const future = new Date();
  future.setUTCDate(future.getUTCDate() + 3);

  const cases: Partial<Record<string, FieldViolation>> = {
    'folio ausente': {
      field: 'folio',
      value: '',
      message: 'El folio es obligatorio.'
    },
    'RUT ausente': {
      field: 'rutReceptor',
      value: '',
      message: 'El RUT del receptor es obligatorio.'
    },
    'monto ausente': {
      field: 'monto',
      value: '',
      message: 'El monto es obligatorio.'
    },
    'RUT con dígito verificador inválido': {
      field: 'rutReceptor',
      value: document.rutReceptor.slice(0, -1) +
        (document.rutReceptor.endsWith('0') ? '1' : '0'),
      message: 'El dígito verificador del RUT no es válido.'
    },
    'folio igual a cero': {
      field: 'folio',
      value: '0',
      message: 'El folio debe estar entre 1 y 9.999.999.'
    },
    'monto igual a cero': {
      field: 'monto',
      value: '0',
      message: 'El monto debe estar entre 1 y 999.999.999.'
    },
    'fecha anterior al año 2000': {
      field: 'fechaEmision',
      value: '1999-12-31',
      message: 'La fecha de emisión no puede ser anterior al 2000-01-01.'
    },
    'fecha futura': {
      field: 'fechaEmision',
      value: future.toISOString().slice(0, 10),
      message: 'La fecha de emisión no puede ser futura.'
    }
  };

  const violation = cases[condition];
  assert.ok(violation, `Condición desconocida: ${condition}`);

  return {
    condition,
    values: {
      ...values,
      [violation.field]: violation.value
    },
    field: violation.field,
    message: violation.message
  };
}
