# khsaif Content Studio: full handoff

Written 18 Nov 2026 from the Claude Code session "Reel Studio · الجلسة الأساسية", where the studio and the `reel-studio` skill were built between 30 Oct and 18 Nov 2026. Read this once at the start of a new session, together with `CLAUDE.md`, `MEMORY.md` and `.claude/skills/reel-studio/SKILL.md`. Reply to Khaled in Egyptian Arabic.

## 1. Who and what

- **Khaled Saif**, Dubai. Registered auditor No. 5727. Works as a **freelancer**, not a licensed firm, so all content is commercial use.
- **Brand:** Saif El Nasr / SEN, "Auditing & Tax". Website **khsaif.com** (English, Arabic, Russian). WhatsApp +971 50 957 0963, email saif@khsaif.com.
- **Wording rule:** never claim tax agent status or FTA representation. "مدقق مسجّل" / "Registered auditor No. 5727" is fine.
- **This repository:** `khaledsaifelnasr-afk/khsaif-content-studio` (private). On Khaled's PC it is the folder `C:\Users\printer\Desktop\Cowork Claude\khsaif Website\khsaif Content Studio`. The website itself lives in a different repository (`khaledsaifelnasr-afk/website`) and is never changed from here.

## 2. Accounts and IDs

| What | Value |
|---|---|
| Instagram | `sen_auditing_firm` (name "Saif El Nasr Auditing & Tax") |
| YouTube (firm channel) | "Saif El Nasr", channel id `UC8NoAlvfepbODUW953D3LpA`, Google account saif@khsaif.com |
| YouTube (personal, do not use for firm content) | "khaled saif" @khaledsaif2002, Google account khaledsaifelnasr@gmail.com |
| Metricool brand | `sen_auditing_firm`, blogId `7753759`, timezone `Asia/Dubai`, linked to the Instagram and the firm YouTube channel |
| ElevenLabs | Starter plan ($6/month, 40,000 credits/month as read from the account on 18 Nov 2026, commercial licence for speech and music; resets on the 30th) |
| GitHub | `khaledsaifelnasr-afk` |

Best posting time from Metricool (Instagram): around 10:00 Dubai time, strongest on Wednesday and Friday.

## 3. Connectors and tools

Connected on Khaled's account: ElevenLabs (custom connector, voice, music, sound effects, images, video, avatars, transcription), Unsplash (real photos; email confirmed), Metricool, Canva (video generation needs a paid Canva plan), Adobe for creativity, HyperFrames (HeyGen), Firecrawl, Figma, Make, Brandfetch, Microsoft 365, Hostinger. Local: Playwright MCP on Edge (auto-updates to the latest version on each start), Node.js 26, Remotion through the skill template, Chrome for rendering.

- **Magnific** was added as a custom connector but never appeared in sessions. Dropped from the chain on 18 Nov 2026; Adobe Stock took its place as the second choice for visuals.
- **Not used, by decision:** Qwen video (terms: private and non-commercial use only), clips from transitionalhooks.com (personal non-commercial use only; ideas only), Artlist (declined; same models as ElevenLabs at extra cost), Shutterstock (offered, not connected).
- **Cloud sessions:** whether every connector works in the cloud has not been tested yet. Check with the connectors status tool first.

## 4. The reel-studio skill

Location: `.claude/skills/reel-studio/` in this repository. On Khaled's PC `C:\Users\printer\.claude\skills\reel-studio` is a junction to it, so there is one copy. **After changing the skill or template, commit and push**, or the other environment will not see it.

### The chain (15 steps)

| # | Step | Tool |
|---|---|---|
| 0 | Past performance and best posting time | Metricool (read only) |
| 1 | Brief; hook and transition ideas | Claude, transitionalhooks.com via Playwright (ideas only) |
| 2 | Script, legal check with source, hook chosen from the Hook playbook | Claude |
| 3 | Scene plan | Claude |
| 4 | Persuasion review and approval of cost | Neuro Marketer skill (AUDIT mode) |
| 5 | Folder `Reels/<yyyy-mm-dd-slug>/assets/` | |
| 6 | Voice | ElevenLabs |
| 7 | Word timings (captions) | ElevenLabs transcription (free) |
| 8 | Visuals: Unsplash, then Adobe stock, then ElevenLabs | |
| 9 | Screen captures | Playwright |
| 9b | Motion-graphic clips | HyperFrames (spends HeyGen credits, no free estimate) |
| 10 | Music and sound effects, `reel.json` | ElevenLabs |
| 11 | Render with automatic checks | Remotion (`scripts/render.mjs`) |
| 12 | Frame review, hook checked against Neuro Marketer principle 46 | |
| 13 | Cover and extra formats | Canva, Adobe Express |
| 14 | Schedule, only after Khaled's explicit yes | Metricool |

ElevenLabs is the only required tool; any other missing tool means its step is skipped and said.

### Template features (`template/src/Reel.tsx`)

- Scene types: `visual` (photo or video, alternating zoom, optional `text` headline, optional `label` stamp over the lower frame that hides captions), `screen`, `card` (with `keyValue`, `kicker`, `icon` audit/tax/vat/tp/zakat, `pair` badges like UAE–KSA, `bars` chart, `logo`), `counter`, `timeline`, `law`, `list`.
- Five brand backgrounds for text scenes, rotating automatically: `glow`, `rings`, `grid`, `gradient`, `midnight`.
- Word-by-word captions with `emphasis`; caption highlight turns white when gold, an icon, badges or a chart is on screen (one cyan element per screen).
- `"direction": "ltr"` for English reels (Space Grotesk headings).
- Audio: voice, music that drops under speech, SEN tick on every cut, `musicThroughOutro`.
- **Default closing:** the animated three-tick ("ledger") logo with "Khaled Saif" and "khsaif.com" under it (`Closing` composition, `closingName`, `closingSite`).
- Renderer stops on scene gaps, missing files and banned phrases ("guaranteed", "مضمون", "world-class"...), warns on scenes over 4.5 s, saves one frame per scene in `qa/`.
- Rendering uses Chrome first (Edge stopped launching once during an update). In the cloud or on Linux it lets Remotion download its own browser. In a fresh clone run `npm ci` in `template/` before the first render.

### Brand rules (from the SEN Visual Identity Guideline v3.1, in `brand/`)

Midnight #0D1B2A base; one cyan #00C2FF element per screen; Sand Gold #D9A441 only for the one key number or a credential, never a button; cyan and gold never both loud; WhatsApp green only for WhatsApp buttons. IBM Plex Sans Arabic (line height 1.7, never letter-spaced), Space Grotesk for numbers and English headings, Western digits. Reversed logo on Midnight. Natural colour photos, no stock photos of people, no black-and-white. Text out of the top 220 px and bottom 400 px. Voice: first person, plain, cite the law by name; never "world-class", "one-stop shop", "guaranteed".

### Hook playbook

Anticipation is the default for SEN (something about to happen, payoff at the end), using a business metaphor (a LATE stamp, an hourglass, dominoes, a calculator total). Others: cost of the mistake, curiosity gap, myth versus fact, direct question. Never fake urgency, invented numbers or shock content.

## 5. Costs measured

| Item | Credits |
|---|---|
| Arabic voice, about 30 s (eleven_v4) | about 363 |
| Short line, 3 s | 33–47 |
| Image (gpt-image-2.5-sunburst) | about 190 |
| Video clip, LTX fast, 5–6 s | about 1,454 |
| Video clip, Seedance 2.5 | about 14,000 (avoid) |
| Music, 30 s | about 1,500 |
| Talking character, OmniHuman, 3 s | about 3,025 plus its image and voice |
| Transcription | 0 |

Lesson: in a chained ElevenLabs flow, run only the last node; running the upstream nodes too charges them twice. LTX returned a **landscape** clip even when asked for 9:16, and garbled the word "LATE" on a stamp.

## 6. What was produced

| Reel | Where (on Khaled's PC, top-level `Reels/`) | Status |
|---|---|---|
| Brand intro, rebuilt in the new brand | `Reels/2026-11-11-brand-intro-en` | Done, not published |
| Brand intro, original video with only the logos swapped, name and site under the closing, clear first frame | `Reels/2026-11-11-brand-intro-logo-swap` (plus `cover.png`) | **Published**: Instagram reel on sen_auditing_firm; YouTube Short https://www.youtube.com/shorts/RkLJwgcBj_g (via Metricool) |
| Talking falcon test ("هلا هلا بالعزيز الغالي") | `Reels/2026-11-13-hala-hala-test` | Test only, about 3,499 credits |
| Late filing penalty, anticipation hook | `Reels/2026-11-16-late-filing-penalty` | **Cancelled** by Khaled on 18 Nov 2026; not to be finished |

Reel media is not in this repository (see `.gitignore`); only `reel.json` and credits are kept for reels saved under this repository's `Reels/`.

## 7. Verified legal facts used

- UAE Corporate Tax late filing: **Cabinet Decision No. 75 of 2023, item 7**: AED 500 per month or part thereof for the first 12 months, AED 1,000 per month from month 13, from the day after the deadline. Two years late = AED 18,000. Return due 9 months after the end of the tax period (Federal Decree-Law No. 47 of 2022). Source used: the Ministry of Finance PDF of Decision 75 and its amendments.

Every new tax claim must be verified again against current law, with the source shown to Khaled before production.

## 8. Open items

1. ~~Late filing penalty reel~~: cancelled by Khaled on 18 Nov 2026. The stamp scene will not be rebuilt and no cover is needed. Its local folder on his PC can be deleted or kept as an archive.
2. Music on the published intro came from the old video; its licence was never checked.
3. An older Short with the old brand may still be on the firm YouTube channel (`kj7Neu3RK-A`); Khaled may hide it.
4. ~~Magnific~~: not in the connector directory or among the installed connectors (18 Nov 2026). Khaled approved dropping it: visuals now go Unsplash → Adobe Stock → ElevenLabs. Kling (video) may be added later if Khaled subscribes. ElevenLabs was reconnected and its credit balance is now readable.
5. The brand reference files of the website (`khsaif Website/handoffs/`, `PROJECT.md`) are on Khaled's PC only, not in this repository. A cloud session has the skill's `brand/` folder (guideline PDF, closing clips, mark, tick) but not those files.

## 9. Working rules

- Learning: `docs/LEARNING-LOG.md` holds what was learned from official Google, YouTube and Instagram guidance (18 Nov 2026) and the nine changes it brought to the skill: brand named by voice in the first 5 s, two shots in the first 5 s, CTA said and shown, a send test in the brief, platform metrics at step 0, trial reels, a music licence rule, problem-first titles, and renderer checks (3-minute stop, late first cut, long reel with music).
- Khaled does not appear on camera for now, but records the voice-over himself (decided 18 Nov 2026), so reels need no AI label unless a photorealistic AI clip is used. `scripts/clean-voice.mjs` cleans his recording for free. Reference takes (18 Nov 2026): his second and third WhatsApp recordings (48 kHz) cleaned to about -16.7 LUFS with quiet gaps; both are the quality bar for future recordings. They stay on the session machine and are not committed (voice files are in `.gitignore`). Khaled then chose a clone of his own voice so he does not record each time: ElevenLabs Instant Voice Clone "Saif" (voice_id kLbuFHpWQBLmZ4IB3Yp9), built from an 87-second cleaned sample (his one-minute take plus takes 2 and 3). Test lines in Egyptian, Emirati and English cost 122 + 122 + 154 credits. Measured pitch of the clone is higher than his real voice (about 115 Hz against 82 Hz), but Khaled listened and approved all three voices. Decision: no AI label for the clone on Instagram or YouTube (told that YouTube does not require one for a creator's own voice and that Meta asks for one on realistic AI audio). The environment now allows `elevenlabsusercontent.com` so generated files can be downloaded. An AI presenter was considered and dropped the same day; no presenter in reels.
- Weekly radar: scheduled task "Reel Studio weekly radar", Thursdays 10:43 Dubai, opens a docs-only PR under `docs/radar/`. Created without connectors (the creating session could not pass them); Khaled should add ElevenLabs, Firecrawl and Exa to it from claude.ai so it can read the model list.

- Show the estimated credits and get Khaled's approval before any generation. Never call a generate tool twice to retry.
- Never publish or schedule without his explicit yes; show the exact text, account and time first.
- Publishing paths that worked: Instagram through Claude in Chrome (the profile there is signed in to Instagram); YouTube through Metricool with the video hosted at a public URL (it was briefly hosted on khsaif.com through the Hostinger connector, then deleted). The Chrome profile that Claude controls is signed in to the personal Google account, not saif@khsaif.com.
- Unsplash: one concept per search, `download_asset` for files, check each photo for logos and identifiable people, record credits.
- Commit and push after changing the skill, template or instructions.

## 10. Cloud session check (18 Nov 2026, session "Content Studio مرجع المهارة")

Free, read-only checks; no credits spent.

| Tool | Result |
|---|---|
| ElevenLabs | Works. After Khaled reconnected it, `account_get_usage` returns the balance: Starter, 8,917 of 40,000 credits used, 31,083 left, resets 30 Nov 2026 15:04 Dubai |
| Metricool | Works: brand `sen_auditing_firm` (7753759), Instagram and firm YouTube linked, Asia/Dubai |
| Unsplash | Works (user saifelnasr) |
| Canva | Works (one Brand Kit) |
| Adobe for creativity | Works (init) |
| HyperFrames | Works (no projects yet) |
| Playwright | Works (Chromium launches) |
| Remotion template | Works after `npm ci` in `template/`; a still of the `Closing` composition rendered correctly |
| Magnific | Not available |
| Recraft (connected, not in the chain) | Free plan, 60 credits |
| Kling (connected, not in the chain) | Free (NORMAL) membership, 0 credits |

Cloud rendering notes: pass `--browser-executable=/opt/pw-browsers/chromium` so Remotion uses the installed Chromium instead of downloading one. A raw `remotion still` of `Closing` needs `public/outro.mp4`; `scripts/render.mjs` sets this up for a real reel.
