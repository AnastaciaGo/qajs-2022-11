import Header from "../letcode/blocks/header";
import LoginPage from "./loginPage";

class MainPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this._btnLogin = page.locator("[href='/signin']");
  }

  async goto() {
    await this.page.goto("https://letcode.in/");
  }

  async clickLoginBtn() {
    await this._btnLogin.click();
    return new LoginPage(this.page);
  }
}

export default MainPage;
