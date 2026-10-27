import { preparePendingDocument } from '../../api/data/pending.fixture';
import type { DocumentRecord } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { withPortalApiSession } from './api-session.fixture';

export async function preparePortalPendingDocument(
  runId: string,
  attach: EvidenceWriter
): Promise<DocumentRecord> {
  return withPortalApiSession(
    runId,
    attach,
    ({ documents }) => preparePendingDocument(documents, attach)
  );
}
