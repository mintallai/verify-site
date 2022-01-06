import { expect } from '@playwright/test';
import { test } from './test';

test.describe.parallel('i18n - translations', () => {
  test(`the site should default to English`, async ({ inspectPage }) => {
    await expect(inspectPage.languagePicker()).toHaveText('English');
    const title = inspectPage.page.locator('data-test-id=header.learn-more');
    await expect(title).toHaveText('Learn more');
  });

  test(`using the dropdown to switch the language to French displays the correct text`, async ({
    inspectPage,
  }) => {
    await expect(inspectPage.languagePicker()).toHaveText('English');
    await inspectPage.changeLanguageViaPicker('fr-FR');
    const title = inspectPage.page.locator('data-test-id=header.learn-more');
    await expect(title).toHaveText('En savoir plus');
    await expect(inspectPage.languagePicker()).toHaveText('Français');
  });

  test(`using the dropdown to switch the language to German displays the correct text`, async ({
    inspectPage,
  }) => {
    await expect(inspectPage.languagePicker()).toHaveText('English');
    await inspectPage.changeLanguageViaPicker('de-DE');
    const title = inspectPage.page.locator('data-test-id=header.learn-more');
    await expect(title).toHaveText('Weitere Infos');
    await expect(inspectPage.languagePicker()).toHaveText('Deutsch');
  });

  test(`using the dropdown to switch the language to Japanese displays the correct text`, async ({
    inspectPage,
  }) => {
    await expect(inspectPage.languagePicker()).toHaveText('English');
    await inspectPage.changeLanguageViaPicker('ja-JP');
    const title = inspectPage.page.locator('data-test-id=header.learn-more');
    await expect(title).toHaveText('詳細情報');
    await expect(inspectPage.languagePicker()).toHaveText('日本語');
  });

  test(`using the dropdown to switch the language persists after a reload`, async ({
    inspectPage,
  }) => {
    await inspectPage.changeLanguageViaPicker('fr-FR');
    const title = inspectPage.page.locator('data-test-id=header.learn-more');
    await inspectPage.page.reload();
    await expect(title).toHaveText('En savoir plus');
    await expect(inspectPage.languagePicker()).toHaveText('Français');
  });

  test(`setting the language from a query string works`, async ({ page }) => {
    await page.goto('/inspect?lang=de-DE');
    const title = page.locator('data-test-id=header.learn-more');
    await expect(title).toHaveText('Weitere Infos');
    await page.goto('/inspect?lang=en');
    await expect(title).toHaveText('Learn more');
  });
});
