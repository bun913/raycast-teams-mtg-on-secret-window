#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Teams on Secret
// @raycast.mode fullOutput

// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "Teams会議のURLを入力" }
// @raycast.packageName TeamsOnSecret

// Documentation:
// @raycast.description Teamsを開く時に名前入力と背景ぼかしを自動で入力
// @raycast.author bun913
const { writeFileSync, existsSync, readFileSync } = require("fs");
const { spawn } = require("child_process");

// 既にpidファイルがあればプロセスをkillする
if (existsSync("teams-on-secret.pid")) {
  try {
    process.kill(parseInt(readFileSync("teams-on-secret.pid", "utf-8")));
  } catch (e) {
    console.log("以前のプロセスが見つかりませんでした");
  }
}

const url = process.argv.slice(2)[0];
const child = spawn("node", ["dist/app.js", url], { detached: true });
child.unref();

// pidを取得して、teams-on-secret.pidファイルとして出力する
const pid = child.pid;
writeFileSync("teams-on-secret.pid", pid.toString());
