# khsaif Content Studio

## Folder Purpose

Content production for Khaled's personal brand website **khsaif.com** (brand mark "Saif El Nasr / SEN — Auditing & Tax"): Instagram Reels, YouTube Shorts and other short videos, their covers and captions, and the social posts that drive visitors to the website and to WhatsApp. Khaled works as a freelancer, not a licensed firm, so all of this is commercial use.

## Specific Instructions

- **Reels:** use the `reel-studio` skill (C:\Users\printer\.claude\skills\reel-studio). Its 15-step chain is the standard: Metricool data, brief, script with legal check, scene plan, Neuro Marketer review and approval of cost, then voice, visuals, render, check, package and schedule.
- **Main reference session:** the Claude Code session "Content Studio مرجع المهارة" (https://claude.ai/code/session_01L32eAjZm9LvXAvqYw2qnWD, from 18 Nov 2026) is the main reference for the `reel-studio` skill: decisions, changes and approvals about the skill are made and recorded there. The earlier session "Reel Studio · الجلسة الأساسية" is kept as the archive of how the skill was first built and tested.
- **Full history:** `docs/HANDOFF.md` records everything decided, produced and still open. Read it at the start of a new session.
- **Weekly radar:** the scheduled task "Reel Studio weekly radar" (every Thursday 10:43 Dubai, id trig_011nPZFDAzMzsbHdA38mpown) scans new AI models, GitHub skills and platform rules, and opens a docs-only pull request with proposals in `docs/radar/`. Nothing from it changes the skill until Khaled approves it in the main reference session. `docs/LEARNING-LOG.md` holds what has been learned and applied.
- **Voice:** Khaled records the voice-over himself (no camera); `scripts/clean-voice.mjs` cleans it. With his own voice and no photorealistic AI video, no AI label is needed. An ElevenLabs voice or a photorealistic AI clip requires Instagram's AI label and YouTube's "AI use: Yes". No AI presenter is used.
- **Output folder:** save each reel in `Reels/<yyyy-mm-dd-slug>/` inside this folder. Earlier reels are in the workspace's top-level `Reels/` folder.
- **Brand source:** the parent folder `khsaif Website` — `handoffs/SEN-Visual-Identity-Guideline-v3.1.pdf`, `handoffs/logo/v2/` (logos and the intro videos), `handoffs/brand-refresh/colour-system.md`, and `PROJECT.md` for verified facts and credentials. Read those instead of guessing.
- **Website link:** every reel and post points to khsaif.com or WhatsApp +971 50 957 0963. Website changes themselves are done from the parent folder under its own rules.
- **Connected tools:** ElevenLabs (paid Starter plan: voice, music, generated images and clips), Unsplash, Playwright, HyperFrames, Metricool (Instagram sen_auditing_firm and the Saif El Nasr YouTube channel), Canva, Adobe, Remotion through the skill's template.
- **Spending:** show the estimated credits and get Khaled's approval before any generation. Never publish or schedule without his explicit yes.
- **Do not use:** Qwen video (its terms are non-commercial only) or clips from transitionalhooks.com (personal, non-commercial use only).
- **Language:** reply in Egyptian Arabic.

## Things to Remember

- Tax facts in any script must be verified against the current UAE or KSA law and the source shown to Khaled before production.
- The late filing penalty reel (Reels/2026-11-16-late-filing-penalty in the workspace root) was cancelled by Khaled on 18 Nov 2026. Do not rebuild it.

---

**MEMORY SYSTEM**

This folder contains a file called MEMORY.md. It is your external memory for this workspace — use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work — don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks — using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them. Do not auto-delete or expire entries.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
