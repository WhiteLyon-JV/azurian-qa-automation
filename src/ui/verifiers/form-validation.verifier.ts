import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import type { InvalidFormCase } from '../models/document-form';
import { DashboardPage } from '../pages/dashboard.page';
import { DocumentValidationPage } from '../pages/document-validation.page';
import { verifyAndReport } from './evidence';

export async function submitInvalidPortalForm(
  page: Page,
  testCase: InvalidFormCase,
  attach: EvidenceWriter
): Promise<void> {
  await attach(JSON.stringify({
    condicion: testCase.condition,
    datosDelFormulario: testCase.values
  }, null, 2), 'application/json');

  await new DashboardPage(page).openNewDocument();
  await new DocumentValidationPage(page).submit(testCase.values);
}

export async function verifyPortalFormError(
  page: Page,
  testCase: InvalidFormCase,
  field: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.equal(field, testCase.field);

  await verifyAndReport(
    page,
    {
      campo: testCase.field,
      valor: testCase.values[testCase.field],
      ariaInvalid: 'true',
      mensaje: testCase.message,
      camposInvalidos: [testCase.field]
    },
    () => new DocumentValidationPage(page).verifyFieldError(
      testCase.field,
      testCase.message
    ),
    attach
  );
}

export async function verifyPortalFormAvailable(
  page: Page,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    {
      formularioVisible: true,
      botonGuardarHabilitado: true
    },
    () => new DocumentValidationPage(page).verifyOpenForCorrection(),
    attach
  );

  await attach(
    await page.screenshot({ fullPage: true }),
    'image/png'
  );
}
