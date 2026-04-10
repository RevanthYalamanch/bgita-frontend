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

/*
Here is a complete, 11-module curriculum strictly modeled after foundational clinical Cognitive Behavioral Therapy (CBT) manuals, such as those by Aaron T. Beck and David D. Burns.

This version strips away the metaphorical or philosophical naming conventions and focuses purely on evidence-based, clinical CBT progression: starting with the Cognitive Model, moving into cognitive restructuring, behavioral interventions, uncovering core beliefs, and ending with relapse prevention.
The Clinical CBT Curriculum

You can replace the contents of your data/curriculum.js file with this array:
JavaScript

export const LESSON_DATA = [
  {
    id: 1,
    title: "The Cognitive Model",
    concept_reading: "Events don't cause our emotions; our *interpretation* of those events does. This is the CBT Triangle: your Thoughts, Feelings, and Behaviors are all connected. If a friend cancels plans, thinking 'They hate me' leads to sadness and isolation. Thinking 'They must be busy' leads to feeling neutral and going on with your day.",
    ai_prompt_context: "The user is in Module 1: The Cognitive Model. Act as a clinical CBT guide. Ask the user to describe a recent mildly upsetting event, and help them identify the specific thought they had in that exact moment, separating the 'fact' of the event from their 'interpretation'.",
    exercise_type: "cbt_triangle_map",
    exercise_instructions: "Think of a recent frustrating moment.\n1. Situation: What happened? (Stick only to the facts, like a camera would record).\n2. Thought: What went through your mind at that exact moment?\n3. Feeling: What emotion did you feel (e.g., sad, angry, anxious)?\n4. Behavior: How did you react physically?",
    reflection_prompt: "Write down one situation from today where you can clearly see how a specific thought directly caused a specific emotion."
  },
  {
    id: 2,
    title: "Catching Automatic Thoughts",
    concept_reading: "We have thousands of thoughts a day. Many of them are 'Automatic Negative Thoughts' (ANTs). They pop up so fast we accept them as absolute truth without questioning them. To change how you feel, you first have to catch these rapid-fire thoughts as they happen.",
    ai_prompt_context: "The user is in Module 2: Automatic Negative Thoughts. Ask them to recall a moment today when their mood suddenly dropped. Guide them to catch the 'ANT' (Automatic Negative Thought) that flew through their mind just seconds before the mood shift.",
    exercise_type: "thought_record_phase_1",
    exercise_instructions: "Set a 'Thought Trap' for tomorrow:\n1. Whenever you notice a sudden drop in your mood, pause.\n2. Ask yourself: 'What was going through my mind just then?'\n3. Write the thought down immediately, exactly as you heard it in your head.",
    reflection_prompt: "What is the most common negative thought that pops into your head automatically when you make a mistake?"
  },
  {
    id: 3,
    title: "Identifying Cognitive Distortions",
    concept_reading: "Our brains sometimes use mental filters that warp reality. These are called Cognitive Distortions. Common ones include 'All-or-Nothing Thinking' (if it's not perfect, it's a failure), 'Mind Reading' (assuming someone is mad at you), and 'Catastrophizing' (expecting the absolute worst-case scenario).",
    ai_prompt_context: "The user is in Module 3: Cognitive Distortions. Provide a brief definition of Catastrophizing, Mind Reading, and All-or-Nothing thinking. Ask the user to share a recent negative thought, and help them identify which 'Thinking Trap' it falls into.",
    exercise_type: "distortion_labeling",
    exercise_instructions: "Review a recent negative thought.\n1. Write the thought down.\n2. Label the distortion: Is it Mind Reading, Catastrophizing, All-or-Nothing, or emotional reasoning?\n3. Notice how recognizing the trap makes the thought feel slightly less powerful.",
    reflection_prompt: "Which specific 'Thinking Trap' or Cognitive Distortion do you fall into the most often?"
  },
  {
    id: 4,
    title: "Putting Thoughts on Trial",
    concept_reading: "Just because you think it, doesn't mean it's true. Once you catch a distorted thought, you must put it on trial like a lawyer. You look for objective, factual evidence that supports the thought, and concrete evidence that contradicts it. Feelings are not facts.",
    ai_prompt_context: "The user is in Module 4: Cognitive Restructuring. Ask them to provide an Automatic Negative Thought. Walk them through a Socratic questioning process: What is the hard evidence for this thought? What is the evidence against it?",
    exercise_type: "thought_record_phase_2",
    exercise_instructions: "1. Write down a negative thought you are currently believing.\n2. The Prosecution: List 3 objective facts that support this thought.\n3. The Defense: List 3 objective facts that prove this thought is false or exaggerated.\n4. The Verdict: Write a new, balanced thought based on the evidence.",
    reflection_prompt: "Write out your new 'Alternative Thought' from the exercise. How does your emotional intensity change when you read the alternative thought?"
  },
  {
    id: 5,
    title: "Behavioral Activation",
    concept_reading: "Depression and burnout tell us to withdraw, stay in bed, and avoid life. But withdrawing removes our access to positive experiences, making us feel worse. Behavioral Activation is the strategy of acting *opposite* to your mood. You act first, and the motivation follows later.",
    ai_prompt_context: "The user is in Module 5: Behavioral Activation. Ask them to identify an activity they used to enjoy or a daily task they are avoiding due to low energy. Help them schedule a ridiculously small, easily achievable version of that task.",
    exercise_type: "activity_scheduling",
    exercise_instructions: "1. Identify one small, positive activity you have been avoiding (e.g., a 10-minute walk, calling a friend).\n2. Rate your current motivation to do it (0-10).\n3. Schedule an exact time and place to do it tomorrow, regardless of your motivation level.",
    reflection_prompt: "Commit to your scheduled activity. What is the biggest obstacle that might get in your way, and how will you bypass it?"
  },
  {
    id: 6,
    title: "Graded Exposure",
    concept_reading: "Anxiety grows when we avoid the things that scare us. Avoidance provides temporary relief but long-term panic. Graded Exposure involves facing your fears in tiny, systematic, and manageable steps, teaching your brain that the 'threat' is actually safe.",
    ai_prompt_context: "The user is in Module 6: Graded Exposure. Ask them about a specific situation that causes them anxiety. Help them construct a 'Fear Hierarchy'—a ladder of 3-5 steps ranging from mildly uncomfortable to the ultimate goal.",
    exercise_type: "fear_hierarchy_building",
    exercise_instructions: "Create a Exposure Ladder for a specific fear.\n1. Step 1 (Distress level 2/10): The easiest version of facing the fear.\n2. Step 2 (Distress level 5/10): A slightly harder challenge.\n3. Step 3 (Distress level 8/10): The actual situation you are avoiding.",
    reflection_prompt: "Look at Step 1 on your Fear Hierarchy. What specific day this week will you purposefully subject yourself to this mild discomfort?"
  },
  {
    id: 7,
    title: "Problem-Solving vs. Rumination",
    concept_reading: "Worrying feels productive, but it's often just spinning your wheels (rumination). True problem-solving requires separating hypothetical worries ('What if the economy crashes?') from practical problems ('I need to update my resume'). You must learn to solve the practical and tolerate the hypothetical.",
    ai_prompt_context: "The user is in Module 7: Problem Solving. Ask them to share a current worry. Help them determine if it is a 'Practical Problem' (something they can take action on today) or a 'Hypothetical Worry' (something out of their control).",
    exercise_type: "worry_tree",
    exercise_instructions: "1. Write down what you are worrying about.\n2. Ask: Is this a problem I can do something about right now?\n3. If YES: Brainstorm solutions and pick one to act on.\n4. If NO: Practice letting go and shifting your attention to the present moment.",
    reflection_prompt: "If you have a hypothetical worry you cannot control, what is one healthy distraction you can use to break the rumination cycle?"
  },
  {
    id: 8,
    title: "Uncovering Core Beliefs",
    concept_reading: "Automatic thoughts are like the leaves of a tree. Core beliefs are the roots. These are deeply held, rigid rules about yourself, others, and the world (e.g., 'I am unlovable', 'I am incompetent'). These beliefs were learned, which means they can be unlearned.",
    ai_prompt_context: "The user is in Module 8: Core Beliefs. Guide them through the 'Downward Arrow Technique'. Ask them for a surface-level negative thought, and repeatedly ask 'If that were true, what would that mean about you?' to dig down to the core belief.",
    exercise_type: "downward_arrow",
    exercise_instructions: "1. Write down a stressful thought (e.g., 'I failed the test').\n2. Ask yourself: 'If that is true, what does it mean?' (e.g., 'It means I'm not smart enough').\n3. Ask again: 'If *that* is true, what does it mean?'\n4. Stop when you hit a definitive 'I am...' statement. This is your core belief.",
    reflection_prompt: "What negative core belief did you uncover today? How old do you think you were when you first started believing it?"
  },
  {
    id: 9,
    title: "Restructuring Core Beliefs",
    concept_reading: "You cannot just delete a negative core belief; you have to build a new, healthier one to replace it. If your old belief is 'I am a failure', your new belief might be 'I am a capable person who sometimes struggles.' You build this new belief by constantly gathering evidence for it.",
    ai_prompt_context: "The user is in Module 9: Core Belief Restructuring. Ask them to share their negative core belief. Help them define a more balanced, realistic alternative belief, and guide them to find one piece of historical evidence that supports the *new* belief.",
    exercise_type: "core_belief_log",
    exercise_instructions: "1. Old Belief: Write down your negative core belief.\n2. New Belief: Write down a more balanced, realistic belief.\n3. The Evidence: Write down three things you have done in your life that prove the NEW belief is true, even partially.",
    reflection_prompt: "How will you remind yourself to look for evidence of your 'New Belief' throughout the day tomorrow?"
  },
  {
    id: 10,
    title: "Cognitive Defusion",
    concept_reading: "Sometimes, challenging thoughts is exhausting. Cognitive Defusion (from ACT, a cousin of CBT) teaches us to step back and observe our thoughts without engaging them. Instead of saying 'I am going to fail,' you say 'I am noticing that I am having the thought that I am going to fail.' It creates distance.",
    ai_prompt_context: "The user is in Module 10: Cognitive Defusion. Ask them what troubling thought they are having. Guide them to rephrase it using defusion techniques, such as imagining the thought written on a leaf floating down a stream.",
    exercise_type: "defusion_practice",
    exercise_instructions: "1. Notice a negative thought you are currently stuck on.\n2. Reframe it: Say out loud, 'I am having the thought that [insert thought].'\n3. Reframe again: Say out loud, 'I notice I am having the thought that [insert thought].'\nObserve how the emotional intensity drops.",
    reflection_prompt: "What is a visualization technique you can use to watch your thoughts pass by (e.g., clouds in the sky, cars on a highway)?"
  },
  {
    id: 11,
    title: "The Relapse Prevention Plan",
    concept_reading: "Setbacks are a normal, expected part of the CBT process. The goal of therapy is for you to become your own therapist. By mapping out your personal triggers and having a clear action plan, you can catch a downward spiral before it takes hold.",
    ai_prompt_context: "The user is in Module 11: Relapse Prevention. Congratulate them on reaching the end of the curriculum. Help them identify their high-risk triggers and build a concrete, step-by-step emergency plan for when their mood begins to drop.",
    exercise_type: "maintenance_blueprint",
    exercise_instructions: "Create your CBT Maintenance Plan:\n1. My Triggers: What situations are most likely to cause a setback?\n2. My Early Warning Signs: What are the first signs my mood is dropping (e.g., isolating, sleeping poorly)?\n3. My Action Steps: Which 3 CBT skills from this curriculum will I use immediately when this happens?",
    reflection_prompt: "Who is one trusted person you can share your early warning signs with, so they can gently let you know if they see you struggling?"
  }
];
*/
