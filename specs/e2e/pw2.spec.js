import LoginPage from "../../pages/letcode/loginPage";
import MainPage from "../../pages/letcode/mainPage";
import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import config from "../../config";

test.describe("Login page tests", () => {
  test("Successfull log in test", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const loginPage = await mainPage.clickLoginBtn();
    await loginPage.login();
    expect(loginPage.page.locator("[role='alertdialog']")).toBeVisible();
    expect(loginPage.page.locator("[role='alertdialog']")).toHaveText(
      `Welcome ${config.credentials.userName}`,
    );
  });
  test("Login without creds", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const loginPage = await mainPage.clickLoginBtn();
    await loginPage.clickLogin();
    expect(loginPage.page.locator("[role='alertdialog']")).toBeVisible();
    expect(loginPage.page.locator("[role='alertdialog']")).toHaveText(
      "Error: The email address is badly formatted.",
    );
  });
  test("Login by non-existent user", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const loginPage = await mainPage.clickLoginBtn();
    await loginPage.login(faker.internet.email(), faker.internet.password());
    expect(loginPage.page.locator("[role='alertdialog']")).toBeVisible();
    expect(loginPage.page.locator("[role='alertdialog']")).toHaveText(
      "Error: There is no user record corresponding to this identifier. The user may have been deleted.",
    );
  });
});

test.describe("Forgot password tests", () => {
  test("Renewal password with wrong format email", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const loginPage = await mainPage.clickLoginBtn();
    await loginPage.clickForgotPassword();
    await loginPage.resetPassword(faker.string.alpha(7));
    expect(
      loginPage.page.locator("[class='notification is-danger']"),
    ).toBeVisible();
    expect(
      loginPage.page.locator("[class='notification is-danger']"),
    ).toHaveText("Error: The email address is badly formatted.");
  });
  test("Reset password with non-existent email", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const loginPage = await mainPage.clickLoginBtn();
    await loginPage.clickForgotPassword();
    await loginPage.resetPassword(faker.internet.email());
    await loginPage.page.waitForTimeout(2000);
    expect(
      loginPage.page.locator("[class='notification is-danger']"),
    ).toBeVisible();
    expect(
      loginPage.page.locator("[class='notification is-danger']"),
    ).toHaveText(
      "Error: There is no user record corresponding to this identifier. The user may have been deleted.",
    );
  });
});
