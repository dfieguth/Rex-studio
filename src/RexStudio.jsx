import { useState } from "react";
import {
  Sparkles, Printer, Copy, Check, ChevronDown,
  BookOpen, PenTool, FlaskConical, Globe, Calculator,
  Loader2, AlertCircle, Eye, EyeOff, ExternalLink, RefreshCw,
  Package, Layout, Type
} from "lucide-react";

// ─── STANDARDS MAP ────────────────────────────────────────────────────────────

const STANDARDS = {
  5: {
    math: {
      "Fractions Practice":        { codes:"5.NF.1–7", focus:"Adding/subtracting fractions with unlike denominators, multiplying and dividing fractions and mixed numbers, fraction word problems.", skills:["unlike denominators","mixed numbers","equivalent fractions","fraction multiplication","fraction division","multi-step fraction word problems"] },
      "Decimals Practice":         { codes:"5.NBT.1–4, 5.NBT.7", focus:"Place value to thousandths, powers of 10, comparing and rounding decimals, decimal operations.", skills:["decimal place value","powers of 10","comparing decimals","rounding","decimal operations","decimal word problems"] },
      "Multiplication & Division": { codes:"5.NBT.2, 5.NBT.5–6, 5.OA.1–2", focus:"Multi-digit multiplication, division with 2-digit divisors, numerical expressions with parentheses.", skills:["multi-digit multiplication","long division","order of operations","numerical expressions","estimation"] },
      "Volume":                    { codes:"5.MD.C.3–5", focus:"Volume of rectangular prisms using unit cubes and formulas V=lwh and V=bh, additive volumes, real-world volume problems.", skills:["unit cubes","V=lwh formula","V=bh formula","additive volume","volume word problems"] },
      "Coordinate Plane & Geometry": { codes:"5.G.1–4, 5.MD.1–2", focus:"Plotting and interpreting ordered pairs, classifying 2D figures, measurement conversion, line plots.", skills:["ordered pairs","coordinate plane","classifying shapes","quadrilaterals","triangles","unit conversion","line plots"] },
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
      "Story Elements":          { codes:"5.RL.1–3, 5.RL.5–6", focus:"Character, conflict, theme, plot structure, narrator point of view.", skills:["character traits/motivation","conflict/resolution","theme vs topic","plot structure","point of view"], passage:true },
      "Author's Purpose":        { codes:"5.RI.6, 5.RI.8, 5.RL.6", focus:"Author's purpose and point of view, evaluating evidence, fact vs opinion.", skills:["persuade/inform/entertain","author's bias","evaluating evidence","author's claim","fact vs opinion"], passage:true },
      "Text Evidence":           { codes:"5.RI.1, 5.RL.1, 5.W.9", focus:"Quoting accurately from text to explain and support inferences.", skills:["locating evidence","quoting correctly","evidence relevance","connecting to claim"], passage:true },
      "Compare & Contrast":      { codes:"5.RI.3, 5.RI.9, 5.RL.3, 5.RL.9", focus:"Comparing two texts, multiple accounts, structure analysis.", skills:["comparing texts","Venn diagram thinking","comparing characters","synthesizing"], passage:true },
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
      "Human Body":         { codes:"NGSS 5-LS1, CA Life Sci", focus:"Body systems and interactions: digestive, respiratory, circulatory, skeletal, muscular, nervous.", skills:["body systems","organs and roles","system interactions","nutrients/digestion"] },
    },
    social: {
      "US History":          { codes:"CA HSS 5.1–5.8", focus:"Pre-Columbian, Exploration, Colonial America, Revolution, Constitution, westward expansion.", skills:["cause/effect","primary vs secondary sources","chronological thinking","historical significance"] },
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
      "Physical Science: Waves & Light":   { codes:"NGSS 4-PS4-1, 4-PS4-2", focus:"Wave patterns and amplitude, light and vision, how eyes detect light.", skills:["wave patterns","amplitude","wave properties","light reflection","vision","how eyes work"] },
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
};


// ─── TOPIC ROTATION LISTS ─────────────────────────────────────────────────────

const TOPICS = {
  5: {
    ela: ["the California Gold Rush and the forty-niners","California missions and their impact on Native peoples","the transcontinental railroad and Chinese workers","the California aqueduct and water systems","the 1906 San Francisco earthquake and rebuilding","California's Central Valley farming and agriculture","Native California tribes and their traditions","the history of California becoming the 31st state","California wildfires and the bravery of firefighters","the Channel Islands National Park and its wildlife","the American Revolution and its causes","the Underground Railroad and Harriet Tubman","immigration through Ellis Island in the early 1900s","the Declaration of Independence and its meaning","the Dust Bowl and the migration of families to California","monarch butterfly migration through California","the water cycle and California droughts","volcanoes and plate tectonics","the life cycle of Pacific salmon in California rivers","ocean ecosystems and kelp forests off the California coast","animal adaptations in the Mojave Desert","renewable energy and solar power in California","the science of earthquakes and seismology","wolves and their role in balancing ecosystems","rainforest biodiversity and the canopy layer","deep sea creatures and bioluminescence","coral reefs and ocean health","the International Space Station and astronaut life","Mars exploration and NASA rovers","weather systems and how hurricanes form","Cesar Chavez and the farmworkers movement","Amelia Earhart and the history of aviation","Thomas Edison and the invention of the lightbulb","Maya Lin and the Vietnam Veterans Memorial","Sally Ride — America's first woman in space","John Muir and the California conservation movement","Thurgood Marshall and the fight for civil rights","Malala Yousafzai and the right to education","Neil Armstrong and the Apollo 11 moon landing","Nikola Tesla and the development of electricity","the history of the Olympic Games","how California grows half of America's fruits and vegetables","the Pony Express and early American communication","the history of the Golden Gate Bridge","how national parks were created and why they matter","how newspapers shaped American democracy","the history of the public library in America","how the US Constitution protects our rights","the history of women's suffrage and the 19th Amendment","the history of Braille and Louis Braille"],
    math: ["planning a school fundraiser car wash","organizing a 5th grade graduation celebration","running a school supply store","tracking a classroom reading challenge","planning a school garden project","organizing a canned food drive for families","budgeting for a class field trip to the California Science Center","planning a school mural painting project","running a school recycling program","organizing a school book fair","calculating stats for a Little League baseball season","planning a school basketball tournament bracket","tracking a swim team's practice distances","organizing a school Olympics event","planning a class hiking trip in a California state park","tracking a soccer team's season scoring record","planning a school fun run fundraiser","calculating scores for a school spelling bee competition","running a school bake sale","planning a class Thanksgiving potluck","scaling recipes for a school cooking class","budgeting for a taco cart at a school carnival","calculating ingredients for a class pizza party","running a lemonade stand as a class economics project","planning a family road trip from Los Angeles to San Francisco","calculating distances between California national parks","budgeting for a family trip to Yosemite National Park","planning a community farmers market booth","tracking water usage during a California drought conservation effort","designing a classroom layout using area and perimeter","planning a school vegetable garden with raised beds","calculating materials needed for a school bench project","measuring and tiling a school bathroom floor","designing a new playground for the school yard","analyzing rainfall data for California cities","tracking daily temperatures across California regions","calculating the cost of solar panels for the school roof","analyzing results from a class science experiment","tracking plant growth measurements in a class experiment","planning a birthday party on a budget","calculating sales tax at a California store","comparing prices at two different grocery stores","budgeting a weekly allowance over a school year","calculating earnings from a neighborhood dog walking business","planning a clothing donation drive for families","calculating postage costs for a pen pal project","budgeting for new classroom library books","tracking miles walked in a school step challenge","calculating the cost of a class subscription to a science magazine","planning a school talent show ticket sales and seating"],
    science: ["how plants make food through photosynthesis","food webs in a California oak woodland ecosystem","the role of decomposers in a healthy forest","how energy moves through a food chain","producers, consumers, and decomposers in a tide pool","how drought affects plant and animal life in California","the life cycle of a California condor","how bees pollinate flowers and support food production","invasive species and their impact on California ecosystems","how salmon depend on healthy rivers to reproduce","how human activity disrupts food webs","the role of fungi in breaking down dead matter","how photosynthesis supports all life on Earth","properties of matter — solids, liquids, and gases","physical and chemical changes in everyday materials","how mixtures and solutions are different","conservation of matter in a chemical reaction","gravity and how it affects objects on Earth","how energy transfers from the sun to living things","density and why objects float or sink in water","how heat energy moves through conduction and convection","the properties of light and how shadows form","magnetism and how it works in everyday life","how forces affect the motion of objects","the difference between potential and kinetic energy","Earth's layers — crust, mantle, outer core, and inner core","how the water cycle works in California","why Earth's climate varies across different regions","how plate tectonics cause earthquakes and volcanoes","the role of the sun as Earth's main energy source","how humans affect Earth's land and water resources","the distribution of fresh water on Earth","how weathering and erosion shape California's landscape","Earth's atmosphere and its protective layers","how climate change affects California's weather patterns","the causes and effects of ocean pollution","how deforestation affects Earth's carbon cycle","how scientists design fair experiments","how to identify variables in a scientific investigation","how engineers use the design process to solve problems","how scientists analyze data and draw conclusions","how scientific models help us understand the natural world","the difference between a hypothesis and a theory","how technology helps scientists study Earth from space","how citizen scientists help track environmental changes","the history of the scientific method from Galileo to today","how scientists use evidence to change their thinking","how the moon affects Earth's ocean tides","the rock cycle and how rocks change over time","how animals adapt to survive California's rainy season"],
    social: ["Native American life in California before European contact","the Maya civilization and their achievements in math and astronomy","the Aztec Empire and the city of Tenochtitlan","Christopher Columbus and the age of exploration","how Europeans and Native Americans first interacted","the Columbian Exchange — plants, animals, and diseases","daily life in a New England colonial town","the triangular trade and its impact on colonists and enslaved people","the Mayflower Compact and the idea of self-government","the role of religion in Colonial America","how colonial economies differed by region","life on a Southern plantation in Colonial America","the Boston Tea Party and colonial protests against Britain","how enslaved people resisted and preserved their culture","the role of colonial newspapers in spreading ideas","the causes of the American Revolution","the role of Paul Revere and the Minutemen at Lexington","Thomas Paine's Common Sense and its influence on colonists","the Battle of Saratoga as the turning point of the Revolution","the role of women in supporting the American Revolution","how the Continental Army survived the winter at Valley Forge","Benjamin Franklin's role as diplomat during the Revolution","the Constitutional Convention of 1787 and the Great Compromise","the Bill of Rights and why each amendment matters","how the three branches of government work together","checks and balances and why they protect democracy","the role of George Washington as the first president","how the Louisiana Purchase doubled the size of the United States","the Lewis and Clark Expedition across the Louisiana Territory","the Oregon Trail and the challenges of westward migration","the California Gold Rush of 1849","how the transcontinental railroad changed American commerce","the impact of westward expansion on Native American nations","the five geographic regions of the United States","how geography shaped where colonists chose to settle","major rivers and their importance to early American history","the Great Plains and how settlers adapted to the environment","how the Rocky Mountains affected the pace of westward expansion","the role of citizens in a democratic government","how a bill becomes a law in the United States","the importance of the freedom of speech and the press","how local, state, and federal governments are different","the Electoral College and how the president is elected","supply and demand in colonial trade","how mercantilism shaped the relationship between colonies and Britain","the role of money, barter, and trade in early America","how taxation without representation angered colonists","comparing the economies of Northern and Southern colonies","the role of the free press in American democracy","how the Erie Canal changed trade in early America"],
    writing: ["should students have homework every night","should schools have a school uniform policy","should recess be longer in elementary school","should students be allowed to use tablets in class every day","should schools serve healthier food in the cafeteria","should physical education be required every school day","should students be able to choose their own reading books","should schools start later in the morning for better sleep","should students learn a second language starting in kindergarten","should schools ban junk food and sugary drinks","should students have a say in creating classroom rules","should school libraries have more graphic novels and comics","should there be limits on screen time for kids","a day when everything went wrong but turned out okay","the day you discovered a hidden talent","a time you showed courage when it was difficult","your most memorable family tradition or celebration","a day exploring a California state park or beach","the best lesson a grandparent or elder ever taught you","a time you had to solve a really difficult problem","a moment when you felt genuinely proud of yourself","a time you tried something completely new and unexpected","the day you made an unexpected friendship","a time you helped someone who really needed it","the most important thing you learned in 5th grade","explain how the water cycle works and why it matters","describe how the three branches of US government are organized","explain why California is called the Golden State","describe the importance of the Bill of Rights to Americans today","explain how photosynthesis supports all life on Earth","describe the main causes of the American Revolution","explain how earthquakes happen and how scientists measure them","describe the journey and hardships of a California Gold Rush miner","explain the importance of water conservation in California","describe how a bill becomes a law in the United States","a letter from a student to their school principal","a diary entry written by a colonial child in 1750","a news report about an important school event","a letter from a Gold Rush miner to their family back home","a travel brochure for a California national park","a book review of a favorite novel read this year","an advertisement for a school fundraiser event","a thank-you letter to a community hero or mentor","a letter to a future 5th grader about what to expect","explain what makes a good leader using a historical example","describe a California landmark and why it is important","a speech to convince the school board to add an art program","explain the importance of voting in a democracy","describe the most interesting thing you learned in science this year","a letter from a student to their favorite author"],
  },
  4: {
    ela: ["the California Gold Rush and life in the mining camps","the Spanish missions of California and their lasting impact","Juan Cabrillo's voyage along the California coast","the role of the Franciscan missionaries in California","California Indian nations and their traditions","the Bear Flag Republic and California's path to statehood","Biddy Mason — from enslaved person to California pioneer","James Marshall's discovery of gold at Sutter's Mill","the building of the transcontinental railroad through California","Chinese immigrants and their contributions to California","the effects of the 1882 Chinese Exclusion Act","how the Dust Bowl brought families to California","California during World War II — shipyards and sacrifice","the history of the Central Valley and California farming","John Muir and the fight to protect Yosemite","the California condor and efforts to save it","the Sacramento River and California's water history","how California's aqueduct system was built","the history of California's state government","the geography of California's coastal regions","the Sierra Nevada mountains and their importance","the Mojave Desert and the people who live there","California's Central Valley — the nation's breadbasket","Ansel Adams and the art of photographing nature","Dorothea Lange and documenting the Great Depression","Walt Disney and the rise of the entertainment industry","John Steinbeck and the story of California's migrant workers","the history of California's public school system","how earthquakes shape California's landscape","California wildfires and how communities rebuild","the kelp forests of California's coastline","gray whales and their migration along the California coast","California tide pools and the creatures that live in them","the history of the Pony Express","how the Golden Gate Bridge was designed and built","the life of a California rancho in the 1830s","the Mexican War of Independence and its effect on California","how California's diverse regions have different climates","the role of Sacramento as California's state capital","California's role in the aerospace industry"],
    math: ["planning a 4th grade field trip to the California State Capitol","organizing a school supply drive for a local shelter","budgeting for a classroom pizza party","tracking a reading log challenge across the school","planning a community garden for the school","calculating distances on a map of California","organizing a school book swap event","tracking rainfall data for a California city","planning a school bake sale with multiple items","calculating the area of the school garden beds","measuring and comparing the height of sunflowers grown in class","planning a Thanksgiving feast for the class","calculating the cost of school supplies for the year","organizing a school clothing drive by weight","budgeting for a class camping trip to a California state park","tracking the growth of California oak seedlings","planning a school mural with specific dimensions","calculating the perimeter of the school playground","organizing a canned food drive and tracking totals","planning a school sports day with multiple events","calculating stats for a classroom kickball tournament","planning a community car wash to raise money","tracking miles walked during a school step challenge","budgeting for a classroom aquarium project","planning a school carnival with booth costs and earnings","calculating the number of tiles needed for a school project","tracking daily temperature changes in a California city","planning a school garden using area and perimeter","calculating the cost of painting a classroom wall","budgeting for new books for the school library","planning a school recycling program and tracking weight","measuring ingredients for a 4th grade cooking class","calculating the distance from school to nearby landmarks","tracking attendance for a school event over multiple days","planning a school talent show and ticket sales","calculating the cost of a class subscription to a magazine","budgeting for a class celebration at the end of the year","tracking the growth of bean plants over several weeks","planning a community cleanup event and supplies needed","calculating the cost of materials for a school art project"],
    science: ["how plant roots and stems help plants survive","how leaves use sunlight to make food for a plant","how animal fur, feathers, and shells help them survive","how a dog's nose helps it find food and stay safe","how eyes and ears help animals respond to their environment","how camouflage helps animals hide from predators","the role of a plant's flowers and seeds in reproduction","how energy from food gives animals the ability to move","what happens to energy when a ball is thrown and caught","how a roller coaster uses kinetic and potential energy","how a simple machine like a lever transfers energy","what happens to energy when two objects collide","how sound travels as a wave through the air","how light bounces off mirrors and other surfaces","why we see colors in a rainbow after rain","how the human eye detects light to create images","how rock layers at the Grand Canyon show Earth's history","how fossils are formed and what they tell us","how rivers carve canyons over thousands of years","how wind and rain shape the hills of California","how California's earthquake faults change the landscape","how mapmakers show mountains and valleys","how scientists map the ocean floor","how coal and oil formed from ancient living things","how solar panels capture energy from the sun","how wind turbines generate electricity","why some energy sources are renewable and others are not","how communities prepare for earthquake damage","how engineers design buildings to survive earthquakes","how scientists test solutions to reduce erosion","how a scientist designs a fair experiment","how engineers use the design process to solve a problem","how scientists identify variables in an investigation","how scientists use data to draw conclusions","how scientific models help explain things we cannot see","how citizen scientists help track California bird populations","the difference between a scientific hypothesis and a theory","how technology helps scientists study California's faults","how evidence from rocks tells us about ancient climates","how engineers improve designs after testing them"],
    social: ["the physical regions of California — coast, valley, mountain, and desert","how latitude and longitude help us locate places in California","how California's Central Valley became a farming region","how the Sierra Nevada mountains affected westward migration","how ocean currents affect California's climate","how the Sacramento and San Joaquin rivers shaped settlement","California's natural resources — gold, timber, oil, and water","how the desert climate of Southern California affected Native peoples","major California Indian nations and their geographic distribution","how the Chumash people used the ocean for food and trade","how the Miwok people adapted to the Sierra Nevada foothills","how California's Native peoples built shelters and gathered food","the spiritual traditions and ceremonies of California Indian nations","Juan Rodriguez Cabrillo's 1542 exploration of California's coast","how the Spanish chose locations for their California missions","life inside a California mission — work, worship, and conflict","the impact of the mission system on California's Native peoples","Junipero Serra and the founding of the California missions","how the Mexican War of Independence changed life in California","the rancho period — land grants and cattle ranching in California","daily life on a California rancho in the 1830s","how the Bear Flag Revolt led to California's independence","the Mexican-American War and California's transfer to the United States","John C. Fremont's role in California's path to statehood","the discovery of gold at Sutter's Mill in January 1848","how the Gold Rush transformed San Francisco overnight","the routes forty-niners took to reach California","Biddy Mason's journey from slavery to freedom in California","how the Gold Rush changed California's economy and population","the debate over California's admission as a free state in 1850","the building of the first transcontinental railroad","the contributions of Chinese workers to the railroad","the Pony Express and how it connected California to the East","how immigration from China, Mexico, and Europe shaped California","the 1882 Chinese Exclusion Act and its effects on California","how Los Angeles grew from a small town to a major city","the effects of the Great Depression on California farm families","how the Dust Bowl migration brought thousands to California","California's role in World War II — shipbuilding and internment","how California's aerospace and technology industries developed"],
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

function buildPrompt(grade, subjectId, resourceType, difficulty, purpose, topic) {
  const std = STANDARDS[grade]?.[subjectId]?.[resourceType] || { codes:`${grade}th Grade CCSS`, focus:`${grade}th grade ${subjectId}`, skills:[resourceType] };
  const gradeLabel = grade === 5 ? "5th" : "4th";
  const diffGuide = { on:`Standard ${gradeLabel} grade difficulty. Moderate complexity. Distractors reflect real student errors.`, support:"Scaffolded. Simplified language, fewer steps, sentence frames for written responses.", extend:"Above grade level. Multi-step reasoning required. Students must justify and connect ideas." };
  const purposeGuide = { practice:"Lesson practice — right after instruction. Include a worked example or hint box. 12–15 questions.", homework:"Homework — completable independently in 15–20 min. No new concepts. 10–12 questions.", review:"SBAC/test review — mirror SBAC format. Include select-all-that-apply, constructed response, explain-your-thinking. 14–18 questions.", finisher:"Early finisher — engaging self-contained challenge. 8–10 rich questions.", assessment:"Quick assessment — tight focus on one skill. 6–8 questions max. Student self-assessment checkbox at bottom." };

  const subjectTopics = TOPICS[grade]?.[subjectId] || TOPICS[5].ela;
  const randomTopic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];

  return `You are creating a complete ${gradeLabel} grade California CCSS-aligned worksheet. Output ONLY structured plain text using exactly the section markers below. Follow the structure EXACTLY — do not move, rename, or skip any block.

DETAILS:
- Grade: ${gradeLabel} Grade
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
${gradeLabel} Grade · ${subjectId.toUpperCase()} · ${std.codes}

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
- Student-friendly warm tone appropriate for ${gradeLabel} grade.
- CRITICAL VARIATION RULE: Every generation must feel completely fresh and different. Never reuse the same passage topic, scenario, character names, or context from previous generations.
- For passages: use the assigned topic below. Do not default to generic topics.
- For math: use different real-world California contexts every time.
- For word problems: use different student names and scenarios every time.
- Generate as if this is the first and only time you are creating this type of worksheet.
- TOPIC FOR THIS WORKSHEET: ${randomTopic}. Build your passage, scenarios, and examples around this specific topic.`;
}

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

function renderSectionHTML(sec) {
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

function PrintableView({ parsed, subject, grade, showKey, onToggleKey }) {
  const hc = subject.hc;
  const gradeLabel = grade === 5 ? "5th" : "4th";
  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 rex-no-print">
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"><Printer size={12}/> Print / PDF</button>
          <button onClick={onToggleKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showKey?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            {showKey?<EyeOff size={12}/>:<Eye size={12}/>} {showKey?"Hide Key":"Answer Key"}
          </button>
        </div>
        <span className="text-xs text-slate-400 italic">CCSS · {gradeLabel} Grade · California</span>
      </div>
      <div className="rex-print-area">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div style={{background:`linear-gradient(135deg,${hc}18 0%,${hc}06 100%)`,borderTop:`4px solid ${hc}`}} className="px-7 py-5">
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
          <div className="px-7 py-5 space-y-6">
            {parsed.sections.map((sec,si)=>(
              <div key={si}>
                <div className="flex items-center gap-3 mb-4"><div className="h-px flex-1 bg-slate-100"/><h2 style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest px-2">{sec.heading}</h2><div className="h-px flex-1 bg-slate-100"/></div>
                <div dangerouslySetInnerHTML={{__html:renderSectionHTML(sec)}}/>
              </div>
            ))}
            {parsed.bonus&&(<div style={{background:`${hc}0d`,border:`1.5px solid ${hc}30`}} className="rounded-xl p-5"><p style={{color:hc}} className="text-xs font-extrabold uppercase tracking-widest mb-3">⭐ Bonus Challenge</p><p className="text-sm font-medium text-slate-800 mb-3">{parsed.bonus.split("\n")[0]}</p>{[...Array(4)].map((_,i)=><div key={i} className="border-b border-slate-300 h-7 mt-1.5 w-full"/>)}</div>)}
          </div>
          <div className="px-7 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-300">© REX Resource Studio · {gradeLabel} Grade · For classroom use</span>
            <div className="flex gap-1">{[...Array(4)].map((_,i)=><div key={i} style={{background:`${hc}50`}} className="w-1 h-1 rounded-full"/>)}</div>
          </div>
        </div>
        {showKey&&parsed.answerKey&&(
          <div className="mt-4 bg-slate-800 rounded-2xl p-5 rex-answer-key" style={{pageBreakBefore:"always"}}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Answer Key</p>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">{parsed.answerKey}</pre>
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

function CanvaView({ parsed, subject, grade }) {
  const hc = subject.hc;
  const gradeLabel = grade === 5 ? "5th" : "4th";
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
  return (
    <div className="space-y-4">
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
      {canvaSections.map((sec,i)=>(<CanvaSection key={i} index={i+1} title={sec.title} content={sec.content} color={hc}/>))}
    </div>
  );
}

export default function RexStudio() {
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
      const result = await callClaude(prompt, apiKey, 4000);
      setRawText(result);
      setParsed(parseWorksheet(result));
    } catch(e) { setError(e.message||"Something went wrong. Please try again."); }
    setLoading(false);
  };

  const gradeLabel = grade === 5 ? "5th" : "4th";

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
          <div className="grid grid-cols-2 gap-3">
            {[5,4].map(g=>(
              <button key={g} onClick={()=>handleGrade(g)} className={`py-3 rounded-xl text-sm font-extrabold border-2 transition-all ${grade===g?"bg-slate-800 text-white border-slate-800 shadow-md":"bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                {g}th Grade
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
              <div className="grid grid-cols-3 gap-2">
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

        {rawText&&parsed&&outputMode==="print"&&<PrintableView parsed={parsed} subject={subject} grade={grade} showKey={showKey} onToggleKey={()=>setShowKey(!showKey)}/>}
        {rawText&&outputMode==="raw"&&<RawView text={rawText} subject={subject}/>}
        {rawText&&parsed&&outputMode==="canva"&&<CanvaView parsed={parsed} subject={subject} grade={grade}/>}
      </div>
    </div>
  );
}
