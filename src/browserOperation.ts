import * as playwright from "playwright";

export interface BrowserOperationArgs {
  page: playwright.Page;
  teamsUrl: string;
}

export class BrowserOperation {
  private readonly teamsUrl: string;
  private page: playwright.Page;
  YOUR_NAME = "ここにあなたの名前を入れてください";

  constructor({ teamsUrl, page }: BrowserOperationArgs) {
    this.teamsUrl = this.toggleMsLaunchParameterNeeded(teamsUrl);
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
    // 所定のURLに遷移するまで待つ
    // TeamsのURLを開く
    await this.page.goto(this.teamsUrl);
    if (this.teamsUrl.startsWith("https://teams.microsoft.com/dl/") === false) {
      // https://teams.microsoft.com/dl/まで遷移するまで待つ
      await this.page.goto(this.teamsUrl);
      await this.page.waitForLoadState("networkidle");
      const dlUrl = this.toggleMsLaunchParameterNeeded(this.page.url());
      // プロンプトが表示されないようにパラメーターを変更して再度遷移する
      await this.page.goto("about:blank");
      await this.page.goto(dlUrl);
    }
    // 「このブラウザーから会議に参加します」をクリック
    const buttonSelector = 'button[data-tid="joinOnWeb"]';
    await this.page.waitForSelector(buttonSelector);
    await this.page.click(buttonSelector);
    // 名前を入力する
    const nameInputSelector = 'input[data-tid="prejoin-display-name-input"]';
    await this.page.waitForSelector(nameInputSelector);
    await this.page.fill(nameInputSelector, this.YOUR_NAME);
    // ビデオを表示する設定がオフの場合、ビデオを表示する
    const videoSettingSelector = 'div[data-tid="toggle-video"]';
    await this.page.waitForSelector(videoSettingSelector);
    // チェックが入っていない場合はチェックを入れる
    if (
      (await this.page.getAttribute(videoSettingSelector, "aria-checked")) ===
      "false"
    ) {
      await this.page.click(videoSettingSelector);
    }
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
