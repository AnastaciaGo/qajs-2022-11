import LoginPage from "../loginPage";

class Header {
  constructor(page) {
    this.page = page;
    this.root = page.locator("#navbar-menu");
    this._btnLogin = page.locator("[href='/signin']");
  }

  async clickLoginBtn() {
    await this._btnLogin.click();
    return new LoginPage(this.page);
  }
}

export default Header;
