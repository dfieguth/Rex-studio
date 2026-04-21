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
    "Vocabulary Practice":   { codes:"5.L.4–6",               focus:"Context clues, Greek/Latin roots, figurative language, academic vocabulary.", skills:["context clues","Greek/Latin roots","prefixes/suffixes","simile/metaphor","idioms","academic vocabulary"] },
    "Context Clues":         { codes:"5.L.4a, 5.RI.4, 5.RL.4",focus:"Determining word meaning using context; literal vs nonliteral meaning.", skills:["definition clues","synonym clues","antonym clues","example clues","inference clues"] },
    "Main Idea & Details":   { codes:"5.RI.2–3, 5.RI.5",      focus:"Main ideas, supporting details, summarizing, text structure.", skills:["identifying main idea","topic vs main idea","supporting details","summarizing","text structure"] },
    "Story Elements":        { codes:"5.RL.1–3, 5.RL.5–6",    focus:"Character, conflict, theme, plot structure, narrator point of view.", skills:["character traits/motivation","conflict/resolution","theme vs topic","plot structure","point of view"] },
    "Author's Purpose":      { codes:"5.RI.6, 5.RI.8, 5.RL.6",focus:"Author's purpose and point of view, evaluating evidence, fact vs opinion.", skills:["persuade/inform/entertain","author's bias","evaluating evidence","author's claim","fact vs opinion"] },
    "Text Evidence":         { codes:"5.RI.1, 5.RL.1, 5.W.9", focus:"Quoting accurately from text to explain and support inferences.", skills:["locating evidence","quoting correctly","evidence relevance","connecting to claim"] },
    "Compare & Contrast":    { codes:"5.RI.3, 5.RI.9, 5.RL.3, 5.RL.9", focus:"Comparing two texts, multiple accounts, structure analysis.", skills:["comparing texts","Venn diagram thinking","comparing characters","synthesizing"] },
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
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text || "";
}

// ─── PROMPT ───────────────────────────────────────────────────────────────────

function buildPrompt(subjectId, resourceType, difficulty, purpose, topic) {
  const std = STANDARDS[subjectId]?.[resourceType] || { codes:"5th Grade CCSS", focus:`5th grade ${subjectId}`, skills:[resourceType] };
  const diffGuide = { on:"Standard 5th grade difficulty. Moderate complexity. Distractors reflect real student errors.", support:"Scaffolded. Simplified language, fewer steps, sentence frames for written responses.", extend:"Above grade level. Multi-step reasoning required. Students must justify and connect ideas." };
  const purposeGuide = { practice:"Lesson practice — right after instruction. Include a worked example or hint box. 12–15 questions.", homework:"Homework — completable independently in 15–20 min. No new concepts. 10–12 questions.", review:"SBAC/test review — mirror SBAC format. Include select-all-that-apply, constructed response, explain-your-thinking. 14–18 questions.", finisher:"Early finisher — engaging self-contained challenge. 8–10 rich questions.", assessment:"Quick assessment — tight focus on one skill. 6–8 questions max. Student self-assessment checkbox at bottom." };

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
CRITICAL: This block MUST appear here, between [DIRECTIONS] and [SECTION: Warm-Up]. Do NOT put the passage inside a section. Do NOT skip this block.
(Write the passage title in ALL CAPS on the very first line)
(Write the full passage text below the title, 150–200 words. Make it engaging and appropriate for 5th grade California students.)

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

RULES: No placeholder text ever. Real numbers and scenarios only. California-relevant contexts. Student-friendly warm tone.`;
}

// ─── PARSE WORKSHEET ─────────────────────────────────────────────────────────

function parseWorksheet(text) {
  const get = (tag) => {
    const re = new RegExp(`\\[${tag}\\]\\n([\\s\\S]*?)(?=\\n\\[|$)`, "i");
    const m = text.match(re);
    return m ? m[1].trim() : "";
  };

  // Primary: look for explicit [PASSAGE] block
  let passage = get("PASSAGE");

  // Fallback: Claude sometimes embeds the passage before question 1 inside the first section
  // Detect by finding substantial text content before the first numbered question
  if (!passage) {
    const beforeFirstQ = text.match(/TYPE:\s*\w+\n([\s\S]*?)(?=\n\s*1\.)/i);
    if (beforeFirstQ) {
      const candidate = beforeFirstQ[1].trim();
      // Only treat as passage if substantial (100+ chars) with real sentences
      if (candidate.length > 100 && candidate.includes(".")) {
        passage = candidate;
      }
    }
  }

  const sectionRe = /\[SECTION:\s*([^\]]+)\]\nTYPE:\s*(\w+)\n([\s\S]*?)(?=\n\[SECTION:|\n\[BONUS\]|\n\[ANSWER KEY\]|\n\[TEACHER NOTES\]|$)/gi;
  const sections = [];
  let m;
  while ((m = sectionRe.exec(text)) !== null) {
    sections.push({ heading: m[1].trim(), type: m[2].trim(), content: m[3].trim() });
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
  const lines = sec.content.split("\n");
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
  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"><Printer size={12} /> Print / PDF</button>
          <button onClick={onToggleKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showKey ? "bg-slate-800 text-white border-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            {showKey ? <EyeOff size={12}/> : <Eye size={12}/>} {showKey ? "Hide Key" : "Answer Key"}
          </button>
        </div>
        <span className="text-xs text-slate-400 italic">CCSS · 5th Grade · California</span>
      </div>

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
        <div className="mt-4 bg-slate-800 rounded-2xl p-5">
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

  return (
    <div className="space-y-4">
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
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
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
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2 items-center">
            <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-… from console.anthropic.com" className="flex-1 px-3.5 py-2 rounded-xl border border-amber-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white font-mono"/>
            <button onClick={()=>{localStorage.setItem("tos2_settings",JSON.stringify({apiKey}));setShowApi(false);}} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors">Save</button>
          </div>
          <p className="text-xs text-amber-600 text-center mt-2">Get a key at <strong>console.anthropic.com</strong> → API Keys → Create Key</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Subject */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
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
