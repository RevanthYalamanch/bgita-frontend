// 🗂️ BGita curriculum — Gita-grounded resilience skills across three tracks.
//
// Per Claude.md, the course blends three evidence-based skill sets, each mapped
// to a moment from the Bhagavad Gita and translated into plain, secular
// language. The three tracks (internal codes CBT / DBT / ACT) are surfaced to
// users only as warm, non-clinical titles — never as "therapy" / "treatment".
//
//   TRACK 1 · CBT → "Seeing Clearly"        — working with thoughts
//   TRACK 2 · DBT → "Steadying the Storm"    — riding strong emotions
//   TRACK 3 · ACT → "Living Your Values"     — acting on what matters
//
// The wizard renders three typed steps from each lesson:
//   - Learn    → gita_anchor + concept { hook, bridge, example }
//   - Practice → exercise { type, title, instructions, fields | options }
//   - Commit   → reflection_prompt
//
// Lesson schema:
//   id              int, sequential — also drives unlock order
//   modality        "CBT" | "DBT" | "ACT"  — internal tag, matches a TRACKS id
//   mechanism       internal clinical name (metadata / AI context only; never shown)
//   skill           user-facing, plain-language skill name (shown as overline)
//   title, objective
//   gita_anchor     { ref, teaching }  — teaching is a public-domain paraphrase
//   concept         { hook, bridge, example }  — bridge/example support **markdown**
//   exercise        { type, title, instructions, fields | options, notesLabel }
//   reflection_prompt
//   safety_note     clinical guardrail for this exercise (Claude.md non-negotiable)
//   ai_prompt_context  unused in the typed-only phase; kept for the AI-coach phase
//
// exercise.type:
//   "fields" → each `fields[]` entry renders a labeled text input
//   "chips"  → `options[]` render as multi-select tags + a notes box
//
// LANGUAGE RULES (enforced): no Sanskrit entry points, no New-Age register, no
// clinical jargon ("cognitive defusion", "radical acceptance") as user-facing
// labels — those live in `mechanism`. DBT lessons ALWAYS validate the emotion
// before any reframe; equanimity = non-reactivity, never suppression.

export const TRACKS = [
  {
    id: "CBT",
    title: "Seeing Clearly",
    tagline: "Working with your thoughts",
    blurb: "Untangle the thoughts that shape how you feel — catch them, question them, and act."
  },
  {
    id: "DBT",
    title: "Steadying the Storm",
    tagline: "Riding strong emotions",
    blurb: "Meet intense feelings and urges with balance, without being swept away or shutting down."
  },
  {
    id: "ACT",
    title: "Living Your Values",
    tagline: "Acting on what matters",
    blurb: "Step back from your thoughts and move toward the life you actually want."
  },
  {
    id: "CAPSTONE",
    title: "Bringing It Together",
    tagline: "Your plan for the hard days",
    blurb: "Weave every skill you've learned into one personal plan you can reach for when your wellbeing dips."
  }
];

export const LESSON_DATA = [
  // ───────────────────────── TRACK 1 · CBT — Seeing Clearly ─────────────────────────
  {
    id: 1,
    modality: "CBT",
    mechanism: "cognitive_model_cbt_triangle",
    skill: "The Cognitive Model",
    title: "The Warrior's Collapse — The Event Isn't the Enemy",
    objective: "See that a situation doesn't directly cause a feeling — the thought wedged in between does.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "Facing the battlefield, a great warrior feels his limbs go weak, his mouth go dry, and his bow slip from his hand. No arrow has been fired. He collapses under the meaning he gives the moment, not the moment itself."
    },
    concept: {
      hook: "The greatest archer alive sinks down unable to act — undone not by the battle, but by the story he tells about it.",
      bridge: "There's a simple map for this: a **Situation** sparks a **Thought**, the thought drives a **Feeling**, and the feeling shapes a **Behavior**. The situation rarely changes how we feel on its own — the thought in the middle does. Shift that, and the whole chain shifts.",
      example: "A friend doesn't text back. *Situation:* no reply. *Thought:* \"They're done with me.\" *Feeling:* rejected. *Behavior:* you go quiet too. Swap the thought to \"They're probably swamped\" and the feeling and behavior change — same situation."
    },
    exercise: {
      type: "fields",
      title: "Map your own battlefield",
      instructions: "Recall a small moment in the last day or two that knocked your mood. Pull it apart into the four corners of the map. Keep the Situation strictly to what a camera would have recorded.",
      fields: [
        { key: "situation", label: "Situation — just the facts", placeholder: "e.g. My manager said \"let's talk later\" and walked off" },
        { key: "thought", label: "Thought — what ran through your mind", placeholder: "e.g. I'm about to get fired" },
        { key: "feeling", label: "Feeling — one word + intensity (0–10)", placeholder: "e.g. Anxious, 8/10" },
        { key: "behavior", label: "Behavior — what you did next", placeholder: "e.g. Couldn't focus, rehearsed the worst all afternoon" }
      ]
    },
    reflection_prompt: "If the exact same situation happened to a friend, what's a fairer thought they might have had? Write the one you'll try to reach for next time.",
    safety_note: "This is a tool for everyday upsets, not for working through trauma. If pulling a moment apart brings up overwhelming distress or thoughts of harming yourself, pause and reach out to the 988 Suicide & Crisis Lifeline (call or text 988). It supports self-understanding — it doesn't replace professional care.",
    ai_prompt_context: "User is in the 'Seeing Clearly' track, lesson on the cognitive model, anchored in the ancient story of a warrior's collapse before battle. Help them separate the bare facts of a recent upsetting event from the interpretation they layered on top. Teach in plain, secular language; do not name the source text or its characters."
  },
  {
    id: 2,
    modality: "CBT",
    mechanism: "automatic_negative_thoughts",
    skill: "Catching Automatic Thoughts",
    title: "The Restless Mind — Catching Automatic Thoughts",
    objective: "Notice the fast, unquestioned thoughts that fire just before your mood drops.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "In the same old story, the warrior admits his mind is restless, turbulent, and stubborn — as hard to hold as the wind. His guide doesn't deny it; he says the mind can still be trained through steady practice."
    },
    concept: {
      hook: "The mind throws off thoughts as fast as wind, and most fly by unexamined — yet we treat them as the plain truth.",
      bridge: "These quick, reflexive, believed-on-contact thoughts are **automatic thoughts**. You can't stop the wind, but you *can* learn to catch a thought as it passes. The first skill isn't fixing thoughts; it's simply **noticing** them.",
      example: "Mid-conversation your stomach tightens. Rewind two seconds and there it is: \"I sound stupid.\" That flash — gone before you clocked it — is the automatic thought steering the whole feeling."
    },
    exercise: {
      type: "fields",
      title: "Set a thought trap",
      instructions: "Think back to a moment today when your mood suddenly dipped. Freeze the two seconds just before it and write down the thought exactly as it sounded in your head — no cleaning it up.",
      fields: [
        { key: "moment", label: "The moment — when did your mood dip?", placeholder: "e.g. Right after I opened my inbox this morning" },
        { key: "thought", label: "The automatic thought that flashed by", placeholder: "e.g. I'm so behind, I'll never catch up" },
        { key: "believe", label: "How much did you believe it then? (0–100%)", placeholder: "e.g. 90%" }
      ]
    },
    reflection_prompt: "What's the negative thought that most often pops up automatically when you make a mistake? Name it so you can spot it next time.",
    safety_note: "Noticing hard thoughts can sting. The aim is to observe them, not to judge yourself for having them. If the thoughts turn toward harming yourself, stop the exercise and contact 988 (call or text).",
    ai_prompt_context: "User is in the 'Seeing Clearly' track, lesson on catching automatic thoughts, anchored in the ancient story's image of the restless mind. Help them rewind to the thought that fired just before a mood drop and write it verbatim, without judging it yet. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 3,
    modality: "CBT",
    mechanism: "cognitive_distortions",
    skill: "Naming Thinking Traps",
    title: "The Clouded Eye — Naming Thinking Traps",
    objective: "Label the specific traps that warp a thought, which loosens their grip.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The old story traces how a churning mind clouds itself: dwelling breeds craving, craving breeds anger, anger breeds confusion, and confusion blurs clear seeing. An agitated mind doesn't see reality — it sees a distortion of it."
    },
    concept: {
      hook: "An agitated mind doesn't show you the world; it shows you a warped picture and swears it's real.",
      bridge: "These warps fall into recurring **thinking traps** — tricks like **Catastrophizing**, **All-or-Nothing** thinking, **Mind Reading**, and **Emotional Reasoning**. You don't have to argue with a thought to weaken it. Often, just **naming the trap** is enough to take the air out of it.",
      example: "\"She didn't smile back — she can't stand me.\" Name it: *Mind Reading* (assuming her thoughts) plus *Catastrophizing* (a frown becomes a verdict). Labeled, it shrinks from fact to guess."
    },
    exercise: {
      type: "chips",
      title: "Name the trap",
      instructions: "Take a negative thought you've been carrying lately. Tag every thinking trap it falls into — click all that apply — then write the thought and why those labels fit.",
      options: [
        "Catastrophizing (expecting the worst)",
        "All-or-Nothing (black & white)",
        "Mind Reading (assuming others' thoughts)",
        "Fortune Telling (predicting the future)",
        "Emotional Reasoning (I feel it, so it's true)",
        "Should Statements (rigid rules)",
        "Personalizing (it's all my fault)",
        "Mental Filter (only seeing the negative)"
      ],
      notesLabel: "Write the thought, then why these labels fit"
    },
    reflection_prompt: "Which thinking trap do you fall into most often? Naming your usual one makes it easier to catch in the moment.",
    safety_note: "Naming a thinking trap is about loosening a thought's grip — never about deciding a real, serious problem 'isn't real.' Trust your judgment about genuine danger or mistreatment.",
    ai_prompt_context: "User is in the 'Seeing Clearly' track, lesson on thinking traps, anchored in the ancient story's account of how an agitated mind clouds itself. Briefly explain a few common traps and help them label which a recent thought falls into. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 4,
    modality: "CBT",
    mechanism: "cognitive_restructuring",
    skill: "Putting Thoughts on Trial",
    title: "The Sword of Discernment — Thoughts on Trial",
    objective: "Weigh a distorted thought against real evidence and build a fairer, balanced one.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The old story teaches that a clear, settled mind dissolves sorrow, while an unsteady mind finds neither wisdom nor peace. Discernment is the blade that cuts confusion from fact."
    },
    concept: {
      hook: "Just because you think it doesn't make it true — a thought deserves a trial before you sentence yourself with it.",
      bridge: "Take the thought to court: list the hard evidence **for** it, the hard evidence **against** it, then deliver a **balanced verdict** the facts actually support. Feelings are testimony, not proof.",
      example: "Thought: \"I always mess up presentations.\" *For:* I stumbled today. *Against:* I've given dozens that went fine; people asked good questions. *Verdict:* \"That one was rough, and I'm generally a capable presenter.\""
    },
    exercise: {
      type: "fields",
      title: "Put the thought on trial",
      instructions: "Pick a negative thought you're believing right now. Be a fair judge — only hard, objective facts count as evidence on either side, not feelings or opinions.",
      fields: [
        { key: "thought", label: "The thought on trial", placeholder: "e.g. Nobody on the team respects me" },
        { key: "evidence_for", label: "Evidence FOR it (hard facts only)", placeholder: "e.g. Two people talked over me in the meeting" },
        { key: "evidence_against", label: "Evidence AGAINST it (hard facts only)", placeholder: "e.g. Priya asked for my input; my idea got used last week" },
        { key: "verdict", label: "The balanced verdict", placeholder: "e.g. Some interactions sting, but there's real evidence I'm valued" }
      ]
    },
    reflection_prompt: "Read your balanced verdict back. How does the feeling change when you hold the fairer thought instead of the original one?",
    safety_note: "Weighing evidence works on distorted thoughts — not on real losses or threats. Some hard things are simply hard, and deserve compassion rather than debate. This isn't a way to argue yourself out of a feeling that's telling you something true.",
    ai_prompt_context: "User is in the 'Seeing Clearly' track, lesson on cognitive restructuring, anchored in the ancient story's praise of the discerning, settled mind. Use Socratic questions to help them weigh evidence for and against a thought and craft a balanced alternative. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 5,
    modality: "CBT",
    mechanism: "behavioral_activation",
    skill: "Action Over Inertia",
    title: "Action Over Inertia — Move First, Mood Follows",
    objective: "Act first to lift your mood, instead of waiting for motivation that won't come.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "Do the work in front of you, the old story urges — action is better than inaction. The warrior is coaxed out of paralysis: even imperfect action keeps life moving, while sinking into inertia only deepens the fog."
    },
    concept: {
      hook: "When we're low, we wait to feel motivated before we act — but with a heavy mind, motivation almost never shows up first.",
      bridge: "So flip the order: **act first, and the motivation follows**. Withdrawing feels safe but quietly removes every source of reward, sinking you lower. One tiny, deliberate action breaks the loop — momentum, not mood, is the lever.",
      example: "You can't face cleaning the flat, so you do nothing and feel worse. Instead: set a timer and wash three dishes. The dread that built all day cracks the moment you start."
    },
    exercise: {
      type: "fields",
      title: "Plan one tiny action",
      instructions: "Pick something small you've been avoiding, then shrink it until it's almost too easy to refuse. Commit to a real time and place — and do it whether or not you feel like it.",
      fields: [
        { key: "avoided", label: "One small activity you've been avoiding", placeholder: "e.g. Replying to my friend's message" },
        { key: "tiny", label: "Shrink it to a 5-minute version", placeholder: "e.g. Send a one-line reply, not a perfect paragraph" },
        { key: "when", label: "Exact time & place you'll do it", placeholder: "e.g. Tonight at 8pm, at my desk" },
        { key: "motivation", label: "Motivation right now (0–10) — do it anyway", placeholder: "e.g. 3/10" }
      ]
    },
    reflection_prompt: "What's the most likely obstacle between you and that 5-minute action — and how will you get past it?",
    safety_note: "Start absurdly small. If even a tiny step feels impossible for a long stretch, that heaviness is worth taking to a professional — these tools support care, they don't replace it.",
    ai_prompt_context: "User is in the 'Seeing Clearly' track, lesson on behavioral activation, anchored in the ancient story's call to action over inertia. Help them shrink an avoided task to a tiny, scheduled step they'll do regardless of motivation. Keep language plain and secular; do not name the source text or its characters."
  },

  // ──────────────────────── TRACK 2 · DBT — Steadying the Storm ────────────────────────
  {
    id: 6,
    modality: "DBT",
    mechanism: "wise_mind_emotion_regulation",
    skill: "Finding Your Steady Center",
    title: "The Steady Center — Meeting Emotion With Balance",
    objective: "Feel an emotion fully without being swept away by it — by finding the steady place between raw feeling and cold logic.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The person of steady wisdom, the old story says, is untroubled in sorrow and not grasping in pleasure — free of clinging and fear. This steadiness isn't coldness; it's meeting joy and grief without being thrown by either."
    },
    concept: {
      hook: "Steadiness isn't feeling nothing — it's feeling something fully and still keeping your feet.",
      bridge: "There's a place between **raw emotion** (all feeling, no perspective) and **cold logic** (all reason, no heart): the steady center where both are honored. The first move is never to argue with an emotion — it's to **name it and let it be there**, then act from the calm underneath. Honoring the feeling and seeing clearly are not opposites.",
      example: "Furious at a curt email? Pure emotion fires off an angry reply; pure logic says 'don't be irrational.' The steady center says: 'I'm angry — that's fair, it felt dismissive. And I'll wait an hour before I respond.' The feeling is honored; the action stays steady."
    },
    exercise: {
      type: "fields",
      title: "Map your steady center",
      instructions: "Bring to mind something that stirred a strong feeling recently. We honor the emotion first, then find the steady center — never skip the first step.",
      fields: [
        { key: "emotion", label: "Name the emotion + intensity (0–10) — no judging it", placeholder: "e.g. Hurt, 7/10" },
        { key: "validate", label: "Why does this feeling make complete sense?", placeholder: "e.g. I was left out, and anyone would feel that sting" },
        { key: "emotion_says", label: "What is the raw emotion urging you to do?", placeholder: "e.g. Send a sharp text and shut everyone out" },
        { key: "logic_says", label: "What does cool reason point out?", placeholder: "e.g. They may not have realized; one event isn't the whole friendship" },
        { key: "wise", label: "Steady-center move — honoring both", placeholder: "e.g. Calmly tell them it stung, and ask what happened" }
      ]
    },
    reflection_prompt: "Next time a big feeling hits, what's one phrase you'll say to yourself to honor the emotion before you act on it?",
    safety_note: "Steadiness means feeling your emotions, never suppressing or 'rising above' them — pushing feelings down backfires. If an emotion is so intense it feels unbearable or unsafe, that's a moment for real-time support: 988 (call or text), not a worksheet.",
    ai_prompt_context: "User is in the 'Steadying the Storm' track, lesson on wise mind / emotion regulation, anchored in the ancient story's portrait of the steady, even-minded person. ALWAYS validate the emotion first; never suggest suppressing it. Help them find the balance between raw feeling and cold logic. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 7,
    modality: "DBT",
    mechanism: "distress_tolerance_urge_surfing",
    skill: "Riding Out the Urge",
    title: "The Tortoise — Riding Out the Storm",
    objective: "Get through a wave of intense urge or distress without acting on it — and without making it worse.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The old story offers an image: as a tortoise draws its limbs in from every side, a steady person can draw their attention back from whatever pulls at them. The urge passes; you don't have to chase it."
    },
    concept: {
      hook: "Every urge is a wave — it rises, peaks, and falls on its own if you don't feed it.",
      bridge: "When distress spikes, there's a pull to do something *now* to make it stop — lash out, numb out, run. The skill is to **ride the wave** instead. Like the tortoise pulling in, you create a pause: you don't fight the urge and you don't obey it. You let it crest and pass, buying time until the storm settles enough to choose.",
      example: "Hit with a craving to doom-scroll at 1am? Instead of fighting or feeding it: name it ('here's the urge'), set a 10-minute timer, splash cold water on your face, breathe. Ten minutes later the wave is smaller — and you didn't have to win a war with it."
    },
    exercise: {
      type: "fields",
      title: "Ride the wave",
      instructions: "Think of an urge or wave of distress you tend to act on too fast. Build your tortoise plan — the pause you'll take while the wave passes. The aim is to get through it safely, not to fix everything.",
      fields: [
        { key: "urge", label: "The urge or distress that hits hard", placeholder: "e.g. The urge to send an angry text when I feel ignored" },
        { key: "cost", label: "What does acting on it usually cost you after?", placeholder: "e.g. Regret, a bigger fight, shame the next morning" },
        { key: "pause", label: "Your tortoise move — how you'll pull back and pause", placeholder: "e.g. Put the phone in another room, set a 15-min timer" },
        { key: "ground", label: "One thing that helps the wave pass", placeholder: "e.g. Step outside and walk to the end of the street" }
      ]
    },
    reflection_prompt: "What's the shortest pause you could commit to next time an urge spikes — even 5 minutes — before you decide anything?",
    safety_note: "These tools are for riding out everyday urges and distress — they are NOT a crisis safety plan. If the urge is to harm yourself or someone else, skip the worksheet and reach out now: 988 Suicide & Crisis Lifeline (call or text 988), or text HOME to 741741.",
    ai_prompt_context: "User is in the 'Steadying the Storm' track, lesson on distress tolerance / urge surfing, anchored in the ancient story's image of the tortoise drawing in its limbs. Help them build a pause-and-ride-the-wave plan. Keep language plain and secular; do not name the source text or its characters. The deterministic safety layer handles any self-harm content — do not coach crisis planning."
  },
  {
    id: 8,
    modality: "DBT",
    mechanism: "radical_acceptance_dvandvas",
    skill: "Accepting What You Can't Change",
    title: "The Pairs of Opposites — Accepting What Is",
    objective: "Stop fighting a painful reality you can't change, so your energy goes to what you can do next.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The old story notes that contact with the world brings cold and heat, pleasure and pain — they arrive and depart, never permanent. Its counsel is to meet them with endurance rather than being tossed between them."
    },
    concept: {
      hook: "Pain is part of life; suffering is the extra we pile on by insisting reality should be otherwise.",
      bridge: "Life runs in pairs — gain and loss, praise and blame, comfort and pain. We brace against the hard half, and that fight (\"this shouldn't be happening\") adds a second layer of pain on top of the first. **Accepting** what is isn't approval or giving up — it's stopping the war with what already *is*, so your energy is free for what you can actually do. You accept the fact; you don't have to like it.",
      example: "A flight's cancelled. Reality: you're stuck tonight. Fighting it — replaying the unfairness, fuming — changes nothing and wrecks your evening. Accepting it ('this is what's true right now') frees you to book a room and call it a night. The loss stays; the suffering shrinks."
    },
    exercise: {
      type: "fields",
      title: "Accept and redirect",
      instructions: "Pick something painful that's already real and outside your control. We separate the fact from the fight, then aim your energy forward. Acceptance doesn't mean it's okay — only that it's true.",
      fields: [
        { key: "reality", label: "The hard reality you keep fighting (just the fact)", placeholder: "e.g. The relationship is over" },
        { key: "fight", label: "How are you fighting it? (the 'it shouldn't be this way' loop)", placeholder: "e.g. Replaying what I should've said, asking why over and over" },
        { key: "accept", label: "Say it plainly: 'This is true right now, even though I don't like it.'", placeholder: "e.g. It's over, and that's the reality I'm living in" },
        { key: "control", label: "What IS still in your hands today?", placeholder: "e.g. How I spend tonight; who I lean on; my next small step" }
      ]
    },
    reflection_prompt: "Where in your life are you spending energy fighting something you can't change — and what would you do with that energy back?",
    safety_note: "Acceptance is for realities you genuinely can't change — never for excusing harm or abuse you could act on or leave. If you're 'accepting' mistreatment because you feel trapped, that's a place for real support, not acceptance: 988, or the National Domestic Violence Hotline at 1-800-799-7233.",
    ai_prompt_context: "User is in the 'Steadying the Storm' track, lesson on radical acceptance of the pairs of opposites, anchored in the ancient story's teaching that pleasure and pain come and go. Stress that acceptance is not approval. Never push acceptance of abuse, or of anything the user can change or leave. Keep language plain and secular; do not name the source text or its characters."
  },

  // ──────────────────────── TRACK 3 · ACT — Living Your Values ────────────────────────
  {
    id: 9,
    modality: "ACT",
    mechanism: "committed_action",
    skill: "Committed Action",
    title: "The Fruits of Action — Commit, Then Release",
    objective: "Pour yourself fully into a values-driven action while letting go of the outcome you can't control.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "You have a right to your actions, the old story says, but never to their fruits. Give yourself fully to the doing; loosen your grip on the result, which was never entirely yours to command."
    },
    concept: {
      hook: "You own your effort, not the outcome — and that's oddly freeing, not defeating.",
      bridge: "So much paralysis comes from fixating on results we can't control — will it work, will they approve. **Committed action** flips the focus: choose an action that reflects what you care about, and pour yourself into the *doing* itself, releasing your grip on the payoff. You act because it matters to you, not because success is guaranteed. The result is the world's to decide; the action is yours.",
      example: "Writing a heartfelt apology. Outcome-focused: you obsess over whether they'll forgive you, and freeze. Action-focused: 'My value is honesty and repair — I'll write and send a sincere apology, and their response is theirs.' You did the thing that mattered, fully, whatever comes back."
    },
    exercise: {
      type: "fields",
      title: "Commit to the action, release the fruit",
      instructions: "Pick something you've stalled on because you're scared of how it'll turn out. We root it in a value, define the action you control, and name the fruit to release.",
      fields: [
        { key: "stuck", label: "Something you've stalled on, fixated on the outcome", placeholder: "e.g. Applying for the job I think I'll never get" },
        { key: "value", label: "What value makes this matter to you?", placeholder: "e.g. Growth — not letting fear pick my ceiling" },
        { key: "action", label: "The action that's fully in your control", placeholder: "e.g. Submit one solid application this week" },
        { key: "fruit", label: "The fruit to release (out of your hands)", placeholder: "e.g. Whether they call me back" }
      ]
    },
    reflection_prompt: "What's one action this week you'll commit to fully — measuring yourself by the doing, not the outcome?",
    safety_note: "Releasing the outcome is freedom from what you can't control — not permission to stop caring or to act recklessly. It pairs effort with peace; it never means giving up on your wellbeing or your future.",
    ai_prompt_context: "User is in the 'Living Your Values' track, the FLAGSHIP committed-action exercise, anchored in the ancient story's teaching to give yourself fully to the action and release the result. Help them tie an action to a chosen value, commit to what they control, and release the result. Always frame values as chosen, never assigned. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 10,
    modality: "ACT",
    mechanism: "observing_self",
    skill: "The Observing Self",
    title: "The Witness — The You That Watches",
    objective: "Notice the steady part of you that observes your thoughts and feelings — and isn't shaken by them.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "The old story draws a distinction between the changing field — the body, the mind, and its passing states — and the quiet one who knows it, the observer within. Thoughts and moods are the weather; something in you watches the weather."
    },
    concept: {
      hook: "Thoughts and feelings come and go all day — but the *you* that notices them stays the same.",
      bridge: "Behind every passing thought and mood, there's a part of you simply **noticing** it — the watcher that was there on your worst day and your best. This isn't a mystical claim about a soul; it's a practical stance: when you stand as the watcher, a painful thought becomes *something you're having*, not *who you are*. The storm is real; you are the sky it moves through.",
      example: "\"I'm a failure\" feels like a verdict on all of you. Step into the watcher: 'I notice my mind is offering the thought that I'm a failure — and I'm the one noticing it.' The thought shrinks to one piece of passing weather, observed by a you that's bigger than it."
    },
    exercise: {
      type: "fields",
      title: "Take the watcher's seat",
      instructions: "Bring up a thought or feeling you've been wrapped up in. We practice stepping back into the part of you that simply watches it.",
      fields: [
        { key: "wrapped", label: "A thought or feeling you've been caught up in", placeholder: "e.g. I'm not cut out for this" },
        { key: "notice", label: "Restate it from the watcher's seat: 'I notice I'm having the thought/feeling that…'", placeholder: "e.g. I notice I'm having the thought that I'm not cut out for this" },
        { key: "constant", label: "Name something true about you that hasn't changed through many moods", placeholder: "e.g. I keep showing up for the people I love, good days and bad" }
      ]
    },
    reflection_prompt: "When a strong thought claims to be the whole truth about you, what reminder will help you step back into the part that's just watching?",
    safety_note: "The observing self is a practical way to get distance from painful thoughts — not a claim that your feelings aren't real or don't matter. If stepping back tips into feeling numb, detached, or unreal for long stretches, mention it to a professional.",
    ai_prompt_context: "User is in the 'Living Your Values' track, lesson on the observing self, anchored in the ancient story's distinction between the changing mind and the quiet observer within. STRIP all metaphysics — present this as a practical stance, never a soul claim. Help them experience the watcher behind the thought. Keep language plain and secular; do not name the source text or its characters."
  },
  {
    id: 11,
    modality: "ACT",
    mechanism: "cognitive_defusion",
    skill: "Unhooking From Thoughts",
    title: "Unhooking — You Are Not Your Thoughts",
    objective: "Loosen a sticky thought's grip by changing your relationship to it — without having to argue it away.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "When the warrior calls the mind restless and hard to hold, his guide agrees — and says it can still be steadied through practice and a lighter grip. You don't have to win against the mind; you can learn to hold its thoughts loosely."
    },
    concept: {
      hook: "A thought only runs you when you're hooked to it — loosen the grip and it's just words passing through.",
      bridge: "Earlier you learned to put thoughts on trial. Sometimes, though, a thought won't lose an argument — it just keeps gripping. **Unhooking** skips the debate: instead of asking *is this thought true?*, you change how you *hold* it. Adding 'I'm having the thought that…', thanking your mind, or even saying it in a silly voice drains its power — not because it's false, but because you've stopped treating it as a command.",
      example: "Stuck on 'I'll embarrass myself.' Don't argue — unhook: say it in a cartoon voice, or 'Thanks, mind, for trying to protect me.' Same words, but now you can see them instead of through them, and walk into the room anyway."
    },
    exercise: {
      type: "fields",
      title: "Unhook the thought",
      instructions: "Take a sticky thought that keeps hooking you. We loosen its grip — the goal is distance, not winning a debate with it.",
      fields: [
        { key: "hook", label: "The thought that keeps hooking you", placeholder: "e.g. Everyone can tell I don't belong here" },
        { key: "preface", label: "Add a label: 'I'm having the thought that…'", placeholder: "e.g. I'm having the thought that everyone can tell I don't belong" },
        { key: "thank", label: "Thank your mind for it (it's trying, clumsily, to protect you)", placeholder: "e.g. Thanks, mind, for trying to keep me safe from rejection" },
        { key: "anyway", label: "What will you do anyway, with the thought just along for the ride?", placeholder: "e.g. Stay 30 more minutes and talk to one person" }
      ]
    },
    reflection_prompt: "Which thought hooks you most often — and which unhooking move will you keep in your pocket for it?",
    safety_note: "Unhooking changes your relationship to a thought; it doesn't mean ignoring real problems that need action. And it's never for brushing off thoughts of harming yourself — those call for real support: 988 (call or text).",
    ai_prompt_context: "User is in the 'Living Your Values' track, lesson on cognitive defusion, anchored in the ancient story's counsel to steady the restless mind with a lighter grip. Help them change their relationship to a thought (label it, thank the mind, hold it lightly) rather than debating its truth. Keep language plain and secular; do not name the source text or its characters. Never use the thought to dismiss self-harm signals."
  },
  {
    id: 12,
    modality: "ACT",
    mechanism: "values_clarification_svadharma",
    skill: "Choosing Your Values",
    title: "Your Own Path — Living by Your Values",
    objective: "Name the values that are truly yours, and take one concrete step to live by them this week.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "Better your own path, though imperfect, than another's walked to perfection — so the old story goes. A life built on borrowed expectations rings hollow, while a life that's authentically yours — flaws and all — is the one worth living."
    },
    concept: {
      hook: "A flawed life that's truly yours beats a polished one you're living for everyone else.",
      bridge: "When the thoughts and feelings settle, one question remains: *what do you actually want to stand for?* **Values** are your chosen directions — not goals you finish, but the way you want to travel: kindness, courage, honesty, creativity. They're yours to pick, never assigned by anyone's expectations. Naming them gives 'rise and act' a direction — your own imperfect path, walked on purpose.",
      example: "Drifting through a job that looks impressive but feels empty? Name the value underneath — maybe 'creativity' or 'helping people directly.' One step: spend two hours this week on work that actually expresses it. The whole life needn't change today; the direction can."
    },
    exercise: {
      type: "fields",
      title: "Chart your path",
      instructions: "This is about what YOU choose to stand for — not what you 'should' value or what others expect of you. Pick honestly, then take one real step.",
      fields: [
        { key: "values", label: "Three values that are genuinely yours", placeholder: "e.g. Honesty, creativity, showing up for family" },
        { key: "drifting", label: "Where is your life drifting from one of them?", placeholder: "e.g. I value creativity but haven't made anything in months" },
        { key: "step", label: "One concrete step this week to live that value", placeholder: "e.g. Spend Saturday morning sketching, no phone" },
        { key: "obstacle", label: "The likely obstacle — and how you'll meet it", placeholder: "e.g. 'No time' — so I'll put it in the calendar tonight" }
      ]
    },
    reflection_prompt: "If you lived one value more fully starting tomorrow, which would change your days the most — and what's the first small move?",
    safety_note: "Your values are yours to choose — never a fixed role, duty, or fate handed to you by family, culture, or anyone else. If naming what you want surfaces grief about how far life has drifted, that's worth sharing with someone you trust or a professional.",
    ai_prompt_context: "User is in the 'Living Your Values' track, the CAPSTONE values-clarification exercise, anchored in the ancient story's idea that your own imperfect path beats a borrowed one. ALWAYS frame values as freely chosen directions, never assigned roles or fate. Help them pick authentic values and one concrete committed step. Keep language plain and secular; do not name the source text or its characters."
  },

  // ──────────────────────── CAPSTONE · Bringing It Together ────────────────────────
  {
    id: 13,
    modality: "CAPSTONE",
    mechanism: "relapse_prevention_plan",
    skill: "Your Wellbeing Blueprint",
    title: "Equipoise — Your Wellbeing Blueprint",
    objective: "Build a personal plan to steady yourself faster the next time your wellbeing dips — drawing on every skill in this course.",
    gita_anchor: {
      ref: "An ancient story",
      teaching: "Steady in yourself, do your work, letting go of attachment, even-minded in success and failure — for evenness of mind is the heart of it. The goal was never a life without storms; it's a steadiness that keeps returning."
    },
    concept: {
      hook: "Wellbeing isn't never falling — it's knowing exactly how to get back up, faster, each time you do.",
      bridge: "You now have three sets of tools: **seeing clearly** (catching and questioning thoughts), **steadying the storm** (riding strong feelings and urges), and **living your values** (acting on what matters). A **blueprint** is your steadiness written down *before* you need it: your usual **triggers**, your earliest **warning signs**, and the **specific moves** — one from each toolkit — that pull you back. Evenness of mind is built, not wished for.",
      example: "*Trigger:* a stretch of bad sleep. *Warning sign:* I start skipping meals and ducking friends. *Plan:* put a sticky thought on trial, ride the urge to isolate with a 15-minute pause, and take one small action toward a value I care about."
    },
    exercise: {
      type: "fields",
      title: "Write your blueprint",
      instructions: "Build your personal plan while you're steady, so it's ready when you're not. Pull one move from each track you've learned. Be specific — vague plans fail exactly when you need them.",
      fields: [
        { key: "triggers", label: "Three things that usually pull you down", placeholder: "e.g. Poor sleep, big deadlines, conflict at home" },
        { key: "signs", label: "Three early warning signs you're slipping", placeholder: "e.g. Skipping meals, avoiding friends, doom-scrolling at 2am" },
        { key: "seeing", label: "Seeing Clearly — your go-to thought move", placeholder: "e.g. Put the worst thought on trial; name the thinking trap" },
        { key: "steadying", label: "Steadying the Storm — your go-to emotion move", placeholder: "e.g. Ride the urge with a 15-min pause; honor the feeling first" },
        { key: "values", label: "Living Your Values — one small action that matters", placeholder: "e.g. Text one person; take a 5-minute step toward a value" }
      ]
    },
    reflection_prompt: "The next time your wellbeing dips, what are the three non-negotiable moves you'll make to steady yourself — one from each track?",
    safety_note: "This blueprint is for everyday dips, not for crisis moments. It is NOT a clinical safety plan. If you ever feel unsafe or have thoughts of harming yourself, your first move is real support, not a worksheet: 988 Suicide & Crisis Lifeline (call or text 988), or text HOME to 741741. These tools work alongside professional care — they don't replace it.",
    ai_prompt_context: "User is in the CAPSTONE lesson: a personal wellbeing plan (relapse prevention), anchored in the ancient story's ideal of evenness of mind. Congratulate them on finishing the course. Help them turn triggers and warning signs into a concrete plan that draws one move from each of the three tracks. Keep language plain and secular; do not name the source text or its characters. Be explicit that this is not a crisis safety plan."
  }
];
