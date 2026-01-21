# Module 2: Working with AI Agents

## What You'll Learn
- Understand the difference between chat and agent interactions
- Apply the 80/20 planning principle for one-shot execution
- Manage context windows effectively to avoid performance degradation

---

## What Are Agents?

Think of an agent as a junior developer who can read code, make changes across files, run tests, and fix issues—all autonomously.

| Chat | Agent |
|------|-------|
| Answers questions | Takes action |
| Single turn | Multi-step reasoning |
| Gives suggestions | Makes changes |

### Key Capabilities
- Read and understand code across multiple files
- Make changes autonomously
- Run tests and fix issues
- Reason through multi-step problems
- Validate and iterate

### Limitations

> [!WARNING]
> Agents make mistakes—always validate their output before committing.

- No memory between sessions
- Limited context window
- Work best with clear, specific instructions

---

## The Importance of Planning

The biggest mistake: jumping straight into coding without a plan.

> [!TIP]
> Spend 80% planning, 20% executing. A good plan enables one-shot solutions.

A good plan → one-shot solution. A bad plan → debugging loops and wasted tokens.

**If you can't one-shot it, fix the plan—not the code.**

### Why Planning Matters

| Benefit | Description |
|---------|-------------|
| **Scope clarity** | Know what success looks like before starting |
| **Risk identification** | Catch edge cases and gotchas early |
| **Token efficiency** | One good plan saves hundreds of wasted tokens |
| **One-shot execution** | Avoid re-planning mid-execution (the most common cause of failure) |

### Using Plan Mode

```bash
/plan Add user authentication with OAuth2
```

When you use `/plan`, Claude will:

1. **Explore** — Scan the codebase for relevant files
2. **Plan** — Create a step-by-step implementation plan
3. **Wait** — Pause for your approval before executing

> [!NOTE]
> Always review the plan—add constraints, correct misunderstandings, clarify edge cases.

### Best Practices

| ❌ Don't | ✅ Do |
|----------|-------|
| "Add a button" | "Add a 'Save Draft' button in the header that auto-saves every 30 seconds" |
| Skip context | Explain background, constraints, and what success looks like |
| Ask for everything at once | Break problems into sequential, focused tasks |
| Accept suggestions blindly | Ask "why" to catch errors in reasoning |

---

## Context Window Management

### The Problem

Models have lower performance when context becomes "noisy"—too much irrelevant information degrades reasoning.

> [!WARNING]
> For Claude models, performance degrades significantly around **50% of context window (~100k tokens)**—the "dumb zone" where the model struggles.

**Why It Happens:**
- Too much information increases noise-to-signal ratio
- Model attention gets diluted across irrelevant context
- Reasoning becomes less precise

### The Solution

Keep one context window focused on one task:

| Strategy | How to Apply |
|----------|--------------|
| **Use `/clear`** | Start fresh when switching tasks to prevent information bleed |
| **Use sub-agents** | Process and compress large amounts of information before passing to main agent |
| **Selective context** | Only load files/docs relevant to current task |
| **Separate concerns** | Documentation research, implementation, and testing in separate contexts |

### Example Workflow

```
Task: Implement date picker with date-fns

❌ Bad:  Load all date-fns docs + entire codebase + tests → implement
✅ Good: Sub-agent searches date-fns docs → returns key API summary
         Main agent implements with focused context
```

---

## Key Takeaways

| Concept | Remember |
|---------|----------|
| **Agents vs Chat** | Agents take action; chat gives suggestions |
| **Planning** | 80% planning, 20% executing—fix the plan, not the code |
| **Context** | One task per context window; use `/clear` between tasks |
| **Validation** | Always review agent output before committing |

---

## Exercise: Add localStorage Persistence

| | |
|---|---|
| **Goal** | Add persistence so todos survive page refreshes |
| **Concepts** | Agent prompting, iterative development, validation |

### Steps

1. Open Claude Code
   ```bash
   claude
   ```

2. Give Claude this prompt:
   ```
   Add localStorage persistence to the TODO app. When todos are added,
   completed, or deleted, save them to localStorage. When the app loads,
   restore todos from localStorage. Handle the case when localStorage is
   empty (first visit).
   ```

3. Review Claude's approach and let it implement

4. Test: Add todos, mark some complete, refresh the page

5. Verify todos persist with correct completed/incomplete states

6. Edge case test: Clear localStorage (DevTools → Application → Storage), refresh, verify empty list

### Acceptance Criteria
- [ ] Todos persist across page refreshes
- [ ] Completed/incomplete states are preserved
- [ ] Empty localStorage shows empty list (no errors)
- [ ] No console errors

---

← [Previous: Getting Started](1-getting-started.md) | [Next: Model Context Protocol →](3-model-context-protocol.md)
