import assert from 'node:assert/strict';
import type { EvidenceWriter } from '../reporting/evidence';

export async function verifyRunId(
  runId: string,
  attach: EvidenceWriter
): Promise<void> {
  await attach(JSON.stringify({
    esperado: 'Entre 3 y 80 caracteres alfanuméricos, guiones o guiones bajos',
    recibido: runId
  }, null, 2), 'application/json');

  assert.match(runId, /^[A-Za-z0-9_-]{3,80}$/);
}
