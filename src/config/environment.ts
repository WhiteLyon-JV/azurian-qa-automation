export const environment = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  username: process.env.LAB_USERNAME ?? 'admin@azurian.com',
  password: process.env.LAB_PASSWORD ?? 'Azurian2026!',
  headless: process.env.HEADLESS !== 'false'
};
