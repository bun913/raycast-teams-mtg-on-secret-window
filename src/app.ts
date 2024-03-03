import { z } from "zod";
import { BrowserOperation } from "./browserOperation";
import * as playwright from "playwright";

const main = async () => {
  // temasURLをコマンドライン引数から取得
  const teamsUrl = process.argv[2];
  // validation
  try {
    z.string().url().parse(teamsUrl);
  } catch (e) {
    console.log("Invalid URL")
    process.exit(1);
  }
  const browser = await playwright.chromium.launch({
    channel: "chrome",
    headless: false,
    timeout: 0,
  });
  const context = await browser.newContext({
    permissions: ["microphone", "camera"],
  });
  const page = await context.newPage();
  page.setDefaultTimeout(0);
  const browserOperation = new BrowserOperation({
    teamsUrl: teamsUrl,
    page,
  });
  await browserOperation.openAndFillTeamsWindow();
  browser.on("disconnected", () => {
    // 正常終了する
    process.exit(0);
  });
};

if (require.main === module) {
  main();
}
