import { useState, useEffect } from "react";
import {
  Sparkles, Printer, Copy, Check, ChevronDown,
  BookOpen, PenTool, FlaskConical, Globe, Calculator,
  Loader2, AlertCircle, Eye, EyeOff, ExternalLink, RefreshCw,
  Package, Layout, Type, Download
} from "lucide-react";

// ─── GRADE LABEL HELPER ───────────────────────────────────────────────────────
// Turns a grade number into its ordinal label ("3rd", "4th", "5th").
// Replaces the old hardcoded binary so any grade works.
function gradeOrdinal(grade) {
  const n = Number(grade);
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

// ─── STANDARDS MAP ────────────────────────────────────────────────────────────

const STANDARDS = {
  5: {
    math: {
      "Fractions Practice":        { codes:"5.NF.1–7", focus:"Adding/subtracting fractions with unlike denominators, multiplying and dividing fractions and mixed numbers, fraction word problems.", skills:["unlike denominators","mixed numbers","equivalent fractions","fraction multiplication","fraction division","multi-step fraction word problems"] },
      "Decimals Practice":         { codes:"5.NBT.1–4, 5.NBT.7", focus:"Place value to thousandths, powers of 10, comparing and rounding decimals, decimal operations.", skills:["decimal place value","powers of 10","comparing decimals","rounding","decimal operations","decimal word problems"] },
      "Multiplication & Division": { codes:"5.NBT.2, 5.NBT.5–6, 5.OA.1–2", focus:"Multi-digit multiplication, division with 2-digit divisors, numerical expressions with parentheses.", skills:["multi-digit multiplication","long division","order of operations","numerical expressions","estimation"] },
      "Volume":                    { codes:"5.MD.C.3–5", focus:"Volume of rectangular prisms using unit cubes and formulas V=lwh and V=bh, additive volumes, real-world volume problems.", skills:["unit cubes","V=lwh formula","V=bh formula","additive volume","volume word problems"] },
      "Coordinate Plane & Geometry": { codes:"5.OA.3, 5.G.1–4, 5.MD.1–2", focus:"Plotting and interpreting ordered pairs, generating numerical patterns and graphing their ordered pairs, classifying 2D figures, measurement conversion, line plots.", skills:["ordered pairs","coordinate plane","numerical patterns and their graphs","classifying shapes","quadrilaterals","triangles","unit conversion","line plots"] },
      "Order of Operations":       { codes:"5.OA.1–2", focus:"Expressions with parentheses, brackets, braces; evaluating and comparing.", skills:["parentheses/brackets/braces","evaluating expressions","writing expressions","comparing expressions"] },
      "Word Problems":             { codes:"5.OA.1–2, 5.NBT.5–6, 5.NF.2–6, 5.MD.1", focus:"Multi-step real-world problems with whole numbers, fractions, and decimals.", skills:["multi-step reasoning","operation selection","interpreting remainders","measurement conversion","fraction/decimal contexts"] },
      "Mixed Review":              { codes:"5.OA, 5.NBT, 5.NF, 5.MD, 5.G", focus:"Comprehensive review across all 5th grade math domains.", skills:["fractions","decimals","multiplication/division","volume","coordinate plane","2D figures"] },
      "SBAC Simulation":           { codes:"All 5th grade CCSS math", focus:"Authentic SBAC-style mixed-domain assessment with constructed response items.", skills:["mixed domains","constructed response","multi-step reasoning","select all that apply","justify and explain"] },
    },
    ela: {
      "Reading Comprehension":   { codes:"5.RI.1–3, 5.RI.6, 5.RL.1–3", focus:"Quoting from text, main idea and details, author's point of view, summarizing.", skills:["cite text evidence","main idea","author's point of view","compare/contrast","cause/effect","inferencing"], passage:true },
      "Vocabulary Practice":     { codes:"5.L.4–6", focus:"Context clues, Greek/Latin roots, figurative language, academic vocabulary.", skills:["context clues","Greek/Latin roots","prefixes/suffixes","simile/metaphor","idioms","academic vocabulary"], passage:true },
      "Context Clues":           { codes:"5.L.4a, 5.RI.4, 5.RL.4", focus:"Determining word meaning using context; literal vs nonliteral meaning.", skills:["definition clues","synonym clues","antonym clues","example clues","inference clues"], passage:true },
      "Main Idea & Details":     { codes:"5.RI.2–3, 5.RI.5", focus:"Main ideas, supporting details, summarizing, text structure.", skills:["identifying main idea","topic vs main idea","supporting details","summarizing","text structure"], passage:true },
      "Story Elements":          { codes:"5.RL.1–3, 5.RL.5–6", focus:"Character, conflict, theme, plot structure, narrator point of view, and how chapters, scenes, and stanzas fit together in stories, dramas, and poems.", skills:["character traits/motivation","conflict/resolution","theme vs topic","plot structure","point of view","poetry and drama structure"], passage:true },
      "Author's Purpose":        { codes:"5.RI.6, 5.RI.8, 5.RL.6", focus:"Author's purpose and point of view, evaluating evidence, fact vs opinion.", skills:["persuade/inform/entertain","author's bias","evaluating evidence","author's claim","fact vs opinion"], passage:true },
      "Text Evidence":           { codes:"5.RI.1, 5.RL.1, 5.W.9", focus:"Quoting accurately from text to explain and support inferences.", skills:["locating evidence","quoting correctly","evidence relevance","connecting to claim"], passage:true },
      "Compare & Contrast":      { codes:"5.RI.3, 5.RI.9, 5.RL.3, 5.RL.9", focus:"Comparing two texts, multiple accounts, structure analysis.", skills:["comparing texts","Venn diagram thinking","comparing characters","synthesizing"], passage:true },
      "SBAC Simulation":         { codes:"All 5th grade CCSS ELA", focus:"Smarter Balanced style reading assessment: one grade-level passage with selected response, constructed response, and a written response requiring text evidence.", skills:["cite text evidence","main idea and theme","author's purpose","vocabulary in context","select all that apply","written response with evidence"], passage:true },
      "Visual & Graphic Sources": { codes:"5.RI.7", focus:"Interpreting information from charts, graphs, diagrams, timelines, and visual sources.", skills:["reading charts","interpreting graphs","reading timelines","diagrams","visual data"], passage:true },
    },
    writing: {
      "Narrative Writing Prompt": { codes:"5.W.3a–e", focus:"Situation/narrator, event sequences, dialogue, description, transitional phrases, conclusion.", skills:["story hook","dialogue","sensory details","transitional phrases","strong conclusion"] },
      "Opinion Writing Prompt":   { codes:"5.W.1a–d", focus:"Opinion statement, logically ordered reasons with evidence, transitions, concluding statement.", skills:["clear opinion","logical reasons","supporting evidence","opinion transitions","strong conclusion"] },
      "Informational Writing":    { codes:"5.W.2a–e", focus:"Topic introduction, grouped information, domain vocab, precise language, conclusion.", skills:["topic introduction","domain vocabulary","facts/definitions","precise language"] },
      "Paragraph Writing":        { codes:"5.W.2, 5.W.4, 5.L.1–2", focus:"Topic sentence, supporting details, concluding sentence, conventions.", skills:["topic sentence","supporting details","concluding sentence","paragraph unity"] },
      "Sentence Editing":         { codes:"5.L.1–2", focus:"Perfect verb tense, pronoun agreement, comma usage, quotation marks, capitalization.", skills:["perfect verb tenses","pronoun agreement","commas","quotation marks","capitalization"] },
      "Grammar Practice":         { codes:"5.L.1a–e", focus:"Perfect verb tenses, correlative conjunctions, pronoun shifts, prepositions.", skills:["perfect verb tenses","correlative conjunctions","verb tense shifts","prepositions"] },
      "Figurative Language":      { codes:"5.L.5a–c, 5.RL.4", focus:"Simile, metaphor, personification, hyperbole, idioms, adages, proverbs.", skills:["simile vs metaphor","personification","hyperbole","idioms","adages/proverbs"] },
      "Transition Words":         { codes:"5.W.1c, 5.W.2c, 5.W.3c", focus:"Transitional words/phrases for sequence, contrast, cause/effect, elaboration.", skills:["sequence transitions","contrast transitions","cause/effect transitions","elaboration transitions"] },
    },
    science: {
      "Life Science":       { codes:"NGSS 5-LS1, 5-LS2", focus:"Photosynthesis, food webs, decomposers, matter cycling in ecosystems.", skills:["photosynthesis","food webs/chains","producers/consumers/decomposers","matter cycling"] },
      "Earth Science":      { codes:"NGSS 5-ESS1–3", focus:"Sun and stars, Earth's spheres, water distribution, seasonal sky changes, human impact.", skills:["Earth's spheres","water cycle","sun as energy source","star brightness/distance","seasonal sky patterns","human impact"] },
      "Physical Science":   { codes:"NGSS 5-PS1–3", focus:"Properties of matter, conservation, mixtures, gravity, energy transfer.", skills:["properties of matter","mixtures/solutions","physical vs chemical changes","conservation of matter","gravity"] },
      "Scientific Method":  { codes:"NGSS Practices 1–8, 3-5-ETS1", focus:"Hypotheses, investigations, analyzing data, engineering design, constructing explanations.", skills:["hypothesis","variables","graphs/data tables","drawing conclusions","experimental design","engineering solutions"] },
      "Ecosystems":         { codes:"NGSS 5-LS2, 5-ESS2–3", focus:"Food webs, environmental change, interdependence, human effects.", skills:["food webs","interdependence","environmental change","adaptation","human impact"] },
      "Weather & Climate":  { codes:"NGSS 5-ESS2–3", focus:"Ocean/land/atmosphere interactions, weather vs climate, human impact.", skills:["weather vs climate","water cycle","atmosphere interactions","climate zones"] },
      "Matter & Energy":    { codes:"NGSS 5-PS1, 5-PS3", focus:"Properties/structure of matter, conservation, physical/chemical changes.", skills:["physical/chemical properties","conservation of matter","mixtures vs compounds","energy in organisms"] },
      "Human Body":         { codes:"CA Health / Life Science enrichment", focus:"Body systems and interactions: digestive, respiratory, circulatory, skeletal, muscular, nervous. (Teacher-requested enrichment; body systems are formally a middle school NGSS topic.)", skills:["body systems","organs and roles","system interactions","nutrients/digestion"] },
    },
    social: {
      "US History":          { codes:"CA HSS 5.1–5.8", focus:"Pre-Columbian, Exploration, Colonial America, Revolution, Constitution, westward expansion.", skills:["cause/effect","primary vs secondary sources","chronological thinking","historical significance"] },
      "First Americans":     { codes:"CA HSS 5.1", focus:"Major pre-Columbian settlements: cliff dwellers and pueblo people of the desert Southwest, American Indians of the Pacific Northwest, nomadic nations of the Great Plains, and woodland peoples east of the Mississippi; how geography and climate shaped daily life, customs, and folklore.", skills:["pre-Columbian settlements","desert Southwest peoples","Pacific Northwest nations","Great Plains nations","Eastern Woodland peoples","geography and daily life","customs and folklore"] },
      "Exploration & Columbian Exchange": { codes:"CA HSS 5.2", focus:"The age of exploration: routes and motivations of European explorers, navigation technology, entrepreneurial risk, and the exchange of plants, animals, and diseases between the Eastern and Western Hemispheres and its consequences.", skills:["age of exploration","explorer routes and motives","navigation technology","Columbian Exchange","impact on Native peoples","cause and effect"] },
      "Geography":           { codes:"CA HSS 5.1, CCSS RH.5", focus:"Geographic features of North America, US regions, geography's influence on history.", skills:["map reading","physical/political maps","US regions","geographic influence"] },
      "Colonial America":    { codes:"CA HSS 5.3–5.4", focus:"New England, Middle, Southern colonies; colonial economy; slavery; democratic ideas.", skills:["colonial regions","triangular trade","colonial economy","slavery","self-government"] },
      "American Revolution": { codes:"CA HSS 5.5–5.6", focus:"Causes, key events, Declaration of Independence, Constitution, Bill of Rights.", skills:["causes of revolution","key battles","Declaration of Independence","Constitutional Convention","Bill of Rights"] },
      "Government & Civics": { codes:"CA HSS 5.7–5.8", focus:"Constitutional Convention, Bill of Rights, branches of government, checks and balances.", skills:["three branches","checks and balances","Bill of Rights","Constitutional principles"] },
      "Economics Basics":    { codes:"CA HSS 5.4, 5.6", focus:"Trade, supply/demand, colonial economy, triangular trade, mercantilism.", skills:["supply and demand","trade/interdependence","colonial economy","goods/services"] },
      "Westward Expansion":  { codes:"CA HSS 5.8", focus:"Louisiana Purchase, Lewis and Clark, Oregon Trail, Texas independence, Mexican-American War.", skills:["Louisiana Purchase","Lewis and Clark","manifest destiny","Oregon Trail","Mexican-American War"] },
      "Map Skills":          { codes:"CA HSS, CCSS RH.5.7", focus:"Reading physical, political, thematic, historical maps of North America.", skills:["types of maps","map tools","latitude/longitude","historical maps"] },
      "Current Events":      { codes:"CCSS RH.5.1, 5.6, 5.8", focus:"Current events: main idea, source evaluation, fact vs opinion, point of view.", skills:["main idea in news","fact vs opinion","source credibility","point of view"] },
    },
  },
  4: {
    math: {
      "Multiplication & Division": { codes:"4.NBT.B.5–6, 4.OA.A.1–3", focus:"Multiply up to 4-digit by 1-digit, 2-digit by 2-digit, divide 4-digit by 1-digit, multiplicative comparisons, multi-step word problems.", skills:["4-digit by 1-digit multiplication","2-digit by 2-digit multiplication","long division","multiplicative comparisons","multi-step problems"] },
      "Fractions Practice":        { codes:"4.NF.1–7", focus:"Fraction equivalence, comparing fractions, adding/subtracting fractions with like denominators, multiplying fractions by whole numbers, decimals to hundredths.", skills:["equivalent fractions","comparing fractions","same denominator addition/subtraction","fraction times whole number","decimals to hundredths"] },
      "Place Value & Rounding":    { codes:"4.NBT.A.1–3", focus:"Place value to millions, comparing multi-digit numbers, rounding to any place.", skills:["place value to millions","comparing numbers","rounding to nearest 10/100/1000","expanded form","number forms"] },
      "Measurement & Data":        { codes:"4.MD.A.1–3, 4.MD.B.4", focus:"Measurement unit conversions, area and perimeter, line plots with fractions.", skills:["unit conversions","area","perimeter","line plots","data interpretation","measurement word problems"] },
      "Angles & Geometry":         { codes:"4.MD.C.5–7, 4.G.A.1–3", focus:"Measuring and drawing angles, points/lines/rays, perpendicular/parallel lines, line symmetry, classifying 2D shapes.", skills:["measuring angles","drawing angles","right/acute/obtuse angles","perpendicular lines","parallel lines","line symmetry","classifying shapes"] },
      "Factors & Patterns":        { codes:"4.OA.B.4, 4.OA.C.5", focus:"Factors and multiples, prime and composite numbers, number patterns and rules.", skills:["factors","multiples","prime numbers","composite numbers","number patterns","pattern rules"] },
      "Word Problems":             { codes:"4.OA.A.1–3, 4.NBT.B.5–6, 4.NF.3–4, 4.MD.A.1–2", focus:"Multi-step word problems with whole numbers, fractions, and measurement.", skills:["multi-step reasoning","operation selection","interpreting remainders","measurement contexts","fraction contexts"] },
      "Mixed Review":              { codes:"4.OA, 4.NBT, 4.NF, 4.MD, 4.G", focus:"Comprehensive review across all 4th grade math domains.", skills:["multiplication/division","fractions","place value","measurement","geometry","patterns"] },
      "SBAC Simulation":           { codes:"All 4th grade CCSS math", focus:"Authentic SBAC-style mixed-domain assessment with constructed response items.", skills:["mixed domains","constructed response","multi-step reasoning","select all that apply","justify and explain"] },
    },
    ela: {
      "Reading Comprehension":        { codes:"4.RI.1–3, 4.RI.6, 4.RL.1–3", focus:"Text evidence with details/examples, main idea, explaining events/procedures, author's point of view.", skills:["cite text evidence","main idea","author's point of view","cause/effect","inferencing","summarizing"], passage:true },
      "Vocabulary Practice":          { codes:"4.L.4–6", focus:"Context clues, Greek/Latin roots, figurative language, academic vocabulary.", skills:["context clues","Greek/Latin roots","prefixes/suffixes","simile/metaphor","idioms","academic vocabulary"], passage:true },
      "Context Clues":                { codes:"4.L.4a, 4.RI.4, 4.RL.4", focus:"Determining word meaning using context; literal vs nonliteral meaning.", skills:["definition clues","synonym clues","antonym clues","example clues","inference clues"], passage:true },
      "Main Idea & Details":          { codes:"4.RI.2–3, 4.RI.5", focus:"Main idea, key details, summarizing, text structure (chronology/compare/cause-effect/problem-solution).", skills:["identifying main idea","supporting details","summarizing","text structure","chronology"], passage:true },
      "Story Elements":               { codes:"4.RL.1–3, 4.RL.5–6", focus:"Character in depth, conflict, theme, plot, first vs third person point of view, poetry/drama/prose differences.", skills:["character traits/motivation","conflict/resolution","theme vs topic","plot structure","point of view","poetry vs prose"], passage:true },
      "Author's Purpose":             { codes:"4.RI.6, 4.RI.8, 4.RL.6", focus:"Author's purpose, evaluating evidence/reasoning, firsthand vs secondhand accounts.", skills:["persuade/inform/entertain","author's evidence","fact vs opinion","author's claim","evaluating reasoning"], passage:true },
      "Text Evidence":                { codes:"4.RI.1, 4.RL.1, 4.W.9", focus:"Referring to details and examples when explaining text explicitly and drawing inferences.", skills:["locating evidence","using details and examples","evidence relevance","connecting to claim"], passage:true },
      "Firsthand vs Secondhand":      { codes:"4.RI.6", focus:"Comparing firsthand and secondhand accounts of the same event; differences in focus and information.", skills:["firsthand account","secondhand account","primary source","secondary source","comparing perspectives","narrator's role"], passage:true },
      "SBAC Simulation":              { codes:"All 4th grade CCSS ELA", focus:"Smarter Balanced style reading assessment: one grade-level passage with selected response, constructed response, and a written response requiring text evidence.", skills:["cite text evidence","main idea","author's purpose","vocabulary in context","select all that apply","written response with evidence"], passage:true },
      "Visual Information":           { codes:"4.RI.7", focus:"Interpreting information presented visually or quantitatively (charts, graphs, diagrams, timelines, maps) and explaining how it contributes to understanding the text.", skills:["reading charts","interpreting graphs","reading timelines","diagrams","maps","connecting visuals to text"], passage:true },
      "Compare & Contrast":           { codes:"4.RI.9, 4.RL.9", focus:"Integrating information from two texts, comparing themes and topics across cultures.", skills:["comparing texts","Venn diagram thinking","comparing themes","cultural comparisons","synthesizing"], passage:true },
    },
    writing: {
      "Narrative Writing Prompt": { codes:"4.W.3a–e", focus:"Situation/narrator/characters setup, dialogue, descriptive details, transitional phrases, conclusion.", skills:["story hook","dialogue","sensory details","transitional phrases","strong conclusion"] },
      "Opinion Writing Prompt":   { codes:"4.W.1a–d", focus:"Clear opinion, grouped reasons supported by facts/details, linking words, concluding statement.", skills:["clear opinion","grouped reasons","facts and details","linking words","strong conclusion"] },
      "Informational Writing":    { codes:"4.W.2a–e", focus:"Topic introduction, grouped paragraphs with headings, facts/definitions, precise language, conclusion.", skills:["topic introduction","headings and formatting","facts/definitions","precise language","conclusion"] },
      "Paragraph Writing":        { codes:"4.W.2, 4.W.4, 4.L.1–2", focus:"Topic sentence, supporting details, concluding sentence, grade-appropriate conventions.", skills:["topic sentence","supporting details","concluding sentence","paragraph unity"] },
      "Sentence Editing":         { codes:"4.L.1–2", focus:"Progressive verb tenses, relative pronouns, commas, quotation marks, capitalization.", skills:["progressive verb tenses","relative pronouns","commas","quotation marks","capitalization","run-ons/fragments"] },
      "Grammar Practice":         { codes:"4.L.1a–g", focus:"Relative pronouns, progressive verb tenses, modal auxiliaries, adjective order, prepositional phrases.", skills:["relative pronouns","progressive verb tenses","modal auxiliaries","adjective order","prepositional phrases"] },
      "Figurative Language":      { codes:"4.L.5a–c, 4.RL.4", focus:"Similes and metaphors in context, idioms, adages and proverbs, synonyms and antonyms.", skills:["simile vs metaphor","idioms","adages/proverbs","synonyms","antonyms"] },
      "Transition Words":         { codes:"4.W.1c, 4.W.2c, 4.W.3c", focus:"Transitional words/phrases for sequence, contrast, cause/effect, elaboration.", skills:["sequence transitions","contrast transitions","cause/effect transitions","elaboration transitions"] },
    },
    science: {
      "Life Science: Structures & Senses": { codes:"NGSS 4-LS1-1, 4-LS1-2", focus:"Plant and animal internal/external structures for survival; animals receive, process, and respond to information through senses.", skills:["plant structures","animal structures","survival functions","sense receptors","information processing","brain and response"] },
      "Physical Science: Energy & Motion": { codes:"NGSS 4-PS3-1–4", focus:"Energy forms and motion, energy transfer between objects, collisions and energy, converting energy to solve problems.", skills:["motion energy","energy transfer","collisions","potential energy","kinetic energy","energy conversion"] },
      "Physical Science: Waves & Light":   { codes:"NGSS 4-PS4-1–3", focus:"Wave patterns and amplitude, light and vision, how eyes detect light, and using patterns to transfer information (like Morse code or digital signals).", skills:["wave patterns","amplitude","wave properties","light reflection","vision","how eyes work","patterns that transfer information"] },
      "Earth Science: Rocks & Landforms":  { codes:"NGSS 4-ESS1-1, 4-ESS2-1, 4-ESS2-2", focus:"Rock layers and fossils as evidence of landscape changes, weathering and erosion, mapping Earth's features.", skills:["rock layers","fossils","landscape changes","weathering","erosion","Earth's physical features"] },
      "Earth Science: Energy & Hazards":   { codes:"NGSS 4-ESS3-1, 4-ESS3-2", focus:"Renewable vs non-renewable energy resources, natural hazard design solutions.", skills:["renewable energy","non-renewable energy","fossil fuels","natural hazards","engineering solutions","environmental impact"] },
      "Scientific Method & Design":        { codes:"NGSS Practices 1–8, 3-5-ETS1", focus:"Hypotheses, fair tests, analyzing data, engineering design process.", skills:["hypothesis","variables","fair tests","data analysis","drawing conclusions","engineering design"] },
      "Ecosystems":                        { codes:"NGSS 4-LS1, 4-ESS2", focus:"How structures help animals survive in ecosystems, environmental interactions.", skills:["adaptations","survival structures","ecosystem interactions","animal behaviors","habitat"] },
      "Mixed Review":                      { codes:"NGSS 4-LS1, 4-PS3, 4-PS4, 4-ESS1–3", focus:"Comprehensive review of all 4th grade science domains.", skills:["life science","physical science","earth science","engineering","scientific practices"] },
    },
    social: {
      "California Geography":            { codes:"CA HSS 4.1", focus:"California physical features, latitude/longitude, regions (coastal/valley/mountain/desert), climate, natural resources, how geography shaped settlement.", skills:["latitude/longitude","California regions","landforms","climate zones","natural resources","geographic influence"] },
      "California Indians & Exploration": { codes:"CA HSS 4.2.1–5", focus:"Major California Indian nations, their culture and economy; Spanish exploration by Cabrillo, Cook, and Bering; early European settlements.", skills:["California Indian nations","cultural traditions","economic activities","Spanish explorers","European settlements","geographic distribution"] },
      "Missions & Ranchos":              { codes:"CA HSS 4.2.6–8", focus:"Spanish missions, role of Franciscans, impact on Native peoples, Mexican independence, rancho period.", skills:["mission system","Franciscan missionaries","impact on Native Californians","Mexican independence","rancho economy","secularization"] },
      "Gold Rush & Statehood":           { codes:"CA HSS 4.3", focus:"Bear Flag Republic, Mexican-American War, Gold Rush of 1849, routes to California, California statehood.", skills:["Bear Flag Republic","Mexican-American War","Gold Rush","Sutter's Fort","routes to California","statehood"] },
      "California Grows":                { codes:"CA HSS 4.4.1–4", focus:"Pony Express, transcontinental railroad, Chinese workers, Gold Rush economy, immigration 1850–1900, Chinese Exclusion Act, growth of cities.", skills:["transcontinental railroad","Chinese workers","Gold Rush economy","immigration","Chinese Exclusion Act","city growth"] },
      "Modern California":               { codes:"CA HSS 4.4.5–9", focus:"Great Depression, Dust Bowl, WWII effects on California, aerospace/oil/agriculture industries, California water system, public education, cultural contributions.", skills:["Great Depression","Dust Bowl","WWII in California","California industries","water system","cultural contributions"] },
      "California Government":           { codes:"CA HSS 4.5", focus:"US Constitution and why it matters, three branches of government, local/state/federal structures, California governance.", skills:["US Constitution","three branches","checks and balances","local government","state government","California governance"] },
      "Map Skills":                      { codes:"CA HSS 4.1, CCSS RH.4.7", focus:"Reading physical, political, and historical maps of California and the US.", skills:["map types","map tools","latitude/longitude","California maps","reading legends","scale"] },
      "Current Events":                  { codes:"CCSS RH.4.1, 4.6, 4.8", focus:"Current events: main idea, source evaluation, fact vs opinion, point of view.", skills:["main idea in news","fact vs opinion","source credibility","point of view"] },
    },
  },
  3: {
    math: {
      "Multiplication & Division": { codes:"3.OA.A.1–4, 3.OA.B.5–6, 3.OA.C.7, 3.OA.D.8–9", focus:"Meaning of multiplication and division within 100, properties of operations as strategies, the relationship between them, fluency, two-step word problems, and arithmetic patterns.", skills:["equal groups and arrays","multiplication within 100","division within 100","properties of operations (commutative, distributive)","multiplication/division relationship","fact fluency","two-step word problems","arithmetic patterns"] },
      "Fractions Practice":        { codes:"3.NF.A.1–3", focus:"Understanding fractions as numbers, fractions on a number line, equivalent fractions, and comparing fractions. Denominators limited to 2, 3, 4, 6, and 8.", skills:["unit fractions","fractions as numbers","fractions on a number line","equivalent fractions","comparing same numerator","comparing same denominator","whole numbers as fractions"] },
      "Area & Perimeter":          { codes:"3.MD.C.5–7, 3.MD.D.8", focus:"Area as an attribute measured in unit squares, relating area to multiplication and addition, and solving perimeter problems.", skills:["area with unit squares","area by multiplication","area of combined rectangles","perimeter of polygons","unknown side length","same area different perimeter"] },
      "Place Value & Rounding":    { codes:"3.NBT.A.1–3", focus:"Rounding whole numbers to the nearest 10 or 100, adding and subtracting within 1000, and multiplying one-digit numbers by multiples of 10.", skills:["rounding to nearest 10","rounding to nearest 100","add within 1000","subtract within 1000","multiply by multiples of 10","place value reasoning"] },
      "Time & Measurement Data":   { codes:"3.MD.A.1–2, 3.MD.B.3–4", focus:"Telling time to the minute and elapsed time, measuring liquid volume and mass, and representing data in scaled graphs and line plots.", skills:["time to the minute","elapsed time","liquid volume (l, ml)","mass (g, kg)","scaled picture graphs","scaled bar graphs","line plots with halves and fourths"] },
      "Shapes & Geometry":         { codes:"3.G.A.1–2", focus:"Classifying shapes by their attributes, understanding categories of quadrilaterals, and partitioning shapes into equal areas expressed as unit fractions.", skills:["shape attributes","categories of quadrilaterals","rhombuses and rectangles","partitioning shapes","equal areas as unit fractions"] },
      "Word Problems":             { codes:"3.OA.A.3, 3.OA.D.8, 3.NBT.A.2, 3.MD.A.1–2", focus:"One- and two-step real-world problems using the four operations, including measurement and data contexts.", skills:["one-step word problems","two-step word problems","operation selection","letter for the unknown","measurement contexts","checking reasonableness"] },
      "Mixed Review":              { codes:"3.OA, 3.NBT, 3.NF, 3.MD, 3.G", focus:"Comprehensive review across all 3rd grade math domains.", skills:["multiplication/division","fractions","area and perimeter","place value","measurement and data","geometry"] },
      "SBAC Simulation":           { codes:"All 3rd grade CCSS math", focus:"Smarter Balanced style mixed-domain assessment for students taking state testing for the first time. Clear directions, one task per item, mixed item formats.", skills:["mixed domains","selected response","constructed response","select all that apply","multi-step reasoning","explain your reasoning"] },
    },
    ela: {
      "Reading Comprehension":   { codes:"3.RL.1–3, 3.RI.1–3", focus:"Asking and answering questions with explicit text evidence, determining main idea and key details, and describing characters and the relationship between events.", skills:["ask and answer questions","cite text evidence","main idea and key details","character traits/motivations","cause and effect","sequence of events"], passage:true },
      "Story Elements":          { codes:"3.RL.2–3, 3.RL.5–7, 3.RL.9", focus:"Recounting fables, folktales, and myths and their central message; describing characters; using story terms; how illustrations contribute to a story; and comparing stories by the same author.", skills:["fables, folktales, and myths","central message/lesson/moral","character traits/motivations","chapter/scene/stanza terms","point of view","illustrations and mood","compare stories by the same author"], passage:true },
      "Informational Text & Main Idea": { codes:"3.RI.2–3, 3.RI.5, 3.RI.8–9", focus:"Determining the main idea and key details, describing relationships using time/sequence/cause-effect, using text features, logical connections between sentences, and comparing two texts on the same topic.", skills:["main idea","key details","cause and effect","sequence","text features","logical connections","comparing two texts on one topic"], passage:true },
      "Cause, Effect & Sequence": { codes:"3.RI.3, 3.RI.8", focus:"Describing the relationship between historical events, scientific ideas, or steps in a procedure using language of time, sequence, and cause and effect.", skills:["cause and effect","sequence of steps","time-order language","connecting events","first/second/third structure","logical connections"], passage:true },
      "Text Features & Illustrations": { codes:"3.RI.5, 3.RI.7, 3.RL.7", focus:"Using text features and search tools to locate information, and using illustrations, maps, and photographs to demonstrate understanding of a text.", skills:["headings and bold words","glossary and index","maps and photographs","illustrations","locating information","where/when/why/how"], passage:true },
      "Vocabulary Practice":     { codes:"3.L.4–6, 3.RL.4, 3.RI.4", focus:"Determining word meaning using context, distinguishing literal from nonliteral language, prefixes and root words, and academic vocabulary.", skills:["context clues","literal vs nonliteral language","prefixes and suffixes","root words","real-life word connections","academic vocabulary"], passage:true },
      "SBAC Simulation":         { codes:"All 3rd grade CCSS ELA", focus:"Smarter Balanced style reading assessment for students taking state testing for the first time: one grade-level passage, clear directions, mixed item formats.", skills:["ask and answer questions","cite text evidence","main idea and key details","vocabulary in context","select all that apply","written response with evidence"], passage:true },
      "Grammar & Conventions":   { codes:"3.L.1a–i, 3.L.2a–e", focus:"Parts of speech and their function, regular/irregular plural nouns and verbs, simple verb tenses, subject-verb and pronoun-antecedent agreement, comparatives, conjunctions, and sentence types. (CA also adds 3.L.1.j cursive and 3.L.1.k reciprocal pronouns.)", skills:["nouns/verbs/adjectives/adverbs","regular and irregular plural nouns","simple verb tenses","subject-verb agreement","pronoun-antecedent agreement","comparative/superlative","coordinating/subordinating conjunctions","simple/compound/complex sentences"] },
    },
    writing: {
      "Opinion Writing Prompt":   { codes:"3.W.1a–d", focus:"Introducing a topic and stating an opinion, supplying reasons, using linking words, and providing a concluding statement.", skills:["clear opinion","reasons that support","linking words (because, therefore, since)","organized structure","concluding statement"] },
      "Informational Writing":    { codes:"3.W.2a–d", focus:"Introducing a topic, developing it with facts/definitions/details, using linking words, and providing a conclusion.", skills:["topic introduction","facts and definitions","grouping related information","linking words","precise details","conclusion"] },
      "Narrative Writing Prompt": { codes:"3.W.3a–d", focus:"Establishing a situation and characters, sequencing events, using dialogue and descriptive detail, temporal words, and a sense of closure.", skills:["story setup","sequence of events","dialogue","descriptive details","temporal words","sense of closure"] },
      "Paragraph Writing":        { codes:"3.W.2, 3.W.4, 3.L.1–2", focus:"Topic sentence, supporting details, concluding sentence, and grade-appropriate conventions.", skills:["topic sentence","supporting details","concluding sentence","paragraph unity"] },
      "Sentence Editing":         { codes:"3.L.1–2", focus:"Simple verb tenses, subject-verb and pronoun-antecedent agreement, capitalization, commas in addresses, quotation marks in dialogue, and possessives.", skills:["simple verb tenses","subject-verb agreement","capitalization in titles","commas in addresses","quotation marks in dialogue","possessives"] },
      "Grammar Practice":         { codes:"3.L.1a–i", focus:"Parts of speech, plural and irregular nouns, simple verb tenses, comparatives and superlatives, conjunctions, and producing simple/compound/complex sentences.", skills:["parts of speech","irregular plural nouns","simple verb tenses","comparative/superlative","coordinating/subordinating conjunctions","sentence types"] },
      "Transition Words":         { codes:"3.W.1c, 3.W.2c, 3.W.3c", focus:"Linking and temporal words and phrases to connect ideas and signal sequence, reasons, and time order.", skills:["sequence words","reason linking words (because, since)","time-order words","connecting ideas"] },
    },
    science: {
      "Forces & Magnets":        { codes:"NGSS 3-PS2-1–4", focus:"Balanced and unbalanced forces and motion, predicting future motion from patterns, and electric and magnetic forces between objects, including a magnet design problem.", skills:["balanced and unbalanced forces","effect of forces on motion","patterns in motion","predicting motion","magnetic forces","electric forces","magnet design solution"] },
      "Life Cycles & Traits":    { codes:"NGSS 3-LS1-1, 3-LS2-1, 3-LS3-1–2", focus:"Diverse life cycles of organisms, how animal groups help members survive, and how traits are inherited from parents and influenced by the environment.", skills:["life cycles","birth/growth/reproduction/death","animal groups and survival","inherited traits","variation of traits","environment's effect on traits"] },
      "Fossils & Environments":  { codes:"NGSS 3-LS4-1–4", focus:"Using fossils as evidence of past environments, how trait variation aids survival, how organisms are suited to their habitats, and solutions for environmental change.", skills:["fossils as evidence","past environments","trait variation and survival","habitats and survival","environmental change","design solutions"] },
      "Weather & Climate":       { codes:"NGSS 3-ESS2-1–2, 3-ESS3-1", focus:"Representing seasonal weather data, describing climates in different regions of the world, and evaluating design solutions that reduce weather-related hazards.", skills:["seasonal weather patterns","weather data in tables/graphs","world climates","climate vs weather","weather-related hazards","hazard design solutions"] },
      "Scientific Method & Design": { codes:"NGSS Practices 1–8, 3-5-ETS1", focus:"Asking questions, planning simple investigations, analyzing data, and using the engineering design process to define and solve problems.", skills:["asking questions","simple investigations","fair tests","analyzing data","drawing conclusions","engineering design process"] },
      "Mixed Review":            { codes:"NGSS 3-PS2, 3-LS1–4, 3-ESS2–3", focus:"Comprehensive review across all 3rd grade science topics.", skills:["forces and magnets","life cycles and traits","fossils and environments","weather and climate","scientific practices"] },
    },
    social: {
      "Local Geography":             { codes:"CA HSS 3.1", focus:"Physical and human geography of the local Whittier region using maps, tables, graphs, and charts: local landforms, the use of maps, and how people use the local environment.", skills:["local landforms (Puente Hills, San Gabriel River)","using maps and globes","map symbols and legends","cardinal directions","human use of the environment","reading tables and charts"] },
      "Local American Indian Nations": { codes:"CA HSS 3.2", focus:"American Indian nations of the local region long ago and today, including the Tongva (Gabrieleno/Kizh) of the Whittier Narrows area, how geography shaped their lives, and their interaction with new settlers.", skills:["local Tongva/Gabrieleno people","how geography shaped daily life","food, clothing, and tools","customs and traditions","systems of government","interaction with settlers"] },
      "Local History & Settlement":  { codes:"CA HSS 3.3", focus:"The sequence of local historical events and how each period of settlement left its mark on the Whittier region: Tongva, Spanish mission era, Mexican ranchos, Pio Pico, the Quaker founding, and growth into a modern city.", skills:["sequence of local events","layers of settlement","Spanish and Mexican rancho era","Pio Pico and El Ranchito","Quaker founding of Whittier","change over time","local cultural diversity"] },
      "Rules, Laws & Government":    { codes:"CA HSS 3.4", focus:"The role of rules and laws in daily life, the basic structure of the U.S. government, how California, other states, and tribal nations participate in the federal system, the meaning of national and local landmarks and symbols, and the contributions of citizens and heroes.", skills:["why we have rules and laws","the U.S. Constitution (basics)","branches of government (basics)","how states and tribal nations fit in the federal system","national symbols (flag, eagle, Statue of Liberty)","local and national landmarks","citizenship","local and national heroes"] },
      "Local Economics":             { codes:"CA HSS 3.5", focus:"Basic economic reasoning and the economy of the local Whittier region: how producers use natural, human, and capital resources, goods made locally vs elsewhere, and economic choices and trade-offs.", skills:["producers and consumers","natural/human/capital resources","local industries (citrus, oil, retail)","goods made here vs elsewhere","economic choices and trade-offs","benefits and costs"] },
      "Map Skills":                  { codes:"CA HSS 3.1, CCSS RH.3.7", focus:"Reading and using maps of the local region and beyond: map symbols, legends, cardinal directions, and locating places.", skills:["types of maps","map legends and symbols","cardinal directions","using a map grid","locating places","map scale (intro)"] },
      "Local Heroes & Symbols":      { codes:"CA HSS 3.4.3–6", focus:"Histories of important local and national landmarks, symbols, and documents, and the heroes and individuals who exemplify cherished ideals in the community and nation.", skills:["national symbols and documents","local landmarks","community heroes","national heroes","cherished ideals","patriotism and citizenship"] },
    },
  },
};


// ─── TOPIC ROTATION LISTS ─────────────────────────────────────────────────────

const TOPICS = {
  5: {
    ela: ["the California Gold Rush and the forty-niners","California missions and their impact on Native peoples","the transcontinental railroad and Chinese workers","the California aqueduct and water systems","the 1906 San Francisco earthquake and rebuilding","California's Central Valley farming and agriculture","Native California tribes and their traditions","the history of California becoming the 31st state","California wildfires and the bravery of firefighters","the Channel Islands National Park and its wildlife","the American Revolution and its causes","the Underground Railroad and Harriet Tubman","immigration through Ellis Island in the early 1900s","the Declaration of Independence and its meaning","the Dust Bowl and the migration of families to California","monarch butterfly migration through California","the water cycle and California droughts","volcanoes and plate tectonics","the life cycle of Pacific salmon in California rivers","ocean ecosystems and kelp forests off the California coast","animal adaptations in the Mojave Desert","renewable energy and solar power in California","the science of earthquakes and seismology","wolves and their role in balancing ecosystems","rainforest biodiversity and the canopy layer","deep sea creatures and bioluminescence","coral reefs and ocean health","the International Space Station and astronaut life","Mars exploration and NASA rovers","weather systems and how hurricanes form","Cesar Chavez and the farmworkers movement","Amelia Earhart and the history of aviation","Thomas Edison and the invention of the lightbulb","Maya Lin and the Vietnam Veterans Memorial","Sally Ride, America's first woman in space","John Muir and the California conservation movement","Thurgood Marshall and the fight for civil rights","Malala Yousafzai and the right to education","Neil Armstrong and the Apollo 11 moon landing","Nikola Tesla and the development of electricity","the history of the Olympic Games","how California grows half of America's fruits and vegetables","the Pony Express and early American communication","the history of the Golden Gate Bridge","how national parks were created and why they matter","how newspapers shaped American democracy","the history of the public library in America","how the US Constitution protects our rights","the history of women's suffrage and the 19th Amendment","the history of Braille and Louis Braille","Jackie Robinson and breaking baseball's color barrier","Rosa Parks and the Montgomery Bus Boycott","the Wright brothers and the first airplane flight","Katherine Johnson and the math behind the moon landing","the history of the Panama Canal","Angel Island and immigration on the West Coast","the Great Chicago Fire and how the city rebuilt","how vaccines were discovered and how they work","the return of the California sea otter from near extinction","how the printing press changed the world","the history of Route 66 and the American road trip","how weather satellites help predict dangerous storms","the life and inventions of George Washington Carver","the history of the telegraph and instant communication","Ruby Bridges and school integration","the redwood forests and the tallest trees on Earth","the Tuskegee Airmen and their service in World War II","how the Grand Canyon formed over millions of years","the Navajo Code Talkers of World War II","the mystery of the lost Roanoke colony","Benjamin Banneker, self-taught scientist and surveyor","how sourdough bread became a San Francisco tradition","the California grizzly bear and the state flag","the history of Alcatraz Island","how astronauts train for life in space"],
    math: ["planning a school fundraiser car wash","organizing a 5th grade graduation celebration","running a school supply store","tracking a classroom reading challenge","planning a school garden project","organizing a canned food drive for families","budgeting for a class field trip to the California Science Center","planning a school mural painting project","running a school recycling program","organizing a school book fair","calculating stats for a Little League baseball season","planning a school basketball tournament bracket","tracking a swim team's practice distances","organizing a school Olympics event","planning a class hiking trip in a California state park","tracking a soccer team's season scoring record","planning a school fun run fundraiser","calculating scores for a school spelling bee competition","running a school bake sale","planning a class Thanksgiving potluck","scaling recipes for a school cooking class","budgeting for a taco cart at a school carnival","calculating ingredients for a class pizza party","running a lemonade stand as a class economics project","planning a family road trip from Los Angeles to San Francisco","calculating distances between California national parks","budgeting for a family trip to Yosemite National Park","planning a community farmers market booth","tracking water usage during a California drought conservation effort","designing a classroom layout using area and perimeter","planning a school vegetable garden with raised beds","calculating materials needed for a school bench project","measuring and tiling a school bathroom floor","designing a new playground for the school yard","analyzing rainfall data for California cities","tracking daily temperatures across California regions","calculating the cost of solar panels for the school roof","analyzing results from a class science experiment","tracking plant growth measurements in a class experiment","planning a birthday party on a budget","estimating the total cost of a family grocery trip","comparing prices at two different grocery stores","budgeting a weekly allowance over a school year","calculating earnings from a neighborhood dog walking business","planning a clothing donation drive for families","calculating postage costs for a pen pal project","budgeting for new classroom library books","tracking miles walked in a school step challenge","calculating the cost of a class subscription to a science magazine","planning a school talent show ticket sales and seating","planning a school science fair with display boards and prizes","planning equipment and snack costs for a softball season","designing a mini golf course with area and perimeter","stocking a classroom aquarium and calculating water volume","comparing cell phone plans for a family","dividing sheet cakes into equal fraction servings for a fair","converting recipe measurements for the school bake-off","mapping a treasure hunt on a coordinate grid","calculating volume of storage boxes for classroom supplies","tracking stats for a school esports tournament","planning bus seating for a field trip to the Griffith Observatory","estimating the cost of a class trip to a Dodgers game","measuring rainfall in tenths of an inch for a weather log","calculating change for customers at a school store sale","designing a raised planter box and its volume of soil","splitting a restaurant bill fairly among families","stocking a vending machine and counting profits","planning a movie night with ticket and snack sales","calculating elapsed time for a school relay race schedule","building a birdhouse and measuring the wood pieces","ordering paint for an art mural using fractions of cans","graphing a week of screen time and finding patterns","planning a 5th grade yearbook with page counts and costs","calculating the perimeter fencing for a school chicken coop","converting metric measurements for a science olympiad"],
    science: ["how plants make food through photosynthesis","food webs in a California oak woodland ecosystem","the role of decomposers in a healthy forest","how energy moves through a food chain","producers, consumers, and decomposers in a tide pool","how drought affects plant and animal life in California","the life cycle of a California condor","how bees pollinate flowers and support food production","invasive species and their impact on California ecosystems","how salmon depend on healthy rivers to reproduce","how human activity disrupts food webs","the role of fungi in breaking down dead matter","how photosynthesis supports all life on Earth","properties of matter: solids, liquids, and gases","physical and chemical changes in everyday materials","how mixtures and solutions are different","conservation of matter in a chemical reaction","gravity and how it affects objects on Earth","how energy transfers from the sun to living things","density and why objects float or sink in water","measuring the weight of ice before and after it melts","how mixtures can be separated by filtering and evaporation","why matter is made of particles too small to see","how Earth's four spheres interact during a storm","how animals get energy from the food they eat","Earth's layers: crust, mantle, outer core, and inner core","how the water cycle works in California","why Earth's climate varies across different regions","how plate tectonics cause earthquakes and volcanoes","the role of the sun as Earth's main energy source","how humans affect Earth's land and water resources","the distribution of fresh water on Earth","how weathering and erosion shape California's landscape","Earth's atmosphere and its protective layers","how climate change affects California's weather patterns","the causes and effects of ocean pollution","how deforestation affects Earth's carbon cycle","how scientists design fair experiments","how to identify variables in a scientific investigation","how engineers use the design process to solve problems","how scientists analyze data and draw conclusions","how scientific models help us understand the natural world","the difference between a hypothesis and a theory","how technology helps scientists study Earth from space","how citizen scientists help track environmental changes","the history of the scientific method from Galileo to today","how scientists use evidence to change their thinking","how Earth's rotation gives us day and night","the rock cycle and how rocks change over time","how animals adapt to survive California's rainy season","why the sun looks brighter than other stars","how shadows and the sun's path change with the seasons","the phases of the moon and why they repeat","how condensation forms on a cold glass","why salt seems to disappear when stirred into water","how baking soda and vinegar show a chemical change","comparing the mass of ingredients before and after mixing","how Earth's gravity keeps the moon in orbit","how wetlands filter and clean water naturally","the journey of a plastic bottle through the recycling system","how compost turns food scraps into soil","why the ocean matters to California's weather","how groundwater collects in aquifers","the role of kelp forests in storing carbon","how scientists track migrating whales with satellite tags","how mushrooms and molds get their food","how a terrarium models Earth's water cycle","why some materials dissolve and others do not","how the tilt of Earth causes the seasons","how scientists classify stars by brightness and distance","what happens to matter when a candle burns","how ocean currents move heat around the planet","how a food web changes when one species disappears","why conserving fresh water matters in the American West","how scientists use models to predict wildfire behavior"],
    social: ["Native American life in California before European contact","the Maya civilization and their achievements in math and astronomy","the Aztec Empire and the city of Tenochtitlan","Christopher Columbus and the age of exploration","how Europeans and Native Americans first interacted","the Columbian Exchange: plants, animals, and diseases","daily life in a New England colonial town","the triangular trade and its impact on colonists and enslaved people","the Mayflower Compact and the idea of self-government","the role of religion in Colonial America","how colonial economies differed by region","life on a Southern plantation in Colonial America","the Boston Tea Party and colonial protests against Britain","how enslaved people resisted and preserved their culture","the role of colonial newspapers in spreading ideas","the causes of the American Revolution","the role of Paul Revere and the Minutemen at Lexington","Thomas Paine's Common Sense and its influence on colonists","the Battle of Saratoga as the turning point of the Revolution","the role of women in supporting the American Revolution","how the Continental Army survived the winter at Valley Forge","Benjamin Franklin's role as diplomat during the Revolution","the Constitutional Convention of 1787 and the Great Compromise","the Bill of Rights and why each amendment matters","how the three branches of government work together","checks and balances and why they protect democracy","the role of George Washington as the first president","how the Louisiana Purchase doubled the size of the United States","the Lewis and Clark Expedition across the Louisiana Territory","the Oregon Trail and the challenges of westward migration","the California Gold Rush of 1849","how the transcontinental railroad changed American commerce","the impact of westward expansion on Native American nations","the five geographic regions of the United States","how geography shaped where colonists chose to settle","major rivers and their importance to early American history","the Great Plains and how settlers adapted to the environment","how the Rocky Mountains affected the pace of westward expansion","the role of citizens in a democratic government","how a bill becomes a law in the United States","the importance of the freedom of speech and the press","how local, state, and federal governments are different","the Electoral College and how the president is elected","supply and demand in colonial trade","how mercantilism shaped the relationship between colonies and Britain","the role of money, barter, and trade in early America","how taxation without representation angered colonists","comparing the economies of Northern and Southern colonies","the role of the free press in American democracy","how the Erie Canal changed trade in early America","the Jamestown colony and its struggle to survive","the Pilgrims, the Wampanoag, and the first Thanksgiving","Benjamin Franklin's inventions and civic projects","the winter crossing of the Delaware and the Battle of Trenton","the Marquis de Lafayette and foreign help in the Revolution","the Treaty of Paris and the end of the Revolution","Shays' Rebellion and why the Articles of Confederation failed","the Federalists and Anti-Federalists debate the Constitution","the Whiskey Rebellion and testing the new government","Sacagawea's role in the Lewis and Clark expedition","the War of 1812 and the Star-Spangled Banner","the cotton gin and how it changed the South","the Trail of Tears and Indian removal","the Alamo and Texas independence","how the telegraph replaced the Pony Express","the Underground Railroad's secret routes north","Frederick Douglass and the power of his words","the Missouri Compromise and the spread of slavery","the Seneca Falls Convention and women's rights","mountain men and the fur trade of the West","the Mexican-American War and the Treaty of Guadalupe Hidalgo","the Homestead Act and claiming land on the plains","the Iroquois Confederacy's Great Law of Peace","how the Constitution can be amended over time","James Madison, father of the Constitution"],
    writing: ["should students have homework every night","should schools have a school uniform policy","should recess be longer in elementary school","should students be allowed to use tablets in class every day","should schools serve healthier food in the cafeteria","should physical education be required every school day","should students be able to choose their own reading books","should schools start later in the morning for better sleep","should students learn a second language starting in kindergarten","should schools ban junk food and sugary drinks","should students have a say in creating classroom rules","should school libraries have more graphic novels and comics","should there be limits on screen time for kids","a day when everything went wrong but turned out okay","the day you discovered a hidden talent","a time you showed courage when it was difficult","your most memorable family tradition or celebration","a day exploring a California state park or beach","the best lesson a grandparent or elder ever taught you","a time you had to solve a really difficult problem","a moment when you felt genuinely proud of yourself","a time you tried something completely new and unexpected","the day you made an unexpected friendship","a time you helped someone who really needed it","the most important thing you learned in 5th grade","explain how the water cycle works and why it matters","describe how the three branches of US government are organized","explain why California is called the Golden State","describe the importance of the Bill of Rights to Americans today","explain how photosynthesis supports all life on Earth","describe the main causes of the American Revolution","explain how earthquakes happen and how scientists measure them","describe the journey and hardships of a California Gold Rush miner","explain the importance of water conservation in California","describe how a bill becomes a law in the United States","a letter from a student to their school principal","a diary entry written by a colonial child in 1750","a news report about an important school event","a letter from a Gold Rush miner to their family back home","a travel brochure for a California national park","a book review of a favorite novel read this year","an advertisement for a school fundraiser event","a thank-you letter to a community hero or mentor","a letter to a future 5th grader about what to expect","explain what makes a good leader using a historical example","describe a California landmark and why it is important","a speech to convince the school board to add an art program","explain the importance of voting in a democracy","describe the most interesting thing you learned in science this year","a letter from a student to their favorite author","should 5th graders be allowed to bring cell phones to school","should zoos exist to protect endangered animals","should kids earn allowance for doing chores","should plastic bags be banned in California stores","should every school day include silent reading time","should students help plan the school lunch menu","the day you taught someone something for the first time","a time a plan failed and you improvised","the bravest thing you ever watched someone do","a family story that gets told again and again","the moment you realized you had grown up a little","explain how the Columbian Exchange changed both hemispheres","explain how volcanoes and earthquakes are related","describe how the First Americans adapted to their regions","explain how recycling protects natural resources","describe how a food web keeps an ecosystem balanced","explain why the colonists objected to British taxes","a persuasive letter to the city council about a new park","a journal entry from a soldier at Valley Forge","a newspaper front page for July 4, 1776","a museum placard describing a pre-Columbian artifact","an interview with an explorer returning from the New World","a speech nominating a classmate for student council","a how-to guide for surviving the Oregon Trail","a letter to Congress about protecting national parks"],
  },
  4: {
    ela: ["the California Gold Rush and life in the mining camps","the Spanish missions of California and their lasting impact","Juan Cabrillo's voyage along the California coast","the role of the Franciscan missionaries in California","California Indian nations and their traditions","the Bear Flag Republic and California's path to statehood","Biddy Mason, from enslaved person to California pioneer","James Marshall's discovery of gold at Sutter's Mill","the building of the transcontinental railroad through California","Chinese immigrants and their contributions to California","the effects of the 1882 Chinese Exclusion Act","how the Dust Bowl brought families to California","California during World War II: shipyards and sacrifice","the history of the Central Valley and California farming","John Muir and the fight to protect Yosemite","the California condor and efforts to save it","the Sacramento River and California's water history","how California's aqueduct system was built","the history of California's state government","the geography of California's coastal regions","the Sierra Nevada mountains and their importance","the Mojave Desert and the people who live there","California's Central Valley, the nation's breadbasket","Ansel Adams and the art of photographing nature","Dorothea Lange and documenting the Great Depression","Walt Disney and the rise of the entertainment industry","John Steinbeck and the story of California's migrant workers","the history of California's public school system","how earthquakes shape California's landscape","California wildfires and how communities rebuild","the kelp forests of California's coastline","gray whales and their migration along the California coast","California tide pools and the creatures that live in them","the history of the Pony Express","how the Golden Gate Bridge was designed and built","the life of a California rancho in the 1830s","the Mexican War of Independence and its effect on California","how California's diverse regions have different climates","the role of Sacramento as California's state capital","California's role in the aerospace industry","the story of how the Golden State got its nickname","Sally Ride and her path to becoming an astronaut","how the giant sequoias of California grow so tall","the work of lighthouse keepers along the California coast","how California poppies became the state flower","the history of cable cars in San Francisco","how desert tortoises survive in the Mojave","the journey of a letter on the Pony Express","how the Hoover Dam changed the American West","the story of Yosemite and the people who protect it","the Salton Sea and how it was accidentally created","Griffith Observatory and stargazing over Los Angeles","the Watts Towers and the man who built them","the La Brea Tar Pits and the Ice Age animals trapped there","the Channel Islands, California's Galapagos","how monarch butterflies overwinter in Pacific Grove","the wildflower super blooms of the California desert","Pio Pico and the last days of Mexican California","the Californios and life after statehood","Sutter's Fort and new arrivals to California","the ghost towns left behind by the Gold Rush","Levi Strauss and the invention of blue jeans","the Chinese fishing villages of Monterey Bay","how Hollywood became the movie capital of the world","the Rose Parade and its flower-covered floats","the adobe bricks that built early California","the San Diego mission, first in the chain","how sea lions and seals share California's coast","the elephant seals of Ano Nuevo","the salmon runs of the Klamath River","how the Salinas Valley became America's salad bowl","Yosemite's waterfalls and how they change with the seasons","Death Valley, the hottest place in North America","Mount Whitney and hiking California's tallest peak","Lake Tahoe and its famously clear water"],
    math: ["planning a 4th grade field trip to the California State Capitol","organizing a school supply drive for a local shelter","budgeting for a classroom pizza party","tracking a reading log challenge across the school","planning a community garden for the school","calculating distances on a map of California","organizing a school book swap event","tracking rainfall data for a California city","planning a school bake sale with multiple items","calculating the area of the school garden beds","measuring and comparing the height of sunflowers grown in class","planning a Thanksgiving feast for the class","calculating the cost of school supplies for the year","organizing a school clothing drive by weight","budgeting for a class camping trip to a California state park","tracking the growth of California oak seedlings","planning a school mural with specific dimensions","calculating the perimeter of the school playground","organizing a canned food drive and tracking totals","planning a school sports day with multiple events","calculating stats for a classroom kickball tournament","planning a community car wash to raise money","tracking miles walked during a school step challenge","budgeting for a classroom aquarium project","planning a school carnival with booth costs and earnings","calculating the number of tiles needed for a school project","tracking daily temperature changes in a California city","planning a school garden using area and perimeter","calculating the cost of painting a classroom wall","budgeting for new books for the school library","planning a school recycling program and tracking weight","measuring ingredients for a 4th grade cooking class","calculating the distance from school to nearby landmarks","tracking attendance for a school event over multiple days","planning a school talent show and ticket sales","calculating the cost of a class subscription to a magazine","budgeting for a class celebration at the end of the year","tracking the growth of bean plants over several weeks","planning a community cleanup event and supplies needed","calculating the cost of materials for a school art project","calculating the cost of seeds and soil for the school garden","measuring angles in a design for a new school sign","tracking how many books each class read during a reading month","planning a class trip to a California mission and counting miles","comparing the heights of California mountains using place value","figuring out factors when arranging desks into equal rows","calculating the perimeter of a rectangular garden bed","measuring rainfall in millimeters across four California cities","splitting fundraiser money equally among classroom supplies","rounding the populations of California cities to the nearest thousand","designing a school flower bed with symmetry","measuring angles on a skateboard ramp design","listing factor pairs for a 36-cupcake bake sale display","using multiples to plan snack packs for a hike","rounding attendance numbers for the school carnival","comparing fractions of two granola bars","adding fractions of a mile walked before and after lunch","converting yards to feet for a football field banner","converting hours to minutes for a class schedule","estimating and multiplying the cost of 24 field trip lunches","dividing 1,248 pencils among grade-level classrooms","finding the area of an L-shaped reading nook","line plots of seedling heights measured in quarter inches","identifying prime numbers in a hundreds-chart game","extending a bead pattern to the 50th bead","comparing two six-digit city populations","reading odometer numbers on a family road trip","framing a class photo and finding its perimeter","measuring right, acute, and obtuse angles in the classroom","finding lines of symmetry in leaves collected at recess","multiplying 2-digit by 2-digit to fill stadium seat sections","interpreting remainders when packing 250 books into boxes of 8","a multi-step problem about saving for an 89 dollar telescope","comparing race times measured in hundredths of a second","adding like-denominator mixed numbers in a trail mix recipe"],
    science: ["how plant roots and stems help plants survive","how thorns, bark, and waxy leaves protect a plant","how animal fur, feathers, and shells help them survive","how a dog's nose helps it find food and stay safe","how eyes and ears help animals respond to their environment","how camouflage helps animals hide from predators","the role of a plant's flowers and seeds in reproduction","how energy from food gives animals the ability to move","what happens to energy when a ball is thrown and caught","how a roller coaster uses kinetic and potential energy","how a simple machine like a lever transfers energy","what happens to energy when two objects collide","how sound travels as a wave through the air","how light bounces off mirrors and other surfaces","why we see colors in a rainbow after rain","how the human eye detects light to create images","how rock layers at the Grand Canyon show Earth's history","how fossils are formed and what they tell us","how rivers carve canyons over thousands of years","how wind and rain shape the hills of California","how California's earthquake faults change the landscape","how mapmakers show mountains and valleys","how scientists map the ocean floor","how coal and oil formed from ancient living things","how solar panels capture energy from the sun","how wind turbines generate electricity","why some energy sources are renewable and others are not","how communities prepare for earthquake damage","how engineers design buildings to survive earthquakes","how scientists test solutions to reduce erosion","how a scientist designs a fair experiment","how engineers use the design process to solve a problem","how scientists identify variables in an investigation","how scientists use data to draw conclusions","how scientific models help explain things we cannot see","how citizen scientists help track California bird populations","the difference between a scientific hypothesis and a theory","how technology helps scientists study California's faults","how evidence from rocks tells us about ancient climates","how engineers improve designs after testing them","how a bird's wings and feathers are built for flight","how echoes show that sound travels as waves","how a flashlight beam lets us see in the dark","how moving water carries sand and reshapes a beach","how a wind-up toy stores and releases energy","how fish use gills and fins to survive underwater","how layers of sediment turn into solid rock over time","how a magnifying glass bends light to make things bigger","how a hawk's eyes and talons make it a skilled hunter","how engineers design bridges to handle moving loads","how a prism splits white light into colors","how sound waves make a drum skin vibrate","how Morse code sends messages with patterns","how a string telephone carries sound between cups","how reflectors on bikes keep riders safe at night","how energy changes when a skateboarder rides a half-pipe","how a hydroelectric dam turns falling water into electricity","how geothermal energy heats homes in California","how batteries store energy for later use","how sand dunes form and move in the desert","how sea stars grip rocks in crashing waves","how a cat's whiskers sense the world","how owls hunt in the dark with sound","how plants close their leaves when touched","how woodpeckers hammer trees without getting hurt","how glaciers carved Yosemite Valley","how a seismograph records earthquake waves","how landslides change California hillsides","why beaches lose sand in winter storms","how volcanic rock layers stack up over time","comparing energy from the sun, wind, and fossil fuels","how earthquake early-warning systems buy precious seconds","designing a shake table to test model buildings","testing which paper airplane design flies farthest","how erosion fences protect sand dunes"],
    social: ["the physical regions of California: coast, valley, mountain, and desert","how latitude and longitude help us locate places in California","how California's Central Valley became a farming region","how the Sierra Nevada mountains affected westward migration","how ocean currents affect California's climate","how the Sacramento and San Joaquin rivers shaped settlement","California's natural resources: gold, timber, oil, and water","how the desert climate of Southern California affected Native peoples","major California Indian nations and their geographic distribution","how the Chumash people used the ocean for food and trade","how the Miwok people adapted to the Sierra Nevada foothills","how California's Native peoples built shelters and gathered food","the spiritual traditions and ceremonies of California Indian nations","Juan Rodriguez Cabrillo's 1542 exploration of California's coast","how the Spanish chose locations for their California missions","life inside a California mission: work, worship, and conflict","the impact of the mission system on California's Native peoples","Junipero Serra and the founding of the California missions","how the Mexican War of Independence changed life in California","the rancho period: land grants and cattle ranching in California","daily life on a California rancho in the 1830s","how the Bear Flag Revolt led to California's independence","the Mexican-American War and California's transfer to the United States","John C. Fremont's role in California's path to statehood","the discovery of gold at Sutter's Mill in January 1848","how the Gold Rush transformed San Francisco overnight","the routes forty-niners took to reach California","Biddy Mason's journey from slavery to freedom in California","how the Gold Rush changed California's economy and population","the debate over California's admission as a free state in 1850","the building of the first transcontinental railroad","the contributions of Chinese workers to the railroad","the Pony Express and how it connected California to the East","how immigration from China, Mexico, and Europe shaped California","the 1882 Chinese Exclusion Act and its effects on California","how Los Angeles grew from a small town to a major city","the effects of the Great Depression on California farm families","how the Dust Bowl migration brought thousands to California","California's role in World War II: shipbuilding and internment","how California's aerospace and technology industries developed","how the Yokuts people lived in the Central Valley","why Spanish settlers built presidios along the coast","how the discovery of gold changed Sacramento","the role of women during the California Gold Rush","how California's missions are connected by El Camino Real","how the state capital moved before settling in Sacramento","how California's three branches of government work together","the importance of California's harbors for trade","how immigrants from many countries built California's farms","how national parks like Yosemite became protected land","the Portola expedition and the discovery of San Francisco Bay","the Anza expedition bringing settlers to California","how the pueblo of Los Angeles was founded in 1781","vaqueros, the first cowboys of California","the hide and tallow trade on the California coast","the Russian settlement at Fort Ross","James Beckwourth and the pass through the Sierra","how rancho families lost their lands after statehood","the Butterfield stage line and mail by stagecoach","the telegraph reaches California and ends the Pony Express","levees, floods, and the Great Flood of 1862","Chinese herbal shops and stores in Gold Rush towns","Angel Island, the Ellis Island of the West","Japanese American farm families before World War II","the bracero program and farmworkers from Mexico","migrant camps of the Great Depression in the Central Valley","women factory workers in California during World War II","Japanese American internment at Manzanar","the GI Bill and California's postwar boom","building the freeways that connected Los Angeles","the Central Valley Project and watering the valley","Cesar Chavez and Dolores Huerta organize farmworkers","how Silicon Valley grew from orchards to computers","the state seal, flag, and symbols of California","how a bill becomes a law in Sacramento"],
    writing: ["should every 4th grader learn to swim","should our school have a longer lunch break","should kids be allowed to bring pets to school one day a year","should 4th graders have classroom jobs","should our school plant a vegetable garden","should students get to pick their own seats in class","should every classroom have a class pet","should kids have to wear helmets when riding scooters","should our school add a recess before lunch","should 4th graders be allowed to use the big kids' playground","should every student learn about California Indian nations","should our class take a field trip to a California mission","should schools teach cursive handwriting","a time you tried something new and it surprised you","the best day you ever had with your family","a time you helped a friend who was having a hard day","the day you lost something important and what happened next","a time you were brave even though you were scared","your favorite family meal and the story behind it","a day at a California beach, park, or mountain","the funniest thing that ever happened at school","a time you worked hard to learn something difficult","imagine you found a gold nugget like James Marshall, and tell the story","imagine you traveled west on a wagon train to California","imagine you spent a day at a California mission in the 1800s","explain how a seed grows into a plant","explain why California has so many different climates","describe the four regions of California","explain how the Gold Rush changed California","describe what life was like for a child on a California rancho","explain how animals use their senses to survive","explain how erosion changes the land over time","describe how the transcontinental railroad was built","explain why we have rules at school and at home","describe how a California mission was built and who lived there","explain how solar panels turn sunlight into electricity","explain what makes the Central Valley good for farming","describe the journey of the forty-niners to California","a letter to your principal suggesting one school improvement","a thank-you letter to a school helper (custodian, librarian, or aide)","a diary entry from a child traveling to California in 1849","a postcard from a famous California landmark","a letter to a 3rd grader about what to expect in 4th grade","a news report about your school's latest event","instructions teaching someone your favorite game","a travel brochure for one of California's four regions","a letter to John Muir asking about Yosemite","an advertisement for your class's imaginary lemonade stand","a book recommendation letter to a friend","a letter from a Chinese railroad worker to family back home","should 4th graders get a weekly allowance","should our school host a talent show","should recess games have student referees","should the class sponsor a shelter animal","should students be able to retake tests","a day you got caught in the rain","the best surprise you ever planned for someone","a time you kept a promise that was hard to keep","the day your family tried something new together","a mystery you solved at home or school","the day you met your best friend","imagine you rode with the Pony Express for one day","imagine you struck water, not gold, in 1849","imagine a day as a lighthouse keeper's kid","explain how a compass helps travelers find their way","describe how fog forms along the California coast","explain why the missions were built a day's walk apart","describe how a wagon was packed for the trip west","explain how recycling works at your school","describe the life cycle of a California poppy","a menu for a Gold Rush town restaurant","a wanted poster for the classroom's missing glue sticks","a letter to the governor about protecting sea otters","a script for a class news broadcast","a field guide entry for a California animal"],
  },
  3: {
    math: ["setting up equal teams for a 3rd grade kickball game","sharing a pack of stickers equally among classmates","counting rows of seats in the school cafeteria","packing apples into equal-sized lunch bags","arranging desks into equal rows and columns","counting wheels on bikes in the school rack","sharing crayons equally at each art table","figuring out how many cupcakes for a class party","counting legs on the class pet hamsters and fish","planting equal rows of seeds in the school garden","sharing a basket of oranges from a Whittier orchard","counting tiles on the classroom floor","figuring out how many cookies in equal bags for a bake sale","setting out equal groups of markers for stations","counting how many crayons are in several full boxes","sharing slices of pizza fairly at lunch","arranging library books on equal shelves","counting how many erasers each table group gets","filling egg cartons to count by equal groups","figuring out how many laps the class ran in total","measuring how tall classroom plants grew this month","measuring the length of the hallway in feet","timing how long it takes to walk to the library","figuring out how much time until recess","weighing fruit at a Whittier farmers market stand","measuring water in liters for a science experiment","reading a clock to know when art class starts","measuring the playground sandbox with a ruler","comparing the weight of two backpacks in kilograms","tracking minutes spent reading each day this week","finding the area of a rectangular garden bed","finding the perimeter of the classroom rug","tiling a rectangle to count square units","measuring around the edge of a poster board","figuring out the area of a vegetable patch","comparing two gardens with the same area","cutting a sandwich into equal fraction pieces","sharing a chocolate bar into halves and fourths","folding paper into thirds and sixths","showing fractions on a number line","figuring out which fraction of pizza is bigger","coloring equal parts of a shape to show a fraction","rounding the number of students to the nearest ten","adding up scores in a class reading contest","counting school supplies into hundreds and tens","subtracting to find how many books are left","reading a bar graph of favorite recess games","making a picture graph of class pet votes","adding up pages read from three chapter books","sorting shapes by their number of sides","putting 24 muffins into boxes of 4","sharing 18 marbles equally among 3 friends","using arrays to count stamps in an album","arranging 30 chairs into rows of 6 for a puppet show","finding how many juice boxes in 7 packs of 8","a two-step problem about tickets for the class play","multiplying by 10s to count pencils in bundles","rounding library book counts to the nearest hundred","adding three-digit points in a board game tournament","subtracting to find seats left on the field trip bus","elapsed time from the start to the end of art class","reading a schedule to plan the class morning","measuring the mass of classroom fruit in grams","filling water bottles and measuring liters for field day","a scaled bar graph of favorite school lunches","a picture graph where each symbol equals 5 votes","a line plot of shoe lengths measured to the half inch","counting square units to find a comic strip's area","finding the perimeter of the four-square court","same perimeter, different area: designing two dog pens","sharing a veggie pizza cut into eighths","marking halves and fourths on a paper number line","comparing two thirds and two fourths of the same juice glass","sorting quadrilaterals by sides and corners","drawing a shape split into 4 equal parts"],
    ela: ["a kid who plants a vegetable garden behind the school","two friends who build a fort in the backyard","a dog that learns to fetch the morning newspaper","a girl who finds a lost kitten on her street","a class field trip to a local nature park","a boy who is afraid of the dark but learns to be brave","a family hiking up a trail in the nearby hills","a turtle and a rabbit who learn to be friends","a kid who saves up coins for a new bike","a rainy day adventure indoors with a cardboard box","a tortoise that wins a race by never giving up (a fable)","a clever crow that figures out how to reach water (a fable)","why the owl only comes out at night (a folktale)","how the bluebird got its color (a folktale)","a myth about how the seasons came to be","a grandmother who tells stories about long ago","a kid who moves to a new town and makes a friend","a squirrel preparing acorns for the winter","a young firefly looking for its glow","a lighthouse keeper who guides ships safely home","how honeybees make honey in their hive","why the ocean has waves and tides","the life cycle of a monarch butterfly","how a spider spins its web","facts about the planets in our solar system","how rainbows form after a storm","the parts of a tree and what each one does","how birds build their nests","why volcanoes erupt","how a seed grows into a plant","amazing facts about elephants and how they live","how the desert tortoise survives in dry places","the journey of a raindrop through the water cycle","how penguins stay warm in the cold","the different kinds of clouds in the sky","how a caterpillar becomes a butterfly","facts about sharks and how they hunt","how bridges are built to hold heavy loads","why we need to drink water every day","how the sun gives Earth light and warmth","a community helper who keeps the neighborhood safe","the story of a beloved local park","a kid who starts a recycling club at school","an inventor who never stopped trying","the first day at a brand new school","a pet that does something surprising","a treasure hunt with a hand-drawn map","a snowy day in a place that never sees snow","a baker who shares bread with the whole town","a kid who helps a younger sibling learn to read","the ant and the grasshopper and planning ahead (a fable)","the lion and the mouse and small acts of kindness (a fable)","the boy who cried wolf and telling the truth (a fable)","why the coyote howls at the moon (a folktale)","the magic paintbrush that painted real things (a folktale)","a myth about where thunder comes from","a girl who trains her puppy for a pet parade","a class that builds a little free library","twins who trade places for a day","a kid who learns to ride the city bus with grandma","the school garden's first ripe tomato","a firefighter visits the classroom","how tunnels are dug under cities","how astronauts eat and sleep in space","the biggest and smallest dogs in the world","how a hummingbird hovers in place","why leaves change color in the fall","how bats find their way in the dark","the life cycle of a pumpkin from seed to pie","how popcorn pops","why the moon seems to change shape","how recycling trucks sort what we toss","a boy who enters the school talent show","the day the power went out at school","a stray cat that adopts a whole neighborhood"],
    writing: ["should your class have a pet","should kids get more recess time","should students choose their own seats","should homework be given on weekends","should the school have a longer lunch","should kids be allowed to chew gum in class","should every classroom have a reading corner","should students help pick the books for class","should the school start a vegetable garden","should kids be allowed to bring toys for show and tell","what your favorite season is and why","the best field trip you could imagine","why your favorite book is worth reading","what makes a good friend","your favorite thing to do after school","the best meal your family makes","a place you would love to visit someday","why you like your favorite animal","what you want to be when you grow up","the most fun game to play at recess","a time you tried something new","a day you helped someone else","your happiest memory with your family","a time you felt really proud of yourself","the funniest thing that ever happened to you","a time you were scared but got through it","your first day in 3rd grade","a special day you spent with a grandparent","a time you lost something and found it","an adventure you had outdoors","explain how to take care of a pet","explain how to plant a seed and help it grow","explain the rules of your favorite game","explain how to make your favorite snack","explain why exercise is good for you","describe your favorite place in your neighborhood","describe what your dream treehouse would look like","describe your favorite holiday and how you celebrate","describe an animal so a reader can picture it","describe your perfect day from morning to night","a thank-you letter to a teacher or helper","a letter inviting a friend to a party","a letter to your future self in 5th grade","a get-well card with a kind message","a postcard from an imaginary vacation","a story about a magic backpack","a story about a talking animal","a story where you shrink to the size of an ant","a story about finding a door that wasn't there before","a story about the best birthday ever","should our class earn a pizza party for reading goals","should kids make their beds every morning","should the library add more comic books","should our school have a game day each month","should kids help cook dinner once a week","should the class get a longer art time","the day you rode a bike without training wheels","a time you shared something you loved","the best snow or beach day ever","a time your pet made you laugh","the day you were the line leader","a time you fixed something all by yourself","your favorite rainy day memory","explain how to brush your teeth the right way","explain how to be a good teammate","describe your classroom to someone who has never seen it","explain how to check out a library book","describe how to make the best sandwich step by step","explain why we recycle at school","describe what fall looks, sounds, and smells like","a birthday card message for a grandparent","a note asking a neighbor to watch your pet","a poster inviting families to open house","a silly menu for a monster restaurant","a list story: ten things in my perfect backpack"],
    science: ["how a push or a pull makes a toy car move","why a ball rolls farther on a smooth floor","how magnets pull some objects but not others","what happens when two magnets face each other","how a soccer ball stops when something blocks it","why a heavier wagon is harder to push","how a swing keeps going back and forth","what forces act on a kite in the wind","how a ramp helps a marble roll faster","how rubbing a balloon makes it stick to a wall","the life cycle of a frog from egg to adult","how a butterfly changes during its life","how baby animals grow up to look like their parents","why kittens in the same litter look different","how a wolf pack works together to survive","how ants live and work together in a colony","how a plant grows from a seed to a flower","why some animals travel in herds for safety","how birds care for their young in a nest","how traits like eye color pass from parents to babies","what fossils tell us about animals long ago","how a dinosaur footprint becomes a fossil","why some plants and animals lived only long ago","how animals are suited to live in their habitat","what happens to animals when their home changes","how a fish is built to live underwater","how a cactus survives in the dry desert","how camouflage helps an animal hide","why polar bears have thick fur and fat","how beavers change the land by building dams","what makes the weather change with the seasons","why summer is hotter than winter","how to read a weather chart for the week","what tools weather scientists use to measure rain","how clouds tell us what weather is coming","why some places are rainy and others are dry","how people stay safe during a big storm","what causes thunder and lightning","how a rain gauge measures how much rain fell","why deserts are dry and rainforests are wet","how scientists ask questions and test ideas","how to set up a fair test in an experiment","how scientists record and chart what they observe","how engineers solve a problem step by step","how to design and test a paper bridge","why scientists repeat their experiments","how a model helps us understand something big","how scientists measure and compare results","how to use a chart to show what you learned","how curiosity leads to a science discovery","how a compass needle points north","how magnets help a junkyard crane lift metal","why socks crackle with static from the dryer","designing a magnetic latch for a treasure box","how a tug-of-war shows balanced and unbalanced forces","why a bowling ball needs a bigger push than a marble","the life cycle of a chicken from egg to hen","the life cycle of a sunflower through the seasons","how salmon return to the stream where they hatched","why giraffes in a herd watch for danger together","how bees in a hive share different jobs","why puppies in one litter can have different spots","traits kids share with their parents and grandparents","fossil seashells found on mountaintops and what they mean","comparing a woolly mammoth to a modern elephant","how tar pits trapped Ice Age animals","why a polar bear could not live in the desert","how frogs survive when their pond dries up","what animals do when a forest burns and regrows","keeping a class weather journal for a month","comparing weather in Whittier and in Alaska","how lightning rods protect tall buildings","designing a shade shelter for a hot playground","how meteorologists warn towns before big storms","measuring wind with a homemade pinwheel"],
    social: ["the Tongva people who lived in the Whittier Narrows long ago","how the Tongva used the San Gabriel River for water and food","the Tongva village of Shevaanga near Whittier","how the Tongva made tools, baskets, and homes from local plants","Tongva traditions, songs, and stories passed down over time","how local Native families gathered acorns and oak from the hills","the Gabrieleno name the Spanish gave the local Tongva people","how the Tongva traded with other nearby villages","how local Native people cared for the land around Whittier","Tongva life in the Los Angeles Basin before the Spanish arrived","the founding of Mission San Gabriel near Whittier Narrows","how Spanish settlers changed life for local Native people","the Mexican rancho era and Rancho Paso de Bartolo","Pio Pico, the last Mexican governor, and his home El Ranchito","Pio Pico State Historic Park and why it matters today","how the Quakers founded the city of Whittier in 1887","why the city was named after the poet John Greenleaf Whittier","how early Whittier grew citrus orchards and farms","the Jonathan Bailey House and Whittier's first settlers","how Whittier changed from ranch land to a city","Uptown Whittier and how the downtown area grew","how the streets of Whittier got their names","the Puente Hills that rise above Whittier","the San Gabriel River and how it shaped the area","using a map to find Whittier in Los Angeles County","local landforms near Whittier, including hills, valleys, and rivers","how people in Whittier use the land today","reading a map of our local Whittier neighborhood","how Whittier's weather and climate affect daily life","the natural resources that helped Whittier grow","why communities make rules and laws","the basic jobs of city leaders in a town like Whittier","the three branches of the U.S. government for kids","what the U.S. Constitution is and why it matters","the American flag and what its stars and stripes mean","the bald eagle as a symbol of the United States","the Statue of Liberty and what it stands for","local landmarks that bring the Whittier community together","what it means to be a good citizen in your community","community heroes who help people in Whittier","national heroes who showed courage and fairness","how a local farm turns resources into food we buy","producers and consumers in the Whittier community","natural, human, and capital resources explained for kids","goods made in our town versus goods made far away","how people make choices about spending and saving","how citrus farming was an important Whittier business","jobs and businesses found in Whittier today","why people trade goods and services","making smart choices about wants and needs","the plank canoes the Tongva used along the coast","games and toys Tongva children played long ago","how the Tongva named places across our region","Whittier's Founders Day and how the city celebrates its history","the Whittier Museum and what you can see there","Central Park in Uptown Whittier long ago and today","the Whittier Public Library through the years","how the 1987 Whittier Narrows earthquake changed the city","famous people who grew up in Whittier","how orange crate labels advertised Whittier fruit","the Whittier hills trails and who takes care of them","how the San Gabriel River is kept safe from floods","where Whittier's drinking water comes from","Whittier College and its long history","how our neighborhood gets its mail delivered","the fire station and how firefighters serve Whittier","how the city council makes decisions for Whittier","voting: how grown-ups choose community leaders","the Pledge of Allegiance and what its words mean","Independence Day and why we celebrate July 4th","the Liberty Bell and its famous crack","Mount Rushmore and the presidents carved in stone","how a dollar travels from shopper to store to worker","how goods travel by truck, train, and ship to our stores","saving money in a bank and why people do it"],
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
  { id:"on",      label:"On-Level",     desc:"Standard grade level" },
  { id:"support", label:"With Support", desc:"Word bank, worked example, sentence frames" },
  { id:"extend",  label:"Extension",    desc:"Error analysis, create-your-own, deeper reasoning" },
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
  { id:"tpt",    label:"TPT Print",    icon:Printer, desc:"Polished TPT-style template" },
  { id:"raw",    label:"Editable Text",icon:Type,    desc:"Copy into Google Docs or Word" },
  { id:"canva",  label:"Canva Pack",   icon:Package, desc:"Section-by-section, ready to paste" },
];

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

// Picks a topic that hasn't been used yet for this grade+subject.
// Tracks used topics in localStorage so a teacher cycles through the
// entire list before any topic repeats. Once all are used, the pool
// resets and starts fresh.
function pickFreshTopic(grade, subjectId, topics) {
  if (!topics || topics.length === 0) return "";
  const key = `rex_used_topics_${grade}_${subjectId}`;
  let used = [];
  try {
    used = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    used = [];
  }

  // Find topics not yet used
  let available = topics.filter((t) => !used.includes(t));

  // If everything has been used, reset the pool
  if (available.length === 0) {
    used = [];
    available = topics.slice();
  }

  // Pick randomly from what's available
  const chosen = available[Math.floor(Math.random() * available.length)];

  // Record it as used
  try {
    used.push(chosen);
    localStorage.setItem(key, JSON.stringify(used));
  } catch {
    // localStorage unavailable — still return a topic, just no tracking
  }

  return chosen;
}

function buildPrompt(grade, subjectId, resourceType, difficulty, purpose, topic) {
  const std = STANDARDS[grade]?.[subjectId]?.[resourceType] || { codes:`${gradeOrdinal(grade)} Grade CCSS`, focus:`${gradeOrdinal(grade)} grade ${subjectId}`, skills:[resourceType] };
  const gradeLabel = gradeOrdinal(grade);

  // ── Grade scaling: passage length, sentence style, and load scale by grade ──
  const gradeScale = {
    3: { passageWords:"100-150", passageStyle:"Use short, simple sentences with one idea each and grade 3 vocabulary (a few stretch words are fine).", mcCut:1, draftLines:8, tone:"warm, encouraging, and concrete" },
    4: { passageWords:"150-200", passageStyle:"Use clear sentences with some compound structures and grade 4 vocabulary.", mcCut:0, draftLines:10, tone:"warm and clear" },
    5: { passageWords:"180-230", passageStyle:"Use varied sentence structures and richer vocabulary appropriate for grade 5.", mcCut:0, draftLines:12, tone:"clear and increasingly academic" },
  };
  const gs = gradeScale[grade] || gradeScale[4];

  // ── Purpose plans: each purpose owns its real question counts ──
  const purposePlan = {
    practice:   { warm:3, mc:4, apply:2, explain:1, guide:"Lesson practice used right after instruction. Include a worked example or hint box immediately after the directions." },
    homework:   { warm:2, mc:4, apply:2, explain:1, guide:"Homework completable independently in 15-20 minutes. No new concepts." },
    review:     { warm:2, mc:5, apply:2, explain:2, dok:true, selectAll:true, guide:"SBAC/test review. Mirror Smarter Balanced item formats so students practice the FORM of the test, not just the content." },
    finisher:   { warm:1, mc:3, apply:2, explain:1, guide:"Early finisher enrichment. Rich, puzzle-like, self-contained challenges." },
    assessment: { warm:1, mc:4, apply:2, explain:1, assess:true, dok:true, guide:"A real graded assessment, not a practice page. Every item must be independently answerable: no hints, no worked examples, no word banks, and no question that gives away the answer to another question." },
  };
  const isAssessment = !!(purposePlan[purpose] || {}).assess;

  // Grade-specific assessment context. CAASPP (Smarter Balanced) tests ELA and
  // math in grades 3-5; CAST (science) is grade 5 only, not 3 or 4.
  const assessContext = {
    3: "This is 3rd grade, the FIRST year students take state testing. They have never seen these item formats before. Directions must be extremely explicit, one task per item, no compound instructions. Keep reading load low so the test measures the math or skill, not reading stamina.",
    4: "This is 4th grade. Students have one year of state testing experience. Items may combine two steps, but each item must still assess one clear skill.",
    5: "This is 5th grade. Students are experienced test takers and also take the CAST science test this year. Items may require multi-step reasoning and precise academic vocabulary.",
  };
  const pp = purposePlan[purpose] || purposePlan.practice;
  const mcCount = Math.max(3, pp.mc - gs.mcCut);

  // The state tests only ELA and math in grades 3-5, plus science at grade 5
  // (CAST). Review must never invoke SBAC for subjects that have no such test.
  let reviewGuide = pp.guide;
  if (purpose === "review") {
    if (subjectId === "social") reviewGuide = "Unit test review. There is no state test for social studies, so review like a strong classroom unit test: mixed recall, application, and written response items across the unit's key ideas.";
    else if (subjectId === "science") reviewGuide = grade === 5
      ? "CAST review (California Science Test, taken in 5th grade). Anchor the applied items to one real-world phenomenon or investigation scenario, and require students to use evidence and science ideas to explain it."
      : "Science unit review. The state science test (CAST) is not taken until 5th grade, so review like a classroom unit test: mixed recall, application, and explanation items.";
    else if (subjectId === "writing") reviewGuide = "Writing review. Practice the full writing process for this genre with attention to what strong responses include.";
  }

  const diffGuide = {
    on: `Standard ${gradeLabel} grade difficulty. Moderate complexity. Numbers and vocabulary sit squarely at grade level. Multiple-choice distractors reflect the real errors ${gradeLabel} graders make.`,
    support: `BELOW GRADE LEVEL / SCAFFOLDED. This worksheet is for students working below grade level who need support to access the same standard. It must be STRUCTURALLY different from a standard worksheet, not just easier wording.`,
    extend: `ABOVE GRADE LEVEL / EXTENSION. This worksheet is for advanced students who have mastered the standard and need to be stretched. It must be STRUCTURALLY different from a standard worksheet, not just harder numbers.`,
  };

  // Structural differentiation: subject-shaped, grade-guarded, and bound to
  // this worksheet's exact skills. Extension means DEPTH, not acceleration.
  const gradeGuard = {
    3: { support:"Every number and task must stay inside 3rd grade standards: multiplication and division within 100, fractions only with denominators 2, 3, 4, 6, and 8, no decimals anywhere.",
         extend:"Stretch DEPTH, not acceleration. Stay inside 3rd grade standards. Do NOT use 4th grade content such as multi-digit multiplication, decimals, or adding unlike fractions. Harder thinking about the same standards." },
    4: { support:"Every number and task must stay inside 4th grade standards: like-denominator fraction addition only, decimals to hundredths only, no brackets or order of operations.",
         extend:"Stretch DEPTH, not acceleration. Stay inside 4th grade standards. Do NOT use 5th grade content such as unlike-denominator fraction addition, fraction division, volume formulas, or order of operations with brackets." },
    5: { support:"Every number and task must stay inside 5th grade standards, with the simplest cases of each skill.",
         extend:"Stretch DEPTH, not acceleration. Stay inside 5th grade standards. Do NOT use middle school content such as negative numbers, ratios, percents, or algebraic expressions beyond a letter for an unknown." },
  };
  const gg = gradeGuard[grade] || gradeGuard[4];

  const supportPlans = {
    math: `- Begin with a "Helpful Hints" box in the [SUPPORT BOX] provided, with the key vocabulary, formulas, or steps.
- Before question 1, include ONE fully worked example labeled "Example" showing every computation step for this exact skill.
- Multiple choice: give only THREE answer choices (A, B, C), not four.
- Use friendlier numbers within the grade (simpler fractions, smaller whole numbers, fewer regrouping steps).
- Split every multi-step problem into labeled Part A and Part B.
- Include one problem built around a described visual model (number line, array, or area model) the student completes.
- Put a sentence frame on every written response, e.g. "I solved it by ______".`,
    elaReading: `- Keep the passage shorter and use simpler sentence structure while keeping the same topic. Number the paragraphs.
- Add a "Word Bank" in the [SUPPORT BOX] provided, defining 3-4 tricky words FROM the passage in kid-friendly terms.
- Before question 1, include ONE worked example labeled "Example" that answers an evidence question and names the paragraph where the answer was found.
- Multiple choice: give only THREE answer choices (A, B, C), not four.
- Ask questions in the same order the passage gives the information.
- Put evidence sentence starters on written items: "The text says ______. This shows ______."`,
    elaGrammar: `- Begin with a "Rules Box" in the [SUPPORT BOX] provided, stating the target rule(s) with one clear example of each.
- Before question 1, include ONE worked example labeled "Example" applying the rule step by step.
- Multiple choice: give only THREE answer choices (A, B, C), not four.
- Test one rule per question; no mixed-rule items.
- For fix-it items, show the sentence and point out exactly which part needs fixing.
- Put a sentence frame on every written response.`,
    writing: `- Restate the prompt in the simplest possible words inside the directions.
- In the Brainstorm box task, provide 2 example ideas already listed, and ask the student to add their own.
- Make the Organize task a labeled frame (Beginning / Middle / End, or Opinion / Reason 1 / Reason 2).
- Start the draft task with a paragraph frame containing blanks the student completes, then lines to continue.
- Include a "Word Bank" of linking and temporal words that fit this genre, in the [SUPPORT BOX] provided.
- Make every Check Your Work item concrete and observable, e.g. "Did I write my opinion in the first sentence?"`,
    science: `- Begin with a "Word Bank" in the [SUPPORT BOX] provided, defining the science vocabulary in kid-friendly terms.
- Before question 1, include ONE worked example labeled "Example" that models the thinking out loud: "I notice ______, so I think ______ because ______."
- Multiple choice: give only THREE answer choices (A, B, C), not four.
- Put claim-evidence sentence frames on written items: "I claim ______ because I observed ______."
- Keep any data simple: small tables, whole numbers, clear labels.
- Split multi-part tasks into labeled Part A and Part B.`,
    social: `- Begin with a "Word Bank" in the [SUPPORT BOX] provided, listing the key names, places, and terms with kid-friendly meanings.
- Before question 1, include ONE worked example labeled "Example" that answers a history question and tells where the answer comes from.
- Multiple choice: give only THREE answer choices (A, B, C), not four.
- Support sequence questions with a simple first / next / last structure or 3-step timeline to complete.
- Put sentence frames on written items: "One cause was ______." "This changed life because ______."
- Ask concrete recall questions before application questions.`,
  };

  const extendPlans = {
    math: `- Replace the simple opening with an entry task that requires reasoning from question 1.
- Include at least one ERROR ANALYSIS question: fictional student work containing a mistake real ${gradeLabel} graders make with this exact skill; find it, explain it, correct it. Write the student's complete work out in full as plain text lines under the question.
- Include at least one CREATE-YOUR-OWN question: the student writes a problem meeting a stated condition, then solves it.
- Make word problems multi-step and require students to justify why their approach works.
- Multiple choice distractors must reflect subtle reasoning errors, not careless mistakes.
- Add a "Going Deeper" prompt connecting the skill to a real-world application.
- The Bonus must require proof-style reasoning or finding a general rule, not just bigger numbers.`,
    elaReading: `- Keep the passage at grade level but make it inference-rich, so answers require reading between the lines.
- Include at least one AUTHOR'S CRAFT question: why the author chose a particular word, detail, or structure.
- The written response must require TWO different pieces of text evidence.
- Include one CREATE-YOUR-OWN question: the student writes a strong question about the passage and answers it.
- Include one synthesis question connecting the passage to a bigger idea or another context.
- Multiple choice distractors must be plausible misreadings, not obviously wrong answers.`,
    elaGrammar: `- Include an ERROR ANALYSIS task: a short fictional paragraph containing 2-3 rule errors to find and correct.
- Include CREATE-YOUR-OWN sentence tasks meeting stated conditions, e.g. "write a compound sentence about ______".
- Require students to explain WHY a correction is right by naming the rule.
- Include sentence-combining and revise-for-style items, not just error spotting.
- Multiple choice distractors must reflect near-miss grammar confusions.`,
    writing: `- The prompt must require a specific craft move for this grade, such as dialogue, sensory detail, figurative language, or (for 5th grade opinion) addressing a counter-reason.
- The Brainstorm task must require MORE ideas than needed, then choosing and starring the strongest.
- The Organize task must plan multiple paragraphs, each with a stated job.
- Include one REVISE-IT task: provide a weak sentence and have the student rewrite it stronger.
- Check Your Work items must be about craft quality, not just completeness.
- The Bonus must challenge the student to address a second audience or point of view.`,
    science: `- The written response must require full claim-evidence-reasoning (CER): claim, observed evidence, and the science idea that connects them.
- Include one DESIGN-A-TEST question: the student plans a fair test changing only one variable.
- Include one ERROR ANALYSIS: a fictional student's wrong conclusion from an investigation; find the flaw and correct the reasoning. Write the student's conclusion out in full under the question.
- Include data with one anomaly or outlier the student must notice and address.
- Add a "Going Deeper" prompt connecting this concept to another science topic or real phenomenon.
- Multiple choice distractors must reflect common science misconceptions.`,
    social: `- Include one PERSPECTIVE question: how the same event was experienced differently by two different groups of people.
- Include one cause-and-effect CHAIN: this led to ______, which led to ______.
- Include one COMPARE question between two events, periods, or regions using a stated criterion.
- Include one CREATE-YOUR-OWN task: design a museum exhibit label, a question to ask a historical figure, or a caption for a primary source, with the student's own answer.
- Require an explanation of historical significance: why this still matters today.
- Multiple choice distractors must reflect common history mix-ups.`,
  };

  const diffKey = subjectId === "ela" ? (std.passage ? "elaReading" : "elaGrammar") : subjectId;

  // A graded assessment may not teach the skill it measures. Support becomes
  // accommodations; extension becomes harder reasoning inside the same scored items.
  const assessSupportBody = `- Use the simplest cases of each listed skill that still measure the standard (smaller numbers and simpler cases within this grade).
- Give slightly fewer items overall; every remaining item keeps its stated point value.
- One task per item. No compound directions. Short, plain sentences in every stem.
- Provide generous answer space and spacing.
- Do NOT include any word bank, worked example, hint box, or sentence starter: this is a graded test.`;
  const assessExtendBody = `- Keep the same sections and stated point values; make the thinking harder, not the format different.
- Write stems that require multi-step reasoning and precise academic vocabulary within this grade's standards.
- Every distractor must encode a subtle misconception an advanced student could still make.
- Constructed and extended response items must require justification with evidence or reasoning, scored by the stated points.
- No unscored extras and no create-your-own tasks; every item must be independently scorable.`;

  const supportBody = isAssessment ? assessSupportBody : (supportPlans[diffKey] || supportPlans.math);
  const extendBody = isAssessment ? assessExtendBody : (extendPlans[diffKey] || extendPlans.math);
  const skillsBind = `- Every scaffold and challenge must target the exact skills of this worksheet: ${std.skills.join(", ")}.`;

  // On an assessment, support scaffolds cannot include worked examples or word
  // banks for the skill being measured; that invalidates the score.
  const assessSupportNote = isAssessment ? "\n- ASSESSMENT ACCOMMODATION MODE: this is a graded test. Do NOT include a worked example, word bank, or hint that reveals how to do the skill being measured. Allowed supports are only: fewer items, simpler numbers within the grade, more answer space, one task per line, and plain direction wording." : "";
  const assessExtendNote = isAssessment ? "\n- ASSESSMENT MODE: keep every item independently scorable and keep the stated point values. Depth comes from harder reasoning, not from extra unscored activities." : "";

  const diffStructure = {
    on: "",
    support: `
DIFFERENTIATION REQUIREMENTS (WITH SUPPORT / BELOW GRADE LEVEL) - these are MANDATORY and override the default structure where they conflict:
${supportBody}${isAssessment ? "" : "\n- Reduce the total number of questions slightly so the page does not feel overwhelming."}
${skillsBind}
- ${gg.support}${assessSupportNote}`,
    extend: `
DIFFERENTIATION REQUIREMENTS (EXTENSION / ABOVE GRADE LEVEL) - these are MANDATORY and override the default structure where they conflict:
${extendBody}
${skillsBind}
- ${gg.extend}${assessExtendNote}`,
  };

  const subjectTopics = TOPICS[grade]?.[subjectId] || TOPICS[5].ela;
  const randomTopic = pickFreshTopic(grade, subjectId, subjectTopics);

  // ── Section assembly: subject-shaped structure with running question numbers ──
  const line = "_______________________________________________";
  const hasPassage = !!std.passage;
  let n = 0;
  let pts = 0;
  const next = () => ++n;
  // Point weighting mirrors Smarter Balanced: selected response 1, constructed
  // response 2, extended written response 3.
  const tag = (v) => { if (!isAssessment) return ""; pts += v; return "  (" + v + " point" + (v > 1 ? "s" : "") + ")"; };
  const sec = [];
  const key = [];

  const shortAnswerBlock = (heading, count, hint, extra) => {
    if (count < 1) return;
    const nums = [];
    let t = `[SECTION: ${heading}]\nTYPE: short_answer\n`;
    for (let i = 0; i < count; i++) {
      const q = next(); nums.push(q);
      t += `${q}. (${hint})${tag(2)}${extra ? `  ${extra}` : ""}\n${line}\n${line}\n\n`;
    }
    sec.push(t.trimEnd());
    key.push(`${heading}:\n` + nums.map(q => `${q}. (answer with brief explanation)`).join("\n"));
  };

  const mcBlock = (heading, count) => {
    if (count < 1) return;
    const nums = [];
    let t = `[SECTION: ${heading}]\nTYPE: multiple_choice\n`;
    for (let i = 0; i < count; i++) {
      const q = next(); nums.push(q);
      t += `${q}. (complete question with real content)${tag(1)}\n   A. (option)\n   B. (option)\n   C. (option)\n   D. (option)\n\n`;
    }
    sec.push(t.trimEnd());
    key.push(`${heading}:\n` + nums.map(q => `${q}. (letter) - (why correct; what error each wrong answer represents)`).join("\n"));
  };

  const workBlock = (heading, count, hint) => {
    if (count < 1) return;
    const nums = [];
    let t = `[SECTION: ${heading}]\nTYPE: word_problem\n`;
    for (let i = 0; i < count; i++) {
      const q = next(); nums.push(q);
      t += `${q}. (${hint})${tag(2)}\n\nShow your work:\n[WORK BOX]\n\nAnswer: _______________\n\n`;
    }
    sec.push(t.trimEnd());
    key.push(`${heading}:\n` + nums.map(q => `${q}. (full solution with steps)`).join("\n"));
  };

  const explainBlock = (heading, count, hint) => {
    if (count < 1) return;
    const nums = [];
    let t = `[SECTION: ${heading}]\nTYPE: explain\n`;
    for (let i = 0; i < count; i++) {
      const q = next(); nums.push(q);
      t += `${q}. (${hint})${tag(3)}\n\n${line}\n${line}\n${line}\n${line}\n\n`;
    }
    sec.push(t.trimEnd());
    key.push(`${heading}:\n` + nums.map(q => `${q}. (example of a strong student response)`).join("\n"));
  };

  let directionsHint = "Clear 1-2 sentence student directions";
  let bonusHint = "One harder higher-order thinking challenge question";

  if (subjectId === "writing") {
    // Writing worksheets are built around the writing process, not question drills.
    // On an assessment, the essay is the scored item: SBAC scores writing on a
    // rubric (Purpose/Organization 4, Evidence/Elaboration 4, Conventions 2),
    // not per-question points, and self-check scaffolds do not belong on a test.
    directionsHint = `State the FULL writing prompt here in student-friendly ${gradeLabel} grade words. This is the writing task the whole page is about`;
    bonusHint = "One optional challenge upgrade for early finishers, like adding dialogue, a stronger hook, or a precise sensory detail";
    const q1 = next(), q2 = next();
    const planNote = isAssessment ? " (planning space, not scored)" : "";
    sec.push(`[SECTION: Plan Your Writing]\nTYPE: word_problem\n${q1}. Brainstorm${planNote}: (a short task telling students to list their ideas, details, or reasons for THIS prompt inside the box)\n\n[WORK BOX]\n\n${q2}. Organize${planNote}: (a short task telling students to put their ideas in order: beginning/middle/end for narrative, opinion plus reasons for opinion, topic plus grouped facts for informative)\n\n[WORK BOX]\n`);
    key.push(`Plan Your Writing:\n${q1}. (sample brainstorm notes a strong student might write)\n${q2}. (a sample organizer for this prompt)`);
    const q3 = next();
    const draftTag = isAssessment ? "  (10 points, scored with the rubric in the answer key)" : "";
    sec.push(`[SECTION: Write Your Draft]\nTYPE: explain\n${q3}. (restate the writing task in one sentence and tell students to write their full response on the lines below)${draftTag}\n\n${(line + "\n").repeat(gs.draftLines).trimEnd()}\n`);
    if (isAssessment) {
      pts = 10;
      key.push(`Write Your Draft:\n${q3}. (a 3-4 sentence sample excerpt of a strong ${gradeLabel} grade response to THIS prompt)`);
      key.push(`Scoring Rubric (10 points total), aligned to ${std.codes}:\nPurpose & Organization (0-4): (describe what a 4, a 3, a 2, and a 1 look like for THIS prompt at ${gradeLabel} grade)\nEvidence & Elaboration (0-4): (describe what a 4, a 3, a 2, and a 1 look like for THIS prompt)\nConventions (0-2): (describe what earns 2, 1, and 0 for ${gradeLabel} grade conventions)`);
    } else {
      key.push(`Write Your Draft:\n${q3}. (describe what a strong ${gradeLabel} grade response includes for ${std.codes}, then give a 3-4 sentence sample excerpt)`);
      const checkNums = [];
      let t = `[SECTION: Check Your Work]\nTYPE: short_answer\n`;
      for (let i = 0; i < 3; i++) {
        const q = next(); checkNums.push(q);
        t += `${q}. (a yes/no self-check item tied to ${std.codes}, written as a question the student answers about their own draft)   YES / NO\n${line}\n\n`;
      }
      sec.push(t.trimEnd());
      key.push(`Check Your Work:\n` + checkNums.map(q => `${q}. (what this check item verifies and what a fix looks like)`).join("\n"));
    }
  } else if (subjectId === "ela" && hasPassage) {
    // Reading worksheets are built around the passage: comprehension, evidence, vocabulary, response.
    mcBlock(isAssessment ? "Part 1: Selected Response" : "Check Understanding", mcCount);
    shortAnswerBlock(isAssessment ? "Part 2: Constructed Response" : "Find the Evidence", pp.apply, "question that requires quoting or citing a specific detail, sentence, or example from the passage");
    shortAnswerBlock(isAssessment ? "Part 3: Vocabulary in Context" : "Vocabulary in Context", pp.warm, "question about a word or phrase from the passage: its meaning from context, or literal vs nonliteral use");
    explainBlock(isAssessment ? "Part 4: Extended Response" : "Written Response", pp.explain, "question requiring a written response about the passage with evidence to support the answer");
  } else {
    // Math, Science, Social Studies, and non-passage ELA (grammar) share the classic arc with subject-shaped applied sections.
    const applyPlans = {
      math:    { heading:"Show Your Work",         type:"work",  hint:"multi-step word problem with a real-world context and real numbers" },
      science: { heading:"Investigate & Apply",    type:"work",  hint:"scenario or data-based problem where students apply the science idea, interpret an investigation, or work with simple data" },
      social:  { heading:"Think Like a Historian", type:"short", hint:"application question asking students to explain cause and effect, compare, sequence events, or connect history to their community" },
      ela:     { heading:"Apply the Rule",         type:"short", hint:"question where students apply the language rule: fix a sentence, choose the correct form, or write their own example" },
    };
    const ap = applyPlans[subjectId] || applyPlans.math;
    if (!isAssessment) shortAnswerBlock("Warm-Up", pp.warm, "quick warm-up question that activates prior knowledge of this skill");
    mcBlock(isAssessment ? "Part 1: Selected Response" : "Multiple Choice", mcCount);
    const applyHead = isAssessment ? "Part 2: Constructed Response" : ap.heading;
    if (ap.type === "work") workBlock(applyHead, pp.apply, ap.hint);
    else shortAnswerBlock(applyHead, pp.apply, ap.hint);
    explainBlock(isAssessment ? "Part 3: Explain Your Reasoning" : "Explain Your Thinking", pp.explain, "question requiring explanation of a strategy, method, or reasoning");
  }

  const totalQuestions = n;
  const totalPoints = pts;

  // Assessment and cognitive-depth rules, modeled on Smarter Balanced item design.
  const dokRules = ((pp.dok || isAssessment) && subjectId !== "writing") ? `
COGNITIVE DEPTH (required): spread the items across depth of knowledge levels the way well-built assessments do. Do NOT write every item at recall level.
- About one third at DOK 1: recall and routine procedure.
- About one third at DOK 2: apply a skill in a described situation, interpret data, or use more than one step.
- The rest at DOK 3: reason, justify, compare strategies, or explain why something works.
- Every multiple choice distractor must be an answer a real ${gradeLabel} grader would actually pick because of a specific misconception, never filler.` : "";

  const assessmentRules = isAssessment ? `
ASSESSMENT INTEGRITY (required, this is a graded test):
- ${assessContext[grade] || assessContext[4]}
- Items must be INDEPENDENT. No item may reveal the answer to another item.
- No hints, no word banks, no worked examples, no sentence starters, and no reminder boxes anywhere on the student pages.
- Directions state only what to do, never how to do it.
- Every item must measure the listed standards directly. Do not test reading ability in a math assessment or test unrelated background knowledge.
- Point values are already written into each item. Do not change them.
- The final [SECTION: Scoring] block must contain only the total score line exactly as specified.

ANSWER KEY REQUIREMENTS FOR THIS ASSESSMENT:
- ${subjectId === "writing" ? "Fill in the Scoring Rubric with concrete, observable descriptors for each level, specific to THIS prompt." : "For every constructed and extended response item, give a scoring guide stating what earns full points and what earns partial credit."}
- End the answer key with a proficiency guide using the four California reporting levels, converted to this test\u0027s ${totalPoints} points, in this exact form:
  Standard Exceeded: (point range)
  Standard Met: (point range)
  Standard Nearly Met: (point range)
  Standard Not Met: (point range)` : "";

  // CAST (California Science Test) is phenomenon-based and three-dimensional,
  // structurally different from SBAC. Only 5th grade takes it.
  const castRules = (grade === 5 && subjectId === "science" && (isAssessment || purpose === "review")) ? `
CAST STRUCTURE (5th grade science): The California Science Test is phenomenon-based and three-dimensional.
- Open the applied section with a short real-world phenomenon or investigation scenario written out in plain text (2-4 sentences), and attach the following items to it.
- Each item should pair a science practice (interpreting data, constructing an explanation, describing a model in words) with the core idea being assessed.
- Include at least one item that asks students to use evidence from the scenario to explain WHY the phenomenon happens.` : "";

  // A select-all item is only meaningful if some options are true and some are
  // false. Without an explicit count, the model tends to satisfy "give 5
  // choices" by listing several correct variations (easiest when the skill
  // itself is about equivalence, like fractions), which produces a key where
  // every option is marked correct and defeats the point of the item.
  const selectAllRules = pp.selectAll ? `
SELECT-ALL-THAT-APPLY ITEM (required, exactly one such item on this worksheet): make ONE multiple choice question a select-all-that-apply item with 5 choices, labeled A. through E., with the select-all instruction inside the question text.
- EXACTLY 2 or 3 of the 5 options are correct. Never 1, never 4, never 5, never 0.
- Each correct option must be independently, genuinely true.
- Each incorrect option must be a plausible near-miss reflecting a real misconception for this skill, not an obviously wrong throwaway. If the skill is equivalence or comparison (like equivalent fractions), a wrong option should look like it could be equivalent but is not, not simply an unrelated number.
- Before writing the answer key for this item, count how many options you marked correct. If the count is not 2 or 3, revise the options until it is.
- The answer key must state exactly which letters are correct AND explain why each of the remaining letters is wrong.
- Decide the correct letters SILENTLY before writing this entry. Write the final letters exactly ONCE. Never show an earlier guess, never write a different letter combination first and revise it, and never write the word "actually" in this entry. If you find yourself reconsidering while writing, stop, restart the entry from scratch, and write only the final version.` : "";

  const sectionText = sec.join("\n\n");
  const keyText = key.join("\n\n");

  return `You are creating a complete ${gradeLabel} grade California standards-aligned worksheet. Output ONLY structured plain text using exactly the section markers below. Follow the structure EXACTLY - do not move, rename, or skip any block. ${isAssessment ? `This is a GRADED ASSESSMENT with exactly ${totalQuestions} scored items worth ${totalPoints} total points.` : `This worksheet has exactly ${totalQuestions} numbered questions plus one bonus.`}

DETAILS:
- Grade: ${gradeLabel} Grade
- Subject: ${subjectId.toUpperCase()} - ${resourceType}
- Standards: ${std.codes}
- Focus: ${std.focus}
- Skills: ${std.skills.join(", ")}
- Purpose: ${reviewGuide}
- Difficulty: ${diffGuide[difficulty] || diffGuide.on}
${topic ? `- Topic: ${topic}` : ""}

EXACT STRUCTURE - copy these markers verbatim, fill in content only inside the parentheses:

[TITLE]
(Engaging specific title)

[SUBTITLE]
${gradeLabel} Grade · ${subjectId.toUpperCase()} · ${std.codes}

[DIRECTIONS]
(${directionsHint})

${difficulty === "support" ? `[SUPPORT BOX]
(Write ONLY the word bank, helpful hints, or rules box content here, whichever fits this subject: vocabulary, formulas, or the target rule(s), with a short title line like "Word Bank" or "Helpful Hints" or "Rules Box" as the first line, then the content on its own lines below. This is the ONLY place this content appears. Do NOT repeat any part of it inside the Directions, the Passage, Question 1, or anywhere else on the worksheet.)

` : ""}${hasPassage ? `[PASSAGE]
(YOUR PASSAGE TITLE IN ALL CAPS)
(Your original ${gs.passageWords} word passage goes here. ${gs.passageStyle} Write ONLY the passage text. No instructions. No brackets. No placeholders. Real sentences only. Start writing the passage immediately after the title line.)

` : ""}${sectionText}

${isAssessment ? `[SECTION: Scoring]
TYPE: short_answer
(Do not write questions here. Write exactly this line and nothing else: Total Score: ______ out of ${totalPoints} points)
` : `[BONUS]
(${bonusHint})

${line}
${line}
${line}
`}
[ANSWER KEY]
${keyText}

Bonus: (full solution or sample response)

[TEACHER NOTES]
Standards: ${std.codes}
Tips: (2-3 sentences on differentiation, misconceptions, suggested use)

${dokRules}${castRules}${selectAllRules}${assessmentRules}

NO DUPLICATION (required): every box, sentence, and example appears exactly ONCE, in the one place the template puts it. Never restate the Support Box content, the passage, or a worked example a second time anywhere else on the page, including inside the Directions.

QUESTION TEXT ACCURACY (required): decide every number, name, and value BEFORE writing a question, not while writing it. Write each question ONCE, cleanly, in its final form. Never write a placeholder, a wrong number, or a partial sentence and then correct it in front of the reader anywhere on the student-facing page, including the Directions, the Support Box, and every question. The words "wait," "let me," "hold on," and "actually" are FORBIDDEN in question text, not only in the answer key.
- Any answer option or question stem that makes a specific numeric CLAIM (a ratio, "N times as great," a comparison, a sum, an equality) must be computed and verified BEFORE it is written, the same way you verify the answer key. If an option you were about to write turns out to be arithmetically false when you check it, do not write that option and rationalize it afterward: replace it with a number that makes the claim genuinely true, or with a clearly wrong distractor that is not presented as correct. This applies especially to place value "value of this digit compared to that digit" comparison questions, where a false multiplier is a common and avoidable mistake.
- For any "mystery number" or multi-clue problem where several clues together describe one number (a common Bonus format): pick the real number FIRST, then write clues that truthfully describe it, in that order. Never invent clues independently and hope they agree. Every clue must describe a DIFFERENT place value; two clues may never assign two different digits to the same place. Before finalizing, solve your own clues from scratch and confirm they produce exactly one number with no conflicts.

ITEM SOLVABILITY (required, check BEFORE writing the question, not in the key):
- For select-all-that-apply items: evaluate all five options for truth FIRST, before writing any of them onto the page. Count the true ones. If the count is not exactly 2 or 3, change the options themselves until it is, then write the item once in its final form. Never write five options and discover afterward that all five are true.
- For "mystery number" and multi-clue items: pick the actual number FIRST, then write clues that describe it. Never write a clue that multiplies, adds to, or derives one digit from another unless you have computed the result and confirmed it is a single digit from 0 to 9. A clue requiring a digit of 10 or more is unsolvable and must never be written.
- For any item that asks students to ORDER or COMPARE results: compute the results first and confirm they are actually different. An ordering question whose values all come out equal is a broken item.
- If you discover mid-writing that an item cannot work, DELETE it and write a different item. Never keep a broken item.

NEVER DELEGATE REPAIRS (required): the worksheet and key you output must be ready to print exactly as written. Never write a note telling the teacher to correct, replace, or substitute anything before use. Never describe an option as needing a corrected version. Never state that a question as printed has a flaw. If an item is flawed, fix the item itself before you output it. A note to the teacher about a broken question is a failed generation, not a solution.

THE KEY MUST MATCH THE PAGE (required): if while writing the answer key you discover a question has no valid single answer, do not keep writing about it. Stop, go back, and rewrite the question stem and all of its options on the page itself, choosing numbers that make the item solvable. Then write a key for that new version. Never leave the printed question and options unchanged while your key discussion drifts onto different numbers, a different digit, or a different comparison than what is actually printed. The key's numbers, options, and the value it names as correct must all be numbers that genuinely appear in the printed question. If they don't match, you have answered a question that does not exist on the page, and the worksheet is unusable no matter how correct the key's own math is.

ANSWER ACCURACY (required):
- Work every problem yourself BEFORE writing the answer key, and write the key from that work.
- Recheck every calculation. A wrong answer key is worse than a hard worksheet.
- Do ALL of this checking silently. The worksheet text must show ONLY the single, final, correct answer for each question. Never write your process of checking or fixing an answer into the output.
- FORBIDDEN in the output: the words "wait," "recheck," "let me," "actually," "hold on," "correction," "revise," "revising," "revised," "re-examine," "reconsider," or any sentence that second-guesses or revises an answer in front of the reader. If you catch a mistake, silently fix it and write only the corrected version.
- Every option letter gets ONE verdict in the answer key, correct or incorrect, stated once. Never call the same letter correct in one place and incorrect in another, even while explaining your reasoning.
- Whatever answer or letter you state FIRST in a key entry must BE the final answer. Never open an entry with one answer and conclude with a different one; decide the correct answer before writing the entry, not while writing it.
- Each question number appears in the answer key EXACTLY ONCE. Never write the same question number twice, even to show a fix.
- The key must answer EVERY numbered question, using the same numbers, in the same order, and nothing that is not on the worksheet.
- For multiple choice, the letter in the key must match the letter of the correct option as written in the question.
- Make sure exactly one option is defensibly correct for single-answer multiple choice.
- No two answer choices on the same question may have the same text or the same value. Every option must be distinct.
- For select-all-that-apply items, the correct set must be a genuine mix: never mark every offered choice correct, never mark none correct. State exactly which letters are correct and explain why each excluded letter is wrong.
- For error-analysis items, the mistake you discuss in the answer key must be the EXACT scenario, numbers, and error shown in the question on the worksheet. Never invent a different mistake or change the numbers when writing the key.

RULES:
- No placeholder text ever. Real content, numbers, and scenarios only.
- Every question must be COMPLETE: full question text, every answer choice, and any data, pattern, table, or student work written out in full. Never reference a table, chart, picture, or work sample that is not fully written into the text.
- Write any table or pattern as simple labeled text lines directly under the question (example: "Bags: 2, 4, 6, 8" then "Apples: 12, 24, 36, 48"). This worksheet is plain text; nothing can be drawn.
- For select-all-that-apply questions, put the select-all instruction inside the numbered question text itself and label the choices A. through E.
- Student-friendly tone for ${gradeLabel} grade: ${gs.tone}.
- Every question must stay within the ${gradeLabel} grade standards listed above. Do not drift above or below grade level.
- CRITICAL VARIATION RULE: Every generation must feel completely fresh and different. Never reuse the same passage topic, scenario, character names, or context from previous generations.
- For passages: use the assigned topic below. Do not default to generic topics.
- For applied problems: use different student names, places, and scenarios every time, with California contexts where natural.
- Generate as if this is the first and only time you are creating this type of worksheet.
- TOPIC FOR THIS WORKSHEET: ${randomTopic}. Build your passage, scenarios, and examples around this specific topic.${diffStructure[difficulty] || ""}`;
}

function inferType(heading) {
  const h = heading.toLowerCase();
  // Engine v2 section names first, so the fallback matches what we actually ask for.
  if (h.includes("multiple choice") || h.includes("multiple-choice") || h.includes("check understanding")) return "multiple_choice";
  if (h.includes("show your work") || h.includes("investigate") || h.includes("plan your writing") || h.includes("word problem")) return "word_problem";
  if (h.includes("written response") || h.includes("write your draft") || h.includes("explain") || h.includes("thinking")) return "explain";
  if (h.includes("warm")) return "short_answer";
  if (h.includes("true") || h.includes("false")) return "true_false";
  if (h.includes("fill") || h.includes("blank")) return "fill_blank";
  return "short_answer";
}

// The model is instructed to verify its work silently, but that instruction can
// be ignored: it sometimes writes its live self-correction into the answer key
// ("Wait, let me recheck... Correction: ...") and repeats the question number a
// second time. This detects that pattern in code and removes it deterministically,
// keeping only the LAST occurrence of any duplicated number, since the later one
// is the corrected version in every observed case.
function cleanAnswerKey(text) {
  if (!text) return text;
  const lines = text.split("\n");
  const blocks = [];
  let current = { num: null, lines: [] };
  for (const line of lines) {
    const m = line.match(/^\s*(\d+)[.)]\s/);
    if (m) {
      if (current.lines.length) blocks.push(current);
      current = { num: m[1], lines: [line] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length) blocks.push(current);

  const lastIndexForNum = {};
  blocks.forEach((b, i) => { if (b.num) lastIndexForNum[b.num] = i; });
  const kept = blocks.filter((b, i) => !b.num || lastIndexForNum[b.num] === i);

  let cleaned = kept.map((b) => b.lines.join("\n")).join("\n");
  // Safety net for a stray correction line that landed outside any numbered block.
  cleaned = cleaned.replace(/^[ \t]*Correction:.*$/gim, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
  return cleaned;
}

// Splits the answer key into logical blocks (one per numbered item or labeled
// heading). Rendering these as separate elements lets a PDF page break land
// BETWEEN blocks. As one tall <pre>, the rasterizer had no choice but to slice
// straight through a line of text at an arbitrary pixel.
function answerKeyBlocks(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const blocks = [];
  let current = [];
  const flush = () => { if (current.join("\n").trim()) blocks.push(current.join("\n")); current = []; };
  for (const line of lines) {
    const startsItem = /^\s*\d+[.)]\s/.test(line);
    const startsHeading = /^[A-Z][^\n]{0,60}:\s*$/.test(line.trim()) || /^(Bonus|Proficiency Guide|Scoring Rubric|Scoring Guide)\b/i.test(line.trim());
    if ((startsItem || startsHeading) && current.length) flush();
    current.push(line);
  }
  flush();
  return blocks;
}

function parseWorksheet(text) {
  const get = (tag) => {
    const re = new RegExp(`\\[${tag}\\][^\\n]*\\n([\\s\\S]*?)(?=\\n\\[(?:TITLE|SUBTITLE|DIRECTIONS|SUPPORT BOX|PASSAGE|SECTION|BONUS|ANSWER|TEACHER)|$)`, "i");
    const m = text.match(re);
    return m ? m[1].trim() : "";
  };

  // Step 1: Get raw passage block
  let passage = get("PASSAGE");

  // Step 2: Clean out any instruction artifacts
  if (passage) {
    passage = passage
      .replace(/^\s*CRITICAL:[^\n]*\n?/gim, "")
      .replace(/^\s*RULE:[^\n]*\n?/gim, "")
      .replace(/^\s*IMPORTANT:[^\n]*\n?/gim, "")
      .replace(/^\s*Write your original passage[^\n]*\n?/gim, "")
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
      const between = text.slice(dirIdx, secIdx);
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

  const sections = [];
  const sectionRe = /\[SECTION:\s*([^\]]+)\][^\n]*\n(?:TYPE:\s*(\w+)[^\n]*\n)?([\s\S]*?)(?=\n\[SECTION:|\n\[BONUS|\n\[ANSWER|\n\[TEACHER|$)/gi;
  let m;
  while ((m = sectionRe.exec(text)) !== null) {
    const heading = m[1].trim();
    let type = m[2] ? m[2].trim() : inferType(heading);
    const rawContent = m[3].trim();
    if (rawContent.startsWith("[SECTION:") || rawContent.startsWith("TYPE:")) continue;
    sections.push({ heading, type, content: rawContent });
  }

  if (sections.length === 0) {
    const altRe = /\*\*([A-Z][^*]+)\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*[A-Z]|\n\[BONUS|\n\[ANSWER|$)/gi;
    while ((m = altRe.exec(text)) !== null) {
      const heading = m[1].trim();
      sections.push({ heading, type: inferType(heading), content: m[2].trim() });
    }
  }

  // Deterministic cleanup. The model is instructed to put word banks, hint
  // boxes, and rules boxes only in [SUPPORT BOX], but instructions are a request,
  // not a guarantee: it often writes them into the directions as well, producing
  // the same content twice on the page. Anything that looks like a box header is
  // cut out of the directions here, in code, and recovered into supportBox if the
  // marker was skipped entirely. Real directions are 1-2 sentences.
  const BOX_HEADER = /(?:[\u2014\u2013\-_=]{3,}\s*(?:\u{1F9E0}|\u{1F4E6}|\u2b50|\u2605)?\s*\b(?:HINT BOX|WORD BANK|HELPFUL HINTS?|RULES BOX|REMEMBER BOX|KEY WORDS|VOCABULARY BOX|EXAMPLE BOX|WORKED EXAMPLE)\b|(?:^|\n)[^\S\n]*(?:\u{1F9E0}|\u{1F4E6}|\u2b50|\u2605)?\s*\b(?:HINT BOX|WORD BANK|HELPFUL HINTS?|RULES BOX|REMEMBER BOX|KEY WORDS|VOCABULARY BOX|EXAMPLE BOX|WORKED EXAMPLE)\b|\b(?:HINT BOX|WORD BANK|HELPFUL HINTS?|RULES BOX|REMEMBER BOX|KEY WORDS|VOCABULARY BOX|EXAMPLE BOX|WORKED EXAMPLE)\b\s*:)/iu;
  let directions = get("DIRECTIONS");
  let supportBox = get("SUPPORT BOX");
  const strayBox = directions.match(BOX_HEADER);
  if (strayBox) {
    const cut = strayBox.index;
    const stray = directions.slice(cut).trim();
    directions = directions.slice(0, cut).trim();
    // Only recover the stray text if the dedicated block is missing or is a
    // near-duplicate of it, so genuine box content is never lost.
    if (!supportBox || supportBox.length < stray.length) supportBox = stray;
  }
  // Strip leading rule lines the model draws around boxes, which render as junk.
  supportBox = supportBox
    .split("\n")
    .filter((l) => !/^[\s\u2014\u2013\-_=\u2500-\u257F]*$/.test(l) || !l.trim())
    .join("\n")
    .replace(/^\s*[\u2014\u2013\-_=]{3,}\s*/, "")
    .trim();

  // Same leakage can happen as a PREFIX inside a section's content instead of
  // inside Directions, most often the first section (for example just before
  // "1. Brainstorm..." on a Writing worksheet). Strip it there too. Only the
  // portion before the first real numbered item is ever touched.
  sections.forEach((sec) => {
    const boxMatch = sec.content.match(BOX_HEADER);
    if (!boxMatch) return;
    const firstQIdx = sec.content.search(/^\s*\d+[.)]\s/m);
    if (firstQIdx <= 0 || boxMatch.index >= firstQIdx) return;
    const strayLead = sec.content
      .slice(0, firstQIdx)
      .split("\n")
      .filter((l) => !/^[\s\u2014\u2013\-_=\u2500-\u257F]*$/.test(l) || !l.trim())
      .join("\n")
      .replace(/^\s*[\u2014\u2013\-_=]{3,}\s*/, "")
      .trim();
    if (!supportBox || supportBox.length < strayLead.length) supportBox = strayLead;
    sec.content = sec.content.slice(firstQIdx).replace(/^\n+/, "");
  });

  return {
    title: get("TITLE"),
    subtitle: get("SUBTITLE"),
    directions,
    supportBox,
    passage,
    sections,
    bonus: get("BONUS"),
    answerKey: cleanAnswerKey(get("ANSWER KEY")),
    teacherNotes: get("TEACHER NOTES"),
  };
}

// Flags the failure modes we have actually seen: cut-off generations, empty
// question stems, and multiple choice questions missing their answer choices.
// Cross-checks the answer key against the actual questions. This cannot judge
// whether an answer is conceptually right, but it reliably catches keys that
// skip items, answer items that do not exist, or name a choice that was never
// offered, which are the errors a teacher notices first.
// Extracts every letter-group in the text that is explicitly tied to "correct"
// language ("A and C are correct", "correct answers: A, C", "the answer is B"),
// in the order they appear, normalized (sorted, uppercase, no separators).
// Shared by the select-all checks and the fraction verifier below.
// Every round of testing finds new vocabulary the model uses to narrate a
// mid-generation change of mind: "wait," then "actually," now "re-reading,"
// "resolving:," "re-examine," "conflict," "corrected interpretation." A single
// shared list means every scan site updates together instead of drifting.
function hasHedgeLanguage(text) {
  return /\b(wait|let me|hold on|actually|re-?reading|re-?examin\w*|corrected interpretation)\b|\bresolving:|:\s*(revising|correcting|resolving|re-?examin\w*)\b/i.test(text || "");
}

// A categorically different failure from hedge language: the model discovers a
// genuine construction error in its own question (options that are all true, a
// clue requiring a digit above 9) and, instead of silently rewriting the item,
// ships it broken and writes repair instructions to the teacher in the answer
// key. The worksheet is unusable as printed, so this must never be savable.
// Structural signal, not a vocabulary list: these are all phrasings that
// address the teacher as someone who must edit the page before use.
function hasTeacherRepairInstruction(text) {
  return /\b(NOTE TO TEACHER|construction error|internal conflict|cannot be satisfied|before (?:distributing|printing)|when administering|administer with|corrected (?:version|distractor|bonus)|teachers? should replace)\b/i.test(text || "");
}

// A digit-group comma immediately fused to a letter, with no space, is
// essentially never valid: as a thousands separator a comma is followed by
// more digits ("4,842"); as ordinary punctuation it's followed by a space
// ("Maria, who..."). A comma landing directly on a letter is a strong signal
// of a corrupted or interrupted token (a number the model started, then
// glitched into unrelated text mid-word), independent of whether visible
// self-correction narration happens to follow it. This structural check
// catches that failure mode even when no hedge word ever appears.
function hasCorruptedNumber(text) {
  return /\d,[A-Za-z]/.test(text || "");
}

function keyLetterGroups(text, onlySetClaims) {
  const LETLIST = "[A-F]\\b(?:\\s*,?\\s*(?:and\\s+|&\\s*)?[A-F]\\b)*";
  const individualPattern = "\\b(" + LETLIST + ")\\s*(?:\\([^)]*\\))?\\s+(?:is|are)\\s+(?:all\\s+)?correct\\b";
  const summaryPattern = "correct\\s+(?:answers?|choices?):?\\s*\\(?(" + LETLIST + ")\\)?|(?:the\\s+)?answers?\\s+(?:is|are)\\s*:?\\s*\\(?(" + LETLIST + ")\\)?";
  const re = new RegExp(individualPattern + "|" + summaryPattern, "gi");
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const letters = (m[1] || m[2] || m[3] || "").match(/\b[A-F]\b/gi);
    if (!letters) continue;
    // A single letter stated individually ("A is correct.") is one fact among
    // several, not a competing candidate answer set, and should never be
    // treated as evidence of revision. Only a multi-letter claim or an
    // explicit "correct answers:" style summary genuinely proposes a full
    // set worth comparing against other proposed sets.
    const isSummaryMatch = m[2] !== undefined || m[3] !== undefined;
    if (onlySetClaims && !isSummaryMatch && letters.length < 2) continue;
    out.push(letters.map((x) => x.toUpperCase()).sort().join(""));
  }
  return out;
}

// Fraction equivalence is exact, bounded math: cross-multiplication either
// matches or it does not. Unlike arbitrary word-problem arithmetic, REX can
// verify this specific class of item directly instead of trusting the model's
// own claim about which options are equivalent, which has been the source of
// two separate real errors (marking everything correct, and quietly excluding
// a genuinely correct option like 3/6 from a 2/4-equivalence question).
function checkFractionEquivalence(parsed, extractTarget) {
  const w = [];
  if (!parsed || !parsed.answerKey || !parsed.sections.length) return w;
  parsed.sections.forEach((sec) => {
    const lines = sec.content.split("\n").map((l) => l.trim());
    let qNum = null, qText = "", optLines = [], seenOption = false;
    const flush = () => {
      if (!qNum) return;
      const target = extractTarget(qText);
      if (!target) return;
      const { n: tn, d: td } = target;
      const options = {};
      // Option lines can carry trailing text (a point value, a note), not just
      // the bare fraction, so only the leading fraction is required, not an
      // exact end-of-line match.
      optLines.forEach((l) => {
        const om = l.match(/^([A-F])\.\s*(\d+)\s*\/\s*(\d+)\b/);
        if (om) options[om[1]] = { n: parseInt(om[2]), d: parseInt(om[3]) };
      });
      if (!Object.keys(options).length) return;
      const keyBlockMatch = parsed.answerKey.match(new RegExp("(?:^|\\n)\\s*" + qNum + "[.)][^\\n]*(?:\\n(?!\\s*\\d+[.)]).*)*", ""));
      if (!keyBlockMatch) return;
      const groups = keyLetterGroups(keyBlockMatch[0]);
      const single = keyBlockMatch[0].match(/^\s*\d+[.)]\s*\(?([A-F])\b/);
      const unioned = new Set();
      groups.forEach((g) => g.split("").forEach((ch) => unioned.add(ch)));
      const keyCorrect = unioned.size ? unioned : (single ? new Set([single[1].toUpperCase()]) : new Set());
      if (!keyCorrect.size) return;
      Object.entries(options).forEach(([letter, frac]) => {
        const isEquiv = frac.n * td === frac.d * tn;
        const markedCorrect = keyCorrect.has(letter);
        if (isEquiv && !markedCorrect) w.push("Question " + qNum + ": option " + letter + " (" + frac.n + "/" + frac.d + ") is mathematically equal to " + tn + "/" + td + ", but the key does not mark it correct.");
        if (!isEquiv && markedCorrect) w.push("Question " + qNum + ": option " + letter + " (" + frac.n + "/" + frac.d + ") is NOT equal to " + tn + "/" + td + ", but the key marks it correct.");
      });
    };
    lines.forEach((l) => {
      const qm = l.match(/^(\d+)\.\s(.*)/);
      if (qm) { flush(); qNum = qm[1]; qText = qm[2]; optLines = []; seenOption = false; return; }
      // A long question stem can wrap onto a second line before the options
      // start; the target phrase ("equal to 4/6") can land on either line, so
      // keep accumulating stem text until the first real option line appears.
      const isOptLine = /^[A-F]\.\s*\S/.test(l);
      if (isOptLine) seenOption = true;
      else if (!seenOption && l) qText += " " + l;
      optLines.push(l);
    });
    flush();
  });
  return w;
}

function fractionEquivalenceWarnings(parsed) {
  return checkFractionEquivalence(parsed, (qText) => {
    const m = qText.match(/(?:equal(?:s)?|equivalent)\s+(?:to\s+)?(?:the\s+fraction\s+)?(\d+)\s*\/\s*(\d+)/i);
    if (!m) return null;
    const tn = parseInt(m[1]), td = parseInt(m[2]);
    return tn && td ? { n: tn, d: td } : null;
  });
}

// Decimal-to-fraction equivalence (e.g. "which fraction equals 0.47?") is just
// as common in the 4.NF standards and just as exactly checkable: convert the
// decimal to an exact fraction (0.47 -> 47/100) and reuse the same
// cross-multiplication core rather than duplicating the option/key extraction.
function decimalFractionEquivalenceWarnings(parsed) {
  return checkFractionEquivalence(parsed, (qText) => {
    const m = qText.match(/(?:(?:equal(?:s)?|equivalent)\s+(?:to\s+)?|represents?\s+|(?:is\s+)?the\s+same\s+as\s+)(?:the\s+decimal\s+)?(\d*\.\d+)/i);
    if (!m) return null;
    const decMatch = m[1].match(/^(\d*)\.(\d+)$/);
    if (!decMatch) return null;
    const whole = parseInt(decMatch[1] || "0", 10);
    const fracDigits = decMatch[2];
    const denom = Math.pow(10, fracDigits.length);
    const num = whole * denom + parseInt(fracDigits, 10);
    return { n: num, d: denom };
  });
}

// Word-list bans on "wait," "revising," etc. are a losing game: the model can
// always reach for a new synonym. This detects the actual INVARIANT a broken
// key violates instead: the same option letter should never be called both
// correct and incorrect within one entry, no matter what words surround it.
function contradictionWarnings(parsed) {
  const w = [];
  if (!parsed || !parsed.answerKey) return w;
  const blocks = [];
  let cur = { num: null, text: "" };
  parsed.answerKey.split("\n").forEach((l) => {
    const m = l.match(/^\s*(\d+)[.)]\s/);
    if (m) { if (cur.num) blocks.push(cur); cur = { num: m[1], text: l }; }
    else cur.text += "\n" + l;
  });
  if (cur.num) blocks.push(cur);

  blocks.forEach((b) => {
    const chunks = b.text.split(/(?<=[.!?])\s+|\n+/);
    const verdicts = {};
    chunks.forEach((chunk) => {
      const letterMatch = chunk.match(/\b([A-F])\b/);
      if (!letterMatch) return;
      const letter = letterMatch[1].toUpperCase();
      const isNeg = /\b(?:is|are)\s+(?:not\s+correct|incorrect|wrong)\b/i.test(chunk);
      const isPos = /\b(?:is|are)\s+correct\b/i.test(chunk);
      if (isNeg) (verdicts[letter] = verdicts[letter] || new Set()).add("incorrect");
      if (isPos) (verdicts[letter] = verdicts[letter] || new Set()).add("correct");
    });
    Object.entries(verdicts).forEach(([letter, set]) => {
      if (set.has("correct") && set.has("incorrect")) {
        w.push("Question " + b.num + ": option " + letter + " is called both correct and incorrect within the same answer key entry, which usually means visible self-correction survived into the output.");
      }
    });
  });
  return w;
}

// Directly compares any fraction the key restates for a letter (like "D
// (6/10)") against what that letter's option ACTUALLY says on the printed
// worksheet, independent of whether either value happens to be equivalent to
// a target fraction. This catches a transcription mismatch even when no
// "equal to N/D" phrasing is present for the fraction-equivalence checker to
// key off of.
// A word problem that asks students to ORDER or RANK several computed or
// rounded values only makes sense if the values actually differ. If the
// model's own key concludes the values are equal/tied, the item has no
// answer and was never validated before being written, exactly the kind of
// unsolvable-item defect the prompt now asks the model to catch pre-write.
// This catches it post-write too, since a prompt rule alone isn't enforcement.
// The most severe failure this session: the key drifts entirely off the
// printed question, discussing different numbers and options than what's on
// the page, and states a "final" answer that matches nothing a student could
// have selected. Detecting this precisely is hard, since the messy middle of
// a spiral often still mentions the original numbers before drifting away, so
// this checks only the LAST substantial stretch of each key entry (where a
// "final answer" declaration actually lives) against the numbers genuinely
// printed in that question's stem and options. This is intentionally
// conservative: it only fires when the ending is completely disconnected
// from the page, not on every mid-entry aside that mentions another number.
function keyMatchesQuestionWarnings(parsed) {
  const w = [];
  if (!parsed || !parsed.answerKey || !parsed.sections.length) return w;
  const bigNum = /\b\d{1,3}(?:,\d{3})+\b/g;
  parsed.sections.forEach((sec) => {
    if (sec.type !== "multiple_choice") return;
    const lines = sec.content.split("\n");
    let qNum = null, qText = "";
    lines.forEach((l) => {
      const m = l.match(/^(\d+)\.\s+(.*)/);
      if (m) { qNum = m[1]; qText = l; }
      else if (qNum) qText += "\n" + l;
    });
    if (!qNum) return;
    const printedNums = new Set((qText.match(bigNum) || []));
    if (!printedNums.size) return;
    const blocks = [];
    let cur = { num: null, text: "" };
    parsed.answerKey.split("\n").forEach((l) => {
      const bm = l.match(/^\s*(\d+)[.)]\s/);
      if (bm) { if (cur.num) blocks.push(cur); cur = { num: bm[1], text: l }; }
      else cur.text += "\n" + l;
    });
    if (cur.num) blocks.push(cur);
    const match = blocks.find((b) => b.num === qNum);
    if (!match) return;
    const tail = match.text.slice(-260);
    const tailNums = new Set((tail.match(bigNum) || []));
    if (!tailNums.size) return;
    const overlaps = [...tailNums].some((n) => printedNums.has(n));
    if (!overlaps) {
      w.push("Question " + qNum + "'s answer key ends by discussing numbers (" + [...tailNums].join(", ") + ") that never appear in the printed question, which asks about (" + [...printedNums].join(", ") + "). The key is answering a different question than what's on the page.");
    }
  });
  return w;
}

function degenerateOrderingWarnings(parsed) {
  const w = [];
  if (!parsed || !parsed.answerKey || !parsed.sections.length) return w;
  const orderingStem = /\b(order|rank)\b[\s\S]{0,80}\b(greatest to least|least to greatest)\b|\bwhich (?:list|order)\b[\s\S]{0,40}\b(greatest|least)\b/i;
  const degenerateKey = /\ball (?:three|four|two|of them) (?:are )?(?:equal|the same|tied)\b|\bequal when rounded\b|\bthere is no (?:order|difference)\b|\bare (?:all )?equal\b[\s\S]{0,40}\brounded\b/i;
  parsed.sections.forEach((sec) => {
    const lines = sec.content.split("\n");
    let qNum = null, qText = "";
    lines.forEach((l) => {
      const m = l.match(/^(\d+)\.\s+(.*)/);
      if (m) { qNum = m[1]; qText = m[2]; }
      else if (qNum) qText += " " + l;
    });
    if (!qNum || !orderingStem.test(qText)) return;
    const blocks = [];
    let cur = { num: null, text: "" };
    parsed.answerKey.split("\n").forEach((l) => {
      const bm = l.match(/^\s*(\d+)[.)]\s/);
      if (bm) { if (cur.num) blocks.push(cur); cur = { num: bm[1], text: l }; }
      else cur.text += "\n" + l;
    });
    if (cur.num) blocks.push(cur);
    const match = blocks.find((b) => b.num === qNum);
    if (match && degenerateKey.test(match.text)) {
      w.push("Question " + qNum + " asks students to order or rank values, but the answer key says the values are equal. The item has no real answer and needs different numbers, not a tie.");
    }
  });
  return w;
}

// Visible mid-key backtracking doesn't require a forbidden word. A key can
// compute a wrong or messy operation, state the result doesn't work cleanly,
// then pivot to the real answer, all in ordinary prose ("... is not a
// whole-number comparison ... so a precise answer is ..."). This is the same
// failure as hasHedgeLanguage catches, just phrased without "wait/actually."
function hasMessyReasoning(text) {
  return /\bis not a whole[\s-]number\b|\bso a precise\b|\bthis (?:is not|violates|breaks)\b|\bexceeds a single digit\b/i.test(text || "");
}

function optionTranscriptionWarnings(parsed) {
  const w = [];
  if (!parsed || !parsed.answerKey || !parsed.sections.length) return w;
  parsed.sections.forEach((sec) => {
    if (sec.type !== "multiple_choice") return;
    const lines = sec.content.split("\n").map((l) => l.trim());
    let qNum = null;
    const realOptions = {};
    lines.forEach((l) => {
      const qm = l.match(/^(\d+)\.\s/);
      if (qm) { qNum = qm[1]; return; }
      const om = l.match(/^([A-F])\.\s*(\d+)\s*\/\s*(\d+)\b/);
      if (om && qNum) realOptions[qNum + om[1]] = { n: parseInt(om[2]), d: parseInt(om[3]) };
    });
    const blocks = [];
    let cur = { num: null, text: "" };
    parsed.answerKey.split("\n").forEach((l) => {
      const m = l.match(/^\s*(\d+)[.)]\s/);
      if (m) { if (cur.num) blocks.push(cur); cur = { num: m[1], text: l }; }
      else cur.text += "\n" + l;
    });
    if (cur.num) blocks.push(cur);
    blocks.forEach((b) => {
      const re = /\b([A-F])\s*\((\d+)\s*\/\s*(\d+)\)/g;
      let m;
      while ((m = re.exec(b.text)) !== null) {
        const key = b.num + m[1].toUpperCase();
        const real = realOptions[key];
        if (!real) continue;
        const stated = { n: parseInt(m[2]), d: parseInt(m[3]) };
        if (real.n !== stated.n || real.d !== stated.d) {
          w.push("Question " + b.num + ": the key restates option " + m[1].toUpperCase() + " as " + stated.n + "/" + stated.d + ", but the worksheet actually shows " + m[1].toUpperCase() + " as " + real.n + "/" + real.d + ".");
        }
      }
    });
  });
  return w;
}

function answerKeyWarnings(parsed) {
  const w = [];
  if (!parsed || !parsed.answerKey || !parsed.sections.length) return w;
  const key = parsed.answerKey;

  // Map every question number to its section and available choice letters.
  const questions = new Map();
  parsed.sections.forEach((sec) => {
    if (/scoring/i.test(sec.heading)) return;
    const lines = sec.content.split("\n").map((l) => l.trim());
    let current = null;
    lines.forEach((l) => {
      const q = l.match(/^(\d+)\.\s(.*)/);
      if (q) { current = q[1]; questions.set(current, { heading: sec.heading, type: sec.type, choices: [], text: q[2] || "" }); return; }
      const c = l.match(/^([A-F])\./);
      if (c && current && questions.has(current)) questions.get(current).choices.push(c[1]);
    });
  });
  if (!questions.size) return w;

  // Which question numbers does the key actually address?
  const answered = new Set();
  key.split("\n").forEach((l) => {
    const m = l.trim().match(/^(\d+)[.):]\s*(.*)$/);
    if (m) answered.add(m[1]);
  });

  const missing = [...questions.keys()].filter((n) => !answered.has(n));
  if (missing.length) w.push("The answer key has no answer for question" + (missing.length > 1 ? "s " : " ") + missing.join(", ") + ".");
  const extra = [...answered].filter((n) => !questions.has(n));
  if (extra.length) w.push("The answer key answers question" + (extra.length > 1 ? "s " : " ") + extra.join(", ") + ", which " + (extra.length > 1 ? "are" : "is") + " not on the worksheet.");

  // For multiple choice, the named letter must be a choice that exists.
  const badLetters = [];
  key.split("\n").forEach((l) => {
    const m = l.trim().match(/^(\d+)[.):]\s*\(?([A-F])\b/);
    if (!m) return;
    const q = questions.get(m[1]);
    if (q && q.choices.length && !q.choices.includes(m[2])) badLetters.push(m[1] + " (says " + m[2] + ")");
  });
  if (badLetters.length) w.push("The answer key names a choice that was not offered on question " + badLetters.join(", ") + ".");

  // Assessment point math: the declared total must match the items.
  const scoring = parsed.sections.find((s) => /scoring/i.test(s.heading));
  if (scoring) {
    const declared = (scoring.content.match(/out of\s+(\d+)/i) || [])[1];
    let summed = 0;
    parsed.sections.forEach((sec) => {
      // The scoring section commonly restates per-item values ("multiple
      // choice items are worth (2 points) each"); counting those into the
      // item total double-counts and false-flags a correct assessment.
      if (/scoring/i.test(sec.heading)) return;
      (sec.content.match(/\((\d+)\s*points?\)/gi) || []).forEach((x) => { summed += parseInt(x.match(/\d+/)[0]); });
    });
    if (declared && summed && parseInt(declared) !== summed) w.push("Point total does not add up: the scoring line says " + declared + " but the items total " + summed + ".");
  }
  // Hedge language that survives even without duplicate numbering, since the
  // prompt rule and cleanAnswerKey both only reliably catch the case where the
  // model restarts with a fresh number. A single entry can still second-guess
  // itself in place.
  if (hasHedgeLanguage(key)) w.push("The answer key still contains visible self-correction language.");

  // Self-contradiction within one entry: opens with one letter, later states a
  // different one as the actual correct answer.
  const keyBlocks = [];
  { let cur = { num: null, text: "" };
    key.split("\n").forEach((l) => {
      const m = l.match(/^\s*(\d+)[.)]\s/);
      if (m) { if (cur.num) keyBlocks.push(cur); cur = { num: m[1], text: l }; }
      else cur.text += "\n" + l;
    });
    if (cur.num) keyBlocks.push(cur);
  }
  keyBlocks.forEach((b) => {
    const open = b.text.match(/^\s*\d+[.)]\s*\(?([A-F])\b/);
    // A legitimate explanation can mention "the correct answer is X" while
    // discussing why a tempting wrong choice is incorrect, before confirming
    // the real answer. Genuine self-correction narrates in the same order
    // (explain, then settle), so the LAST such phrase in the entry is the
    // one that actually matters, not the first.
    const laterMatches = [...b.text.matchAll(/correct answer is\s*\(?([A-F])\b/gi)];
    const later = laterMatches.length ? laterMatches[laterMatches.length - 1] : null;
    if (open && later && open[1] !== later[1]) w.push("Question " + b.num + "'s answer key entry opens with " + open[1] + " but later states the correct answer is " + later[1] + ".");
  });

  // Select-all items should have a genuine mix, not every offered choice
  // correct, and the answer key should state the final letters exactly once.
  // Both checks below only count a letter when it is actually tied to "correct"
  // language, not merely mentioned anywhere (a well-written key legitimately
  // names every letter while explaining why the wrong ones are wrong).
  keyBlocks.forEach((b) => {
    const q = questions.get(b.num);
    if (!q || !/select[\s-]?all/i.test(q.text || "")) return;
    const setClaims = keyLetterGroups(b.text, true);
    const distinct = new Set(setClaims);
    if (distinct.size > 1) w.push("Question " + b.num + "'s answer key shows more than one different answer set for this select-all question, which usually means visible self-correction survived into the output.");
    const allGroups = keyLetterGroups(b.text);
    const unioned = new Set();
    allGroups.forEach((g) => g.split("").forEach((ch) => unioned.add(ch)));
    if (unioned.size && q.choices.length && unioned.size >= q.choices.length) w.push("Question " + b.num + " asks to select all that apply, but the key marks every offered choice correct.");
  });

  return w;
}

function worksheetWarnings(parsed, rawText) {
  const w = [];
  if (!parsed) return w;
  if (!parsed.title) w.push("The title is missing.");
  if (!parsed.sections.length) w.push("No question sections were found.");
  if (!parsed.answerKey) w.push("The answer key is missing, which usually means the generation was cut off.");
  else if (!/\[TEACHER NOTES\]/i.test(rawText || "")) w.push("Teacher notes are missing.");
  // Visible self-correction is not only an answer-key problem: it can leak
  // into the actual student-facing question text ("Write the value of the
  // digit 7 in the number 472,schleswig Wait — here is the number: 472,319.").
  // Scan every student-facing field, not only the answer key, for the same
  // hedge language.
  if (hasHedgeLanguage(parsed.directions)) w.push("The directions contain visible self-correction language, which should never reach the student page.");
  if (hasHedgeLanguage(parsed.supportBox)) w.push("The support box contains visible self-correction language, which should never reach the student page.");
  if (hasHedgeLanguage(parsed.bonus)) w.push("The bonus question contains visible self-correction language, which should never reach the student page.");
  if (hasCorruptedNumber(parsed.directions)) w.push("The directions contain a corrupted number (a digit fused directly to letters), which usually means a generation glitch.");
  if (hasCorruptedNumber(parsed.supportBox)) w.push("The support box contains a corrupted number (a digit fused directly to letters), which usually means a generation glitch.");
  if (hasCorruptedNumber(parsed.bonus)) w.push("The bonus question contains a corrupted number (a digit fused directly to letters), which usually means a generation glitch.");
  parsed.sections.forEach((sec) => {
    if (hasHedgeLanguage(sec.content)) w.push("Question text in \"" + sec.heading + "\" contains visible self-correction language, which should never reach the student page.");
    if (hasCorruptedNumber(sec.content)) w.push("Question text in \"" + sec.heading + "\" contains a corrupted number (a digit fused directly to letters), which usually means a generation glitch.");
  });
  if (hasCorruptedNumber(parsed.answerKey)) w.push("The answer key contains a corrupted number (a digit fused directly to letters), which usually means a generation glitch.");
  if (hasTeacherRepairInstruction(parsed.answerKey) || hasTeacherRepairInstruction(parsed.teacherNotes)) w.push("The answer key admits a question is built wrong and tells you to fix it before printing. The item needs regenerating, not patching.");
  if (hasMessyReasoning(parsed.answerKey)) w.push("The answer key visibly computes a wrong or messy result before landing on the real answer, without using a forbidden self-correction word. This should never reach the printed key.");
  // Question numbers must be unique across the whole worksheet. When the
  // model restarts numbering per section (1, 2 in Vocabulary, then 1, 2
  // again in Comprehension), the answer key mirrors it, and cleanAnswerKey's
  // duplicate-number dedup (built for self-correction restarts) then keeps
  // only the LAST section's answers, silently deleting the rest and pairing
  // the wrong heading with the wrong answers. Detecting the restart here
  // turns a silent mangled key into a retry.
  {
    const seenNums = new Map();
    const dupNums = new Set();
    parsed.sections.forEach((sec) => {
      if (/scoring/i.test(sec.heading)) return;
      sec.content.split("\n").forEach((l) => {
        const m = l.trim().match(/^(\d+)[.)]\s/);
        if (!m) return;
        if (seenNums.has(m[1])) dupNums.add(m[1]);
        else seenNums.set(m[1], sec.heading);
      });
    });
    if (dupNums.size) w.push("Question number" + (dupNums.size > 1 ? "s " : " ") + [...dupNums].join(", ") + " appear" + (dupNums.size > 1 ? "" : "s") + " more than once on the worksheet. Numbering restarted instead of continuing across sections, which scrambles the answer key.");
  }
  parsed.sections.forEach((sec) => {
    const lines = sec.content.split("\n").map((l) => l.trim());
    const qs = lines.filter((l) => /^\d+\.\s*/.test(l));
    const blank = qs.filter((l) => l.replace(/^\d+\.\s*/, "").length < 8).length;
    if (blank) w.push(blank + " question" + (blank > 1 ? "s" : "") + " in \"" + sec.heading + "\" " + (blank > 1 ? "have" : "has") + " no text.");
    if (sec.type === "multiple_choice" && qs.length) {
      const choices = lines.filter((l) => /^[A-F]\./.test(l)).length;
      if (choices < qs.length * 2) w.push("Some questions in \"" + sec.heading + "\" are missing answer choices.");
      // Duplicate answer text within a single question (grouped between one
      // question line and the next), not just duplicates across the section.
      let qNum = null, group = [];
      const flushGroup = () => {
        const texts = group.map((l) => l.replace(/^[A-F]\.\s*/, "").trim().toLowerCase()).filter(Boolean);
        const dupe = texts.length && new Set(texts).size !== texts.length;
        if (dupe) w.push("Question " + qNum + " in \"" + sec.heading + "\" has two answer choices with the same text.");
      };
      lines.forEach((l) => {
        const qm = l.match(/^(\d+)\.\s/);
        if (qm) { if (qNum) flushGroup(); qNum = qm[1]; group = []; return; }
        if (/^[A-F]\./.test(l)) group.push(l);
      });
      if (qNum) flushGroup();
    }
  });
  return w.concat(answerKeyWarnings(parsed)).concat(fractionEquivalenceWarnings(parsed)).concat(decimalFractionEquivalenceWarnings(parsed)).concat(contradictionWarnings(parsed)).concat(optionTranscriptionWarnings(parsed)).concat(degenerateOrderingWarnings(parsed)).concat(keyMatchesQuestionWarnings(parsed));
}

function renderSectionHTML(sec) {
  let cleanContent = sec.content
    .replace(/^\[SECTION:[^\]]+\]\n?/gim, "")
    .replace(/^TYPE:\s*\w+\n?/gim, "")
    .replace(/^RULE:[^\n]+\n?/gim, "")
    .replace(/^IMPORTANT:[^\n]+\n?/gim, "")
    .trim();
  const lines = cleanContent.split("\n");
  const isQ = (s) => /^\d+\.\s+/.test(s);
  // Generated content goes into raw HTML strings here (this path renders via
  // dangerouslySetInnerHTML). HTML5 parsing forgives most bare symbols, but a
  // "<" tight against a letter (like "a<b") starts a tag and silently swallows
  // the rest of the line. Escaping content at insertion closes that entirely.
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const proseHTML = (t) => `<p style="font-size:13px;color:#374151;margin:4px 0;white-space:pre-wrap;">${esc(t)}</p>`;
  const lineHTML = `<div style="border-bottom:1.5px solid #CBD5E1;height:28px;margin-bottom:4px;"></div>`;
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      const qNum = qMatch[1], qText = qMatch[2];
      html += `<div style="margin-bottom:16px;display:flex;gap:10px;"><span style="font-weight:700;color:#374151;min-width:22px;font-size:14px;">${qNum}.</span><div style="flex:1;"><p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#1e293b;font-weight:500;">${esc(qText)}</p>`;
      if (sec.type === "multiple_choice") {
        let j = i + 1;
        while (j < lines.length && !isQ(lines[j].trim())) {
          const l = lines[j].trim();
          if (/^[A-F]\./.test(l)) {
            html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><div style="width:16px;height:16px;border-radius:50%;border:2px solid #CBD5E1;flex-shrink:0;"></div><span style="font-size:13px;color:#374151;">${esc(l)}</span></div>`;
          } else if (l) {
            html += proseHTML(l);
          }
          j++;
        }
        i = j;
      } else if (sec.type === "word_problem") {
        i++;
        while (i < lines.length) {
          const wl = lines[i].trim();
          if (wl === "[WORK BOX]") { html += `<div style="border:2px dashed #CBD5E1;border-radius:10px;padding:12px;margin:8px 0;background:#F8FAFC;"><p style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;">Show Your Work</p><div style="min-height:60px;"></div></div>`; i++; }
          else if (wl.startsWith("Answer:")) { html += `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;"><span style="font-size:12px;font-weight:600;color:#94A3B8;">Answer:</span><div style="border-bottom:1.5px solid #CBD5E1;flex:1;height:20px;"></div></div>`; i++; break; }
          else if (isQ(wl)) break;
          else { if (wl) html += proseHTML(wl); i++; }
        }
      } else if (sec.type === "explain") {
        i++;
        let lc = 0;
        while (i < lines.length && !isQ(lines[i].trim())) {
          const l = lines[i].trim();
          if (l.startsWith("___")) { lc++; html += lineHTML; }
          else if (l) html += proseHTML(l);
          i++;
        }
        for (let k = lc; k < 4; k++) html += lineHTML;
      } else {
        i++;
        while (i < lines.length && !isQ(lines[i].trim())) {
          const l = lines[i].trim();
          if (l.startsWith("___")) html += lineHTML;
          else if (l) html += proseHTML(l);
          i++;
        }
      }
      html += `</div></div>`;
    } else {
      // A section with no numbered items (for example the assessment Scoring
      // block) still has real content. Render it instead of dropping it.
      if (!line.startsWith("[") && !/^TYPE:/i.test(line)) {
        html += line.startsWith("___")
          ? lineHTML
          : `<p style="font-size:14px;color:#1e293b;font-weight:600;margin:4px 0;">${esc(line)}</p>`;
      }
      i++;
    }
  }
  return html;
}

// ─── PDF DOWNLOAD ─────────────────────────────────────────────────────────────
// Loads html2pdf from a CDN the first time it is needed, then renders the
// on-screen worksheet to a PDF and downloads it automatically. The separate
// Print button still produces sharper vector text and stays available.
function loadHtml2Pdf() {
  if (typeof window === "undefined") return Promise.reject(new Error("No browser available."));
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  if (window.__rexPdfLoader) return window.__rexPdfLoader;
  window.__rexPdfLoader = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    s.onload = () => { if (window.html2pdf) resolve(window.html2pdf); else { window.__rexPdfLoader = null; reject(new Error("PDF tool did not load.")); } };
    s.onerror = () => { window.__rexPdfLoader = null; reject(new Error("Could not load the PDF tool. Check your connection.")); };
    document.body.appendChild(s);
  });
  return window.__rexPdfLoader;
}

function pdfFileName(parsed, subject, grade) {
  const raw = (parsed && parsed.title ? parsed.title : "REX Worksheet") + " " + gradeOrdinal(grade) + " " + (subject && subject.label ? subject.label : "");
  const clean = raw.replace(/[^A-Za-z0-9 _-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
  return (clean || "REX-Worksheet") + ".pdf";
}

async function saveWorksheetPdf(parsed, subject, grade) {
  const html2pdf = await loadHtml2Pdf();
  const el = document.querySelector(".rex-print-area");
  if (!el) throw new Error("Generate a worksheet first.");
  // Wait for the TPT web fonts to finish loading before the snapshot. Capturing
  // mid font-swap causes layout reflow that produces blank gaps and text sliced
  // across page boundaries in the exported PDF. The <link> tag is inserted once
  // when the app mounts (see RexStudio), so by the time anyone can reach this
  // button the fetch has almost always already finished; this just covers the
  // rare case of a very fast click on a very slow connection.
  try {
    const link = document.getElementById("rex-tpt-fonts");
    if (link && !link.dataset.loaded) {
      await Promise.race([
        new Promise((resolve) => { link.addEventListener("load", resolve, { once: true }); link.addEventListener("error", resolve, { once: true }); }),
        new Promise((r) => setTimeout(r, 2000)),
      ]);
    }
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1000))]);
    }
  } catch {
    // Font readiness is a best-effort improvement, never block the export on it.
  }
  el.classList.add("rex-pdf-export");
  try {
    await html2pdf().set({
    margin: [0.4, 0.35, 0.4, 0.35],
    filename: pdfFileName(parsed, subject, grade),
    image: { type: "jpeg", quality: 0.98 },
    // scrollY resets html2canvas's capture offset to the top of the element
    // regardless of the page's current scroll position, a known html2canvas
    // gotcha that otherwise produces a blank gap and misaligned pagination.
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#FFFFFF", logging: false, scrollY: 0, scrollX: 0 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], before: [".rex-answer-key", ".tpt-keypage"], avoid: [".tpt-q", ".tpt-header", ".rex-header-block", ".tpt-directions", ".tpt-supportbox", ".tpt-passage", ".tpt-bonus", ".tpt-firstblock", ".tpt-keyblock", ".rex-keyblock", ".tpt-notes"] },
    }).from(el).save();
  } finally {
    el.classList.remove("rex-pdf-export");
  }
}

function PrintableView({ parsed, subject, grade, showKey, onToggleKey }) {
  const hc = subject.hc;
  const gradeLabel = gradeOrdinal(grade);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");
  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 rex-no-print">
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"><Printer size={12}/> Print</button>
          <button onClick={async()=>{setPdfBusy(true);setPdfError("");try{await saveWorksheetPdf(parsed,subject,grade);}catch(err){setPdfError(err.message||"Could not save the PDF.");}setPdfBusy(false);}} disabled={pdfBusy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50">
            {pdfBusy?<Loader2 size={12} className="animate-spin"/>:<Download size={12}/>} {pdfBusy?"Saving…":"Save as PDF"}
          </button>
          {pdfError&&<span className="text-xs text-red-500 self-center">{pdfError}</span>}
          <button onClick={onToggleKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showKey?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            {showKey?<EyeOff size={12}/>:<Eye size={12}/>} {showKey?"Hide Key":"Answer Key"}
          </button>
        </div>
        <span className="text-xs text-slate-400 italic">CCSS · {gradeLabel} Grade · California</span>
      </div>
      <div className="rex-print-area">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div style={{background:`linear-gradient(135deg,${hc}18 0%,${hc}06 100%)`,borderTop:`4px solid ${hc}`}} className="px-7 py-5 rex-header-block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">{parsed.title||"Worksheet"}</h1>
                <p style={{color:hc}} className="text-xs font-bold mt-1 uppercase tracking-wide">{parsed.subtitle}</p>
              </div>
              <div className="flex-shrink-0 space-y-1.5 min-w-32">
                {["Name","Date","Score"].map(f=>(
                  <div key={f} className="flex items-center gap-2"><span className="text-xs text-slate-400 w-9">{f}:</span><div className="border-b border-slate-300 flex-1 h-5"/></div>
                ))}
              </div>
            </div>
            {parsed.directions&&(<div className="mt-4 bg-white bg-opacity-80 rounded-xl px-4 py-2.5"><span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mr-2">Directions:</span><span className="text-sm text-slate-700">{parsed.directions}</span></div>)}
          </div>
          {parsed.passage&&(<div className="px-7 pt-5"><div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Read the Passage:</p>{parsed.passage.split("\n").map((line,i)=>(<p key={i} className={`text-sm leading-relaxed ${i===0?"font-bold text-slate-800 mb-1":"text-slate-700"}`}>{line}</p>))}</div></div>)}
          {parsed.supportBox&&(<div className="px-7 pt-5"><div style={{background:`${subject.hc}0d`,border:`1.5px solid ${subject.hc}30`}} className="rounded-xl p-4">{parsed.supportBox.split("\n").filter(l=>l.trim()).map((line,i)=>(<p key={i} className={`text-sm leading-relaxed ${i===0?"font-bold uppercase tracking-wide text-xs mb-2":"text-slate-700"}`} style={i===0?{color:subject.hc}:{}}>{line}</p>))}</div></div>)}
          <div className="px-7 py-5 space-y-6">
            {parsed.sections.map((sec,si)=>(
              <div key={si}>
                <div className="flex items-center gap-3 mb-4"><div className="h-px flex-1 bg-slate-100"/><h2 style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest px-2">{sec.heading}</h2><div className="h-px flex-1 bg-slate-100"/></div>
                <div dangerouslySetInnerHTML={{__html:renderSectionHTML(sec)}}/>
              </div>
            ))}
            {parsed.bonus&&(<div style={{background:`${hc}0d`,border:`1.5px solid ${hc}30`}} className="rounded-xl p-5"><p style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest mb-3">⭐ Bonus Challenge</p><div className="mb-3">{parsed.bonus.split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("___")).map((l,i)=>(<p key={i} className="text-sm font-medium text-slate-800" style={{whiteSpace:"pre-wrap"}}>{l}</p>))}</div>{[...Array(4)].map((_,i)=><div key={i} className="border-b border-slate-300 h-7 mt-1.5 w-full"/>)}</div>)}
          </div>
        </div>
        {showKey&&parsed.answerKey&&(
          <div className="mt-4 bg-slate-800 rounded-2xl p-5 rex-answer-key" style={{pageBreakBefore:"always"}}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Answer Key</p>
            {answerKeyBlocks(parsed.answerKey).map((b,i)=>(<pre key={i} className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed rex-keyblock" style={{margin:"0 0 8px"}}>{b}</pre>))}
            {parsed.teacherNotes&&(<div className="mt-4 bg-slate-700 rounded-xl px-4 py-3"><p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Teacher Notes</p><pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">{parsed.teacherNotes}</pre></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function RawView({ text, subject }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border ${subject.border} shadow-sm overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-700">Editable Text — paste into Google Docs or Word</span>
        <div className="flex gap-2">
          <button onClick={()=>{navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all">
            {copied?<Check size={13} className="text-emerald-500"/>:<Copy size={13}/>} {copied?"Copied!":"Copy All"}
          </button>
          <button onClick={()=>window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:border-slate-300 transition-all"><Printer size={13}/> Print</button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed p-6">{text}</pre>
    </div>
  );
}

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
    <div className="rounded-2xl overflow-hidden" style={{border:`2px solid ${hc}40`,background:`${hc}08`}}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{background:hc}}>AI</div>
          <div className="text-left">
            <p className="text-sm font-extrabold text-slate-800">Step 1: Canva AI Prompt</p>
            <p className="text-xs text-slate-500">Copy this first → paste into Canva AI to generate your layout</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl p-4 mb-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-600 mb-2">How to use this in Canva:</p>
            <div className="space-y-1.5">
              {["Go to canva.com → click Magic Design or use the AI assistant","Paste this prompt into the AI text field","Let Canva AI generate a starting layout","Then use the content blocks below to fill it in"].map((step,i)=>(
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:hc,fontSize:10}}>{i+1}</span>
                  <p className="text-xs text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Canva AI Prompt</span>
              <button onClick={()=>{navigator.clipboard.writeText(prompt);setCopied(true);setTimeout(()=>setCopied(false),2000);}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all" style={{background:copied?"#10B981":hc,color:"white"}}>
                {copied?<Check size={12}/>:<Copy size={12}/>} {copied?"Copied!":"Copy Prompt"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed p-4 max-h-48 overflow-y-auto">{prompt}</pre>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">After Canva generates the layout → come back and use the content blocks below to fill it in</p>
        </div>
      )}
    </div>
  );
}

function CanvaView({ parsed, subject, grade }) {
  const hc = subject.hc;
  const gradeLabel = gradeOrdinal(grade);
  const [allCopied, setAllCopied] = useState(false);
  const canvaSections = [];
  canvaSections.push({ title:"① HEADER BLOCK", content:`${parsed.title}\n${parsed.subtitle}` });
  canvaSections.push({ title:"② NAME / DATE / SCORE LINE", content:"Name: ________________________     Date: ___________     Score: ______" });
  if (parsed.directions) canvaSections.push({ title:"③ DIRECTIONS BOX", content:`Directions: ${parsed.directions}` });
  if (parsed.passage) canvaSections.push({ title:"④ READING PASSAGE BOX", content:parsed.passage });
  parsed.sections.forEach((sec,i)=>{
    const circle=["⑤","⑥","⑦","⑧","⑨","⑩"][i]||`(${(parsed.passage?5:4)+i})`;
    const typeHint={multiple_choice:"MULTIPLE CHOICE — use bubble answer choices",word_problem:"WORD PROBLEMS — add Show Your Work box",short_answer:"SHORT ANSWER — add 2–3 answer lines",explain:"EXPLAIN THINKING — add 4 answer lines"}[sec.type]||sec.type.toUpperCase();
    canvaSections.push({ title:`${circle} SECTION: ${sec.heading.toUpperCase()} — ${typeHint}`, content:sec.content });
  });
  if (parsed.bonus) canvaSections.push({ title:"⑪ BONUS CHALLENGE BOX", content:`⭐ BONUS CHALLENGE\n${parsed.bonus}` });
  canvaSections.push({ title:"⑫ FOOTER", content:`© ${new Date().getFullYear()} · ${gradeLabel} Grade · ${subject.label} · For classroom use` });
  if (parsed.answerKey) canvaSections.push({ title:"⑬ ANSWER KEY PAGE", content:`ANSWER KEY\n${parsed.title}\n\n${parsed.answerKey}` });
  if (parsed.teacherNotes) canvaSections.push({ title:"⑭ TEACHER NOTES", content:parsed.teacherNotes });
  const copyAll = () => { navigator.clipboard.writeText(canvaSections.map(s=>`=== ${s.title} ===\n${s.content}`).join("\n\n\n")); setAllCopied(true); setTimeout(()=>setAllCopied(false),2000); };
  const sectionNames = parsed.sections.map(s=>s.heading).join(", ");
  const hasPassage = !!parsed.passage;
  const canvaAIPrompt = `Create a professional, print-ready classroom worksheet for elementary school students with the following specifications:

WORKSHEET DETAILS:
Title: ${parsed.title || "Educational Worksheet"}
Subject: ${subject.label}
Grade Level: ${gradeLabel} Grade
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
- Color: Use ${hc} as the primary accent color throughout

Generate a worksheet template layout I can fill in with my content.`;

  return (
    <div className="space-y-4">
      <CanvaAIBlock prompt={canvaAIPrompt} subject={subject} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1"><Package size={16} style={{color:hc}}/><span className="text-sm font-extrabold text-slate-800">Canva Pack</span><span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{background:hc}}>READY</span></div>
            <p className="text-xs text-slate-500">Copy blocks one at a time into matching text boxes in your Canva template.</p>
          </div>
          <button onClick={copyAll} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all" style={{background:allCopied?"#10B981":hc}}>
            {allCopied?<Check size={13}/>:<Copy size={13}/>} {allCopied?"All Copied!":"Copy Everything"}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 bg-slate-50 rounded-xl p-3">
          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{background:hc}}/>
          <div><p className="text-xs font-bold text-slate-600">Subject color</p><p className="text-xs text-slate-400">In Canva: paste hex <span className="font-mono font-bold text-slate-700">{hc}</span></p></div>
          <button onClick={()=>navigator.clipboard.writeText(hc)} className="ml-auto px-2 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold">Copy hex</button>
        </div>
        <a href="https://www.canva.com/search/templates?q=classroom+worksheet" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-xs font-bold underline" style={{color:hc}}>Open Canva worksheet templates <ExternalLink size={11}/></a>
      </div>
      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How to use this in Canva</p>
        <div className="space-y-2">
          {["Open Canva → search 'classroom worksheet' → pick a template with a colored header and section boxes",`Change the header color to ${hc} (tap any colored element → color picker → paste the hex)`,"Work through each block below in order — copy it, click the matching text box in Canva, paste","For answer bubbles: Canva Elements → search 'circle outline' → add 4 next to each A/B/C/D","For work boxes: Canva Elements → search 'rectangle outline' → drag below word problems","When done: Share → Download → PDF Print (300 DPI) → upload to TPT"].map((step,i)=>(
            <div key={i} className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
      {canvaSections.map((sec,i)=>(<CanvaSection key={i} index={i+1} title={sec.title} content={sec.content} color={hc}/>))}
    </div>
  );
}

// ─── TPT PRINT VIEW ───────────────────────────────────────────────────────────
// Polished TPT-style print template. Same props as PrintableView.

function TptScallop({ color, grade }) {
  // Built from positioned divs rather than inline SVG: html2canvas (used by
  // Save as PDF) cannot reliably rasterize SVG, and drops <text> entirely, which
  // is why this sticker was missing from exported PDFs. Percentages reproduce the
  // original geometry: 12 petals on a radius-38 ring, a radius-40 center disc,
  // and a dashed ring at radius 33, all within a 100-unit box.
  const petals = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const cx = 50 + Math.cos(a) * 38;
    const cy = 50 + Math.sin(a) * 38;
    petals.push(
      <div
        key={i}
        style={{
          position: "absolute",
          width: "26%",
          height: "26%",
          left: `${cx - 13}%`,
          top: `${cy - 13}%`,
          borderRadius: "50%",
          background: color,
        }}
      />
    );
  }
  return (
    <div style={{ position: "relative", width: 78, height: 78, flexShrink: 0 }} aria-hidden="true">
      {petals}
      <div style={{ position: "absolute", left: "10%", top: "10%", width: "80%", height: "80%", borderRadius: "50%", background: color }} />
      <div style={{ position: "absolute", left: "17%", top: "17%", width: "66%", height: "66%", borderRadius: "50%", border: "1.6px dashed #FFFFFF", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", lineHeight: 1 }}>
        <span style={{ font: "800 17px 'Baloo 2', sans-serif" }}>{grade}</span>
        <span style={{ font: "700 8px 'Baloo 2', sans-serif", letterSpacing: "1.2px", marginTop: 2 }}>GRADE</span>
      </div>
    </div>
  );
}

function TptLines({ n }) {
  return (<div>{Array.from({ length: n }).map((_, i) => <div key={i} className="tpt-line" />)}</div>);
}

function tptRenderSection(sec) {
  const lines = sec.content
    .replace(/^\[SECTION:[^\]]+\]\n?/gim, "")
    .replace(/^TYPE:\s*\w+\n?/gim, "")
    .split("\n");
  const isQ = (s) => /^\d+\.\s+/.test(s);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    const q = line.match(/^(\d+)\.\s+(.+)/);
    if (!q) {
      // Prose-only section content (for example the assessment Scoring block).
      if (!line.startsWith("[") && !/^TYPE:/i.test(line)) {
        out.push(line.startsWith("___")
          ? <div key={"pl" + i} className="tpt-line" />
          : <p key={"pl" + i} className="tpt-scoreline">{line}</p>);
      }
      i++;
      continue;
    }
    const body = [];
    if (sec.type === "multiple_choice") {
      let j = i + 1;
      while (j < lines.length && !isQ(lines[j].trim())) {
        const l = lines[j].trim();
        if (/^[A-F]\./.test(l)) {
          body.push(
            <div key={j} className="tpt-choice">
              <span className="tpt-bubble">{l[0]}</span>
              <span>{l.slice(2).trim()}</span>
            </div>
          );
        } else if (l) {
          body.push(<p key={j} className="tpt-inline">{l}</p>);
        }
        j++;
      }
      i = j;
    } else if (sec.type === "word_problem") {
      i++;
      while (i < lines.length && !isQ(lines[i].trim())) {
        const wl = lines[i].trim();
        if (wl === "[WORK BOX]") body.push(
          <div key={i} className="tpt-workbox"><span className="tpt-worklabel">Show your work</span></div>
        );
        else if (wl.startsWith("Answer:")) body.push(
          <div key={i} className="tpt-answerline"><span>Answer</span><div /></div>
        );
        else if (wl && !wl.toLowerCase().startsWith("show your work")) body.push(
          <p key={i} className="tpt-inline">{wl}</p>
        );
        i++;
      }
    } else {
      i++;
      let lc = 0;
      const min = sec.type === "explain" ? 4 : 2;
      while (i < lines.length && !isQ(lines[i].trim())) {
        const l = lines[i].trim();
        if (l.startsWith("___")) { lc++; body.push(<div key={i} className="tpt-line" />); }
        else if (l) body.push(<p key={i} className="tpt-inline">{l}</p>);
        i++;
      }
      for (let k = lc; k < min; k++) body.push(<div key={"pad" + k} className="tpt-line" />);
    }
    out.push(
      <div key={q[1]} className="tpt-q">
        <span className="tpt-qnum">{q[1]}</span>
        <div className="tpt-qbody">
          <p className="tpt-qtext">{q[2]}</p>
          {body}
        </div>
      </div>
    );
  }
  return out;
}

function TPTPrintView({ parsed, subject, grade, showKey, onToggleKey }) {
  const hc = subject.hc;
  const ord = gradeOrdinal(grade);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const passageLines = parsed.passage ? parsed.passage.split("\n") : [];
  return (
    <div className="tpt-scope" style={{ "--accent": hc }}>
      <style>{`
        /* Baloo 2 and Atkinson Hyperlegible are preloaded once at the app level
           (see RexStudio's mount effect), not here, so the fetch has already
           finished long before this view can even be reached. */
        .tpt-scope { --ink:#2B2A33; --pencil:#8A867C; --rule:#D8D5CE; color:#2B2A33; font-family:'Atkinson Hyperlegible',sans-serif; }
        .tpt-page { background:#fff; margin:0 auto 24px; padding:0.55in 0.6in 0.4in; box-shadow:0 2px 14px rgba(43,42,51,.12); border-radius:6px; max-width:8.5in; }
        .tpt-header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; border-bottom:3px solid ${hc}; padding-bottom:14px; }
        .tpt-eyebrow { font:700 10px 'Baloo 2',sans-serif; letter-spacing:2px; text-transform:uppercase; color:${hc}; margin:0 0 2px; }
        .tpt-title { font:800 30px/1.05 'Baloo 2',sans-serif; margin:0 0 12px; color:#2B2A33; }
        .tpt-keysub { font-style:italic; font-size:14px; color:#8A867C; margin:0; }
        .tpt-meta { display:flex; align-items:flex-end; gap:8px; font:700 10px 'Baloo 2',sans-serif; text-transform:uppercase; letter-spacing:1px; color:#8A867C; }
        .tpt-meta div { border-bottom:1.5px solid #2B2A33; height:16px; width:150px; }
        .tpt-meta div.short { width:80px; } .tpt-meta div.shorter { width:50px; }
        .tpt-directions { display:flex; margin:16px 0 0; border:1.5px solid #D8D5CE; border-radius:8px; overflow:hidden; }
        .tpt-tab { background:${hc}; color:#fff; font:700 11px 'Baloo 2',sans-serif; letter-spacing:1px; text-transform:uppercase; padding:10px 12px; display:flex; align-items:center; }
        .tpt-directions p { margin:0; padding:9px 12px; font-size:13.5px; line-height:1.5; }
        .tpt-passage { margin:16px 0 0; padding:14px 16px; border:1.5px solid #D8D5CE; border-left:5px solid ${hc}; border-radius:8px; background:${hc}0a; }
        .tpt-passage-title { font:800 14px 'Baloo 2',sans-serif; letter-spacing:1.5px; margin:0 0 6px; }
        .tpt-passage-body { margin:0 0 6px; font-size:13.5px; line-height:1.62; }
        .tpt-supportbox { margin:16px 0 0; padding:12px 14px; border:1.5px solid ${hc}; border-radius:8px; background:${hc}0d; }
        .tpt-supportbox-title { font:800 11px 'Baloo 2',sans-serif; letter-spacing:1.5px; text-transform:uppercase; color:${hc}; margin:0 0 6px; }
        .tpt-supportbox-line { margin:0 0 4px; font-size:13px; line-height:1.55; }
        .tpt-section { margin-top:20px; }
        .tpt-firstblock { display:block; }
        .tpt-sechead { display:flex; align-items:center; gap:10px; margin:0 0 12px; }
        .tpt-sechead span { font:700 13px 'Baloo 2',sans-serif; letter-spacing:1.5px; text-transform:uppercase; color:${hc}; white-space:nowrap; }
        .tpt-sechead::after { content:""; flex:1; border-top:2px dotted #D8D5CE; }
        .tpt-q { display:flex; gap:10px; margin-bottom:15px; break-inside:avoid; }
        .tpt-qnum { font:800 14px 'Baloo 2',sans-serif; color:#fff; background:${hc}; width:22px; height:22px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .tpt-qbody { flex:1; }
        .tpt-qtext { margin:0 0 8px; font-size:13.5px; line-height:1.55; font-weight:700; }
        .tpt-inline { margin:4px 0; font-size:13px; line-height:1.5; white-space:pre-wrap; }
        .tpt-scoreline { margin:6px 0; font:700 15px 'Baloo 2',sans-serif; letter-spacing:0.5px; }
        .tpt-choice { display:flex; align-items:center; gap:9px; margin-bottom:6px; font-size:13px; }
        .tpt-bubble { width:19px; height:19px; border:1.8px solid #2B2A33; border-radius:50%; display:flex; align-items:center; justify-content:center; font:700 10px 'Baloo 2',sans-serif; flex-shrink:0; }
        .tpt-line { border-bottom:1.5px solid #D8D5CE; height:26px; }
        .tpt-workbox { border:2px dashed ${hc}; border-radius:10px; min-height:95px; padding:8px 10px; margin:6px 0; }
        .tpt-worklabel { font:700 9.5px 'Baloo 2',sans-serif; letter-spacing:1.5px; text-transform:uppercase; color:#8A867C; }
        .tpt-answerline { display:flex; align-items:flex-end; gap:8px; margin-top:8px; font:700 10px 'Baloo 2',sans-serif; text-transform:uppercase; letter-spacing:1px; color:#8A867C; }
        .tpt-answerline div { border-bottom:1.5px solid #2B2A33; height:16px; width:180px; }
        .tpt-bonus { margin-top:22px; border:2px solid ${hc}; border-radius:12px; padding:12px 14px; background:${hc}0f; }
        .tpt-bonus-label { font:800 13px 'Baloo 2',sans-serif; letter-spacing:1px; text-transform:uppercase; color:${hc}; margin:0 0 6px; }
        .tpt-footer { display:flex; justify-content:space-between; margin-top:26px; padding-top:8px; border-top:1.5px solid #D8D5CE; font-size:9.5px; color:#8A867C; }
        .tpt-dots { color:${hc}; letter-spacing:3px; font-size:7px; }
        .tpt-keypage { page-break-before:always; }
        .tpt-key { white-space:pre-wrap; font:400 12.5px/1.65 'Atkinson Hyperlegible',sans-serif; margin:14px 0 0; }
        .tpt-keyblock { margin:0 0 10px; }
        .tpt-notes { margin-top:16px; border-top:2px dotted #D8D5CE; padding-top:10px; }
        .tpt-notes-label { font:700 11px 'Baloo 2',sans-serif; letter-spacing:1.5px; text-transform:uppercase; color:${hc}; margin:0; }
        @media print {
          .tpt-page { box-shadow:none; border-radius:0; margin:0; max-width:none; padding:0.15in 0.1in; }
        }
        .rex-pdf-export .tpt-page { box-shadow:none; margin-bottom:0; }
        .rex-pdf-export .tpt-footer { margin-top:14px; }
      `}</style>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 rex-no-print">
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"><Printer size={12}/> Print</button>
          <button onClick={async()=>{setPdfBusy(true);setPdfError("");try{await saveWorksheetPdf(parsed,subject,grade);}catch(err){setPdfError(err.message||"Could not save the PDF.");}setPdfBusy(false);}} disabled={pdfBusy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50">
            {pdfBusy?<Loader2 size={12} className="animate-spin"/>:<Download size={12}/>} {pdfBusy?"Saving…":"Save as PDF"}
          </button>
          {pdfError&&<span className="text-xs text-red-500 self-center">{pdfError}</span>}
          <button onClick={onToggleKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showKey?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            {showKey?<EyeOff size={12}/>:<Eye size={12}/>} {showKey?"Hide Key":"Answer Key"}
          </button>
        </div>
        <span className="text-xs text-slate-400 italic">TPT Print · {ord} Grade · California</span>
      </div>
      <div className="rex-print-area">
        <div className="tpt-page">
          <header className="tpt-header">
            <div style={{flex:1}}>
              <p className="tpt-eyebrow">{parsed.subtitle}</p>
              <h1 className="tpt-title">{parsed.title || "Worksheet"}</h1>
              <div className="tpt-meta">
                <span>Name</span><div /><span>Date</span><div className="short" /><span>Score</span><div className="shorter" />
              </div>
            </div>
            <TptScallop color={hc} grade={ord} />
          </header>
          {parsed.directions && (
            <div className="tpt-directions"><span className="tpt-tab">Directions</span><p>{parsed.directions}</p></div>
          )}
          {parsed.supportBox && (
            <div className="tpt-supportbox">
              {parsed.supportBox.split("\n").filter(l => l.trim()).map((l, i) => i === 0
                ? <p key={i} className="tpt-supportbox-title">{l}</p>
                : <p key={i} className="tpt-supportbox-line">{l}</p>)}
            </div>
          )}
          {parsed.passage && (
            <div className="tpt-passage">
              {passageLines.map((l, i) => i === 0
                ? <p key={i} className="tpt-passage-title">{l}</p>
                : <p key={i} className="tpt-passage-body">{l}</p>)}
            </div>
          )}
          {parsed.sections.map((sec, si) => {
            const qs = tptRenderSection(sec);
            return (
              <section key={si} className="tpt-section">
                <div className="tpt-firstblock">
                  <h2 className="tpt-sechead"><span>{sec.heading}</span></h2>
                  {qs[0]}
                </div>
                {qs.slice(1)}
              </section>
            );
          })}
          {parsed.bonus && (
            <div className="tpt-bonus">
              <p className="tpt-bonus-label">★ Bonus Challenge</p>
              {parsed.bonus.split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("___")).map((l,i)=>(<p key={i} className={i===0?"tpt-qtext":"tpt-inline"}>{l}</p>))}
              <TptLines n={3} />
            </div>
          )}
          <footer className="tpt-footer">
            <span></span>
            <span className="tpt-dots">● ● ● ●</span>
          </footer>
        </div>
        {showKey && parsed.answerKey && (
          <div className="tpt-page tpt-keypage">
            <header className="tpt-header">
              <div style={{flex:1}}>
                <p className="tpt-eyebrow">{parsed.subtitle}</p>
                <h1 className="tpt-title">Answer Key</h1>
                <p className="tpt-keysub">{parsed.title}</p>
              </div>
              <TptScallop color={hc} grade={ord} />
            </header>
            {answerKeyBlocks(parsed.answerKey).map((b, i) => (
              <pre key={i} className="tpt-key tpt-keyblock">{b}</pre>
            ))}
            {parsed.teacherNotes && (
              <div className="tpt-notes">
                <p className="tpt-notes-label">Teacher Notes</p>
                <pre className="tpt-key">{parsed.teacherNotes}</pre>
              </div>
            )}
            <footer className="tpt-footer">
              <span>Answer Key · Not for student distribution</span>
              <span className="tpt-dots">● ● ● ●</span>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RexStudio() {
  // The TPT view's fonts (Baloo 2, Atkinson Hyperlegible) previously loaded via an
  // @import inside TPTPrintView's own <style> tag, so the fetch only started once
  // someone switched to that view. Hitting Save as PDF right after switching could
  // fire the export before the font finished downloading, since document.fonts.ready
  // only tracks fonts the browser has already registered, and there is a real gap
  // between the <style> tag mounting and the @import being parsed. Loading them
  // here, once, as soon as the app starts, means they are already cached by the
  // time anyone reaches the TPT view at all.
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("rex-tpt-fonts")) return;
    const link = document.createElement("link");
    link.id = "rex-tpt-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap";
    link.addEventListener("load", () => { link.dataset.loaded = "1"; }, { once: true });
    link.addEventListener("error", () => { link.dataset.loaded = "1"; }, { once: true });
    document.head.appendChild(link);
  }, []);

  const [apiKey, setApiKey] = useState(()=>{ try{return JSON.parse(localStorage.getItem("tos2_settings")||"{}").apiKey||"";}catch{return "";} });
  const [showApi, setShowApi] = useState(false);
  const [grade, setGrade] = useState(5);
  const [subjectIdx, setSubjectIdx] = useState(0);
  const subject = SUBJECTS[subjectIdx];
  const resourceTypes = Object.keys(STANDARDS[grade][subject.id]);
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

  const handleGrade = (g) => { setGrade(g); setResourceType(Object.keys(STANDARDS[g][subject.id])[0]); setRawText(""); setParsed(null); setError(""); };
  const handleSubject = (idx) => { const s=SUBJECTS[idx]; setSubjectIdx(idx); setResourceType(Object.keys(STANDARDS[grade][s.id])[0]); setRawText(""); setParsed(null); setError(""); };

  const generate = async () => {
    if (!apiKey.trim()) { setError("Tap '⚠ Set API Key' at the top right."); return; }
    const validTypes = Object.keys(STANDARDS[grade][subject.id]);
    const safeType = validTypes.includes(resourceType) ? resourceType : validTypes[0];
    setLoading(true); setError(""); setRawText(""); setParsed(null); setShowKey(false);
    try {
      const prompt = buildPrompt(grade, subject.id, safeType, difficulty, purpose, topic);
      let result = await callClaude(prompt, apiKey, 8000);
      let parsedResult = parseWorksheet(result);
      let issues = worksheetWarnings(parsedResult, result);
      // Retry silently, BEFORE the user ever sees a broken worksheet, reusing
      // the same prompt (same topic and parameters) so a retry is genuinely
      // "try this request again," not a different question. Capped at 3 total
      // attempts; a network failure on a retry keeps the prior attempt rather
      // than crashing the whole generation.
      let attempts = 1;
      while (issues.length && attempts < 3) {
        attempts++;
        try {
          const retryResult = await callClaude(prompt, apiKey, 8000);
          const retryParsed = parseWorksheet(retryResult);
          const retryIssues = worksheetWarnings(retryParsed, retryResult);
          result = retryResult; parsedResult = retryParsed; issues = retryIssues;
        } catch { break; }
      }
      setRawText(result);
      setParsed(parsedResult);
    } catch(e) { setError(e.message||"Something went wrong. Please try again."); }
    setLoading(false);
  };

  const gradeLabel = gradeOrdinal(grade);
  const warnings = parsed ? worksheetWarnings(parsed, rawText) : [];

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

      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm rex-no-print">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-sm transition-all duration-300`}><subject.icon size={18} className="text-white"/></div>
          <div><div className="font-extrabold text-slate-800 text-sm tracking-wide">REX</div><div className="text-xs text-slate-400">Resource Studio · {gradeLabel} Grade CA</div></div>
        </div>
        <button onClick={()=>setShowApi(!showApi)} className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all ${apiKey?"border-emerald-200 text-emerald-600 bg-emerald-50":"border-red-200 text-red-500 bg-red-50"}`}>
          {apiKey?"✓ API Key Set":"⚠ Set API Key"} <ChevronDown size={11}/>
        </button>
      </div>

      {showApi&&(
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 rex-no-print">
          <div className="max-w-2xl mx-auto flex gap-2 items-center">
            <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-… from console.anthropic.com" className="flex-1 px-3.5 py-2 rounded-xl border border-amber-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white font-mono"/>
            <button onClick={()=>{localStorage.setItem("tos2_settings",JSON.stringify({apiKey}));setShowApi(false);}} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors">Save</button>
          </div>
          <p className="text-xs text-amber-600 text-center mt-2">Get a key at <strong>console.anthropic.com</strong> → API Keys → Create Key</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">

        {/* Grade selector */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 rex-no-print">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Grade</p>
          <div className="grid grid-cols-3 gap-3">
            {[5,4,3].map(g=>(
              <button key={g} onClick={()=>handleGrade(g)} className={`py-3 rounded-xl text-sm font-extrabold border-2 transition-all ${grade===g?"bg-slate-800 text-white border-slate-800 shadow-md":"bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                {gradeOrdinal(g)} Grade
              </button>
            ))}
          </div>
        </div>

        {/* Subject selector */}
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
              {resourceTypes.map(t=>(<button key={t} onClick={()=>{setResourceType(t);setRawText("");setParsed(null);setError("");}} className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${resourceType===t?`bg-gradient-to-br ${subject.gradient} text-white border-transparent shadow-sm`:`bg-white ${subject.border} ${subject.accent} hover:shadow-sm`}`}>{t}</button>))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Purpose</label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map(p=>(<button key={p.id} onClick={()=>setPurpose(p.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${purpose===p.id?"bg-slate-800 text-white border-slate-800 shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{p.label}</button>))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d=>(<button key={d.id} onClick={()=>setDifficulty(d.id)} className={`p-3 rounded-xl text-left border-2 transition-all ${difficulty===d.id?`${subject.soft} ${subject.border} shadow-sm`:"bg-white border-slate-200 hover:border-slate-300"}`}><div className={`text-xs font-bold ${difficulty===d.id?subject.accent:"text-slate-600"}`}>{d.label}</div><div className="text-xs text-slate-400 mt-0.5 leading-tight">{d.desc}</div></button>))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Specific Topic <span className="font-normal text-slate-400">(optional)</span></label>
            <input value={topic} onChange={e=>setTopic(e.target.value)}
              placeholder={subject.id==="math"?"e.g. Adding fractions with unlike denominators":subject.id==="ela"?"e.g. Making inferences from informational text":subject.id==="writing"?"e.g. Should students have homework?":subject.id==="science"?"e.g. Photosynthesis and food webs":"e.g. California Gold Rush"}
              className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 ${subject.ring} bg-white transition`}
            />
          </div>
          {rawText&&(
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">View As</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {OUTPUT_MODES.map(m=>(<button key={m.id} onClick={()=>setOutputMode(m.id)} className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${outputMode===m.id?`${subject.soft} ${subject.border} shadow-sm`:"border-slate-200 bg-white hover:border-slate-300"}`}><m.icon size={14} className={outputMode===m.id?subject.accent:"text-slate-400"}/><div className={`text-xs font-bold ${outputMode===m.id?subject.accent:"text-slate-600"}`}>{m.label}</div><div className="text-xs text-slate-400 leading-tight">{m.desc}</div></button>))}
              </div>
            </div>
          )}
          <button onClick={generate} disabled={loading} className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all active:scale-95 ${loading?"bg-slate-200 cursor-not-allowed text-slate-400":`bg-gradient-to-r ${subject.gradient} shadow-lg hover:shadow-xl hover:opacity-95`}`}>
            {loading?<Loader2 size={18} className="animate-spin"/>:<Sparkles size={18}/>}
            {loading?"Generating your worksheet…":rawText?"Generate New Worksheet":"Generate Resource"}
          </button>
          {error&&(<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"><AlertCircle size={15} className="mt-0.5 flex-shrink-0"/><div><p>{error}</p><button onClick={generate} className="mt-2 flex items-center gap-1.5 text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all"><RefreshCw size={11}/> Try Again</button></div></div>)}
        </div>

        {rawText&&parsed&&warnings.length>0&&(
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2 rex-no-print">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0"/>
            <div>
              <p className="font-bold">This worksheet looks incomplete</p>
              <ul className="mt-1 space-y-0.5 text-xs">{warnings.map((w,i)=>(<li key={i}>· {w}</li>))}</ul>
              <button onClick={generate} className="mt-2 flex items-center gap-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all"><RefreshCw size={11}/> Generate Again</button>
            </div>
          </div>
        )}
        {rawText&&parsed&&outputMode==="print"&&<PrintableView parsed={parsed} subject={subject} grade={grade} showKey={showKey} onToggleKey={()=>setShowKey(!showKey)}/>}
        {rawText&&parsed&&outputMode==="tpt"&&<TPTPrintView parsed={parsed} subject={subject} grade={grade} showKey={showKey} onToggleKey={()=>setShowKey(!showKey)}/>}
        {rawText&&outputMode==="raw"&&<RawView text={rawText} subject={subject}/>}
        {rawText&&parsed&&outputMode==="canva"&&<CanvaView parsed={parsed} subject={subject} grade={grade}/>}
      </div>
    </div>
  );
}
