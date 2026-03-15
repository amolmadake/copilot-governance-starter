# Copilot Governance Bootstrap

> **One prompt. Run once.** Generates all the rules your AI coding tools need — derived from your actual codebase.

Works with **GitHub Copilot, Claude Code, Cursor, and any AI tool** that reads Markdown files.

---

## The Problem

AI coding tools start fresh every session — they don't remember your team's rules:

| Problem | What happens | Impact |
|---|---|---|
| No shared rules | Same request → different code per developer | Rework, slower delivery |
| Wrong patterns | AI uses REST when project uses GraphQL | Output thrown away |
| No automated review | AI code merged without checks | Bugs reach production |
| Wasted tokens | All rules loaded every time | ~2,000 tokens wasted per session |
| Manual setup | 16+ config files maintained by hand | Time spent on rules, not features |
| Slow onboarding | Generic "install Node.js" guides | Hours lost on project setup |

---

## The Solution

Run one prompt → it reads your code → generates 16+ governance files automatically.

**How it works:**

```
1. You copy one prompt file into your repo
2. Run it in Copilot Chat
3. It scans your real code (source files, package.json, tests, config)
4. Generates 16+ files: agents, skills, prompts, instructions, architecture doc
5. Every developer on the team now gets consistent AI behaviour
```

| | Detail |
|---|---|
| **Cost** | Zero — one Markdown file, no infrastructure |
| **Risk** | Zero — source code is never touched, only creates new files |
| **Undo** | Delete the generated folders and you're back to normal |
| **vs. Copilot /init** | /init makes 1 file; this makes 16+ with multi-agent orchestration |

---

## Benefits — Before vs. After

| Area | ❌ Before | ✅ After | Example |
|---|---|---|---|
| **Token cost** | ~2,000 tokens/session | ~300 tokens/session | Rules load only when needed, not all at once |
| **Consistency** | Different output per developer | Same rules for everyone via Git | Update one file → whole team follows new convention |
| **Code review** | No automated checks | AI reviewer validates every code change | Catches architectural violations before merge |
| **Efficiency** | All agents run always | Smart skipping for simple tasks | "Fix typo" uses 1 agent; "Add feature" uses all 5 |
| **Onboarding** | Generic guides | `/setup` gives exact commands for your repo | New dev gets working environment in minutes |
| **Multi-stack** | Manual config per stack | Auto-detects any stack | Works for NestJS, Spring Boot, FastAPI, Go, .NET, React |

---

## What Gets Generated — 5 File Types

| Type | What it does | When it activates | Example |
|---|---|---|---|
| **Instructions** | Project-wide rules (thin overview) | Every session — automatic | "This is a NestJS + GraphQL API" |
| **Scoped Instructions** | Rules for specific file types | When editing matching files | Test rules load only when editing `*.spec.ts` |
| **Skills** | Deep knowledge packs (patterns, conventions) | On demand — when task matches | Coding conventions, test patterns, review checklist |
| **Prompts** | Slash commands for common workflows | When developer types the command | `/implement-feature`, `/setup`, `/refactor-code` |
| **Agents** | Specialist AI roles with specific permissions | When orchestrator delegates work | Coder (writes code), Tester (writes tests), Reviewer (validates) |

### All 16 generated files

| # | File | What it does |
|---|---|---|
| 1 | `copilot-instructions.md` | Thin project overview (~300 tokens, every session) |
| 2 | `coding-conventions.instructions.md` | Code rules — auto-loads for `*.ts` / `*.js` files |
| 3 | `testing.instructions.md` | Test rules — auto-loads for `*.spec.ts` files |
| 4 | `orchestrator.agent.md` | Coordinates other agents — never writes code itself |
| 5 | `planner.agent.md` | Breaks complex tasks into phases |
| 6 | `coder.agent.md` | Writes code following your repo's patterns |
| 7 | `tester.agent.md` | Writes tests using your test framework |
| 8 | `reviewer.agent.md` | Reviews code (read-only) — checks architecture + security |
| 9 | `implement-feature.prompt.md` | `/implement-feature` — full feature pipeline |
| 10 | `refactor-code.prompt.md` | `/refactor-code` — refactor + tests + review |
| 11 | `review-pull-request.prompt.md` | `/review-pull-request` — PR checklist |
| 12 | `setup.prompt.md` | `/setup` — exact setup commands for your repo |
| 13 | `coding-conventions/SKILL.md` | DI patterns, API rules, data access conventions |
| 14 | `testing/SKILL.md` | Mock patterns, test structure, coverage rules |
| 15 | `pr-review/SKILL.md` | Review checklist, security rules |
| 16 | `architecture.md` | Single source of truth — modules, patterns, dependencies, AI usage policy, governance file inventory |

---

## How Multi-Agent Orchestration Works

Instead of one AI doing everything, work is split across **5 specialist agents** — each with a specific role and limited permissions:

```
  Developer
      │
      ▼
  ┌──────────────┐
  │ Orchestrator  │  ← reads request + architecture, decides who to call
  └──────┬───────┘
         │
    ┌────┴──────────────────────────────┐
    │                                   │
    ▼                                   ▼
┌──────────┐                     (if > 2 files)
│ Simple?  │──── yes ───► Coder handles directly (inline plan)
│ (≤2 files│
│ docs/cfg)│
└────┬─────┘
     │ no
     ▼
┌──────────┐
│ Planner  │  ← breaks task into phases with file lists
└────┬─────┘
     │
     ▼  (for each phase, sequentially)
┌──────────┐    then    ┌──────────┐
│  Coder   │  ────────► │  Tester  │  ← agents run one at a time per phase
└────┬─────┘            └────┬─────┘
     │                       │
     └──────────┬────────────┘
                ▼  (after all coding phases complete)
         ┌──────────┐
         │ Reviewer  │  ← read-only, validates architecture + security
         └────┬─────┘
              │
              ▼
         Result back to Developer
```

### What each agent does

| Agent | Role | Permissions | Key rule |
|---|---|---|---|
| **Orchestrator** | Reads request, decides which agents to call | Read + delegate | Never writes code itself |
| **Planner** | Breaks complex tasks into phases with file lists | Read only | Skipped if ≤ 2 files affected |
| **Coder** | Writes code following your repo's conventions | Read + write + run commands | Cannot delegate to other agents |
| **Tester** | Writes tests using your detected test framework | Read + write + run commands | Cannot delegate to other agents |
| **Reviewer** | Validates architecture, conventions, security | Read only | **Never skipped** for code changes |

### Why this matters

| Benefit | Explanation |
|---|---|
| **Least privilege** | Reviewer can't edit code; Coder can't delegate — limits blast radius |
| **Cost savings** | Simple tasks skip agents — "fix typo" uses 1 agent instead of 5 |
| **Safety** | Reviewer always runs for code — catches violations the Coder might miss |
| **Phased work** | Non-overlapping files are grouped into phases — executed sequentially, one agent at a time |
| **Isolation** | Each agent runs in its own context — can't see other agents' conversations |

### Example walkthrough

**Developer types:** `/implement-feature Add a "priority" field to items`

| Phase | What happens |
|---|---|
| **Assess** | Orchestrator reads request + `architecture.md` → sees > 2 files affected → calls Planner |
| **Plan** | Planner outputs: Phase 1 (schema + DTO), Phase 2 (service + resolver), Phase 3 (tests) |
| **Phase 1** | Coder adds `priority` to `item.schema.ts` + `create-item.input.ts` → Tester skipped (no tests yet) |
| **Phase 2** | Coder updates `items.service.ts` + `items.resolver.ts` → Tester skipped (tests in Phase 3) |
| **Phase 3** | Tester writes `items.service.spec.ts` + `items.resolver.spec.ts` |
| **Review** | Reviewer checks: correct pattern (Resolver → Service → Model)? Tests cover new field? No security issues? |
| **Done** | Orchestrator returns summary to developer |

### What happens when something goes wrong

| Failure | What the Orchestrator does |
|---|---|
| **Coder fails** | Stops the current phase immediately, reports to developer |
| **Tester fails** | Logs a warning, continues to Reviewer (Reviewer will flag missing tests) |
| **Planner fails** | Falls back to Coder making its own plan |
| **Reviewer fails** | Defaults to "manual review required" |
| **Any agent times out** | Reports which agent timed out, lets developer decide next step |

---

## How It Flows

When a developer types `/implement-feature Add pagination to items`, this happens:

| Step | Who | What | Can be skipped? |
|---|---|---|---|
| 1 | **Orchestrator** | Reads the request, checks architecture, counts files | No |
| 2 | **Planner** | Breaks work into phases (e.g., Phase 1: schema, Phase 2: API, Phase 3: tests) | Yes — if ≤ 2 files |
| 3 | **Coder** | Writes code following your repo's patterns | Yes — if docs-only or config-only change |
| 4 | **Tester** | Writes tests using your test framework | Yes — if docs-only or config-only change |
| 5 | **Reviewer** | Validates architecture + security (read-only) | **Never** skipped for code |

**Smart skipping examples:**

| Request | Agents used | Why |
|---|---|---|
| "Fix typo in README" | Orchestrator only (1 agent) | Docs-only, 1 file |
| "Update cron schedule" | Orchestrator only (1 agent) | Config-only change, Coder+Tester skipped |
| "Rename a variable" | Orchestrator + Coder + Reviewer (3 agents) | Code change, ≤ 2 files, skip Planner |
| "Add pagination feature" | All 5 agents | > 2 files, full pipeline |

---

## Folder Structure — Before and After

**Before** (your existing repo — nothing changes here):

```
your-repo/
├── src/             ← your source code
├── test/            ← your tests
├── package.json
└── README.md
```

**After** (new governance layer added alongside — source code untouched):

```
your-repo/
├── src/                          ← UNCHANGED
├── test/                         ← UNCHANGED
├── package.json                  ← UNCHANGED
├── README.md                     ← UNCHANGED
│
├── docs/
│   ├── copilot/
│   │   └── bootstrap-copilot-instructions.prompt.md   ← the prompt you copied
│   └── architecture.md           ← NEW — generated architecture doc
│
└── .github/                      ← NEW — all governance files
    ├── copilot-instructions.md   ← project overview (loaded every session)
    ├── agents/                   ← 5 specialist agents
    ├── instructions/             ← 2 scoped rule files
    ├── prompts/                  ← 4 slash commands
    └── skills/                   ← 3 knowledge packs

> `.gitattributes` may also be created or appended with `diff=markdown` entries for governance files.
```

---

## Security — Agent Permissions

| Agent | Can read | Can write | Can delegate | Can run commands |
|---|---|---|---|---|
| **Orchestrator** | ✅ | ❌ | ✅ | ❌ |
| **Planner** | ✅ | ❌ | ❌ | ❌ |
| **Coder** | ✅ | ✅ | ❌ | ✅ |
| **Tester** | ✅ | ✅ | ❌ | ✅ |
| **Reviewer** | ✅ | ❌ | ❌ | ❌ |

Key: Reviewer can **never** edit code. Coder can **never** delegate. Orchestrator can **never** write files.

---

## Works With Any Stack

| Stack | What gets detected | What gets generated |
|---|---|---|
| **NestJS + GraphQL** | TypeScript, NestJS, MongoDB/Mongoose, Redis cache, Jest, Nx | Resolver → Service → Model patterns, cache-aside with Redis, fluent query chains, mock conventions |
| **Spring Boot** | Java, Spring Boot, PostgreSQL, JUnit, Maven/Gradle | Controller → Service → Repository patterns |
| **FastAPI** | Python, FastAPI, SQLAlchemy, pytest | Router → Service → Repository patterns |
| **Go / Gin** | Go, Gin, GORM, Go testing | Handler → Service → Repository patterns |
| **.NET** | C#, ASP.NET Core, EF Core, xUnit | Controller → Service → DbContext patterns |
| **React / Next.js** | TypeScript, React, Next.js, Vitest/Jest | Component → Hook → API client patterns |
| **Kafka / Messaging** | Kafka/RabbitMQ/SQS client libs, consumer groups, producers | Consumer/producer patterns, DLQ handling, schema validation |
| **Monorepo** | Nx / Turborepo / pnpm workspaces | Per-app boundaries, cross-app rules |

---

## Getting Started

| Step | What to do |
|---|---|
| 1 | Copy `bootstrap-copilot-instructions.prompt.md` into your repo at `docs/copilot/` |
| 2 | Open Copilot Chat (Agent mode) → type `Run docs/copilot/bootstrap-copilot-instructions.prompt.md` |
| 3 | Review the 16+ generated files, commit them |

**Requirements:** VS Code + GitHub Copilot with Agent mode enabled.

**Re-running:** Safe at any time. Auto-generated files get refreshed. Manually edited files are preserved. A changelog row is appended to `architecture.md` on each re-run for traceability.

---

## Adoption & Maintenance

| Aspect | Detail |
|---|---|
| **Deploy** | One file committed to the repo |
| **Infrastructure** | None |
| **Effort** | One developer, one run |
| **Rollback** | Delete generated folders (file list is in the governance inventory section of `architecture.md`) |
| **Day-to-day** | Nothing — governance is stable |
| **Convention change** | Edit the relevant skill file |
| **New module / migration** | Re-run the bootstrap (in a new Copilot Chat session) |

---

## Cleanup

Delete all generated files (source code is never affected):

```bash
rm -f docs/architecture.md .github/copilot-instructions.md
rm -rf .github/agents/ .github/prompts/ .github/skills/ .github/instructions/
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Agents don't appear in picker | Ensure files are in `.github/agents/`, reload VS Code. Check VS Code version ≥ 1.100 |
| `/commands` don't work | Ensure files are in `.github/prompts/`, reload. Only `.prompt.md` files are slash-invocable |
| Skills not found | Folder name must exactly match `name` in SKILL.md frontmatter (case-sensitive) |
| Can't delegate to subagents | Add `agent` to Orchestrator's `tools` list and verify `agents` allowlist includes subagent names |
| Subagents invoked directly | Verify subagent files have `user-invocable: false` and `disable-model-invocation: true` |
| Model not available | Open model dropdown in Copilot Chat, verify the model ID in agent frontmatter is available |
| Bootstrap loses coherence mid-run | Context window likely exhausted — use a model with ≥ 200k context. The prompt outputs a structured partial summary you can resume from in a new session |
| `/setup` tries to edit files | Verify `tools: [codebase]` is the only tools entry and `agent` key is absent from setup.prompt.md |
| Generated files not in git | Check `.gitignore` doesn't exclude `.github/` |
| Re-run overwrites manual edits | Manually edited files (no provenance comment) are preserved. If overwritten, the file had a provenance comment |

---

## Further Reading

- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)

---

## License

MIT
