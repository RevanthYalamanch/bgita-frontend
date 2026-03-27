export const LESSON_DATA = [
  {
    id: 1,
    title: "The Physics of Stress",
    concept_reading: "Stress isn't just in your head; it's a physical reaction. When you feel overwhelmed, your body reacts with a racing heart, tight chest, or exhaustion. These feelings come and go like the weather. Learning to notice these physical signs without panicking is the first step to feeling calmer.",
    ai_prompt_context: "The user is studying Module 1: how stress shows up in the body. Act as a supportive guide. Ask them to describe a physical sign of stress they felt recently (like a tight jaw or fast heartbeat), and help them observe it calmly without trying to 'fix' it immediately.",
    exercise_type: "body_scan_log",
    exercise_instructions: "1. Close your eyes and take three slow, deep breaths.\n2. Scan your body from head to toe. Where are you currently holding physical tension (like your jaw, shoulders, or stomach)?\n3. Write down the sensation exactly as it feels, without judging it as 'good' or 'bad'.",
    reflection_prompt: "Write down one physical boundary or calming technique you will try tomorrow when you feel stressed."
  },
  {
    id: 2,
    title: "The Inner Ally vs. Enemy",
    concept_reading: "Your mind can be your best friend or your worst enemy. Sometimes, our brains create 'Automatic Negative Thoughts' that make us expect the worst or assume people are judging us. By catching these unfair thoughts, you can train your mind to support you instead of attacking you.",
    ai_prompt_context: "The user is in Module 2: catching negative thoughts. Ask them to share a harsh or unfair thought they had about themselves recently. Help them see how that thought is a 'distortion' and guide them to be kinder to themselves.",
    exercise_type: "thought_challenger",
    exercise_instructions: "1. Write down one harsh or critical thought you had about yourself today.\n2. Notice how extreme it is (does it use words like 'always', 'never', or 'ruined'?).\n3. Challenge it: Rewrite that exact thought as if you were encouraging a close friend who made the same mistake.",
    reflection_prompt: "If your anxiety or inner critic had a silly name, what would it be? Write it down to help separate it from your true self."
  },
  {
    id: 3,
    title: "The Ladder of Fall",
    concept_reading: "A total meltdown rarely happens all at once. It usually starts with a single, stuck thought. When we obsess over how things *should* be, we get frustrated. That frustration turns into anger, and anger makes us do things we regret. By catching the very first stuck thought, you can stop the emotional snowball before it rolls.",
    ai_prompt_context: "The user is in Module 3: stopping the emotional snowball. Ask them about a recent moment they overreacted or felt intense anger. Walk them backward step-by-step to find the very first small thought that started the chain reaction.",
    exercise_type: "chain_analysis",
    exercise_instructions: "Think of a recent time you overreacted.\n1. The Result: What did you do or feel at the very end?\n2. The Trigger: What was the exact tiny event that started it?\n3. The Missing Links: What were the thoughts that connected the Trigger to the Result?",
    reflection_prompt: "What is your personal 'early warning sign' that you are starting to get frustrated and need to step away?"
  },
  {
    id: 4,
    title: "Process Over Prize",
    concept_reading: "A lot of our anxiety comes from trying to control things we simply can't. True peace comes from focusing 100% on your own effort and letting go of the final result. You can control how hard you work, how kind you are, and how you react, but you cannot control the 'prize'. Focus on the process.",
    ai_prompt_context: "The user is in Module 4: letting go of the outcome. Ask them about a goal or situation they are currently stressing over. Help them separate what is entirely in their control (their effort) from what is out of their control (the final result).",
    exercise_type: "locus_of_control_map",
    exercise_instructions: "Think of a situation currently causing you anxiety.\n1. Write down 3 things about it that are completely OUT of your control.\n2. Write down 3 things that are completely IN your control (your actions, your effort, your attitude).",
    reflection_prompt: "List one goal for this week. Now, rewrite that goal so it relies completely on your own actions, regardless of what other people do."
  },
  {
    id: 5,
    title: "The Sattvic Rhythm",
    concept_reading: "It is incredibly hard to have a healthy mind if you have an exhausted body. Skipping meals, losing sleep, or staying indoors all day disrupts your body's natural rhythm. To build a strong mind, you must first build a stable, healthy daily routine.",
    ai_prompt_context: "The user is in Module 5: healthy habits. Ask them to review their daily habits with you. Gently probe into their sleep schedule, meals, or screen time to find one area that is making them feel drained.",
    exercise_type: "habit_audit",
    exercise_instructions: "Review your last 24 hours:\n1. Sleep: How many hours did you get, and was it restful?\n2. Fuel: Did you eat regular meals, or skip them?\n3. Movement: Did you get outside or move your body today?\nIdentify one area that needs immediate improvement.",
    reflection_prompt: "What is one simple, healthy habit you will add to your morning routine tomorrow?"
  },
  {
    id: 6,
    title: "Action as Therapy",
    concept_reading: "When we feel down, we often wait for the 'motivation' to do things. But motivation usually comes *after* we start, not before. Doing even a tiny, imperfect action can break the cycle of feeling stuck. You don't wait to feel better to act; you act first to feel better.",
    ai_prompt_context: "The user is in Module 6: taking action. Ask them to identify a task they have been putting off because they feel overwhelmed. Help them break it down into a ridiculously small, 5-minute task.",
    exercise_type: "behavioral_activation_planner",
    exercise_instructions: "1. Name a task you have been avoiding because you 'don't have the energy'.\n2. Break that task down into a tiny step that takes less than 5 minutes.\n3. Write down the exact time and place you will do this 5-minute step today.",
    reflection_prompt: "Commit to your 5-minute micro-task. What exact time will you do it today?"
  },
  {
    id: 7,
    title: "The Courage to Arise",
    concept_reading: "Avoiding the things that make us anxious feels good in the moment, but it makes the fear stronger in the long run. The best way to beat fear is to face it in tiny, manageable steps. This proves to your brain that you are capable of handling hard things.",
    ai_prompt_context: "The user is in Module 7: facing fears gently. Ask them about a situation they are avoiding out of anxiety. Help them brainstorm a 'low-stress' way to face a very tiny fraction of that fear this week.",
    exercise_type: "fear_hierarchy",
    exercise_instructions: "Choose a fear or situation you have been avoiding.\n1. The Big Goal: What is the ultimate thing you are afraid to do?\n2. Baby Step 1: What is a very easy, low-stress version of this? (e.g., just thinking about it, or looking at a picture).\n3. Baby Step 2: What is the next slightly harder step?",
    reflection_prompt: "Write down the first baby step on your 'Ladder of Courage'. What is the smallest, safest way you can face your fear this week?"
  },
  {
    id: 8,
    title: "Caging the Wind",
    concept_reading: "Trying to stop your thoughts is like trying to catch the wind. It's impossible. Instead of trying to empty your mind, mindfulness teaches you to simply watch your thoughts drift by without letting them sweep you away.",
    ai_prompt_context: "The user is in Module 8: mindfulness. Ask them what specific worries are blowing through their mind right now. Guide them through a brief, text-based grounding exercise (like noticing the physical space around them).",
    exercise_type: "worry_time_scheduler",
    exercise_instructions: "Practice the 5-4-3-2-1 Grounding Technique. Look around the room right now and list:\n- 5 things you can see.\n- 4 things you can physically feel.\n- 3 things you can hear.\n- 2 things you can smell.\n- 1 thing you can taste.",
    reflection_prompt: "Schedule a 15-minute 'Worry Time' for tomorrow. If you catch yourself worrying outside of this time, write it down and save it for the scheduled appointment."
  },
  {
    id: 9,
    title: "The Sword of Discernment",
    concept_reading: "When we are panicked or sad, our emotions lie to us. We start believing that because we *feel* like a failure, we *are* a failure. We must learn to act like a detective, using hard facts and evidence to cut through our panic and see the real truth.",
    ai_prompt_context: "The user is in Module 9: fact-checking emotions. Ask them to share a painful belief they hold about themselves right now. Challenge them to provide hard, objective evidence for and against this belief.",
    exercise_type: "evidence_log",
    exercise_instructions: "1. Write down a negative belief you have right now (e.g., 'I am terrible at my job').\n2. The Prosecution: List 3 hard facts that seem to prove this belief.\n3. The Defense: List 3 hard facts that prove this belief is FALSE.",
    reflection_prompt: "Look at the evidence against your negative belief. Write a new, fairer sentence about yourself based strictly on the facts."
  },
  {
    id: 10,
    title: "Seeing the Unified Truth",
    concept_reading: "Anxiety loves extremes. It tells us things are 'all good' or 'all bad,' a 'total success' or a 'total failure.' True mental health means finding the middle ground. You can make a big mistake AND still be a good, capable person at the exact same time.",
    ai_prompt_context: "The user is in Module 10: finding the middle ground. Ask them to share a situation where they feel like a 'total failure'. Guide them to find the 'gray area'—what did they actually do right, and what context makes their reaction understandable?",
    exercise_type: "dialectical_journal",
    exercise_instructions: "Think of a recent situation that felt like a 'total disaster'.\n1. What is the extreme, black-and-white thought?\n2. Find the Gray Area: What is one small thing that actually went okay, or one thing you learned from the mess?",
    reflection_prompt: "Write a sentence using the word 'AND' instead of 'BUT'. (e.g., 'I messed up today, AND I am still a hard worker.')"
  },
  {
    id: 11,
    title: "The Wellbeing Blueprint",
    concept_reading: "The goal isn't to never feel sad or stressed again; the goal is to bounce back faster when life gets hard. True wellbeing requires a personal emergency plan. You need to know exactly what steps to take when you feel your mental health starting to slip.",
    ai_prompt_context: "The user is in the final Module: building a safety plan. Congratulate them. Ask them which of the previous 10 lessons was the most helpful, and help them strategize how to use it the next time life gets incredibly stressful.",
    exercise_type: "relapse_prevention_plan",
    exercise_instructions: "Build your Emergency Plan:\n1. Triggers: List 3 things that usually cause your mental health to drop.\n2. Warning Signs: List 3 early signs that you are struggling (e.g., skipping meals, avoiding friends).\n3. Action: List 3 healthy things you promise to do when you notice those warning signs.",
    reflection_prompt: "When your mental health dips in the future, what are the three non-negotiable actions you will take to stabilize yourself?"
  }
];
