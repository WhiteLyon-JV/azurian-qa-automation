import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { ObservationsPage } from '../pages/observations.page';
import { verifyAndReport } from './evidence';

export async function verifyPortalObservations(
  page: Page,
  length: number,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    {
      valor: 'A'.repeat(length),
      cantidad: length,
      contador: `${length}/300`,
      limite: '300'
    },
    () => new ObservationsPage(page).verify(length),
    attach
  );

  await attach(await page.screenshot({
    fullPage: true
  }), 'image/png');
}
