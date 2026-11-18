---
name: reel-studio
description: Produce a finished vertical reel (1080x1920 MP4) for Saif El Nasr Auditing & Tax from an idea: script, Neuro Marketer persuasion review, ElevenLabs voice, Unsplash photos, Adobe Stock and ElevenLabs Creative visuals, Playwright screen captures, HyperFrames motion-graphic clips, Transitional Hooks references, Canva and Adobe Express covers and formats, Metricool timing and scheduling, word-timed Arabic captions, animated SEN backgrounds and motion scenes, music and cut sounds, Remotion render with automatic checks. Use whenever Khaled asks for a reel, Instagram Reel, YouTube Short, TikTok, short video or "ريل", or says "reel studio". Not for long YouTube videos or for editing filmed talking-head footage.
---

# Reel Studio

Four tracks on one timeline: Voice (ElevenLabs), Visuals (Unsplash first, then ElevenLabs Creative, with animated SEN backgrounds for text scenes), Screens (Playwright), Captions. Neuro Marketer reviews the script before any spend, and Remotion joins everything. The template and renderer live next to this file.

## Before starting

Confirm the tools are in this session. ElevenLabs is required: if it is missing, stop before writing the script and tell Khaled. Every other tool is part of the chain but optional: if one is missing, skip its step, say so in one line, and carry on.

| Tool | Role in the chain | Step |
|---|---|---|
| Metricool connector | Past reel performance and best posting time; scheduling on approval | 0, 14 |
| Transitional Hooks (transitionalhooks.com, via Playwright) | Hook and transition ideas only, never clips in the reel | 1 |
| Neuro Marketer skill | Persuasion review before any spend, and the hook check | 4, 12 |
| ElevenLabs connector | Voice, caption timing, music, sound effects, generated visuals | 6, 7, 8, 10 |
| Unsplash connector | Real photos, first choice | 8 |
| Adobe connector (Adobe Express) | Licensed stock (second choice for visuals), speech clean-up, extra formats | 8, 13 |
| Playwright MCP | Screen captures of public pages | 9 |
| HyperFrames connector (HeyGen) | Motion-graphic clips: animated charts, kinetic type, product-style explainers | 9b |
| Remotion (this skill's template) | Motion scenes, brand backgrounds, captions, render, checks | 11 |
| Canva connector | Cover image and thumbnail on the brand kit | 13 |

## Steps

0. **Data.** Metricool: run `getBrandSettings` for the brand id and timezone, then read the last 90 days of Instagram reels analytics (`getAnalyticsAvailableMetrics` first for valid metric names). Note which topics, hooks and lengths did best, and get `getBestTimeToPostByNetwork` for the coming week. Use this in the brief. Read-only; post nothing here.
1. **Brief.** Infer topic, audience and language (default Egyptian or Gulf Arabic to suit the audience). Ask only what is missing. Target 20 to 40 seconds.
   - Hook research: open transitionalhooks.com with Playwright, pick one or two hook or transition styles that suit the topic, and rebuild the idea in Remotion with our own scenes. Its terms limit the clips to personal, non-commercial use and grant no licence, so never download or place its clips in a reel, unless Khaled supplies written permission from the clip's copyright owner.
2. **Script.** Hook in the first 2 seconds (pick one from "Hook playbook" below), one idea, one call to action. About 2.5 Arabic words per second.
   - Any tax, VAT, TP, AML or audit statement is professional judgment: check it against current UAE or KSA law, use opus, and name the source to Khaled. Khaled approves the script before anything is spent.
3. **Scene plan.** List scenes with timing, type and source, following "Production standard" below.
4. **Persuasion review.** Load the `anthropic-skills:neuro-marketer` skill and run it in AUDIT mode on the hook, script, scene plan and call to action. Diagnose in its fixed order (Attention, Framing, Motivation, Social), give at most 7 findings by principle number, and apply the fixes before approval. Focus on:
   - Attention: the first 2 seconds stop the scroll (46 Von Restorff, 63 Picture Superiority), and each scene has one loud element.
   - Framing: state the cost of the problem before the solution (3 Anchoring, 5 Loss Aversion), with one idea only (13 Focusing).
   - Motivation: plain words (24 Curse of Knowledge), and one clear next step saying what happens after they message (21 Need for Certainty, 2 Hobson's +1).
   - Social, weighted for the GCC: name the exact audience (68 In-Group Bias) and show real credentials (70 Authority).
   - Its integrity gate is a hard block: no invented deadlines, scarcity, client numbers or testimonials. Legal accuracy from step 2 outranks any persuasion fix.
   Show the scores, the changes made, the script, the plan and the estimated credits together for one approval.
5. **Folder.** Create `Reels/<yyyy-mm-dd-slug>/assets/` in the workspace.
6. **Voice.** Pick from `creative_list_voices` with `languages: ["ar"]`, matching the accent. Price it first with `creative_generate_speech` `estimate_only: true`, then generate with `generations_count: 1`. Poll `creative_get_flow_run_status`, get the file URL from `creative_get_generations`, and save it as `assets/voice.mp3`. Never call generate again to retry; it charges again.
7. **Timing.** Run `creative_transcribe_audio` on the voice node with `connect_from`. Use its per-word start and end seconds, but replace each word's text with the approved script spelling, so captions never carry transcription errors.
8. **Visuals.** Use real photos first, because they cost no credits and suit professional content. Search Unsplash with `search_photos`, `orientation: "portrait"`, `plus: "none"` and one short concept per search. Get each file through `download_asset`, never from the result's `urls`, and save it in `assets/`. No photo showing an identifiable person, a third-party brand or logo, or a government building presented as linked to the firm, since the Unsplash licence does not clear those. Open every downloaded photo and look at it before using it, because building signs and company logos often appear in skyline shots. Record photographer names in `assets/credits.txt`.
   Next choice, licensed stock from Adobe (call `adobe_mandatory_init` first): photos or footage when Unsplash has nothing suitable. Any licence cost needs Khaled's approval at step 4.
   Magnific is not used (dropped 18 Nov 2026: not available as a connector). Recraft and Kling are connected but not part of the chain: Recraft is on the free plan (no commercial use) and Kling has no credits. Use either only after Khaled subscribes and says so.
   Generate with ElevenLabs Creative only when no suitable photo or stock asset exists, or the idea needs an illustrated concept. Use `creative_generate_image` and `creative_generate_video` with `estimate_only: true` first and include the figures in the approval at step 4. Then generate with `generations_count: 1`, poll `creative_get_flow_run_status`, get the file URL from `creative_get_generations`, and save it in `assets/`. Ask for vertical 9:16 in the prompt. Never call generate again to retry. Default to images: about 190 credits each with `gpt-image-2.5-sunburst`, against about 14,000 for one `bytedance-seedance-v2.5` clip, on a 30,000 monthly allowance. Generate video only when Khaled approves that clip's own estimate, and look for a cheaper model first with `creative_get_flow_node_types`. Use `topaz-image-upscale-v2` to upscale. Follow the imagery rule below.
9. **Screens.** Playwright: set the viewport to 1080x1920, open the page, save screenshots in `assets/`. Only public pages, and never client data.
9b. **Motion clips.** HyperFrames, when it is in the session and a scene needs motion the template's scene types cannot give (an animated chart, kinetic typography, a step-by-step explainer). One `compose` call per clip, never a whole reel:
   - Prompt: the exact on-screen content from the approved script, vertical 9:16, the clip's length in seconds, "no narration, no music", English or numbers only on screen (Arabic stays in our captions), and the SEN brand: Midnight #0D1B2A background, one cyan #00C2FF accent, Sand Gold #D9A441 only for the one key number, Space Grotesk for numbers and headings, no logos. Pass `designSource: "signal"` (navy and gold editorial), the closest preset to SEN.
   - Images it should show must be public https file URLs, such as the Unsplash `download_asset` URL. Local files cannot be reached.
   - `compose` returns at once and renders the MP4 itself in a few minutes. Get the link with `get_render_status` when ready, or `render_video` only if compose did not render, and save it in `assets/` as `motion-<n>.mp4`. Use it as a `visual` scene; the template plays it muted.
   - It spends HeyGen credits and there is no free estimate: list each planned clip in the approval at step 4 and get Khaled's yes before the first `compose`. Never call `compose` again to retry a clip; edit it with its `projectId`.
   - Check every clip's frames at step 12 like any other scene, including brand colours and that no third-party logo or invented figure appears.
10. **Sound and reel.json.** Music is optional and costs about 1,500 credits for 30 seconds, so include it in the approval at step 4 and offer to reuse a saved track. Generate it with `creative_generate_in_flow`, `node_type: "music"`, `model_id: "eleven_music_v2_5"`, `estimate_only: true` first, instrumental only and no vocals. Sound effects use `node_type: "sfx"`, `model_id: "eleven_text_to_sound_v2"`. Then write `reel.json` in the reel folder (format below). Paths are relative to `assets/`. Scenes must cover the whole voice with no gaps.
11. **Render.**
    ```bash
    "C:/Program Files/nodejs/node.exe" "$HOME/.claude/skills/reel-studio/scripts/render.mjs" "<reel folder>"
    ```
    The renderer stops on scene gaps, missing files and banned brand phrases, warns on scenes over 4.5 seconds, adds the watermark, the SEN tick on each cut and the closing (the animated three-tick logo with "Khaled Saif" and "khsaif.com" under it; change them with `closingName` and `closingSite`), and saves one frame per scene in `qa/`. Set `"outro": ""`, `"watermark": ""` or `"tick": ""` to drop one.
12. **Check.** Look at every frame in `qa/`. Check the hook frame against Neuro Marketer principle 46 (one loud element) before anything else. Confirm text inside the margins, captions not covering key content, one cyan element per screen, no third-party logos, and correct Arabic. Probe the file for 1080x1920 and an audio stream. Fix and render again before showing it.
13. **Package.**
    - Cover: with Canva, design a 1080x1920 cover and a 1080x1080 grid thumbnail on the SEN brand kit (`list-brand-kits`, then `generate-design` or `create-design`, then `export-design` as PNG), one message and one number per the brand rules. Save them in the reel folder.
    - Formats: with Adobe Express (`adobe_mandatory_init` first), use `video_resize` to make 1:1 and 16:9 versions when Khaled wants LinkedIn or YouTube, and `media_enhance_speech` only if a recorded voice sounds noisy.
    - Give Khaled the paths to `reel.mp4`, the cover and any extra formats, plus a suggested post caption and the best posting time from step 0.
14. **Schedule.** Only after Khaled approves the final reel and caption in this conversation: schedule it in Metricool for the time he confirms, using `createScheduledPostForReview` when he wants a review step, otherwise `createScheduledPost`. Show him the exact text, account and time before calling either, and never publish immediately.

## reel.json

```json
{
  "voice": "voice.mp3",
  "music": "music.mp3",
  "musicVolume": 0.2,
  "scenes": [
    {"type": "visual", "start": 0, "end": 3, "src": "hook.jpg", "text": "جملة البداية"},
    {"type": "card", "start": 3, "end": 6, "text": "آخر موعد لتقديم الإقرار", "keyValue": "9 أشهر"},
    {"type": "counter", "start": 6, "end": 9, "from": 0, "to": 375000, "prefix": "AED", "text": "الحد المعفى"},
    {"type": "timeline", "start": 9, "end": 13, "steps": [
      {"date": "1 Jan", "label": "بداية السنة"},
      {"date": "30 Sep", "label": "آخر موعد"}
    ]},
    {"type": "law", "start": 13, "end": 16, "source": "اسم القانون، المادة 1", "text": "نص مختصر ودقيق"},
    {"type": "list", "start": 16, "end": 20, "text": "العنوان", "items": ["أولًا", "ثانيًا", "ثالثًا"]},
    {"type": "screen", "start": 20, "end": 23, "src": "portal.png"}
  ],
  "captions": [{"text": "كلمة", "start": 0.2, "end": 0.6, "emphasis": true}]
}
```

- `visual`: image or video, full frame, zooming in and out on alternate scenes. `text` puts a large headline over it.
- `screen`: screenshot inside a framed panel, top of the page first.
- `card` extras: `kicker` is a small line under the text (`
` breaks it); `icon` puts a service icon above it (`audit`, `tax`, `vat`, `tp`, `zakat`); `pair` adds two linked badges such as `["UAE", "KSA"]`; `bars` adds an animated bar chart; `logo` shows a logo file above the text.
- `label` on a `visual` scene lays a stamp-style Arabic label over the lower middle of the frame and hides captions for that scene. Use it to cover text an AI clip rendered badly, such as a garbled word on a stamp.
- `"direction": "ltr"` makes an English reel: left-to-right layout and Space Grotesk headings.
- `"musicThroughOutro": true` keeps the music under the closing clip.
- A HyperFrames clip from step 9b is a `visual` scene with `src` set to its `motion-<n>.mp4`.
- `card`: Midnight background, or a photo in `src`. `keyValue` is the one number or date, shown in gold.
- `counter`: a real figure counting up in gold.
- `timeline`: dates in order. The last step is the highlighted one, so put the key date last.
- `law`: the law's name in gold over a short, exact extract. Only text verified at step 2.
- `list`: up to 4 short items that land in turn.
- `bg` sets the background of a text scene (`card` without `src`, `counter`, `timeline`, `law`, `list`): `glow`, `rings`, `grid`, `gradient` or `midnight`. Leave it out and scenes rotate through all five, so no two neighbouring scenes look alike. All five use only the guideline's colours, gradients and clock-ring supergraphic, cost nothing, and carry no third-party content.
- `emphasis` on a caption word keeps it highlighted and larger. Use it on 1 or 2 words per sentence, usually the number or the consequence.
- `musicVolume` is the level in pauses. Music drops to about a third under speech and fades at the end.

## Hook playbook

Pick one hook per reel and name it in the plan at step 3. The hook must lead into the reel's actual point; a hook that has nothing to do with the topic wins the view and loses the client.

1. **Anticipation (recommended for SEN).** Open on 2 to 3 seconds of something about to happen, cut to the explanation, and pay it off at the end. The brain waits for the ending, so viewers stay. Use a business metaphor for the risk in the script, not a random stunt:
   - a red "LATE" stamp coming down on a tax return (late filing penalty),
   - an hourglass with the last grains falling (a deadline),
   - a row of dominoes about to tip (one missed filing triggering others),
   - a calculator total about to land on a large figure (an assessment).
   Make it with a short ElevenLabs video clip at step 8 (prefer `ltx-v2-fast`, about 1,450 credits for 5 seconds; never the 14,000-credit models for a hook) or for free with a Remotion `card` and motion. Show the payoff frame in the last scene before the closing.
2. **Cost of the mistake.** Lead with the loss: "This mistake costs companies a penalty." Only real penalties, named from the law.
3. **Curiosity gap.** "Most UAE companies file this wrong, and it is not the deadline." Answer it within the reel.
4. **Myth versus fact.** "You do not need to register for Corporate Tax if you are small. Wrong." Only when the law clearly says so.
5. **Direct question to the audience.** "Is your company in a free zone?" Names the viewer (68 In-Group Bias).

Do not use: fake urgency, invented numbers, shock content, or anticipation clips with people in danger. Neuro Marketer at step 4 checks the chosen hook.

## Production standard

- Hook: the first scene is a `visual` with `text`, stating the cost or the surprise in under 8 words.
- Pace: change the picture every 2 to 4 seconds. Split long sentences across scenes rather than holding one.
- Variety: never use the same scene type three times in a row, and let backgrounds rotate unless a scene needs a specific one. A 30-second reel usually needs 9 to 12 scenes.
- Fit the type to the content: amounts use `counter`, deadlines use `timeline`, legal claims use `law`, steps use `list`.
- One idea per scene. If a scene needs two sentences on screen, make it two scenes.
- Sync: start each scene on the word it illustrates, using the word timings from step 7.

## Brand rules (SEN)

The full guideline is `brand/SEN-Visual-Identity-Guideline-v3.1.pdf`. Open it when a question is not answered here.

- Voice: first person, plain words, short sentences. Cite the law by name. Say "registered", "on time", "clear fee". Never say "world-class", "one-stop shop", "guaranteed", or anything implying FTA representation.
- Message: one message, one number, the mark in a corner. Only verified dates and figures, as on the website.
- Credentials and contact, only as written: Registered auditor No. 5727, khsaif.com, +971 50 957 0963, saif@khsaif.com. WhatsApp is the main action.
- Colours: Midnight #0D1B2A carries the brand. One cyan element per screen beyond the logo: in this template that is the caption highlight, so add no other cyan. Sand Gold #D9A441 is only for the one key date or number or a credential badge, and never a button. Cyan and gold never both shout in one view; the template switches the caption highlight to white on a gold card. WhatsApp green #25D366 is for WhatsApp buttons only.
- Type: IBM Plex Sans Arabic for all Arabic, line-height 1.7, never letter-spaced. Space Grotesk for numbers and English headings. Western digits in both languages.
- Logo: reversed version on Midnight, never stretched, rotated, recoloured or on a low-contrast background. The template sets the mark on a Midnight panel for this reason.
- Photography: natural colour and light, never black-and-white. No stock photos of people.
- Keep text out of the top 220px and bottom 400px, where Instagram's interface sits.
- Mockups and generated scenes use the Dubai scene, not Khaled's portrait.
- No AI-generated people presented as real clients or staff, no fake testimonials, and no cloned voice of anyone without their consent.

## Costs and licensing

- The account is on ElevenLabs Starter, whose plan page lists a commercial licence for speech and music. Khaled must confirm the terms for generated images and video before the first published reel uses them.
- Report the credits actually used for each reel.
- In a chained ElevenLabs flow (image and voice wired into a talking-character or lip-sync node), run only the last node: it generates its own inputs, so also running the upstream nodes charges them twice. A 3-second talking character with `bytedance-omnihuman-v1.5` cost about 3,260 credits including its image and voice.

## Where it lives

The skill is in the `khsaif-content-studio` GitHub repository (private), at `.claude/skills/reel-studio`. On Khaled's PC, `C:\Users\printer\.claude\skills\reel-studio` is a link to the same folder, so there is one copy. Commit and push changes to the skill or template from the repository folder `khsaif Website\khsaif Content Studio`.

In a fresh clone or a cloud session, run `npm ci` in `template/` once before the first render. Without Chrome or Edge the renderer lets Remotion download its own headless browser. In a Claude Code cloud session, point Remotion at the pre-installed Chromium instead (`--browser-executable=/opt/pw-browsers/chromium`); a cloud check on 18 Nov 2026 rendered the `Closing` composition correctly this way.

## Editing the template

`template/src/Reel.tsx` holds all layout. After changing it, run `npx tsc --noEmit` in `template/` and render a test reel.
