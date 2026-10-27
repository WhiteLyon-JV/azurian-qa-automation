import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { buildTestAttachment } from '../data/attachment.factory';
import type { TestAttachment } from '../models/attachment';
import {
  selectPortalAttachment,
  verifyPortalAttachmentAccepted,
  verifyPortalAttachmentError,
  verifyPortalAttachmentEmpty
} from '../verifiers/attachment.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface AttachmentWorld extends TestWorld {
  attachment?: TestAttachment;
}

When(
  'selecciono como respaldo el archivo {string} de {int} bytes',
  async function (
    this: AttachmentWorld,
    name: string,
    bytes: number
  ) {
    this.attachment = buildTestAttachment(name, bytes);

    await selectPortalAttachment(
      this.page,
      this.attachment,
      evidenceWriter(this)
    );
  }
);

Then(
  'veo el archivo de respaldo seleccionado',
  async function (this: AttachmentWorld) {
    assert.ok(this.attachment);

    await verifyPortalAttachmentAccepted(
      this.page,
      this.attachment,
      evidenceWriter(this)
    );
  }
);

Then(
  'veo el error {string} asociado al documento de respaldo',
  async function (this: AttachmentWorld, reason: string) {
    assert.ok(this.attachment);

    await verifyPortalAttachmentError(
      this.page,
      reason,
      evidenceWriter(this)
    );
  }
);

Then(
  'el archivo rechazado no queda seleccionado',
  async function (this: AttachmentWorld) {
    assert.ok(this.attachment);

    await verifyPortalAttachmentEmpty(
      this.page,
      evidenceWriter(this)
    );
  }
);
