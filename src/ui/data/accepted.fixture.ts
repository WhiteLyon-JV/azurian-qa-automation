import { preparePendingDocument } from '../../api/data/pending.fixture';
import {
  verifyAcceptedDocument
} from '../../api/verifiers/document-send.verifier';
import {
  verifyRetrievedDocument
} from '../../api/verifiers/documents.verifier';
import type { DocumentRecord } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { withPortalApiSession } from './api-session.fixture';

export async function preparePortalAcceptedDocument(
  runId: string,
  attach: EvidenceWriter
): Promise<DocumentRecord> {
  return withPortalApiSession(
    runId,
    attach,
    async ({ documents, send }) => {
      const pendingDocument = await preparePendingDocument(
        documents,
        attach
      );

      const sendResponse = await send.sendById(pendingDocument.id);

      const acceptedDocument = await verifyAcceptedDocument(
        sendResponse,
        pendingDocument,
        attach
      );

      const detailResponse = await documents.getById(
        acceptedDocument.id
      );

      await verifyRetrievedDocument(
        detailResponse,
        acceptedDocument,
        attach
      );

      return acceptedDocument;
    }
  );
}
