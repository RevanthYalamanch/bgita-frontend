export const LESSON_DATA = [
  {
    id: 1,
    title: "The Physics of Stress",
    time_estimate: "60 min",
    concept_reading: "The contact of bodily senses with the outside world creates feelings like sorrow or happiness. In CBT, we recognize that our physical sensations (racing heart, tight chest, exhaustion) are temporary biological responses, much like passing winter and summer. Learning to observe these without immediate reaction is the first step to cognitive control.",
    ai_prompt_context: "The user is currently studying Module 1: how external events trigger internal physical stress. Act as a Socratic guide. Ask them to describe a specific physical sensation of stress they felt today, and gently help them observe it objectively without judgment.",
    exercise_type: "body_scan_log",
    reflection_prompt: "Write down one physical boundary or grounding technique you will commit to practicing tomorrow."
  },
  {
    id: 2,
    title: "The Inner Ally vs. Enemy",
    time_estimate: "60 min",
    concept_reading: "The mind can be your greatest ally or your worst enemy. When left unchecked, 'Automatic Negative Thoughts' (ANTs) act as an internal adversary. By identifying cognitive distortions—such as catastrophizing or mind-reading—you elevate the mind and turn it into a supportive ally.",
    ai_prompt_context: "The user is in Module 2: identifying cognitive distortions. Ask them to share a recurring negative thought they had this week. Help them identify what specific distortion (like 'all-or-nothing thinking' or 'catastrophizing') might be at play.",
    exercise_type: "thought_challenger",
    reflection_prompt: "Rename your 'Inner Enemy'. If your anxiety had a name, what would it be? Write it down to separate it from your true self."
  },
  {
    id: 3,
    title: "The Ladder of Fall",
    time_estimate: "60 min",
    concept_reading: "Brooding over objects leads to attachment. Attachment breeds desire, desire breeds anger, anger breeds delusion, and delusion destroys reasoning. In psychology, this is known as a Behavioral Chain. A single unchecked thought can cascade into an intense emotional and behavioral crisis if not interrupted early.",
    ai_prompt_context: "The user is in Module 3: Behavioral Chain Analysis. Ask them about a recent moment they felt intense anger or frustration. Walk them backward step-by-step to find the very first 'brooding thought' that started the chain.",
    exercise_type: "chain_analysis",
    reflection_prompt: "Identify your personal 'Tripwire'—the early warning sign that you are stepping onto the Ladder of Fall. What is it?"
  },
  {
    id: 4,
    title: "Process Over Prize",
    time_estimate: "60 min",
    concept_reading: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Much of our anxiety comes from an external 'Locus of Control'—obsessing over outcomes we cannot guarantee. True resilience comes from focusing entirely on the process, which is within your control.",
    ai_prompt_context: "The user is in Module 4: Locus of Control. Ask them about a goal or situation they are currently stressing over. Help them separate what is entirely in their control (the process) from what is out of their control (the prize).",
    exercise_type: "locus_of_control_map",
    reflection_prompt: "List one goal for this week. Now, rewrite that goal so it relies 100% on your own actions, regardless of the outcome."
  },
  {
    id: 5,
    title: "The Sattvic Rhythm",
    time_estimate: "60 min",
    concept_reading: "Mental clarity is impossible for someone who eats too much, sleeps too much, or deprives themselves of sleep and recreation. Routine and behavioral activation are foundational to CBT. Biological stability creates psychological stability.",
    ai_prompt_context: "The user is in Module 5: Sleep hygiene and routine. Ask them to perform an audit of their daily habits. Gently probe into their sleep schedule, diet, or screen time to find one area disrupting their biological baseline.",
    exercise_type: "habit_audit",
    reflection_prompt: "What is one 'Sattvic' (pure/balanced) habit you will introduce into your morning routine tomorrow?"
  },
  {
    id: 6,
    title: "Action as Therapy",
    time_estimate: "60 min",
    concept_reading: "Inaction driven by fear or lethargy only deepens depression. Action, even imperfect action, breaks the cycle. This is the core of Behavioral Activation: you do not wait to feel better to act; you act first in order to feel better.",
    ai_prompt_context: "The user is in Module 6: Behavioral Activation. Ask them to identify a task they have been avoiding due to feeling overwhelmed. Help them break it down into a ridiculously small, 5-minute micro-task.",
    exercise_type: "behavioral_activation_planner",
    reflection_prompt: "Commit to your 5-minute micro-task. What exact time will you do it today?"
  },
  {
    id: 7,
    title: "The Courage to Arise",
    time_estimate: "60 min",
    concept_reading: "Yield not to feebleness. Avoiding what makes us anxious provides temporary relief but strengthens the anxiety long-term. Graded Exposure Therapy teaches us to face our fears incrementally, proving to our nervous system that we are capable of handling discomfort.",
    ai_prompt_context: "The user is in Module 7: Exposure Therapy. Ask them about a fear or social situation they are avoiding. Help them brainstorm a 'low-stakes' way to face a tiny fraction of that fear this week.",
    exercise_type: "fear_hierarchy",
    reflection_prompt: "Write down the first step on your 'Ladder of Courage'. What is the smallest safe exposure you can try?"
  },
  {
    id: 8,
    title: "Caging the Wind",
    time_estimate: "60 min",
    concept_reading: "The mind is restless, turbulent, and as hard to restrain as the wind. But through persistent practice and detachment, it can be subdued. Mindfulness is not about emptying the mind; it is about noticing the wind blowing and choosing not to be swept away by it.",
    ai_prompt_context: "The user is in Module 8: Mindfulness and Rumination. Ask them what specific worries are blowing through their mind right now. Guide them through a brief, text-based grounding exercise (like the 5-4-3-2-1 technique).",
    exercise_type: "worry_time_scheduler",
    reflection_prompt: "Schedule a 15-minute 'Worry Time' for tomorrow. If you worry outside of this time, write it down and defer it to the scheduled appointment."
  },
  {
    id: 9,
    title: "The Sword of Discernment",
    time_estimate: "60 min",
    concept_reading: "A balanced intellect discriminates between what sets the mind free and what imprisons it. When faced with a crisis, emotional reasoning clouds judgment. We must use evidence-based thinking to slice through panic and see reality as it objectively is.",
    ai_prompt_context: "The user is in Module 9: Fact-checking and Evidence Gathering. Ask them to present a belief they hold about themselves that causes them pain. Challenge them to provide hard, objective evidence for and against this belief.",
    exercise_type: "evidence_log",
    reflection_prompt: "Look at the evidence against your negative belief. Write a new, balanced statement based strictly on the facts."
  },
  {
    id: 10,
    title: "Seeing the Unified Truth",
    time_estimate: "60 min",
    concept_reading: "Mental distress thrives in extremes—black and white, good and bad, success and failure. Seeing the unified truth means embracing dialectical thinking: understanding that two opposing truths can exist at the same time. You can be a masterpiece and a work in progress simultaneously.",
    ai_prompt_context: "The user is in Module 10: Gray-area thinking. Ask them to share a situation where they feel they 'completely failed'. Guide them to find the 'gray area'—what did they do right, and what context makes their reaction understandable?",
    exercise_type: "dialectical_journal",
    reflection_prompt: "Write a sentence using the word 'AND' instead of 'BUT'. (e.g., 'I made a mistake today, AND I am still a capable person.')"
  },
  {
    id: 11,
    title: "The Wellbeing Blueprint",
    time_estimate: "60 min",
    concept_reading: "The ultimate goal is a mind unperturbed by sorrow, free from deep attachment and fear. This is not a state of numbness, but a state of profound resilience. True wellbeing requires a customized, lifelong maintenance plan.",
    ai_prompt_context: "The user is in the final Module: Relapse Prevention. Congratulate them. Ask them which of the previous 10 lessons resonated the most with them, and help them strategize how to apply it during their next major life stressor.",
    exercise_type: "relapse_prevention_plan",
    reflection_prompt: "Create your emergency blueprint. When your mental health dips, what are the three non-negotiable actions you will take to stabilize yourself?"
  }
];