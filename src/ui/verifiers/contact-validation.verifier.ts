import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import type { ContactValidationCase } from '../data/contact-validation.factory';
import { DashboardPage } from '../pages/dashboard.page';
import { ContactPage } from '../pages/contact.page';
import { ContactErrorPage } from '../pages/contact-error.page';
import { DocumentValidationPage } from '../pages/document-validation.page';
import { verifyAndReport } from './evidence';

export async function submitInvalidContactForm(
  page: Page,
  testCase: ContactValidationCase,
  attach: EvidenceWriter
): Promise<void> {
  await attach(JSON.stringify({
    datosDelFormulario: testCase.values,
    entrega: testCase.options,
    correo: testCase.email
  }, null, 2), 'application/json');

  await new DashboardPage(page).openNewDocument();
  await new ContactPage(page).configure(testCase.options);
  await new ContactPage(page).fillEmail(testCase.email);
  await new DocumentValidationPage(page).submit(testCase.values);
}

export async function verifyInvalidContactEmail(
  page: Page,
  testCase: ContactValidationCase,
  reason: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(
    reason === 'correo obligatorio' || reason === 'formato inválido'
  );

  const messages = {
    'correo obligatorio':
      'El correo de contacto es obligatorio cuando se entrega por correo o se envía copia.',
    'formato inválido':
      'El correo de contacto no tiene un formato válido.'
  };

  const message = messages[reason];

  await verifyAndReport(
    page,
    {
      campo: 'contactEmail',
      valor: testCase.email,
      ariaInvalid: 'true',
      mensaje: message
    },
    () => new ContactErrorPage(page).verify(message),
    attach
  );
}
