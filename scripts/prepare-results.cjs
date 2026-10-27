'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

try {
  const root = path.resolve(__dirname, '..');
  const packageFile = path.join(root, 'package.json');
  if (!fs.existsSync(packageFile) ||
      JSON.parse(fs.readFileSync(packageFile, 'utf8')).name !== 'azurian-qa-automation') {
    throw new Error('Este script debe estar en scripts/ del proyecto azurian-qa-automation.');
  }

  const results = path.join(root, 'allure-results');
  if (process.env.ALLURE_RESULTS_DIR &&
      path.resolve(root, process.env.ALLURE_RESULTS_DIR) !== results) {
    throw new Error('results:prepare prepara allure-results. Quita ALLURE_RESULTS_DIR para usar este comando.');
  }

  if (fs.existsSync(results)) {
    const archiveRoot = path.join(root, 'work', 'allure-history');
    fs.mkdirSync(archiveRoot, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archive = path.join(archiveRoot, `${timestamp}-${randomUUID()}`);
    fs.renameSync(results, archive);
    console.log(`Resultados anteriores guardados en: ${archive}`);
  }

  fs.mkdirSync(results, { recursive: true });
  console.log('allure-results está preparada para una nueva ejecución.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
