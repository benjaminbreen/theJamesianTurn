# Project Plan: The Jamesian Turn (1889)

## Executive Summary
A high-fidelity, browser-based roguelike RPG simulation of the 1889 Exposition Universelle.
**Core Concept:** Play as Henry James navigating the social and mechanical complexities of the World's Fair.
**Aesthetic Direction:**
1.  **Default (The Chronoscope):** A modern, information-dense HUD. Dark mode, neon-amber accents, monospaced data streams, glassmorphism. Inspired by *Disco Elysium* and *Cyberpunk 2077*.
2.  **Optional (The Gaslight):** A diegetic, skeuomorphic overlay. Cream parchment, ink-bleed typography, sepia-toned vignettes, flickering vignette borders.
**Tech Stack:** React 18 (Vite), TypeScript, Tailwind CSS, Framer Motion, Howler.js (Audio), Gemini API (Text/Logic), Imagen (Visuals).

---

## Phase 1: The "Dual-Skin" Architecture
**Goal:** Build a robust container that supports instant thematic switching between "Cyber-HUD" and "Period-Parchment".

1.  **Theme Engine (`ThemeContext`)**
    *   Implement CSS variable bridges in Tailwind config.
    *   *Chronoscope Mode:* `bg-slate-950`, `text-amber-400`, font `Geist Mono` or `Fira Code`.
    *   *Gaslight Mode:* `bg-[#fdf6e3]` (Solarized Light base), `text-[#2b2520]` (Ink), font `EB Garamond`.
    *   Create a `LayoutShell` component that subscribes to theme state to swap entire distinct UI chrome (borders, panels).

2.  **Global State & Layout**
    *   **Left Panel:** "The Stream" (Scrolling log, internal monologue).
    *   **Center:** "The Viewport" (The game world).
    *   **Right Panel:** "The Inspector" (Context-aware details).
    *   **Bottom:** "The Action Deck" (Skills, Inventory, Status).

3.  **Gemini Service Layer**
    *   Initialize `@google/genai` client.
    *   Setup distinct System Instructions for:
        *   `Narrator`: Omniscient, detailed, Jamesian prose.
        *   `Director`: Handles game logic, state updates, JSON outputs.

## Phase 2: The Tactile Grid & "Smart Interaction"
**Goal:** Create a game loop that feels like an Action RPG, not just a text parser.

1.  **The Kinetic Renderer**
    *   Grid-based map using CSS Grid + Framer Motion layout animations.
    *   **Smooth Movement:** Entities `lerp` between cells rather than snapping.
    *   **Lighting:** Raycasting algorithm for Line-of-Sight visibility. Dark tiles fade out; lit tiles have bloom (in Dark mode) or ink contrast (in Light mode).

2.  **The "Smart Spacebar" (Contextual Action)**
    *   Implement a `InteractionScanner` that checks the tile directly in front of the player.
    *   **Behavior Matrix:**
        *   *Facing NPC:* **"Greet / Interject"** (Opens Dialogue).
        *   *Facing Item:* **"Acquire"** (Pickup animation).
        *   *Facing Machine:* **"Inspect / Fiddle"** (Trigger description).
        *   *Facing Nothing:* **"Observe"** (Triggers a "Jamesian Observation" of the environment).
        *   *Hold Space:* **"Eavesdrop"** (Expands hearing radius to catch NPC chatter).

3.  **Feedback Loops**
    *   Screen shake on impact/surprise.
    *   Tooltip floating text (`+1 Erudition`, `New Rumor Acquired`) appearing over player head.

## Phase 3: Temporal Geography (World & Assets)
**Goal:** Construct the 1889 Fair with generative visual flair.

1.  **Zone Architecture**
    *   **The Eiffel Tower:** Vertical scrolling grid with steam elevator cutscene.
    *   **The Gallery of Machines:** Massive open industrial space.
    *   **The Esplanade:** Open-air crowd navigation.

2.  **Generative Backdrops (Imagen)**
    *   When entering a new Zone, call `ai.models.generateImages`.
    *   Prompt: "An etching style illustration of the [Zone Name] at the 1889 Paris World Fair, detailed, architectural."
    *   Display this image with a low opacity overlay in the background of the grid or as a "Loading/Transition" plate.

## Phase 4: The "Persona" System & Social Physics
**Goal:** NPCs that feel like physical entities with social gravity.

1.  **Historical Figures**
    *   Database: Oscar Wilde, Thomas Edison, Guy de Maupassant, Buffalo Bill.
    *   **Visuals:** Generate pixel-art or etching-style avatars using Imagen for the Inspector panel.

2.  **Gossip as Currency**
    *   New Mechanic: `Rumors`.
    *   Eavesdropping (Hold Space) collects `Rumor` fragments.
    *   Rumors can be "Equipped" in dialogue to unlock specific branches.

3.  **Dynamic Dialogue UI**
    *   Not just a list of choices.
    *   **Tone Slider:** Player adjusts "Polite <-> Snide" before speaking.
    *   **Interrupt:** If an NPC is speaking (text streaming), hitting Spacebar attempts to "Interrupt" with a specific witticism.

## Phase 5: "Repartee" (Action-Based Social Combat)
**Goal:** Pokemon meets Oscar Wilde. Turn-based but snappy.

1.  **Combat UI**
    *   Camera zooms in (CSS scale transform).
    *   Health Bars: `Composure` (HP) and `Reputation` (Armor).

2.  **The Move Set**
    *   Moves are collected like spells.
    *   *The Withering Glare*: Low damage, lowers opponent defense.
    *   *The Obscure Reference*: High damage, requires High Erudition.
    *   *The Backhanded Compliment*: Heals self (Composure), damages opponent.

3.  **Active Resolution**
    *   LLM generates the specific insult based on context.
    *   **Crit Mechanic:** If the player inputs a move that uses a relevant `Rumor` or `Fact` about the NPC, it crits.

## Phase 6: The Narrative Director (Events)
**Goal:** Emergent storytelling driven by location and chance.

1.  **Procedural Vignettes**
    *   Tile triggers: Stepping on a specific tile might trigger "You step in a puddle of spilled champagne."
    *   Gemini prompts generate 3-choice micro-scenarios.

2.  **The Elevator Cinematic**
    *   A scripted sequence.
    *   Animation: Grid moves down rapidly.
    *   Audio: Steam hiss, clanking gears.
    *   Visual: Parallax scrolling of the Paris skyline (ASCII or generated Image).

## Phase 7: Material Culture (Inventory & Artifacts)
**Goal:** Historically accurate items with generative visuals.

1.  **The Inventory Grid**
    *   Drag-and-drop UI.
    *   Items take up physical slots (Resident Evil 4 style simplified).

2.  **Item Inspection (Generative)**
    *   Clicking "Inspect" on an item (e.g., "A Baedeker Guide").
    *   Call `gemini-pro` for a text excerpt.
    *   Call `imagen-4.0` for a visual: "A vintage 1889 guidebook cover, worn texture, photorealistic isolation."
    *   Display the image in a specialized "Artifact Viewer" modal.

## Phase 8: The Veracity Engine (Education Layer)
**Goal:** Real-time fact-checking that rewards learning.

1.  **The Truth Serum Agent**
    *   Runs in background.
    *   If the `RoleplayAgent` hallucinates (e.g., claims Einstein was there), the `VeracityAgent` flags it.

2.  **The "Footnote" Mechanic**
    *   In-text hyperlinks appear in the Game Log on historical terms.
    *   Hovering opens a "Wikipedia Card" (fetched via Wikipedia API).
    *   Reading footnotes grants XP (`Erudition`).

## Phase 9: Assessment & The "Obituary"
**Goal:** Meaningful, sarcastic feedback.

1.  **The Critic**
    *   Compiles the `SessionLog`.
    *   Generates a review in the style of a 19th-century literary critic.
    *   Assigns a "Jamesian Score" based on: Subtlety, Verbosity, and Social Standing.

2.  **Data Viz**
    *   Radar chart showing: *Wit, Snobbery, Melancholy, Modernity*.

## Phase 10: Sensory Immersion (Audio & Polish)
**Goal:** High-quality sound and final UX.

1.  **Audio Engineering (Howler.js)**
    *   **BGM:** Minimalist Erik Satie-esque piano (Generated or Stock).
    *   **SFX:**
        *   *Dialogue:* Typewriter clacking (pitch-shifted per character).
        *   *Spacebar:* Satisfying mechanical "thock" or "switch" sound.
        *   *Ambience:* Low-pass filtered crowd noise, distant steam whistles.

2.  **Particle Effects**
    *   Smoke particles (Canvas API) in the Gallery of Machines.
    *   Dust motes floating in the Viewport.

3.  **Testing & Settings**
    *   Text speed sliders.
    *   "Reduced Motion" accessibility.
    *   Export Save Game to JSON.