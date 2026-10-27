import assert from 'node:assert/strict';
import type { SessionLifetimeFixture } from '../data/session-lifetime.fixture';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { verifyRetrievedDocument } from './documents.verifier';

export async function reachSessionCondition(
  fixture: SessionLifetimeFixture,
  condition: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(
    condition === 'requiere renovación preventiva' ||
    condition === 'alcanzó su vencimiento previsto',
    `Condición de sesión desconocida: ${condition}`
  );

  const before = fixture.clock.now();
  const target = condition === 'requiere renovación preventiva'
    ? fixture.initialTiming.refreshAt
    : fixture.initialTiming.expiresAt;

  fixture.clock.advanceTo(target);

  await attach(JSON.stringify({
    relojControlado: 'Reloj del cliente de pruebas',
    condicion: condition,
    antes: before,
    despues: fixture.clock.now(),
    sesionAntesDeConsultar: fixture.session.snapshot
  }, null, 2), 'application/json');
}

export async function querySessionDocument(
  fixture: SessionLifetimeFixture,
  count: number,
  mode: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(Number.isInteger(count) && count >= 1 && count <= 3);
  assert.ok(mode === 'secuencial' || mode === 'simultánea');
  assert.equal(fixture.responses.length, 0);

  fixture.expectedQueries = count;

  await attach(JSON.stringify({
    solicitud: {
      metodo: 'GET',
      documento: fixture.document.id,
      cantidad: count,
      modo: mode,
      relojCliente: fixture.clock.now()
    }
  }, null, 2), 'application/json');

  if (mode === 'secuencial') {
    for (let index = 0; index < count; index += 1) {
      fixture.responses.push(await fixture.client.getById(fixture.document.id));
    }
    return;
  }

  const outcomes = await Promise.allSettled(
    Array.from({ length: count }, () =>
      fixture.client.getById(fixture.document.id)
    )
  );

  for (const outcome of outcomes) {
    if (outcome.status === 'rejected') {
      throw outcome.reason;
    }
    fixture.responses.push(outcome.value);
  }
}

export async function verifySessionDocuments(
  fixture: SessionLifetimeFixture,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(fixture.expectedQueries > 0);
  assert.equal(fixture.responses.length, fixture.expectedQueries);

  for (const response of fixture.responses) {
    await verifyRetrievedDocument(response, fixture.document, attach);
  }
}

export async function verifySessionRenewals(
  fixture: SessionLifetimeFixture,
  renewals: number,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(Number.isInteger(renewals) && renewals >= 0);
  const current = fixture.session.snapshot;
  const expectedLogins = fixture.initialTiming.loginCount + renewals;

  await attach(JSON.stringify({
    esperado: {
      consultas: fixture.expectedQueries,
      loginCount: expectedLogins,
      renovaciones: renewals,
      sesionVigenteParaElCliente: true
    },
    recibido: {
      consultas: fixture.responses.length,
      loginCount: current.loginCount,
      renovaciones: current.loginCount - fixture.initialTiming.loginCount,
      sesionVigenteParaElCliente: fixture.clock.now() < current.refreshAt,
      relojCliente: fixture.clock.now(),
      refreshAt: current.refreshAt,
      expiresAt: current.expiresAt
    }
  }, null, 2), 'application/json');

  assert.equal(current.loginCount, expectedLogins);
  assert.ok(fixture.clock.now() < current.refreshAt);
  assert.ok(current.refreshAt < current.expiresAt);
}
