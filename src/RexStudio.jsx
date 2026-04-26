import { useState, useRef } from "react";
import {
  FileText, Sparkles, Printer, Copy, Check, ChevronDown,
  BookOpen, PenTool, FlaskConical, Globe, Calculator,
  Loader2, AlertCircle, Eye, EyeOff, ExternalLink, RefreshCw,
  Package, Layout, Type
} from "lucide-react";

// ─── STANDARDS MAP ────────────────────────────────────────────────────────────

const STANDARDS = {
  math: {
    "Fractions Practice":        { codes:"5.NF.1–7",              focus:"Adding/subtracting fractions with unlike denominators, multiplying and dividing fractions and mixed numbers, fraction word problems.", skills:["unlike denominators","mixed numbers","equivalent fractions","fraction multiplication","fraction division","multi-step fraction word problems"] },
    "Decimals Practice":         { codes:"5.NBT.1–4, 5.NBT.7",    focus:"Place value to thousandths, powers of 10, comparing and rounding decimals, decimal operations.", skills:["decimal place value","powers of 10","comparing decimals","rounding","decimal operations","decimal word problems"] },
    "Word Problems":             { codes:"5.OA.1–2, 5.NBT.5–6, 5.NF.2–6, 5.MD.1", focus:"Multi-step real-world problems with whole numbers, fractions, and decimals.", skills:["multi-step reasoning","operation selection","interpreting remainders","measurement conversion","fraction/decimal contexts"] },
    "Mixed Review":              { codes:"5.OA, 5.NBT, 5.NF, 5.MD, 5.G", focus:"Comprehensive review across all 5th grade math domains.", skills:["fractions","decimals","multiplication/division","volume","coordinate plane","2D figures"] },
    "SBAC Simulation":           { codes:"All 5th grade CCSS math", focus:"Authentic SBAC-style mixed-domain assessment with constructed response items.", skills:["mixed domains","constructed response","multi-step reasoning","select all that apply","justify and explain"] },
    "Multiplication & Division": { codes:"5.NBT.2, 5.NBT.5–6, 5.OA.1–2", focus:"Multi-digit multiplication, division, numerical expressions with parentheses.", skills:["multi-digit multiplication","long division","order of operations","numerical expressions","estimation"] },
    "Geometry & Measurement":    { codes:"5.MD.1–5, 5.G.1–4",    focus:"Volume, coordinate plane, classifying 2D figures, unit conversion.", skills:["volume","coordinate plane","classifying shapes","unit conversion","line plots"] },
    "Order of Operations":       { codes:"5.OA.1–2",              focus:"Expressions with parentheses, brackets, braces; evaluating and comparing.", skills:["parentheses/brackets/braces","evaluating expressions","writing expressions","comparing expressions"] },
  },
  ela: {
    "Reading Comprehension": { codes:"5.RI.1–3, 5.RI.6, 5.RL.1–3", focus:"Quoting from text, main idea and details, author's point of view, summarizing.", skills:["cite text evidence","main idea","author's point of view","compare/contrast","cause/effect","inferencing"], passage:true },
    "Vocabulary Practice":   { codes:"5.L.4–6",               focus:"Context clues, Greek/Latin roots, figurative language, academic vocabulary.", skills:["context clues","Greek/Latin roots","prefixes/suffixes","simile/metaphor","idioms","academic vocabulary"] , passage:true },
    "Context Clues":         { codes:"5.L.4a, 5.RI.4, 5.RL.4",focus:"Determining word meaning using context; literal vs nonliteral meaning.", skills:["definition clues","synonym clues","antonym clues","example clues","inference clues"] , passage:true },
    "Main Idea & Details":   { codes:"5.RI.2–3, 5.RI.5",      focus:"Main ideas, supporting details, summarizing, text structure.", skills:["identifying main idea","topic vs main idea","supporting details","summarizing","text structure"] , passage:true },
    "Story Elements":        { codes:"5.RL.1–3, 5.RL.5–6",    focus:"Character, conflict, theme, plot structure, narrator point of view.", skills:["character traits/motivation","conflict/resolution","theme vs topic","plot structure","point of view"] , passage:true },
    "Author's Purpose":      { codes:"5.RI.6, 5.RI.8, 5.RL.6",focus:"Author's purpose and point of view, evaluating evidence, fact vs opinion.", skills:["persuade/inform/entertain","author's bias","evaluating evidence","author's claim","fact vs opinion"] , passage:true },
    "Text Evidence":         { codes:"5.RI.1, 5.RL.1, 5.W.9", focus:"Quoting accurately from text to explain and support inferences.", skills:["locating evidence","quoting correctly","evidence relevance","connecting to claim"] , passage:true },
    "Compare & Contrast":    { codes:"5.RI.3, 5.RI.9, 5.RL.3, 5.RL.9", focus:"Comparing two texts, multiple accounts, structure analysis.", skills:["comparing texts","Venn diagram thinking","comparing characters","synthesizing"] , passage:true },
  },
  writing: {
    "Narrative Writing Prompt": { codes:"5.W.3a–e",  focus:"Situation/narrator, event sequences, dialogue, description, transitional phrases, conclusion.", skills:["story hook","dialogue","sensory details","transitional phrases","strong conclusion"] },
    "Opinion Writing Prompt":   { codes:"5.W.1a–d",  focus:"Opinion statement, logically ordered reasons, transitions, concluding statement.", skills:["clear opinion","logical reasons","supporting evidence","opinion transitions","strong conclusion"] },
    "Informational Writing":    { codes:"5.W.2a–e",  focus:"Topic introduction, grouped information, domain vocab, precise language, conclusion.", skills:["topic introduction","domain vocabulary","facts/definitions","precise language"] },
    "Paragraph Writing":        { codes:"5.W.2, 5.W.4, 5.L.1–2", focus:"Topic sentence, supporting details, concluding sentence, conventions.", skills:["topic sentence","supporting details","concluding sentence","paragraph unity"] },
    "Sentence Editing":         { codes:"5.L.1–2",   focus:"Verb tense, pronoun agreement, comma usage, quotation marks, capitalization.", skills:["verb tense","pronoun agreement","commas","quotation marks","capitalization"] },
    "Grammar Practice":         { codes:"5.L.1a–e",  focus:"Perfect verb tenses, correlative conjunctions, pronoun shifts, prepositions.", skills:["perfect verb tenses","correlative conjunctions","verb tense shifts","prepositions"] },
    "Figurative Language":      { codes:"5.L.5a–c, 5.RL.4", focus:"Simile, metaphor, personification, hyperbole, idioms, adages, proverbs.", skills:["simile vs metaphor","personification","hyperbole","idioms","adages/proverbs"] },
    "Transition Words":         { codes:"5.W.1c, 5.W.2c, 5.W.3c", focus:"Transitional words/phrases for sequence, contrast, cause/effect, elaboration.", skills:["sequence transitions","contrast transitions","cause/effect transitions","elaboration transitions"] },
  },
  science: {
    "Life Science":      { codes:"NGSS 5-LS1, 5-LS2",    focus:"Photosynthesis, food webs, decomposers, matter cycling in ecosystems.", skills:["photosynthesis","food webs/chains","producers/consumers/decomposers","matter cycling"] },
    "Earth Science":     { codes:"NGSS 5-ESS1–3",        focus:"Sun as energy source, Earth's spheres, water distribution, human impact.", skills:["Earth's layers","water cycle","Earth's spheres","sun as energy source","human impact"] },
    "Physical Science":  { codes:"NGSS 5-PS1–3",         focus:"Properties of matter, conservation, mixtures, gravity, energy transfer.", skills:["properties of matter","mixtures/solutions","physical vs chemical changes","conservation of matter"] },
    "Scientific Method": { codes:"NGSS Practices 1–8",   focus:"Hypotheses, investigations, analyzing data, constructing explanations.", skills:["hypothesis","variables","graphs/data tables","drawing conclusions","experimental design"] },
    "Ecosystems":        { codes:"NGSS 5-LS2, 5-ESS2–3", focus:"Food webs, environmental change, interdependence, human effects.", skills:["food webs","interdependence","environmental change","adaptation","human impact"] },
    "Weather & Climate": { codes:"NGSS 5-ESS2–3",        focus:"Ocean/land/atmosphere interactions, weather vs climate, human impact.", skills:["weather vs climate","water cycle","atmosphere interactions","climate zones"] },
    "Matter & Energy":   { codes:"NGSS 5-PS1, 5-PS3",    focus:"Properties/structure of matter, conservation, physical/chemical changes.", skills:["physical/chemical properties","conservation of matter","mixtures vs compounds","energy in organisms"] },
    "Human Body":        { codes:"NGSS 5-LS1, CA Life Sci",focus:"Body systems and interactions: digestive, respiratory, circulatory, skeletal, muscular, nervous.", skills:["body systems","organs and roles","system interactions","nutrients/digestion"] },
  },
  social: {
    "US History":          { codes:"CA HSS 5.1–5.8",       focus:"Pre-Columbian, Exploration, Colonial, Revolution, Constitution, westward expansion.", skills:["cause/effect","primary vs secondary sources","chronological thinking","historical significance"] },
    "Geography":           { codes:"CA HSS 5.1, CCSS RH.5",focus:"Geographic features of North America, US regions, geography's influence on history.", skills:["map reading","physical/political maps","US regions","geographic influence"] },
    "Government & Civics": { codes:"CA HSS 5.7–5.8",       focus:"Constitutional Convention, Bill of Rights, branches of government, checks and balances.", skills:["three branches","checks and balances","Bill of Rights","Constitutional principles"] },
    "Economics Basics":    { codes:"CA HSS 5.4, 5.6",      focus:"Trade, supply/demand, colonial economy, triangular trade, mercantilism.", skills:["supply and demand","trade/interdependence","colonial economy","goods/services"] },
    "Map Skills":          { codes:"CA HSS, CCSS RH.5.7",  focus:"Reading physical, political, thematic, historical maps.", skills:["types of maps","map tools","latitude/longitude","historical maps"] },
    "Culture & Society":   { codes:"CA HSS 5.1, 5.3–5.4",  focus:"Pre-Columbian cultures, colonial culture, diverse group influence on American culture.", skills:["cultural characteristics","comparing cultures","cultural exchange","daily life analysis"] },
    "California History":  { codes:"CA HSS 5.2–5.3",       focus:"CA missions, impact on Native peoples, Gold Rush, statehood.", skills:["CA missions","Gold Rush","statehood","impact on Native Californians"] },
    "Current Events":      { codes:"CCSS RH.5.1, 5.6, 5.8",focus:"Current events: main idea, source evaluation, fact vs opinion, point of view.", skills:["main idea in news","fact vs opinion","source credibility","point of view"] },
  },
};

const SUBJECTS = [
  { id:"math",    label:"Math",           icon:Calculator,   gradient:"from-amber-500 to-orange-500",  soft:"bg-amber-50",   border:"border-amber-200",   accent:"text-amber-700",  hc:"#F59E0B", ring:"focus:ring-amber-300" },
  { id:"ela",     label:"ELA / Reading",  icon:BookOpen,     gradient:"from-sky-500 to-indigo-500",    soft:"bg-sky-50",     border:"border-sky-200",     accent:"text-sky-700",    hc:"#0EA5E9", ring:"focus:ring-sky-300" },
  { id:"writing", label:"Writing",        icon:PenTool,      gradient:"from-violet-500 to-purple-500", soft:"bg-violet-50",  border:"border-violet-200",  accent:"text-violet-700", hc:"#7C3AED", ring:"focus:ring-violet-300" },
  { id:"science", label:"Science",        icon:FlaskConical, gradient:"from-emerald-500 to-teal-500",  soft:"bg-emerald-50", border:"border-emerald-200", accent:"text-emerald-700",hc:"#10B981", ring:"focus:ring-emerald-300" },
  { id:"social",  label:"Social Studies", icon:Globe,        gradient:"from-rose-500 to-pink-500",     soft:"bg-rose-50",    border:"border-rose-200",    accent:"text-rose-700",   hc:"#F43F5E", ring:"focus:ring-rose-300" },
];

const DIFFICULTIES = [
  { id:"on",      label:"On-Level",     desc:"Standard 5th grade" },
  { id:"support", label:"With Support", desc:"Scaffolded" },
  { id:"extend",  label:"Extension",    desc:"Advanced learners" },
];

const PURPOSES = [
  { id:"practice",   label:"Lesson Practice" },
  { id:"homework",   label:"Homework" },
  { id:"review",     label:"Test / SBAC Review" },
  { id:"finisher",   label:"Early Finisher" },
  { id:"assessment", label:"Quick Assessment" },
];

const OUTPUT_MODES = [
  { id:"print",  label:"Printable",    icon:Layout,  desc:"Renders as a formatted worksheet" },
  { id:"raw",    label:"Editable Text",icon:Type,    desc:"Copy into Google Docs or Word" },
  { id:"canva",  label:"Canva Pack",   icon:Package, desc:"Section-by-section, ready to paste" },
];

// ─── API ──────────────────────────────────────────────────────────────────────

async function callClaude(prompt, apiKey, maxTokens = 4000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, apiKey, maxTokens }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text || "";
}

// ─── PROMPT ───────────────────────────────────────────────────────────────────

function buildPrompt(subjectId, resourceType, difficulty, purpose, topic) {
  const std = STANDARDS[subjectId]?.[resourceType] || { codes:"5th Grade CCSS", focus:`5th grade ${subjectId}`, skills:[resourceType] };
  const diffGuide = { on:"Standard 5th grade difficulty. Moderate complexity. Distractors reflect real student errors.", support:"Scaffolded. Simplified language, fewer steps, sentence frames for written responses.", extend:"Above grade level. Multi-step reasoning required. Students must justify and connect ideas." };
  const purposeGuide = { practice:"Lesson practice — right after instruction. Include a worked example or hint box. 12–15 questions.", homework:"Homework — completable independently in 15–20 min. No new concepts. 10–12 questions.", review:"SBAC/test review — mirror SBAC format. Include select-all-that-apply, constructed response, explain-your-thinking. 14–18 questions.", finisher:"Early finisher — engaging self-contained challenge. 8–10 rich questions.", assessment:"Quick assessment — tight focus on one skill. 6–8 questions max. Student self-assessment checkbox at bottom." };

  // Random context rotators to force variety
  const passageTopics = {
    ela: [
      "the California Gold Rush and the forty-niners",
      "California missions and their impact on Native peoples",
      "the transcontinental railroad and Chinese workers",
      "the California aqueduct and water systems",
      "the 1906 San Francisco earthquake and rebuilding",
      "California's Central Valley farming and agriculture",
      "Native California tribes and their traditions",
      "the history of California becoming the 31st state",
      "California wildfires and the bravery of firefighters",
      "the Channel Islands National Park and its wildlife",
      "the American Revolution and its causes",
      "the Underground Railroad and Harriet Tubman",
      "immigration through Ellis Island in the early 1900s",
      "the Declaration of Independence and its meaning",
      "the Dust Bowl and the migration of families to California",
      "monarch butterfly migration through California",
      "the water cycle and California droughts",
      "volcanoes and plate tectonics",
      "the life cycle of Pacific salmon in California rivers",
      "ocean ecosystems and kelp forests off the California coast",
      "animal adaptations in the Mojave Desert",
      "renewable energy and solar power in California",
      "the science of earthquakes and seismology",
      "wolves and their role in balancing ecosystems",
      "rainforest biodiversity and the canopy layer",
      "deep sea creatures and bioluminescence",
      "coral reefs and ocean health",
      "the International Space Station and astronaut life",
      "Mars exploration and NASA rovers",
      "weather systems and how hurricanes form",
      "Cesar Chavez and the farmworkers movement",
      "Amelia Earhart and the history of aviation",
      "Thomas Edison and the invention of the lightbulb",
      "Maya Lin and the Vietnam Veterans Memorial",
      "Sally Ride — America's first woman in space",
      "John Muir and the California conservation movement",
      "Thurgood Marshall and the fight for civil rights",
      "Malala Yousafzai and the right to education",
      "Neil Armstrong and the Apollo 11 moon landing",
      "Nikola Tesla and the development of electricity",
      "the history of the Olympic Games",
      "how California grows half of America's fruits and vegetables",
      "the Pony Express and early American communication",
      "the history of the Golden Gate Bridge",
      "how national parks were created and why they matter",
      "how newspapers shaped American democracy",
      "the history of the public library in America",
      "how the US Constitution protects our rights",
      "the history of women's suffrage and the 19th Amendment",
      "the history of the Paralympic Games and disability rights",
      "the history of Braille and Louis Braille",
    ],
    math: [
      "planning a school fundraiser car wash",
      "organizing a 5th grade graduation celebration",
      "running a school supply store",
      "tracking a classroom reading challenge",
      "planning a school garden project",
      "organizing a canned food drive for families",
      "budgeting for a class field trip to the California Science Center",
      "planning a school mural painting project",
      "running a school recycling program",
      "organizing a school book fair",
      "calculating stats for a Little League baseball season",
      "planning a school basketball tournament bracket",
      "tracking a swim team's practice distances",
      "organizing a school Olympics event",
      "planning a class hiking trip in a California state park",
      "tracking a soccer team's season scoring record",
      "planning a school fun run fundraiser",
      "calculating scores for a school spelling bee competition",
      "running a school bake sale",
      "planning a class Thanksgiving potluck",
      "scaling recipes for a school cooking class",
      "budgeting for a taco cart at a school carnival",
      "calculating ingredients for a class pizza party",
      "running a lemonade stand as a class economics project",
      "planning a family road trip from Los Angeles to San Francisco",
      "calculating distances between California national parks",
      "budgeting for a family trip to Yosemite National Park",
      "planning a community farmers market booth",
      "tracking water usage during a California drought conservation effort",
      "designing a classroom layout using area and perimeter",
      "planning a school vegetable garden with raised beds",
      "calculating materials needed for a school bench project",
      "measuring and tiling a school bathroom floor",
      "designing a new playground for the school yard",
      "analyzing rainfall data for California cities",
      "tracking daily temperatures across California regions",
      "calculating the cost of solar panels for the school roof",
      "analyzing results from a class science experiment",
      "tracking plant growth measurements in a class experiment",
      "planning a birthday party on a budget",
      "calculating sales tax at a California store",
      "comparing prices at two different grocery stores",
      "budgeting a weekly allowance over a school year",
      "calculating earnings from a neighborhood dog walking business",
      "planning a clothing donation drive for families",
      "calculating postage costs for a pen pal project",
      "budgeting for new classroom library books",
      "tracking miles walked in a school step challenge",
      "calculating the cost of a class subscription to a science magazine",
      "planning a school talent show ticket sales and seating",
    ],
    science: [
      "how plants make food through photosynthesis",
      "food webs in a California oak woodland ecosystem",
      "the role of decomposers in a healthy forest",
      "how energy moves through a food chain",
      "producers, consumers, and decomposers in a tide pool",
      "how drought affects plant and animal life in California",
      "the life cycle of a California condor",
      "how bees pollinate flowers and support food production",
      "invasive species and their impact on California ecosystems",
      "how salmon depend on healthy rivers to reproduce",
      "how human activity disrupts food webs",
      "the role of fungi in breaking down dead matter",
      "how photosynthesis supports all life on Earth",
      "properties of matter — solids, liquids, and gases",
      "physical and chemical changes in everyday materials",
      "how mixtures and solutions are different",
      "conservation of matter in a chemical reaction",
      "gravity and how it affects objects on Earth",
      "how energy transfers from the sun to living things",
      "density and why objects float or sink in water",
      "how heat energy moves through conduction and convection",
      "the properties of light and how shadows form",
      "magnetism and how it works in everyday life",
      "how forces affect the motion of objects",
      "the difference between potential and kinetic energy",
      "Earth's layers — crust, mantle, outer core, and inner core",
      "how the water cycle works in California",
      "why Earth's climate varies across different regions",
      "how plate tectonics cause earthquakes and volcanoes",
      "the role of the sun as Earth's main energy source",
      "how humans affect Earth's land and water resources",
      "the distribution of fresh water on Earth",
      "how weathering and erosion shape California's landscape",
      "Earth's atmosphere and its protective layers",
      "how climate change affects California's weather patterns",
      "the causes and effects of ocean pollution",
      "how deforestation affects Earth's carbon cycle",
      "how scientists design fair experiments",
      "how to identify variables in a scientific investigation",
      "how engineers use the design process to solve problems",
      "how scientists analyze data and draw conclusions",
      "how scientific models help us understand the natural world",
      "the difference between a hypothesis and a theory",
      "how technology helps scientists study Earth from space",
      "how citizen scientists help track environmental changes",
      "the history of the scientific method from Galileo to today",
      "how scientists use evidence to change their thinking",
      "how the moon affects Earth's ocean tides",
      "the rock cycle and how rocks change over time",
      "how animals adapt to survive California's rainy season",
    ],
    social: [
      "Native American life in California before European contact",
      "the Maya civilization and their achievements in math and astronomy",
      "the Aztec Empire and the city of Tenochtitlan",
      "Christopher Columbus and the age of exploration",
      "how Europeans and Native Americans first interacted",
      "the Columbian Exchange — plants, animals, and diseases",
      "daily life in a New England colonial town",
      "the triangular trade and its impact on colonists and enslaved people",
      "the Mayflower Compact and the idea of self-government",
      "the role of religion in Colonial America",
      "how colonial economies differed by region",
      "life on a Southern plantation in Colonial America",
      "the Boston Tea Party and colonial protests against Britain",
      "how enslaved people resisted and preserved their culture",
      "the role of colonial newspapers in spreading ideas",
      "the causes of the American Revolution",
      "the role of Paul Revere and the Minutemen at Lexington",
      "Thomas Paine's Common Sense and its influence on colonists",
      "the Battle of Saratoga as the turning point of the Revolution",
      "the role of women in supporting the American Revolution",
      "how the Continental Army survived the winter at Valley Forge",
      "Benjamin Franklin's role as diplomat during the Revolution",
      "the Constitutional Convention of 1787 and the Great Compromise",
      "the Bill of Rights and why each amendment matters",
      "how the three branches of government work together",
      "checks and balances and why they protect democracy",
      "the role of George Washington as the first president",
      "how the Louisiana Purchase doubled the size of the United States",
      "the Lewis and Clark Expedition across the Louisiana Territory",
      "the Oregon Trail and the challenges of westward migration",
      "the California Gold Rush of 1849",
      "how the transcontinental railroad changed American commerce",
      "the impact of westward expansion on Native American nations",
      "the five geographic regions of the United States",
      "how geography shaped where colonists chose to settle",
      "major rivers and their importance to early American history",
      "the Great Plains and how settlers adapted to the environment",
      "how the Rocky Mountains affected the pace of westward expansion",
      "the role of citizens in a democratic government",
      "how a bill becomes a law in the United States",
      "the importance of the freedom of speech and the press",
      "how local, state, and federal governments are different",
      "the Electoral College and how the president is elected",
      "supply and demand in colonial trade",
      "how mercantilism shaped the relationship between colonies and Britain",
      "the role of money, barter, and trade in early America",
      "how taxation without representation angered colonists",
      "comparing the economies of Northern and Southern colonies",
      "the role of the free press in American democracy",
      "how the Erie Canal changed trade in early America",
    ],
    writing: [
      "should students have homework every night",
      "should schools have a school uniform policy",
      "should recess be longer in elementary school",
      "should students be allowed to use tablets in class every day",
      "should schools serve healthier food in the cafeteria",
      "should physical education be required every school day",
      "should students be able to choose their own reading books",
      "should schools start later in the morning for better sleep",
      "should students learn a second language starting in kindergarten",
      "should schools ban junk food and sugary drinks",
      "should students have a say in creating classroom rules",
      "should school libraries have more graphic novels and comics",
      "should there be limits on screen time for kids",
      "a day when everything went wrong but turned out okay",
      "the day you discovered a hidden talent",
      "a time you showed courage when it was difficult",
      "your most memorable family tradition or celebration",
      "a day exploring a California state park or beach",
      "the best lesson a grandparent or elder ever taught you",
      "a time you had to solve a really difficult problem",
      "a moment when you felt genuinely proud of yourself",
      "a time you tried something completely new and unexpected",
      "the day you made an unexpected friendship",
      "a time you helped someone who really needed it",
      "the most important thing you learned in 5th grade",
      "explain how the water cycle works and why it matters",
      "describe how the three branches of US government are organized",
      "explain why California is called the Golden State",
      "describe the importance of the Bill of Rights to Americans today",
      "explain how photosynthesis supports all life on Earth",
      "describe the main causes of the American Revolution",
      "explain how earthquakes happen and how scientists measure them",
      "describe the journey and hardships of a California Gold Rush miner",
      "explain the importance of water conservation in California",
      "describe how a bill becomes a law in the United States",
      "a letter from a student to their school principal",
      "a diary entry written by a colonial child in 1750",
      "a news report about an important school event",
      "a letter from a Gold Rush miner to their family back home",
      "a travel brochure for a California national park",
      "a book review of a favorite novel read this year",
      "an advertisement for a school fundraiser event",
      "a thank-you letter to a community hero or mentor",
      "a letter to a future 5th grader about what to expect",
      "explain what makes a good leader using a historical example",
      "describe a California landmark and why it is important",
      "a speech to convince the school board to add an art program",
      "explain the importance of voting in a democracy",
      "describe the most interesting thing you learned in science this year",
      "a letter from a student to their favorite author",
    ],
  }
  
  const subjectTopics = passageTopics[subjectId] || passageTopics.ela;
  const randomTopic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];

  return `You are creating a complete 5th grade California CCSS-aligned worksheet. Output ONLY structured plain text using exactly the section markers below. Follow the structure EXACTLY — do not move, rename, or skip any block.

DETAILS:
- Subject: ${subjectId.toUpperCase()} — ${resourceType}
- Standards: ${std.codes}
- Focus: ${std.focus}
- Skills: ${std.skills.join(", ")}
- Purpose: ${purposeGuide[purpose] || purposeGuide.practice}
- Difficulty: ${diffGuide[difficulty] || diffGuide.on}
${topic ? `- Topic: ${topic}` : ""}

EXACT STRUCTURE — copy these markers verbatim, fill in content only inside the parentheses:

[TITLE]
(Engaging specific title)

[SUBTITLE]
5th Grade · ${subjectId.toUpperCase()} · ${std.codes}

[DIRECTIONS]
(Clear 1–2 sentence student directions)

${std.passage ? `[PASSAGE]
(YOUR PASSAGE TITLE IN ALL CAPS — e.g. THE CALIFORNIA GOLD RUSH)
(Your original 150-200 word passage goes here. Write ONLY the passage text. No instructions. No brackets. No placeholders. Real sentences only. Start writing the passage immediately after the title line.)

` : ""}[SECTION: Warm-Up]
TYPE: short_answer
1. (question)
_______________________________________________

2. (question)
_______________________________________________

3. (question)
_______________________________________________

[SECTION: Multiple Choice]
TYPE: multiple_choice
4. (complete question with real numbers)
   A. (common student error answer)
   B. (correct answer)
   C. (common student error answer)
   D. (common student error answer)

5. (complete question)
   A. (option)
   B. (option)
   C. (option)
   D. (option)

6. (complete question)
   A. (option)
   B. (option)
   C. (option)
   D. (option)

7. (complete question)
   A. (option)
   B. (option)
   C. (option)
   D. (option)

[SECTION: Show Your Work]
TYPE: word_problem
8. (multi-step word problem with California context and real numbers)

Show your work:
[WORK BOX]

Answer: _______________

9. (word problem requiring interpretation, not just computation)

Show your work:
[WORK BOX]

Answer: _______________

[SECTION: Explain Your Thinking]
TYPE: explain
10. (question requiring explanation of a strategy or method)

_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________

[BONUS]
(One harder higher-order thinking challenge question)

_______________________________________________
_______________________________________________
_______________________________________________

[ANSWER KEY]
Warm-Up:
1. (answer with brief explanation)
2. (answer with brief explanation)
3. (answer with brief explanation)

Multiple Choice:
4. (letter) — (why correct; what error each wrong answer represents)
5. (letter) — (brief explanation)
6. (letter) — (brief explanation)
7. (letter) — (brief explanation)

Word Problems:
8. (full solution with steps)
9. (full solution with steps)

Explain: (example of strong student response)
Bonus: (full solution)

[TEACHER NOTES]
Standards: ${std.codes}
Tips: (2–3 sentences on differentiation, misconceptions, suggested use)

RULES:
- No placeholder text ever. Real numbers and scenarios only.
- Student-friendly warm tone.
- CRITICAL VARIATION RULE: Every generation must feel completely fresh and different. Never reuse the same passage topic, scenario, character names, or context from previous generations.
- For passages: rotate through a wide range of topics. Do NOT default to redwood trees, monarch butterflies, or condors repeatedly. Use topics like: California history, space exploration, ocean ecosystems, inventors, athletes, local communities, food science, weather phenomena, architecture, music, animal adaptations, technology, rivers and water systems, farming, immigration stories, California missions, the Gold Rush, famous Californians, sports, cooking, ocean life, deserts, mountains, volcanoes, ancient civilizations, coding, environmental science, and more.
- For math: rotate through different real-world contexts — sports statistics, cooking and recipes, school events, construction projects, travel distances, shopping, fundraisers, science experiments, farming, architecture, population data, environmental data.
- For word problems: use different student names and scenarios every time. Never repeat the same setup.
- Generate as if this is the first and only time you are creating this type of worksheet — make it unique, engaging, and specific.
- TOPIC FOR THIS WORKSHEET: ${randomTopic}. Build your passage, scenarios, and examples around this specific topic. Make it feel completely fresh and specific.\`;
// ─── PARSE WORKSHEET ─────────────────────────────────────────────────────────

function inferType(heading) {
  const h = heading.toLowerCase();
  if (h.includes("multiple choice") || h.includes("multiple-choice")) return "multiple_choice";
  if (h.includes("warm")) return "short_answer";
  if (h.includes("word problem") || h.includes("show your work") || h.includes("math")) return "word_problem";
  if (h.includes("explain") || h.includes("thinking") || h.includes("writing")) return "explain";
  if (h.includes("true") || h.includes("false")) return "true_false";
  if (h.includes("fill") || h.includes("blank")) return "fill_blank";
  return "short_answer";
}

function parseWorksheet(text) {
  const get = (tag) => {
    // Match [TAG] followed by content until next [ tag or end
    const re = new RegExp(`\\[${tag}\\][^\\n]*\\n([\\s\\S]*?)(?=\\n\\[(?:TITLE|SUBTITLE|DIRECTIONS|PASSAGE|SECTION|BONUS|ANSWER|TEACHER)|$)`, "i");
    const m = text.match(re);
    return m ? m[1].trim() : "";
  };

  // Step 1: Get raw passage block
  let passage = get("PASSAGE");

  // Step 2: Clean out any instruction artifacts
  if (passage) {
    passage = passage
      .replace(/CRITICAL:.*?\n/gi, "")
      .replace(/RULE:.*?\n/gi, "")
      .replace(/IMPORTANT:.*?\n/gi, "")
      .replace(/Write your original passage.*?\n/gi, "")
      .replace(/\(replace this.*?\)/gi, "")
      .replace(/\(Write.*?\)/gi, "")
      .trim();
    // Discard if too short or still placeholder
    if (passage.length < 80) passage = "";
  }

  // Step 3: If still no passage, find text between [DIRECTIONS] and first [SECTION]
  if (!passage) {
    const dirIdx = text.indexOf("[DIRECTIONS]");
    const secIdx = text.indexOf("[SECTION:");
    if (dirIdx !== -1 && secIdx !== -1 && secIdx > dirIdx) {
      // Get everything between end of directions content and start of first section
      const between = text.slice(dirIdx, secIdx);
      // Skip past the directions line itself
      const afterDir = between.replace(/\[DIRECTIONS\][^\n]*\n[^\n]+\n/, "").trim();
      if (afterDir.length > 80 && !afterDir.startsWith("[") && afterDir.split(".").length > 2) {
        passage = afterDir;
      }
    }
  }

  // Step 4: Last resort - look for ALL CAPS title followed by paragraph text
  if (!passage) {
    const capsTitle = text.match(/\n([A-Z][A-Z\s]{10,})\n([\s\S]{100,}?)(?=\n\[SECTION:)/);
    if (capsTitle) {
      passage = capsTitle[1].trim() + "\n" + capsTitle[2].trim();
    }
  }

  // Flexible section parser - handles variations in Claude output formatting
  const sections = [];
  
  // Strategy 1: Standard format [SECTION: name]\nTYPE: type\n
  const sectionRe = /\[SECTION:\s*([^\]]+)\][^\n]*\n(?:TYPE:\s*(\w+)[^\n]*\n)?([\s\S]*?)(?=\n\[SECTION:|\n\[BONUS|\n\[ANSWER|\n\[TEACHER|$)/gi;
  let m;
  while ((m = sectionRe.exec(text)) !== null) {
    const heading = m[1].trim();
    // Infer type from heading if TYPE line is missing
    let type = m[2] ? m[2].trim() : inferType(heading);
    const rawContent = m[3].trim();
    // Skip if content looks like raw unparsed markers
    if (rawContent.startsWith("[SECTION:") || rawContent.startsWith("TYPE:")) continue;
    sections.push({ heading, type, content: rawContent });
  }
  
  // If no sections found, try alternate format without TYPE line
  if (sections.length === 0) {
    const altRe = /\*\*([A-Z][^*]+)\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*[A-Z]|\n\[BONUS|\n\[ANSWER|$)/gi;
    while ((m = altRe.exec(text)) !== null) {
      const heading = m[1].trim();
      sections.push({ heading, type: inferType(heading), content: m[2].trim() });
    }
  }

  return {
    title: get("TITLE"),
    subtitle: get("SUBTITLE"),
    directions: get("DIRECTIONS"),
    passage,
    sections,
    bonus: get("BONUS"),
    answerKey: get("ANSWER KEY"),
    teacherNotes: get("TEACHER NOTES"),
  };
}

// ─── PRINTABLE VIEW ───────────────────────────────────────────────────────────

function renderSectionHTML(sec) {
  // Clean any accidentally included section markers from content
  let cleanContent = sec.content
    .replace(/^\[SECTION:[^\]]+\]\n?/gim, "")
    .replace(/^TYPE:\s*\w+\n?/gim, "")
    .replace(/^RULE:[^\n]+\n?/gim, "")
    .replace(/^IMPORTANT:[^\n]+\n?/gim, "")
    .trim();
  const lines = cleanContent.split("\n");
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      const qNum = qMatch[1], qText = qMatch[2];
      html += `<div style="margin-bottom:16px;display:flex;gap:10px;"><span style="font-weight:700;color:#374151;min-width:22px;font-size:14px;">${qNum}.</span><div style="flex:1;"><p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#1e293b;font-weight:500;">${qText}</p>`;
      if (sec.type === "multiple_choice") {
        let j = i + 1;
        while (j < lines.length && lines[j].trim().match(/^[A-D]\./)) {
          html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><div style="width:16px;height:16px;border-radius:50%;border:2px solid #CBD5E1;flex-shrink:0;"></div><span style="font-size:13px;color:#374151;">${lines[j].trim()}</span></div>`;
          j++;
        }
        i = j;
      } else if (sec.type === "word_problem") {
        i++;
        while (i < lines.length) {
          const wl = lines[i].trim();
          if (wl === "[WORK BOX]") { html += `<div style="border:2px dashed #CBD5E1;border-radius:10px;padding:12px;margin:8px 0;background:#F8FAFC;"><p style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;">Show Your Work</p><div style="min-height:60px;"></div></div>`; i++; }
          else if (wl.startsWith("Answer:")) { html += `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;"><span style="font-size:12px;font-weight:600;color:#94A3B8;">Answer:</span><div style="border-bottom:1.5px solid #CBD5E1;flex:1;height:20px;"></div></div>`; i++; break; }
          else if (wl.match(/^(\d+)\.|^\[/)) break;
          else { if (wl) html += `<p style="font-size:13px;color:#374151;margin:2px 0;">${wl}</p>`; i++; }
        }
      } else if (sec.type === "explain") {
        i++;
        let lc = 0;
        while (i < lines.length && lines[i].trim().startsWith("___")) { lc++; i++; }
        for (let k = 0; k < Math.max(lc, 4); k++) html += `<div style="border-bottom:1.5px solid #CBD5E1;height:28px;margin-bottom:4px;"></div>`;
      } else {
        i++;
        while (i < lines.length && lines[i].trim().startsWith("___")) { html += `<div style="border-bottom:1.5px solid #CBD5E1;height:28px;margin-bottom:4px;"></div>`; i++; }
      }
      html += `</div></div>`;
    } else { i++; }
  }
  return html;
}

function PrintableView({ parsed, subject, showKey, onToggleKey }) {
  const hc = subject.hc;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 rex-no-print">
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"><Printer size={12} /> Print / PDF</button>
          <button onClick={onToggleKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showKey ? "bg-slate-800 text-white border-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            {showKey ? <EyeOff size={12}/> : <Eye size={12}/>} {showKey ? "Hide Key" : "Answer Key"}
          </button>
        </div>
        <span className="text-xs text-slate-400 italic">CCSS · 5th Grade · California</span>
      </div>

      <div className="rex-print-area">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div style={{ background:`linear-gradient(135deg,${hc}18 0%,${hc}06 100%)`, borderTop:`4px solid ${hc}` }} className="px-7 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">{parsed.title || "Worksheet"}</h1>
              <p style={{color:hc}} className="text-xs font-bold mt-1 uppercase tracking-wide">{parsed.subtitle}</p>
            </div>
            <div className="flex-shrink-0 space-y-1.5 min-w-32">
              {["Name","Date","Score"].map(f=>(
                <div key={f} className="flex items-center gap-2"><span className="text-xs text-slate-400 w-9">{f}:</span><div className="border-b border-slate-300 flex-1 h-5"/></div>
              ))}
            </div>
          </div>
          {parsed.directions && (
            <div className="mt-4 bg-white bg-opacity-80 rounded-xl px-4 py-2.5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mr-2">Directions:</span>
              <span className="text-sm text-slate-700">{parsed.directions}</span>
            </div>
          )}
        </div>

        {parsed.passage && (
          <div className="px-7 pt-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Read the Passage:</p>
              {parsed.passage.split("\n").map((line,i)=>(
                <p key={i} className={`text-sm leading-relaxed ${i===0?"font-bold text-slate-800 mb-1":"text-slate-700"}`}>{line}</p>
              ))}
            </div>
          </div>
        )}

        <div className="px-7 py-5 space-y-6">
          {parsed.sections.map((sec,si)=>(
            <div key={si}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-100"/>
                <h2 style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest px-2">{sec.heading}</h2>
                <div className="h-px flex-1 bg-slate-100"/>
              </div>
              <div dangerouslySetInnerHTML={{__html:renderSectionHTML(sec)}}/>
            </div>
          ))}
          {parsed.bonus && (
            <div style={{background:`${hc}0d`,border:`1.5px solid ${hc}30`}} className="rounded-xl p-5">
              <p style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest mb-3">⭐ Bonus Challenge</p>
              <p className="text-sm font-medium text-slate-800 mb-3">{parsed.bonus.split("\n")[0]}</p>
              {[...Array(4)].map((_,i)=><div key={i} className="border-b border-slate-300 h-7 mt-1.5 w-full"/>)}
            </div>
          )}
        </div>

        <div className="px-7 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-300">© Teacher OS · 5th Grade · For classroom use</span>
          <div className="flex gap-1">{[...Array(4)].map((_,i)=><div key={i} style={{background:`${hc}50`}} className="w-1 h-1 rounded-full"/>)}</div>
        </div>
      </div>

      {showKey && parsed.answerKey && (
        <div className="mt-4 bg-slate-800 rounded-2xl p-5 rex-answer-key" style={{pageBreakBefore:"always"}}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Answer Key</p>
          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">{parsed.answerKey}</pre>
          {parsed.teacherNotes && (
            <div className="mt-4 bg-slate-700 rounded-xl px-4 py-3">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Teacher Notes</p>
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">{parsed.teacherNotes}</pre>
            </div>
          )}
        </div>
      )}
      </div>{/* end rex-print-area */}
    </div>
  );
}

// ─── RAW TEXT VIEW ────────────────────────────────────────────────────────────

function RawView({ text, subject }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border ${subject.border} shadow-sm overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-700">Editable Text — paste into Google Docs or Word</span>
        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all">
            {copied?<Check size={13} className="text-emerald-500"/>:<Copy size={13}/>} {copied?"Copied!":"Copy All"}
          </button>
          <button onClick={()=>window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all"><Printer size={13}/> Print</button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed p-6">{text}</pre>
    </div>
  );
}

// ─── CANVA PACK VIEW ──────────────────────────────────────────────────────────

function CanvaSection({ title, content, color, index }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100" style={{borderLeft:`4px solid ${color}`}}>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{background:color}}>{index}</span>
          <span className="text-sm font-bold text-slate-700">{title}</span>
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all">
          {copied?<Check size={12} className="text-emerald-500"/>:<Copy size={12}/>} {copied?"Copied!":"Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed p-4">{content}</pre>
    </div>
  );
}

function CanvaAIBlock({ prompt, subject }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);
  const hc = subject.hc;

  return (
    <div className="rounded-2xl overflow-hidden" style={{border: `2px solid ${hc}40`, background: `${hc}08`}}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{background: hc}}>
            AI
          </div>
          <div className="text-left">
            <p className="text-sm font-extrabold text-slate-800">Step 1: Canva AI Prompt</p>
            <p className="text-xs text-slate-500">Copy this first → paste into Canva AI to generate your layout</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* How to use */}
          <div className="bg-white rounded-xl p-4 mb-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-600 mb-2">How to use this in Canva:</p>
            <div className="space-y-1.5">
              {[
                "Go to canva.com → click Magic Design or use the AI assistant",
                "Paste this prompt into the AI text field",
                "Let Canva AI generate a starting layout",
                "Then use the content blocks below to fill it in"
              ].map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{background: hc, fontSize: 10}}>{i+1}</span>
                  <p className="text-xs text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The prompt */}
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Canva AI Prompt</span>
              <button
                onClick={() => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{background: copied ? "#10B981" : hc, color: "white"}}
              >
                {copied ? <Check size={12}/> : <Copy size={12}/>}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed p-4 max-h-48 overflow-y-auto">{prompt}</pre>
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            After Canva generates the layout → come back and use the content blocks below to fill it in
          </p>
        </div>
      )}
    </div>
  );
}

function CanvaView({ parsed, subject, rawText }) {
  const hc = subject.hc;
  const [allCopied, setAllCopied] = useState(false);

  // Build ordered sections for Canva
  const canvaSections = [];

  // 1. Cover/Header block
  canvaSections.push({
    title: "① HEADER BLOCK — paste into the top colored header",
    content: `${parsed.title}\n${parsed.subtitle}`
  });

  // 2. Student info line
  canvaSections.push({
    title: "② NAME / DATE / SCORE LINE — paste below the header",
    content: `Name: ________________________     Date: ___________     Score: ______`
  });

  // 3. Directions
  if (parsed.directions) {
    canvaSections.push({
      title: "③ DIRECTIONS BOX",
      content: `Directions: ${parsed.directions}`
    });
  }

  // 4. Passage (if any)
  if (parsed.passage) {
    canvaSections.push({
      title: "④ READING PASSAGE BOX",
      content: parsed.passage
    });
  }

  // 5. Each section
  parsed.sections.forEach((sec, i) => {
    const num = (parsed.passage ? 5 : 4) + i;
    const circle = ["⑤","⑥","⑦","⑧","⑨","⑩"][i] || `(${num})`;
    const typeHint = {
      multiple_choice: "MULTIPLE CHOICE — use bubble answer choices below each question",
      word_problem:    "WORD PROBLEMS — add a 'Show Your Work' box below each",
      short_answer:    "SHORT ANSWER — add 2–3 answer lines below each question",
      explain:         "EXPLAIN THINKING — add 4 answer lines below the question",
    }[sec.type] || sec.type.toUpperCase();

    canvaSections.push({
      title: `${circle} SECTION: ${sec.heading.toUpperCase()} — ${typeHint}`,
      content: sec.content
    });
  });

  // 6. Bonus
  if (parsed.bonus) {
    const num = canvaSections.length + 1;
    canvaSections.push({
      title: `⑪ BONUS CHALLENGE BOX — use a highlighted or star-bordered box`,
      content: `⭐ BONUS CHALLENGE\n${parsed.bonus}`
    });
  }

  // 7. Footer
  canvaSections.push({
    title: "⑫ FOOTER — small text at bottom of page",
    content: `© ${new Date().getFullYear()} · 5th Grade · ${subject.label} · For classroom and TPT use`
  });

  // 8. Answer key (separate page)
  if (parsed.answerKey) {
    canvaSections.push({
      title: "⑬ ANSWER KEY PAGE — duplicate your worksheet page, delete questions, paste this",
      content: `ANSWER KEY\n${parsed.title}\n\n${parsed.answerKey}`
    });
  }

  // 9. Teacher notes
  if (parsed.teacherNotes) {
    canvaSections.push({
      title: "⑭ TEACHER NOTES — optional back page or TPT product description",
      content: parsed.teacherNotes
    });
  }

  const copyAll = () => {
    const full = canvaSections.map((s,i) => `=== ${s.title} ===\n${s.content}`).join("\n\n\n");
    navigator.clipboard.writeText(full);
    setAllCopied(true);
    setTimeout(()=>setAllCopied(false),2000);
  };

  // Build the Canva AI prompt
  const sectionNames = parsed.sections.map(s => s.heading).join(", ");
  const hasPassage = !!parsed.passage;
  const canvaAIPrompt = `Create a professional, print-ready classroom worksheet for elementary school students with the following specifications:

WORKSHEET DETAILS:
Title: ${parsed.title || "Educational Worksheet"}
Subject: ${subject.label}
Grade Level: 5th Grade
Standards: ${parsed.subtitle || "CCSS Aligned"}

LAYOUT REQUIREMENTS:
- Clean, teacher-friendly design suitable for printing
- Bold, eye-catching title at the top in a colored header banner
- Name, Date, and Score fields in the header area
- Directions box with a subtle background
${hasPassage ? "- A clearly defined reading passage box with a bold passage title" : ""}
- Distinct section headers for: ${sectionNames}
- Multiple choice questions with circular bubble answer options (○ A. ○ B. ○ C. ○ D.)
- Lined answer spaces for short answer and written response questions
- Dashed work boxes for word problems labeled "Show Your Work"
- A star-bordered bonus challenge box at the bottom
- Professional footer with grade level and copyright line

STYLE:
- Fonts: Bold display font for title, clean readable font for body
- Layout: Single column, well-spaced for student writing room
- Feel: Polished and professional — suitable for TPT sale or classroom use
- Page size: 8.5 x 11 inches, portrait orientation
- Color: Choose a cohesive, professional color scheme that fits an elementary classroom

Generate a worksheet template layout I can fill in with my content.`;

  return (
    <div className="space-y-4">
      {/* Canva AI Prompt Block */}
      <CanvaAIBlock prompt={canvaAIPrompt} subject={subject} />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} style={{color:hc}} />
              <span className="text-sm font-extrabold text-slate-800">Canva Pack</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{background:hc}}>READY</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Each block below is one paste in Canva. Copy them one at a time into the matching text box in your template.</p>
          </div>
          <button onClick={copyAll} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all active:scale-95 flex-shrink-0" style={{background: allCopied ? "#10B981" : hc}}>
            {allCopied ? <Check size={13}/> : <Copy size={13}/>} {allCopied ? "All Copied!" : "Copy Everything"}
          </button>
        </div>

        {/* Color chip */}
        <div className="mt-4 flex items-center gap-3 bg-slate-50 rounded-xl p-3">
          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{background:hc}} />
          <div>
            <p className="text-xs font-bold text-slate-600">Your subject color</p>
            <p className="text-xs text-slate-400">In Canva: click header → change color → paste <span className="font-mono font-bold text-slate-700">{hc}</span></p>
          </div>
          <button onClick={()=>navigator.clipboard.writeText(hc)} className="ml-auto px-2 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all">Copy hex</button>
        </div>

        {/* Quick Canva link */}
        <a href="https://www.canva.com/search/templates?q=classroom+worksheet" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-xs font-bold underline" style={{color:hc}}>
          Open Canva worksheet templates <ExternalLink size={11}/>
        </a>
      </div>

      {/* Step-by-step instructions */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How to use this in Canva</p>
        <div className="space-y-2">
          {[
            "Open Canva → search 'classroom worksheet' → pick a template with a colored header and section boxes",
            `Change the header color to ${hc} (tap any colored element → color picker → paste the hex)`,
            "Work through each block below in order — copy it, click the matching text box in Canva, paste",
            "For answer bubbles: Canva Elements → search 'circle outline' → add 4 next to each A/B/C/D",
            "For work boxes: Canva Elements → search 'rectangle outline' → drag below word problems",
            "When done: Share → Download → PDF Print (300 DPI) → upload to TPT",
          ].map((step, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Canva blocks */}
      {canvaSections.map((sec, i) => (
        <CanvaSection key={i} index={i+1} title={sec.title} content={sec.content} color={hc} />
      ))}

      {/* TPT tip */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <Sparkles size={15} className="text-indigo-400 mt-0.5 flex-shrink-0"/>
        <div>
          <p className="text-xs font-bold text-indigo-700 mb-1">TPT Seller Tip</p>
          <p className="text-xs text-indigo-600 leading-relaxed">Generate 3–5 variations of the same resource type (e.g. 5 different Fractions Practice sheets). Bundle them into one Canva file with a cover page. That's a complete TPT product. Price point: $3–5 for a 5-pack. Cover page = your thumbnail.</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function RexStudio() {
  const [apiKey, setApiKey] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tos2_settings") || "{}").apiKey || ""; } catch { return ""; }
  });
  const [showApi, setShowApi] = useState(false);

  const [subjectIdx, setSubjectIdx] = useState(0);
  const subject = SUBJECTS[subjectIdx];
  const resourceTypes = Object.keys(STANDARDS[subject.id]);
  const [resourceType, setResourceType] = useState(resourceTypes[0]);
  const [difficulty, setDifficulty] = useState("on");
  const [purpose, setPurpose] = useState("practice");
  const [topic, setTopic] = useState("");
  const [outputMode, setOutputMode] = useState("print");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [showKey, setShowKey] = useState(false);

  const handleSubject = (idx) => {
    const s = SUBJECTS[idx];
    setSubjectIdx(idx);
    setResourceType(Object.keys(STANDARDS[s.id])[0]);
    setRawText(""); setParsed(null); setError("");
  };

  const generate = async () => {
    if (!apiKey.trim()) { setError("Tap '⚠ Set API Key' at the top right."); return; }
    const validTypes = Object.keys(STANDARDS[subject.id]);
    const safeType = validTypes.includes(resourceType) ? resourceType : validTypes[0];
    setLoading(true); setError(""); setRawText(""); setParsed(null); setShowKey(false);
    try {
      const prompt = buildPrompt(subject.id, safeType, difficulty, purpose, topic);
      const result = await callClaude(prompt, apiKey, 4000);
      setRawText(result);
      setParsed(parseWorksheet(result));
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          .rex-print-area, .rex-print-area * { visibility: visible; }
          .rex-print-area { position: absolute; top: 0; left: 0; width: 100%; }
          .rex-answer-key { page-break-before: always !important; }
          .rex-answer-key, .rex-answer-key * { visibility: visible; }
        }
      `}</style>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm rex-no-print">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-sm transition-all duration-300`}>
            <subject.icon size={18} className="text-white"/>
          </div>
          <div>
            <div className="font-extrabold text-slate-800 text-sm tracking-wide">REX</div>
            <div className="text-xs text-slate-400">Resource Studio · 5th Grade CA</div>
          </div>
        </div>
        <button onClick={()=>setShowApi(!showApi)} className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all ${apiKey?"border-emerald-200 text-emerald-600 bg-emerald-50":"border-red-200 text-red-500 bg-red-50"}`}>
          {apiKey?"✓ API Key Set":"⚠ Set API Key"} <ChevronDown size={11}/>
        </button>
      </div>

      {/* API panel */}
      {showApi && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 rex-no-print">
          <div className="max-w-2xl mx-auto flex gap-2 items-center">
            <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-… from console.anthropic.com" className="flex-1 px-3.5 py-2 rounded-xl border border-amber-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white font-mono"/>
            <button onClick={()=>{localStorage.setItem("tos2_settings",JSON.stringify({apiKey}));setShowApi(false);}} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors">Save</button>
          </div>
          <p className="text-xs text-amber-600 text-center mt-2">Get a key at <strong>console.anthropic.com</strong> → API Keys → Create Key</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Subject */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 rex-no-print">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Subject</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SUBJECTS.map((s,idx)=>(
              <button key={s.id} onClick={()=>handleSubject(idx)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-bold transition-all ${subjectIdx===idx?`bg-gradient-to-br ${s.gradient} text-white border-transparent shadow-md scale-105`:`bg-white ${s.border} ${s.accent} hover:shadow-sm`}`}>
                <s.icon size={17}/><span className="text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Config */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5 rex-no-print">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure Your Resource</p>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Resource Type</label>
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map(t=>(
                <button key={t} onClick={()=>{setResourceType(t);setRawText("");setParsed(null);setError("");}} className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${resourceType===t?`bg-gradient-to-br ${subject.gradient} text-white border-transparent shadow-sm`:`bg-white ${subject.border} ${subject.accent} hover:shadow-sm`}`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Purpose</label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map(p=>(
                <button key={p.id} onClick={()=>setPurpose(p.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${purpose===p.id?"bg-slate-800 text-white border-slate-800 shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{p.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d=>(
                <button key={d.id} onClick={()=>setDifficulty(d.id)} className={`p-3 rounded-xl text-left border-2 transition-all ${difficulty===d.id?`${subject.soft} ${subject.border} shadow-sm`:"bg-white border-slate-200 hover:border-slate-300"}`}>
                  <div className={`text-xs font-bold ${difficulty===d.id?subject.accent:"text-slate-600"}`}>{d.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Specific Topic <span className="font-normal text-slate-400">(optional)</span></label>
            <input value={topic} onChange={e=>setTopic(e.target.value)}
              placeholder={subject.id==="math"?"e.g. Adding fractions with unlike denominators":subject.id==="ela"?"e.g. Making inferences from informational text":subject.id==="writing"?"e.g. Should students have homework?":subject.id==="science"?"e.g. Photosynthesis and food webs":"e.g. Colonial America daily life"}
              className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 ${subject.ring} bg-white transition`}
            />
          </div>

          {/* Output mode — only show after generating */}
          {rawText && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">View As</label>
              <div className="grid grid-cols-3 gap-2">
                {OUTPUT_MODES.map(m=>(
                  <button key={m.id} onClick={()=>setOutputMode(m.id)} className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${outputMode===m.id?`${subject.soft} ${subject.border} shadow-sm`:"border-slate-200 bg-white hover:border-slate-300"}`}>
                    <m.icon size={14} className={outputMode===m.id?subject.accent:"text-slate-400"}/>
                    <div className={`text-xs font-bold ${outputMode===m.id?subject.accent:"text-slate-600"}`}>{m.label}</div>
                    <div className="text-xs text-slate-400 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={generate} disabled={loading} className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all active:scale-95 ${loading?"bg-slate-200 cursor-not-allowed text-slate-400":`bg-gradient-to-r ${subject.gradient} shadow-lg hover:shadow-xl hover:opacity-95`}`}>
            {loading?<Loader2 size={18} className="animate-spin"/>:<Sparkles size={18}/>}
            {loading?"Generating your worksheet…":rawText?"Generate New Worksheet":"Generate Resource"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0"/>
              <div><p>{error}</p>
                <button onClick={generate} className="mt-2 flex items-center gap-1.5 text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all"><RefreshCw size={11}/> Try Again</button>
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        {rawText && parsed && outputMode === "print" && <PrintableView parsed={parsed} subject={subject} showKey={showKey} onToggleKey={()=>setShowKey(!showKey)}/>}
        {rawText && outputMode === "raw" && <RawView text={rawText} subject={subject}/>}
        {rawText && parsed && outputMode === "canva" && <CanvaView parsed={parsed} subject={subject} rawText={rawText}/>}
      </div>
    </div>
  );
}
