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
      ? `${pc.green("●")} /recall command is installed.`
      : `${pc.dim("○")} /recall command is not installed.`,
    "Status"
  );

  const choices = installed
    ? [
        { value: "reinstall", label: "Reinstall", hint: "Update to latest version" },
        { value: "remove", label: "Remove", hint: "Uninstall /recall command" },
      ]
    : [{ value: "install", label: "Install", hint: "Install /recall command" }];

  const action = await p.select({
    message: "What would you like to do?",
    options: choices,
  });

  if (p.isCancel(action)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  if (action === "install" || action === "reinstall") {
    install();
  } else if (action === "remove") {
    const confirmed = await p.confirm({
      message: "Are you sure you want to remove the /recall command?",
    });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    remove();
  }

  p.note(
    [
      `${pc.cyan("/recall yesterday")}      — what you did yesterday`,
      `${pc.cyan("/recall last week")}      — last week's summary`,
      `${pc.cyan("/recall last 3 days")}    — recent 3 days`,
      `${pc.cyan("/recall March 20")}       — specific date`,
    ].join("\n"),
    "Usage"
  );

  p.outro(pc.dim("Try /recall in Claude Code!"));
}

function install() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }
  fs.copyFileSync(SOURCE, TARGET);
  p.log.success("/recall command installed.");
}

function remove() {
  if (fs.existsSync(TARGET)) {
    fs.unlinkSync(TARGET);
    p.log.success("/recall command removed.");
  } else {
    p.log.warn("Already removed.");
  }
}

main().catch(console.error);
