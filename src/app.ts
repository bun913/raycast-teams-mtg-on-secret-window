import { BrowserOperation } from "./browserOperation";
import * as playwright from "playwright";

const main = async () => {
  // temasURLをコマンドライン引数から取得
  const teamsUrl = process.argv[2];
  const browser = await playwright.chromium.launch({
    channel: "chrome",
    headless: false,
  });
  const context = await browser.newContext({
    permissions: ["microphone", "camera"],
  });
  const page = await context.newPage();
  const browserOperation = new BrowserOperation({
    teamsUrl: teamsUrl,
    browser,
    context,
    page,
  });
  await browserOperation.openAndFillTeamsWindow();
  browser.on("disconnected", () => {
    // 正常終了する
    process.exit(0);
  })
};

if (require.main === module) {
  main();
}
