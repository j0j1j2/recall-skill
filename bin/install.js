#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_NAME = "recall.md";
const SOURCE = path.join(__dirname, "..", "commands", COMMAND_NAME);
const TARGET_DIR = path.join(os.homedir(), ".claude", "commands");
const TARGET = path.join(TARGET_DIR, COMMAND_NAME);

const installed = fs.existsSync(TARGET);

async function main() {
  // Non-interactive mode
  const args = process.argv.slice(2);
  if (args.includes("--yes") || args.includes("-y")) {
    install();
    return;
  }
  if (args.includes("remove") || args.includes("uninstall")) {
    remove();
    return;
  }

  p.intro(pc.bgCyan(pc.black(" recall-skill ")));

  p.note(
    installed
      ? `${pc.green("●")} /recall 커맨드가 설치되어 있습니다.`
      : `${pc.dim("○")} /recall 커맨드가 설치되어 있지 않습니다.`,
    "상태"
  );

  const choices = installed
    ? [
        { value: "reinstall", label: "재설치", hint: "최신 버전으로 업데이트" },
        { value: "remove", label: "삭제", hint: "/recall 커맨드 제거" },
      ]
    : [{ value: "install", label: "설치", hint: "/recall 커맨드 설치" }];

  const action = await p.select({
    message: "무엇을 할까요?",
    options: choices,
  });

  if (p.isCancel(action)) {
    p.cancel("취소되었습니다.");
    process.exit(0);
  }

  if (action === "install" || action === "reinstall") {
    install();
  } else if (action === "remove") {
    const confirmed = await p.confirm({
      message: "정말 /recall 커맨드를 삭제할까요?",
    });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("취소되었습니다.");
      process.exit(0);
    }
    remove();
  }

  p.note(
    [
      `${pc.cyan("/recall 어제")}        — 어제 뭐 했는지`,
      `${pc.cyan("/recall 지난주")}      — 지난주 작업 요약`,
      `${pc.cyan("/recall 최근 3일")}    — 최근 3일간 기록`,
      `${pc.cyan("/recall 3월 20일")}    — 특정 날짜 조회`,
    ].join("\n"),
    "사용법"
  );

  p.outro(pc.dim("Claude Code에서 /recall 을 사용해보세요!"));
}

function install() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }
  fs.copyFileSync(SOURCE, TARGET);
  p.log.success("/recall 커맨드가 설치되었습니다.");
}

function remove() {
  if (fs.existsSync(TARGET)) {
    fs.unlinkSync(TARGET);
    p.log.success("/recall 커맨드가 삭제되었습니다.");
  } else {
    p.log.warn("이미 삭제되어 있습니다.");
  }
}

main().catch(console.error);
