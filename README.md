# FocusFlow — Product Brief

> **Product promise:** Know what to focus on next, at a pace that fits your actual energy and time.

## 1. Product definition

FocusFlow is a calm, adaptive daily-planning workspace for people who have too many tasks and too little attention. It helps users translate a task backlog into a realistic plan based on available time, task importance, deadlines, and current energy. It then carries the user from planning into a focused work session and a short end-of-day reflection.

FocusFlow is not another all-in-one project-management suite. It is a small decision-support tool whose central job is to reduce the friction between **“I have a lot to do”** and **“I know what to do next.”**

## 2. Primary audience

- Students balancing coursework, projects, and personal responsibilities.
- Designers, freelancers, and solo professionals moving between creative and administrative tasks.
- Knowledge workers who want structure without a heavy project-management process.
- People who prefer a humane, realistic plan over an aggressive productivity streak system.

### Primary user need

“When I sit down to work, help me choose a realistic next task and make it easier to begin.”

## 3. Problem statement

Most task apps help users capture work but leave the hardest daily decisions to the user: what matters most, what fits the time available, and what is reasonable given today's energy. Static lists create guilt and decision fatigue when plans are unrealistic or energy changes.

## 4. The FocusFlow loop

1. **Check in:** The user chooses an energy level and how much time they have.
2. **Plan:** FocusFlow proposes a short, ordered set of tasks. The user can accept, reorder, skip, or replace suggestions.
3. **Focus:** The user starts one task in a distraction-light timer view.
4. **Complete:** The user marks work done or records that it remains unfinished.
5. **Reflect:** The user reviews the day and carries unfinished tasks forward intentionally.

This loop must work with local sample data. It must not require an account, API key, or AI service to demonstrate the core value.

## 5. Product principles

### Humane over hustle
No shaming language, red-alert overload, punitive streaks, or claims that the user is “behind in life.” Use supportive, neutral language such as “Move to tomorrow” and “Your plan can change.”

### Show the next step
The interface should make the next recommended action obvious within a few seconds. Keep the dashboard hierarchy decisive, not a wall of same-sized cards.

### Adapt, do not dictate
Recommendations are suggestions. Users can reorder, skip, edit, and complete tasks at any time. Explain why a task is recommended when useful.

### Real functionality over decorative UI
Every primary control must work. Charts and stats must derive from application data; avoid fake buttons, fake integrations, and decorative metrics that do not update.

### Calm, not empty
Use whitespace and low-noise surfaces, but still provide clear structure, helpful labels, progress, and affordances. “Minimal” must not mean vague or unfinished.

## 6. Scope for the first release

### Must ship
- Responsive application shell with navigation.
- Energy and available-time check-in.
- Task creation, editing, deletion, completion, priority, estimated duration, and optional deadline.
- Deterministic daily-plan suggestions using task data, energy, priorities, deadlines, and available time.
- Functional focus timer with start, pause, resume, reset/end, and session completion.
- Daily and weekly progress computed from locally stored sessions and completed tasks.
- End-of-day reflection.
- Local persistence across refreshes.
- Seeded demo data and a clear way to reset the demo.
- Useful empty states, validation, keyboard access, and mobile layouts.

### Could ship if the core is already stable
- Dark theme.
- Editable focus duration presets.
- Simple weekly chart.
- Export local data as JSON.

### Explicitly out of scope for the MVP
- Blockchain, tokens, NFTs, wallets, or smart contracts.
- Authentication, teams, collaborative planning, and a cloud database.
- Calendar/email integrations.
- Paid subscriptions or billing.
- An AI API call as a requirement for core planning.
- Social leaderboards, public profiles, or punitive streak mechanics.

**Blockchain note:** Devfolio is a hackathon platform, and use of blockchain depends on the specific event or prize-track rules. Do not add blockchain merely because the platform is associated with Web3 events. If an exact event rubric later requires an on-chain element, treat that as a separate, clearly scoped extension; do not compromise the core UX by adding speculative crypto mechanics.

## 7. Product differentiator: “Your day, at an honest pace”

FocusFlow should feel different from a generic task dashboard. The distinguishing experience is the moment when the app combines energy + available time + deadlines into an achievable plan. Use a short explanation such as “A 25-minute task first: you have 45 minutes and selected low energy.” Never present the plan as an authoritative or medical judgement.

## 8. Demo story (about 90 seconds)

1. Open the Overview and see a thoughtful, populated day rather than an empty template.
2. Set energy to “Low” and available time to “45 minutes.”
3. Click “Build my plan” and see the order update, with short tasks surfaced first.
4. Add a task named “Refine landing page hero,” choose High priority, set 30 minutes, then save it.
5. Start a focus session, pause it, resume it, and complete it.
6. Show that session time and task status update the progress summary.
7. Refresh the page to prove local persistence.
8. Finish on the reflection screen and show how unfinished work can be moved to tomorrow.

## 9. Success criteria

A first-time user should be able to:
- Understand the app's purpose without a tutorial.
- Add a task in under 20 seconds.
- generate a daily plan in one short interaction.
- Start a focus session from a suggested task.
- Finish or pause a session without losing timer state.
- Refresh the browser without losing their tasks and preferences.
- Use the primary flow with keyboard navigation and at 360px viewport width.

## 10. Product voice

Clear, warm, concise, non-judgmental. Use sentences that sound human and specific. Examples:
- “Let's make a plan that fits today.”
- “Start small. Build momentum.”
- “You have 45 minutes. Keep the first step simple.”
- “Not finished yet? Move it forward without losing your place.”

Avoid: “Crush your goals,” “Dominate your day,” “You failed your streak,” “AI-powered productivity revolution,” and generic marketing filler.
