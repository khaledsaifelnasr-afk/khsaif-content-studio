# Learning log: short video and YouTube

Free, official sources studied in full on 18 Nov 2026 in the session "Content Studio مرجع المهارة", at Khaled's request. Each lesson is followed by what it means for SEN. The changes to the `reel-studio` skill in section 3 were approved by Khaled and applied on 18 Nov 2026 (SKILL.md and scripts/render.mjs); a test render in the cloud confirmed the new checks.

## 1. Sources

| # | Source | Publisher | Read |
|---|---|---|---|
| S1 | "About the ABCDs of effective video ads", incl. "ABCDs of YouTube Shorts" (support.google.com/google-ads/answer/14783551) | Google Ads Help | Full page |
| S2 | "ABCD: A playbook for building effective creative on YouTube" (thinkwithgoogle.com, PDF, 11 pages) | Think with Google, with Ipsos, Nielsen Neuro, Kantar | Full PDF |
| S3 | "Search & discovery tips – Shorts" (support.google.com/youtube/answer/11914225) | YouTube Help | Full text |
| S4 | "Understand your content performance for YouTube's recommendation system" (support.google.com/youtube/answer/16559650) and "How YouTube recommendations work" (answer/16089387) | YouTube Help | Full pages |
| S5 | "Understand three-minute YouTube Shorts" (support.google.com/youtube/answer/15424877) | YouTube Help | Full text |
| S6 | Instagram Reels Chaining AI system (transparency.meta.com, updated 11 Nov 2025) | Meta Transparency Center | Main text |
| S7 | Instagram originality and ranking rules, quoted from Instagram for Creators ("Tips for Improving Your Reach", FAQ, "Rewarding original creators", 30 Apr 2026, "Original Content Guidelines") and Adam Mosseri (ranking video, 22 Jan 2025) | Secondary summaries that quote Instagram's pages (waehq.com research note, reeldrop.io) | Read in full |

Limit: creators.instagram.com is blocked by this cloud session's network and by the scraping tools, so the Instagram rules in S7 come from pages that quote Instagram word for word, not from Instagram's own site. Check them in the app (Professional dashboard → Best practices) before relying on an exact figure.

## 2. What was learned

### How the platforms decide who sees a video

- **YouTube Shorts** (S3, S4): ranking uses three buckets. *Appeal*: did people choose to watch or swipe away. *Engagement*: % of viewers who chose to view, average view duration, average % viewed. *Satisfaction*: likes and post-watch surveys. The system "has no opinion" about format; it ranks on performance and personalisation. No minimum posting cadence is required, and Shorts never hurt long-form recommendations.
- **Instagram Reels** (S6, S7): Mosseri's three signals to watch are average watch time, likes per reach and sends per reach (DM shares). Likes weigh slightly more with followers; sends weigh slightly more with non-followers, which is where new clients come from. Meta's own explainer compares a viewer's watch time with others who watched reels of the same length, so a short reel watched to the end beats a long one abandoned.
- **What Instagram demotes** (S7): reels over 3 minutes are not recommended; low-resolution, bordered, muted or mostly-text reels, third-party watermarks (another app's logo, not our own brand mark), and reposts of a reel already on Instagram. Since 30 Apr 2026 the same originality rules cover photos and carousels.
- **Trial reels** (S7): a reel can be shown to non-followers only first; metrics come after about 24 hours and it can auto-share to followers if it performs within 72 hours. A free A/B test for hooks.

### How to build the video (Google ABCD, S1 and S2)

- **Attract**: start in the middle of the action; tight framing; **two or more shots in the first 5 seconds**; surprising or memorable imagery in the first 5 seconds; bright, high-contrast visuals; large type. If a person appears, open on them. Use an "emerging story arc": a strong opening, several peaks and shifts, not a slow build to one reveal.
- **Brand**: introduce the brand **in the first 5 seconds** and keep it present; a spoken brand mention beats a visual-only one; a persistent logo watermark works for consideration; use the brand's own colours, fonts and sounds (our tick and Midnight/cyan/gold are exactly this).
- **Connect**: one focused message; pair a functional message with the feeling it gives; humour, surprise and intrigue; tension and release; people make it relatable. For Shorts: authentic, real points of view, a lighter tone.
- **Direct**: one specific call to action, shown on screen **and said in the voice-over**; for action goals, ask only after the context is set. Urgency helps only when it is real.
- **Sound on**: 95% of YouTube viewing is with sound; build audio (voice, music, effects) to carry the message, not just decorate it.

### Packaging and YouTube long-form (S4)

- Title and thumbnail set the promise; the first seconds must deliver it at once, or viewers leave and satisfaction drops.
- Frame a niche topic around a universal, everyday problem. YouTube's own example: not "economics of the coffee market" but "Why is your coffee so expensive?". For SEN: not "Cabinet Decision 75 of 2023" but "Why a late tax return costs you AED 18,000".
- Tags are not essential for discovery; title, thumbnail and description are.
- Build anticipation and curiosity through the video and read retention at key moments in Analytics.

### Rules that touch our work directly (S5)

- Vertical or square videos up to **3 minutes** are Shorts. A Short **over 1 minute with any active copyright claim is blocked worldwide**. Music for anything over 60 s must be our own (ElevenLabs, commercial licence) or from the YouTube Audio Library.
- This links to an open item in `HANDOFF.md`: the published brand intro reuses music from the old video whose licence was never checked.

## 3. Changes to `reel-studio` (approved and applied 18 Nov 2026)

| # | Change | Why | Where |
|---|---|---|---|
| CR-1 | Brand cue in the first 5 seconds: a small SEN mark or "Khaled Saif" on the hook scene, and the voice says the brand or Khaled's name once within the first 5 s | ABCD Brand: introduce early, audio mention adds impact. Today the brand only appears in the closing | Step 2 script, step 3 plan, template hook scene |
| CR-2 | At least 2 shots in the first 5 seconds (the hook scene splits into two cuts) | ABCD Attract, Pace rule | "Pace" rules, step 3 |
| CR-3 | CTA said in the voice-over **and** shown on screen at the end (WhatsApp or khsaif.com), once | ABCD Direct: reinforce the CTA with audio | Step 2 script, closing scene |
| CR-4 | A "send test" in the brief: who would forward this reel to whom, and why (e.g. a finance manager to the owner) | Sends per reach is the signal that reaches non-followers | Step 1 brief, step 4 review |
| CR-5 | Step 0 reads the right metrics: Instagram average watch time, likes per reach, sends per reach; YouTube % chose to view and average % viewed | These are the signals the platforms named | Step 0 |
| CR-6 | Offer a Trial Reel for new hook styles before posting to followers | Free, official A/B test with non-followers | Step 14 |
| CR-7 | Music rule: any reel over 60 s uses only ElevenLabs music or the YouTube Audio Library; check the licence of the published intro's music | A claimed Short over 1 minute is blocked worldwide | Step 10, open item |
| CR-8 | Titles and captions frame the topic as an everyday business problem, not the law's name | YouTube packaging guidance | Step 13 caption and title |
| CR-9 | Hard checks in the renderer: no reel over 3 minutes; warn if the first cut comes after 2.5 s | Instagram recommendation limit; ABCD pace | `scripts/render.mjs` |

### For discussion, not proposed as rules

- **Faces**: ABCD and Shorts guidance both say people, and especially a real person speaking to camera, raise attention and trust. Khaled decided on 18 Nov 2026 not to appear on camera for now; the skill carries the human element through his voice, name and credentials. Revisit later.
- **Long-form YouTube**: the skill covers short video only. If Khaled wants long videos (for example 6 to 10 minute explainers of UAE Corporate Tax topics), the packaging lessons above would be the base of a separate skill.

## 4. Realistic AI presenter (studied 18 Nov 2026)

Khaled will not appear on camera for now and asked whether a realistic AI presenter can stand in. Sources read: YouTube Help "Disclosing use of GenAI content" (support.google.com/youtube/answer/14328491) and the YouTube blog announcement (18 Mar 2024); Meta's disclosure requirement as quoted from its Transparency Center and Help Centre (Partnership on AI case study by Meta, and summaries checked Oct–Nov 2026); ElevenLabs model guides for `creatify-aurora` and the lip-sync family (`bytedance-omnihuman-v1.5`, `minimax-h3-max-lipsync`, `sync-lipsync-v3`, `veed-fabric-1-fast`); practitioner guides on AI talking heads (blurstudio.ai, markmeets.com, domer.io, diyai.io, Oct–Nov 2026).

### Rules (platform requirements, not style)

- **Disclosure is required.** YouTube requires "AI use: Yes" for realistic content, explicitly including a synthetically generated voice narrating a video; for finance topics the label can show on the player. Meta requires the AI label on Instagram for photorealistic video **or realistic-sounding audio**, and names "a reel narrated with a realistic AI voiceover" as an example. Our ElevenLabs voice-overs already fall under this, presenter or not. Disclosing does not limit reach or monetisation on YouTube; not disclosing can lead to penalties.
- **The presenter must not pass as Khaled or any real person.** YouTube lists "making it appear as if someone gave advice they did not actually give" as disclosable, and a fake face presented as a named professional misleads clients. The presenter is a fictional SEN presenter, introduced as such, and never says "I am Khaled". Its face must not resemble a real person.
- **Same for the voice.** An ElevenLabs voice is not Khaled's voice, so the script never puts "أنا خالد" in its mouth. A clone of Khaled's own voice, made with his consent, would be the only exception.

### How to make it look real (ElevenLabs models available on the account)

- **Audio first.** Lock the voice-over (step 6), then animate the face to it. Lip-sync breaks when the video is planned before the final audio.
- **One fixed portrait.** Generate one front-facing, evenly lit, neutral-expression portrait (9:16, shoulders up, plain Midnight or soft studio background, Gulf business attire), approve it once, and reuse the same file in every reel so the presenter stays consistent. No text in the image (lip-sync models morph it).
- **Models.** `creatify-aurora` (made for studio talking heads, takes a framing prompt, `prompt_guidance` 1 to start); `bytedance-omnihuman-v1.5` (still image + audio, realistic, measured earlier at about 3,025 credits for 3 s); `minimax-h3-max-lipsync` (5–14.8 s of speech, no prompt, use 480p for drafts); `heygen-avatar4`. Always price with `estimate_only` first.
- **Short windows.** Use the presenter only for the hook (3–5 s) and the call to action (3–5 s), and cut to b-roll, cards and captions in between. Avatars hold up in short takes; long takes expose artefacts.
- **Script for the ear.** Short clauses, numbers written as they should be spoken, a pause between sentences, moderate speed. Test the hardest line (a number plus a law name) on a short draft before the full clip.
- **Check.** Watch the mouth on fast consonants, frozen eyes, repeated gestures, and voice–face match (age, tone). If a viewer's first question is "is this a real person?", it is not ready.

### Proposed next step (needs Khaled's approval and credits)

1. Generate 3 candidate presenter portraits (about 190 credits each with `gpt-image-2.5-sunburst`, about 570 in total) for Khaled to pick one.
2. A 5-second lip-sync test of the chosen portrait on one line of an existing voice, priced first with `estimate_only` (expected roughly 1,500–3,000 credits depending on the model).
3. If he approves the result, add an `presenter` scene type to the template and a section to the skill.
