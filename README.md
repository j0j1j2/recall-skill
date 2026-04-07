# recall-skill

A Claude Code slash command that lets you look back at your work history using natural language.

## Install

```bash
npx recall-skill
```

## Uninstall

```bash
npx recall-skill remove
```

## Usage

In Claude Code:

```
/recall yesterday
/recall last week
/recall March 20
/recall last 3 days
```

Reads `~/.claude/history.jsonl` and summarizes what you worked on during that period.

Responds in the language you use most — if your history is in Korean, the summary will be in Korean. If in English, English.

## License

MIT
