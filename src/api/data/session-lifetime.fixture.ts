import assert from 'node:assert/strict';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthSession } from '../auth/auth-session';
import { DocumentsClient } from '../clients/documents.client';
import { preparePendingDocument } from './pending.fixture';
import type { DocumentRecord } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { ControlledClock } from '../../shared/time/controlled-clock';

export interface SessionLifetimeFixture {
  clock: ControlledClock;
  session: AuthSession;
  client: DocumentsClient;
  document: DocumentRecord;
  initialTiming: AuthSession['snapshot'];
  responses: APIResponse[];
  expectedQueries: number;
}

export async function prepareSessionLifetimeFixture(
  context: APIRequestContext,
  attach: EvidenceWriter
): Promise<SessionLifetimeFixture> {
  const clock = new ControlledClock();
  const session = new AuthSession(context, attach, clock.now);
  const client = new DocumentsClient(context, session);
  const document = await preparePendingDocument(client, attach);
  const initialTiming = session.snapshot;

  assert.equal(initialTiming.loginCount, 1);
  assert.ok(initialTiming.refreshAt > clock.now());
  assert.ok(initialTiming.refreshAt < initialTiming.expiresAt);

  return {
    clock,
    session,
    client,
    document,
    initialTiming,
    responses: [],
    expectedQueries: 0
  };
}
