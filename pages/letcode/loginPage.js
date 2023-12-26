import config from "../../config";

class LoginPage {
  constructor(page) {
    this.page = page;
    this._fieldEmail = page.locator("[name=email]");
    this._fieldPassword = page.locator("[type=password]");
    this._btnLogin = page.locator("//button[text()='LOGIN']");
    this._btnForgottenPassword = page.locator("//button[contains(text(), 'password')]");
    this._fieldForgottenPassword = page.locator("[name='fgEmail']");
    this._btnResetPassword = page.locator("//button[text()='RESET']");
  }

  async fillEmail(email) {
    await this._fieldEmail.fill(email);
  }

  async fillPassword(password) {
    await this._fieldPassword.fill(password);
  }

  async clickLogin() {
    await this._btnLogin.click();
  }

  async login(email = config.email, password = config.credentials.password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.page.waitForTimeout(2000);
  }

  async clickForgotPassword() {
    await this._btnForgottenPassword.click();
  }

  async resetPassword(email = config.email) {
    await this._fieldForgottenPassword.fill(email);
    await this._btnResetPassword.click();
  }
}

export default LoginPage;
