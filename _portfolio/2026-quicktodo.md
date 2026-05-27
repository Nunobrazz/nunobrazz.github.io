---
title: "QuickTodo — Instant Capture TODO App"
excerpt: "A local TODO app with a system-wide capture shortcut — select any text, hit Cmd+Option+L, and it lands in on the list."
collection: portfolio
date: 2026-05-01
project_category: "Custom Tools"
github_url: "https://github.com/Nunobrazz/QuickTodo"
---

A local TODO app built around the idea that capturing things should be as fast as copy-paste. Using a Hammerspoon shortcut (`Cmd+Option+L`), you can select any text in any app — a URL, a Slack message, a line of code — and it goes straight into your TODO list. No context switching, no opening a browser tab, no friction.

Everything runs locally. 

### How the Capture Works

1. Select text anywhere on your Mac
2. Press `Cmd+Option+L`
3. Hammerspoon copies the selection and pipes it into QuickTodo
4. A notification confirms the task was added — you never leave what you were doing

### Features

- System-wide capture shortcut via Hammerspoon
- Clean, minimal interface
- Categories with color coding
- Filter tasks by category
- Links attached to tasks (captured automatically from browser on macOS)
- Runs 100% locally — your data stays on your machine
