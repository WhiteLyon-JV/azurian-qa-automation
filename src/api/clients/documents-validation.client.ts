import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';
import type { AccessToken } from '../auth/token-provider';
import { authorizationHeaders } from '../auth/token-provider';

export class DocumentsValidationClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: AccessToken
  ) {}

  async createCandidate(
    input: Partial<CreateDocumentInput>
  ): Promise<APIResponse> {
    return this.request.post('/api/documents', {
      headers: this.token === undefined
        ? {}
        : await authorizationHeaders(this.token),
      data: input
    });
  }
}
