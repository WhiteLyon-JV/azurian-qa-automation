import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AccessToken } from '../auth/token-provider';
import { authorizationHeaders } from '../auth/token-provider';

export class DocumentSendClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: AccessToken
  ) {}

  async sendById(id: string): Promise<APIResponse> {
    return this.request.post(
      `/api/documents/${encodeURIComponent(id)}/send`,
      {
        headers: await authorizationHeaders(this.token)
      }
    );
  }
}
