import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import type { DeliveryOptions } from '../models/contact';
import {
  buildDeliveryOptions,
  contactExampleEmail
} from '../data/contact.factory';
import { DashboardPage } from '../pages/dashboard.page';
import { ContactPage } from '../pages/contact.page';
import { verifyAndReport } from './evidence';

export async function configurePortalContact(
  page: Page,
  channel: string,
  copy: string
): Promise<DeliveryOptions> {
  const options = buildDeliveryOptions(channel, copy);
  await new DashboardPage(page).openNewDocument();
  await new ContactPage(page).configure(options);
  return options;
}

export async function disablePortalContact(
  page: Page
): Promise<DeliveryOptions> {
  const options = buildDeliveryOptions('Portal', 'no');
  await new ContactPage(page).configure(options);
  return options;
}

export async function verifyPortalContactAvailability(
  page: Page,
  options: DeliveryOptions,
  state: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(state === 'habilitado' || state === 'deshabilitado');

  const enabled = state === 'habilitado';

  await verifyAndReport(
    page,
    {
      portalSeleccionado: options.channel === 'PORTAL',
      correoSeleccionado: options.channel === 'EMAIL',
      copiaSeleccionada: options.sendCopy,
      correoHabilitado: enabled
    },
    () => new ContactPage(page).verifyAvailability(options, enabled),
    attach
  );

  await attach(
    await page.screenshot({ fullPage: true }),
    'image/png'
  );
}

export async function fillPortalContactEmail(
  page: Page,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    contactExampleEmail,
    () => new ContactPage(page).fillEmail(contactExampleEmail),
    attach
  );
}

export async function verifyPortalContactEmpty(
  page: Page,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    '',
    () => new ContactPage(page).verifyEmpty(),
    attach
  );
}
