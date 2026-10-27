import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';
import type {
  DocumentFormValues,
  FormValidationField
} from '../models/document-form';

export interface FormErrorEvidence {
  campo: FormValidationField;
  valor: string;
  ariaInvalid: string | null;
  mensaje: string;
  camposInvalidos: FormValidationField[];
}

export class DocumentValidationPage {
  constructor(private readonly page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });
  }

  private field(name: FormValidationField): Locator {
    const labels: Record<FormValidationField, string> = {
      folio: 'Número de folio *',
      rutReceptor: 'RUT receptor *',
      monto: 'Monto total (CLP) *',
      fechaEmision: 'Fecha de emisión *'
    };

    return this.dialog.getByLabel(labels[name], { exact: true });
  }

  async submit(values: DocumentFormValues): Promise<void> {
    await expect(this.dialog).toBeVisible();

    await this.dialog.getByLabel(
      'Tipo de documento tributario *',
      { exact: true }
    ).selectOption(values.tipoDte);

    await this.field('folio').fill(values.folio);
    await this.field('rutReceptor').fill(values.rutReceptor);
    await this.field('monto').fill(values.monto);
    await this.field('fechaEmision').fill(values.fechaEmision);

    await this.dialog.getByRole('button', {
      name: 'Guardar y emitir',
      exact: true
    }).click();

    await expect(this.dialog.getByRole('alert')).toHaveText(
      'Corrige los campos indicados antes de continuar.'
    );
  }

  async verifyFieldError(
    name: FormValidationField,
    message: string
  ): Promise<FormErrorEvidence> {
    const input = this.field(name);

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(message);

    const error = this.dialog.getByText(message, { exact: true });
    await expect(error).toHaveCount(1);
    await expect(error).toBeVisible();

    const fields: FormValidationField[] = [
      'folio',
      'rutReceptor',
      'monto',
      'fechaEmision'
    ];

    const invalidFields: FormValidationField[] = [];

    for (const field of fields) {
      if (await this.field(field).getAttribute('aria-invalid') === 'true') {
        invalidFields.push(field);
      }
    }

    expect(invalidFields).toEqual([name]);

    return {
      campo: name,
      valor: await input.inputValue(),
      ariaInvalid: await input.getAttribute('aria-invalid'),
      mensaje: await error.innerText(),
      camposInvalidos: invalidFields
    };
  }

  async verifyOpenForCorrection(): Promise<{
    formularioVisible: boolean;
    botonGuardarHabilitado: boolean;
  }> {
    const save = this.dialog.getByRole('button', {
      name: 'Guardar y emitir',
      exact: true
    });

    await expect(this.dialog).toBeVisible();
    await expect(save).toBeEnabled();

    return {
      formularioVisible: await this.dialog.isVisible(),
      botonGuardarHabilitado: await save.isEnabled()
    };
  }
}
