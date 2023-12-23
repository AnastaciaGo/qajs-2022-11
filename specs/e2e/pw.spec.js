import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import config from "../../config";

test("Check radio-button page", async ({ page }) => {
  await page.goto("/radio-button");
  await page.locator(`//*[@for='impressiveRadio']`).click();
  await expect(page.locator(`//span[@class='text-success']`)).toHaveText(
    "Impressive",
  );
});

test.describe('Check text-box" page', () => {
  test("Submit data success", async ({ page }) => {
    const testData = {
      name: faker.string.alpha(5),
      email: faker.internet.email(),
      currentAddress: faker.string.alpha(10),
      permanentAddress: faker.string.alpha(10),
    };
    await page.goto("/text-box");
    await page.locator(`input[id*=Name]`).fill(testData.name);
    await page.locator(`input[id*=Email]`).fill(testData.email);
    await page
      .locator(`textarea[id*=currentAddress]`)
      .fill(testData.currentAddress);
    await page
      .locator(`textarea[id*=permanentAddress]`)
      .fill(testData.permanentAddress);
    await page.locator(`#submit`).click();
    await expect(page.locator(`#output`)).toBeVisible();
    for (let key in testData) {
      await expect(page.locator(`p[id*=${key}]`)).toContainText(testData[key]);
    }
  });
  test("Email validation error", async ({ page }) => {
    await page.goto("/text-box");
    await page.locator(`input[id=userEmail]`).fill(faker.string.alpha(6));
    await page.locator(`#submit`).click();
    await expect(page.locator(`input[id=userEmail]`)).toHaveClass(
      /field-error/,
    );
  });
});

test.describe("Check login page", () => {
  test("Authorization success", async ({ page }) => {
    await page.goto("/login");
    for (let key in config.credentials) {
      await page.locator(`#${key}`).fill(config.credentials[key]);
    }
    await page.locator("#login").click();
    await page.waitForResponse(
      (response) =>
        response.url() === "https://demoqa.com/Account/v1/Login" &&
        response.status() === 200,
    );
    await expect(page.locator("#userName-value")).toHaveText(
      config.credentials.userName,
    );
  });
  test("Authorisation failed", async ({ page }) => {
    await page.goto("/login");
    await page.locator(`#userName`).fill(config.credentials.userName);
    await page.locator(`#password`).fill(faker.string.alpha(5));
    await page.locator("#login").click();
    await expect(
      page.locator(`//p[contains(text(),'Invalid username or password!')]`),
    ).toBeVisible();
  });
});
