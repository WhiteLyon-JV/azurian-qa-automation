const resultsDir = process.env.ALLURE_RESULTS_DIR ?? 'allure-results';

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/**/*.ts'],
    format: [
      'summary',
      ['allure-cucumberjs/reporter', 'allure-formatter.log']
    ],
    formatOptions: {
      resultsDir
    }
  }
};
