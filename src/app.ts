import { z } from "zod";
import { BrowserOperation } from "./browserOperation";
import * as playwright from "playwright";

export const main = async () => {
  // temasURLをコマンドライン引数から取得
  const teamsUrl = process.argv[2];
  // validation
  try {
    z.string().url().parse(teamsUrl);
  } catch (e) {
    process.exit(1);
  }
  const browser = await playwright.chromium.connectOverCDP({
    endpointURL: "http://localhost:9222"
  })
  const context = browser.contexts()[0];
  await context.grantPermissions(["microphone", "camera"]);
  const page = context.pages()[0];
  // const page = await context.newPage();
  page.setDefaultTimeout(0);
  const browserOperation = new BrowserOperation({
    teamsUrl: teamsUrl,
    browser,
    context,
    page,
  });
  await browserOperation.openAndFillTeamsWindow();
};
