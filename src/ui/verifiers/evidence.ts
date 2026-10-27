import { timeouts } from '../../config/timeouts';
import { stripVTControlCharacters } from 'node:util';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';

export async function verifyAndReport<T>(
  page: Page,
  expected: unknown,
  verification: () => Promise<T>,
  attach: EvidenceWriter
): Promise<T> {
  let received: unknown;

  try {
    const result = await verification();
    received = result;
    return result;
  } catch (error) {
    received = {
      url: page.url(),
      titulos: await page.getByRole('heading').allTextContents(),
      alertas: await page.getByRole('alert').allTextContents(),
      contenidoPrincipal: await page.getByRole('main').innerText({
        timeout: timeouts.evidence
      }).catch(() => null),
      fallo: stripVTControlCharacters(
        error instanceof Error ? error.message : String(error)
      )
    };

    throw error;
  } finally {
    await attach(JSON.stringify({
      esperado: expected,
      recibido: received
    }, null, 2), 'application/json');
  }
}
