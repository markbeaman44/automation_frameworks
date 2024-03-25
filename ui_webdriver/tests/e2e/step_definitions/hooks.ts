import { storeValues } from '../../support/constant.js';

export async function loadBrowser() {
  await browser.url('/');
}

export async function cleanStoredValues() {
  storeValues.splice(0, storeValues.length);
}
