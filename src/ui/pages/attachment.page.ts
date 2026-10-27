import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';
import type { TestAttachment } from '../models/attachment';

interface SelectedFile {
  name: string;
  size: number;
  mimeType: string;
}

export class AttachmentPage {
  constructor(private readonly page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });
  }

  private get input(): Locator {
    return this.dialog.getByLabel('Documento de respaldo', {
      exact: true
    });
  }

  private async selectedFiles(): Promise<SelectedFile[]> {
    return this.input.evaluate(element => {
      if (!(element instanceof HTMLInputElement)) {
        throw new Error('El control de respaldo debe ser un input.');
      }

      return Array.from(element.files ?? []).map(file => ({
        name: file.name,
        size: file.size,
        mimeType: file.type
      }));
    });
  }

  async select(file: TestAttachment): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await this.input.setInputFiles(file);
  }

  async verifyAccepted(file: TestAttachment): Promise<SelectedFile[]> {
    await expect(
      this.dialog.getByText(file.name, { exact: true })
    ).toBeVisible();

    await expect(
      this.dialog.getByRole('button', {
        name: 'Quitar archivo adjunto',
        exact: true
      })
    ).toBeVisible();

    await expect(this.input).not.toHaveAttribute('aria-invalid', 'true');

    const files = await this.selectedFiles();

    expect(files).toEqual([{
      name: file.name,
      size: file.buffer.byteLength,
      mimeType: file.mimeType
    }]);

    return files;
  }

  async verifyError(message: string): Promise<{
    campo: string;
    mensaje: string;
    ariaInvalid: string | null;
  }> {
    await expect(this.input).toHaveAttribute('aria-invalid', 'true');
    await expect(this.input).toHaveAccessibleDescription(message);

    const error = this.dialog.getByText(message, { exact: true });
    await expect(error).toHaveCount(1);
    await expect(error).toBeVisible();

    await expect(
      this.dialog.getByRole('button', {
        name: 'Quitar archivo adjunto',
        exact: true
      })
    ).toHaveCount(0);

    return {
      campo: 'attachmentName',
      mensaje: await error.innerText(),
      ariaInvalid: await this.input.getAttribute('aria-invalid')
    };
  }

  async verifyEmpty(): Promise<{
    valor: string;
    archivosSeleccionados: SelectedFile[];
  }> {
    await expect(this.input).toHaveValue('');

    const files = await this.selectedFiles();
    expect(files).toEqual([]);

    return {
      valor: await this.input.inputValue(),
      archivosSeleccionados: files
    };
  }
}
