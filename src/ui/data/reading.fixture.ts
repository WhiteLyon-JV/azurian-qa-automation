import {
  prepareReadingDocuments
} from '../../api/data/reading.fixture';
import type {
  ReadingFixture
} from '../../api/data/reading.fixture';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { withPortalApiSession } from './api-session.fixture';

export async function preparePortalReadingDocuments(
  runId: string,
  attach: EvidenceWriter
): Promise<ReadingFixture> {
  return withPortalApiSession(
    runId,
    attach,
    ({ documents }) => prepareReadingDocuments(documents, attach)
  );
}
