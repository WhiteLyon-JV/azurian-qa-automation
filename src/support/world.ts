import { World, setWorldConstructor } from '@cucumber/cucumber';
import type { AuthSession } from '../api/auth/auth-session';
import type {
  APIRequestContext,
  APIResponse,
  Browser,
  BrowserContext,
  Page
} from '@playwright/test';
import { randomUUID } from 'node:crypto';
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentRecord
} from '../shared/models/document';
import type { ReadingFixture } from '../api/data/reading.fixture';

export class TestWorld extends World {
  readonly runId = `qa-${randomUUID()}`;
  apiRequest?: APIRequestContext;
  token?: AuthSession;
  documentInput?: CreateDocumentInput;
  createResponse?: APIResponse;
  createdDocument?: DocumentRecord;
  readingFixture?: ReadingFixture;
  listResponse?: APIResponse;
  selectedDocument?: DocumentRecord;
  detailResponse?: APIResponse;
  documentChanges?: UpdateDocumentInput;
  updateResponse?: APIResponse;
  updatedDocument?: DocumentRecord;
  browser?: Browser;
  browserContext?: BrowserContext;
  uiPage?: Page;

  get request(): APIRequestContext {
    if (!this.apiRequest) {
      throw new Error('El contexto de API no está inicializado.');
    }

    return this.apiRequest;
  }

  get page(): Page {
    if (!this.uiPage) {
      throw new Error('La página del navegador no está inicializada.');
    }

    return this.uiPage;
  }
}

setWorldConstructor(TestWorld);
