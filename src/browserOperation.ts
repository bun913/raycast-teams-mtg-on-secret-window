import * as playwright from "playwright";

export interface BrowserOperationArgs {
  browser: playwright.Browser;
  context: playwright.BrowserContext;
  page: playwright.Page;
  teamsUrl: string;
}

export class BrowserOperation {
  private readonly teamsUrl: string;
  private browser: playwright.Browser;
  private context: playwright.BrowserContext;
  private page: playwright.Page;
  YOUR_NAME = "ここにあなたの名前を入れてください";

  constructor({ teamsUrl, browser, context, page }: BrowserOperationArgs) {
    this.teamsUrl = this.toggleMsLaunchParameterNeeded(teamsUrl);
    this.browser = browser;
    this.context = context;
    this.page = page;
  }

  private toggleMsLaunchParameterNeeded(urlString: string): string {
    const url = new URL(urlString);
    if (url.searchParams.has("msLaunch")) {
      url.searchParams.delete("msLaunch");
    }
    url.searchParams.set("msLaunch", "false");
    return url.href;
  }

  async openAndFillTeamsWindow() {
    // TeamsのURLを開く
    await this.page.goto(this.teamsUrl);
    // 「このブラウザーから会議に参加します」をクリック
    const buttonSelector = 'button[data-tid="joinOnWeb"]';
    await this.page.waitForSelector(buttonSelector);
    await this.page.click(buttonSelector);
    // 名前を入力する
    const nameInputSelector = 'input[data-tid="prejoin-display-name-input"]';
    await this.page.waitForSelector(nameInputSelector);
    await this.page.fill(nameInputSelector, this.YOUR_NAME);
    // 背景の設定をクリック
    const backgroundSettingSelector =
      'button[data-tid="button-custom-video-backgrounds"]';
    await this.page.waitForSelector(backgroundSettingSelector);
    await this.page.click(backgroundSettingSelector);
    // 背景をぼかすボタンをクリック
    const blurBackgroundSelector = "button[data-tid='background-effect-blur']";
    await this.page.waitForSelector(blurBackgroundSelector);
    await this.page.click(blurBackgroundSelector);
  }
}
