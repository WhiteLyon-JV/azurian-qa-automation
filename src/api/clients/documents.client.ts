import type { APIRequestContext, APIResponse } from '@playwright/test';
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  DteType
} from '../../shared/models/document';
import type { AccessToken } from '../auth/token-provider';
import { authorizationHeaders } from '../auth/token-provider';

export interface DocumentFilters {
  rut: string;
  tipoDte: DteType;
}

export class DocumentsClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: AccessToken
  ) {}

  async create(input: CreateDocumentInput): Promise<APIResponse> {
    return this.request.post('/api/documents', {
      headers: await authorizationHeaders(this.token),
      data: input
    });
  }

  async getById(id: string): Promise<APIResponse> {
    return this.request.get(`/api/documents/${encodeURIComponent(id)}`, {
      headers: await authorizationHeaders(this.token)
    });
  }

  async list(filters: DocumentFilters): Promise<APIResponse> {
    return this.request.get('/api/documents', {
      headers: await authorizationHeaders(this.token),
      params: {
        rut: filters.rut,
        tipoDte: filters.tipoDte
      }
    });
  }

  async update(
    id: string,
    input: UpdateDocumentInput
  ): Promise<APIResponse> {
    return this.request.patch(`/api/documents/${encodeURIComponent(id)}`, {
      headers: await authorizationHeaders(this.token),
      data: input
    });
  }

  async deleteById(id: string): Promise<APIResponse> {
    return this.request.delete(`/api/documents/${encodeURIComponent(id)}`, {
      headers: await authorizationHeaders(this.token)
    });
  }
}
