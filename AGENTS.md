# WB_Game_Mobile — Codex Project Instructions

## 1. Project Purpose

`WB_Game_Mobile` is a long-term high-fidelity interactive prototype project for the WillBet Casino / Game product. Its primary purpose is product design exploration, high-fidelity UI prototyping, interaction demonstrations, internal product reviews, and sharing prototypes through GitHub Pages. This is a prototype project, not a production frontend application. Prioritize realistic product experience and presentation quality while keeping code reasonably clean and maintainable for future iterations.

## 2. Core Technology

Default stack: HTML, CSS, and Vanilla JavaScript. Do not introduce React, Vue, Next.js, backend services, databases, build systems, or large JavaScript frameworks unless explicitly requested or clearly necessary. Prefer native browser capabilities. Avoid third-party libraries; a lightweight stable CDN library may be used only when it has a clear native-implementation advantage. Do not add dependencies merely for engineering elegance.

## 3. Mobile First

Mobile H5 first. Primary baseline: 375px width; maintain reasonable compatibility from 360px–430px. Unless explicitly requested, do not create a separate Desktop layout, expand into Tablet/Desktop layouts, or redesign desktop-first. On desktop, keep the Mobile H5 interface centered rather than stretched. 375px is the primary review viewport.

## 4. Design Direction

WillBet Casino defaults: Dark, Deep Navy, WillBet Purple, controlled Neon Purple/Cyan, premium, modern, refined, and high information density without clutter. Avoid excessive neon glow, continuous breathing effects, infinite flashing, excessive gradients, over-designed gaming effects, and decorative elements that reduce discovery efficiency. Game content and product information remain visual priority.

## 5. Design Reference Priority

When references conflict: 1) explicit product/business requirements; 2) newest user wireframe/prototype; 3) existing WillBet visual language; 4) competitors such as Stake. Competitors are references only: do not copy their branding, colors, logos, navigation, or product identity. Use their screenshots for patterns, density, usability, and interaction ideas only.

## 6. Evolution Over Redesign

Unless explicitly requested, prefer incremental improvement over full redesign. For a request such as “Optimize VIP Lounge”, preserve page design system, unrelated sections, navigation, and overall information architecture; modify only the relevant component. Do not interpret localized optimization as permission to redesign the whole page.

## 7. Minimum Change Principle

For small tasks, make the smallest reasonable change required. Do not broadly refactor because existing code could be cleaner. If a serious architecture problem is discovered, explain it; do not refactor unrelated code unless genuinely required.

## 8. Unrelated Problems

Do not silently fix unrelated issues. Report them after the requested task. Fix them automatically only when they block the requested feature, local preview, validation, Git commit, or GitHub deployment. Do not use unrelated bugs to modify product design or business logic.

## 9. Requirement Ambiguity

Ask for clarification when materially different interpretations affect product behavior, business logic, information architecture, page layout, interaction model, significant visual structure, existing confirmed functionality, or requested scope. Do not ask unnecessary questions for minor implementation details. Minor visual decisions may be made independently; layout, IA, or business-logic ambiguity must be clarified.

## 10. Discussion vs Execution

Discussion questions (“Do you think this is reasonable?”, “What is wrong?”, “Which is better?”, “How should this be designed?”, “Give options.”) are analysis-only: do not edit. Edit only when the user clearly asks to modify, implement, adjust, build, fix, create, or execute. “先给方案” means proposal only; do not modify files.

## 11. Visual Autonomy

Codex may independently tune spacing, font sizing, radius, minor color, alignment, and hierarchy when direction is clear. For major restructuring, layout model, IA, new interaction patterns, or significant hierarchy changes, propose the solution first when not already explicit.

## 12. When Design Feels Wrong

Determine whether the issue is styling, information hierarchy, component structure, semantics, or interaction design before superficial changes. Make small visual fixes directly; when meaningful structure/layout changes are required and unclear, explain and confirm direction first.

## 13. Prototype Experience Priority

When engineering elegance conflicts with prototype presentation, prioritize prototype quality without creating unmaintainable hardcoded hacks. Target high-fidelity presentation plus reasonable maintainability; do not over-engineer into production.

## 14. Mock Data

Keep Mock Data separate from rendering when practical. Avoid scattering important values through HTML/render code. Common data: games, providers, categories, playing, RTP, volatility, jackpot, road data, history, favorites, New/Hot states. Preserve useful demonstration switches such as `userHasHistory`.

## 15. Prototype Interaction Depth

Business-critical flows require meaningful mock interactions/pages: View All results, category switching, filters updating results, sorting reordering results, and game-launch mock overlay/toast when appropriate. Secondary non-core functionality may use lightweight toast feedback. Do not leave important primary controls dead.

## 16. UI Copy

Default UI language is English. Keep copy short, clear, international Casino/Sports appropriate, and industry-consistent. Do not invent long marketing copy. Use a reasonable temporary placeholder for unclear non-material business strings.

## 17. Images and Assets

Priority: existing local assets, user assets, local CSS/SVG/generated placeholder artwork, then remote public assets only when necessary. Prefer local resources; remote images require fallback. Never use `/Users/...` paths. Use GitHub Pages-compatible relative paths.

## 18. GitHub Pages Compatibility

Keep Pages compatibility: repository `WB_Game_Mobile`, branch `main`, remote `origin`, primary entry page suitable for Pages, relative assets, no domain-root assumptions, no localhost-only dependencies, and no APIs/services unless explicitly requested.

## 19. File Structure

Create files when clarity improves (CSS, JS modules, data, SVG, images), but do not over-engineer or split a simple prototype into dozens of files. Prefer clear structure over abstraction.

## 20. File Deletion

Do not delete files unless explicitly asked for cleanup/refactoring or deletion is unquestionably required. Leave seemingly unnecessary files and mention them when deletion is not required. Avoid destructive cleanup during ordinary iteration.

## 21. Default Git Policy

By default: **DO NOT COMMIT. DO NOT PUSH.** Local modification is default. A completed UI task normally stops at Modify → Preview → Validate. Commit/push only with explicit user intent such as Commit, Push, 上传 GitHub, 推到 GitHub, 发布, or 这版没问题，推上去. Do not infer publishing permission from prior tasks.

## 22. Commit Messages

When requested without a message, generate concise Conventional Commit messages, e.g. `feat: add baccarat road picks`, `fix: refine VIP lounge cards`, `style: adjust casino category navigation`, or `refactor: simplify game card rendering`.

## 23. Git Push Workflow

On explicit publishing: validate, check status/branch/origin, commit, push `origin/main`, check Pages when available, and return public URL if verified. Do not create another repo/directory/branch or change remote unnecessarily.

## 24. Pre-Push Technical Fixes

After design approval and push request, Codex may fix clear technical blockers: JavaScript errors, broken relative paths, missing files, invalid references, or Pages incompatibility; then revalidate. Do not make extra UI/product changes after approval.

## 25. Default Validation

After modifications, run local preview, check 375px, task-relevant interactions, console errors, horizontal overflow/broken layout, and unrelated regression. Check 360px/430px when relevant; 375px remains primary.

## 26. UI Validation

When browser preview/screenshots/interactions are available, use them. Do not declare visual work done from source alone. Inspect mobile viewport, first screen, fixed navigation, horizontal carousels, bottom sheets, overflow, game cards, badges, sticky elements, and safe-area spacing.

## 27. Validation Report

Keep reports concise: what changed, validation result, discovered-but-unmodified issues, local preview, and Git status when relevant.

## 28. Interrupted Task Recovery

When a task resumes after usage/session/application interruption, do not restart. First inspect files, `git status`, `git diff`, modifications, and current implementation related to the task. The repository is source of truth; continue only unfinished work and never overwrite completed work unnecessarily.

## 29. Natural-Language Command Semantics

### “先本地看”
Modify, preview, validate, and keep local. Do not commit/push.

### “这版没问题，推上去”
Do not continue visual iteration. Final validate, fix technical blockers, commit, push `origin/main`, check Pages, return public URL.

### “只改这里”
Strict minimum-change mode: modify only named component/behavior; report unrelated issues separately.

### “先给方案”
Analyze and recommend only; do not modify.

### “直接执行”
Proceed when clear, but does not override material-ambiguity clarification.

### “继续上次任务”
Inspect current progress first and continue unfinished work; never restart unless current implementation is unusable.

### “恢复上一版”
Inspect history, diff, and scope. Determine exact rollback; do not blindly reset/revert unrelated confirmed work. Clarify ambiguous destructive rollback scope.

### “推到 GitHub”
Do not continue product design. Validate → Commit → Push `origin/main` → Check Pages.

## 30. Final Working Principle

Preferred workflow: Understand → Modify → Preview → Validate → User Review → Publish only when explicitly approved.

Optimize for product clarity, high-fidelity prototype quality, fast iteration, minimal unintended changes, easy continuation across Codex sessions, and stable GitHub Pages sharing. When in doubt, preserve existing confirmed work; do not silently reinterpret product intent or publish without explicit permission.
