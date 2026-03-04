/**
 * skillMap.js
 *
 * Single source of truth that binds:
 *   - SkillTree node IDs
 *   - ContentPanel card types (and their metadata)
 *   - Keywords the LLM reply must contain to trigger an unlock
 *
 * The backend reads this same keyword list and returns which node IDs
 * to unlock based on the assistant's reply.
 */

export const SKILL_MAP = [

    // ── CENTER ────────────────────────────────────────────────────────────
    {
        nodeId: 'center',
        card: { type: 'intro', title: 'Didula', subtitle: 'Full-stack dev, game engineer & perpetual learner' },
        keywords: ['didula', 'who are you', 'about you', 'introduce yourself', 'tell me about', 'who is this'],
    },

    // ── IDENTITY ──────────────────────────────────────────────────────────
    {
        nodeId: 'origin',
        card: null,
        keywords: ['sri lanka', 'sri lankan', 'born in', 'roots', 'grew up', 'home country', 'where are you from'],
    },
    {
        nodeId: 'age',
        card: null,
        keywords: ['1999', 'born in', 'age', 'years old', '26', 'how old'],
    },
    {
        nodeId: 'location',
        card: null,
        keywords: ['australia', 'melbourne', 'where do you live', 'based in', 'currently in', 'living in'],
    },
    {
        nodeId: 'personality',
        card: null,
        keywords: ['ambivert', 'personality', 'introvert', 'extrovert', 'quiet', 'noisy', 'social', 'character'],
    },
    {
        nodeId: 'drive',
        card: null,
        keywords: ['motivation', 'drive', 'thirst', 'learn', 'curious', 'why do you', 'what drives', 'passion', 'obsessed'],
    },
    {
        nodeId: 'mindset',
        card: null,
        keywords: ['leader', 'leadership', 'competitive', 'ambitious', 'teach', 'mentor', 'mindset', 'attitude'],
    },
    {
        nodeId: 'solo',
        card: null,
        keywords: ['solo', 'alone', 'independent', 'solo dev', 'by yourself', 'own projects', 'self-driven'],
    },
    {
        nodeId: 'traveller',
        card: null,
        keywords: ['travel', 'travelled', 'london', 'countries', 'moved', 'lived abroad', 'international', 'westminster'],
    },

    // ── EDUCATION ─────────────────────────────────────────────────────────
    {
        nodeId: 'bsc',
        card: null,
        keywords: ['westminster', 'bsc', 'bachelor', 'undergraduate', 'london', 'computer science', 'games degree', 'graphics degree'],
    },
    {
        nodeId: 'msc',
        card: null,
        keywords: ['swinburne', 'msc', 'master', 'postgrad', 'postgraduate', 'melbourne university', 'software development master', 'quantum course', 'it professional'],
    },

    // ── TECH STACK ────────────────────────────────────────────────────────
    {
        nodeId: 'languages',
        card: null,
        keywords: ['java', 'javascript', 'php', 'c#', 'c++', 'python', 'ruby', 'html', 'css', 'programming language', 'languages', 'code in', 'polyglot'],
    },
    {
        nodeId: 'frameworks',
        card: null,
        keywords: ['vue', 'react', 'rails', 'ruby on rails', 'framework', 'frontend framework', 'tech stack', 'web framework'],
    },
    {
        nodeId: 'game-engines',
        card: null,
        keywords: ['unity', 'unreal', 'godot', 'game engine', 'unreal engine', 'game development tool'],
    },
    {
        nodeId: 'cloud-ai',
        card: null,
        keywords: ['cloud', 'ai', 'artificial intelligence', 'machine learning', 'cloud computing', 'aws', 'azure', 'llm', 'language model'],
    },

    // ── SPECIALISATIONS ───────────────────────────────────────────────────
    {
        nodeId: 'fullstack',
        card: { type: 'spec_fullstack', title: 'Full-Stack Dev', subtitle: 'End-to-end web and app development' },
        keywords: ['full-stack', 'full stack', 'frontend', 'backend', 'web dev', 'web development', 'app development', 'end to end'],
    },
    {
        nodeId: 'game-eng',
        card: { type: 'ge_intro', title: 'Game Engineering', subtitle: 'Hyper-casual mobile games & interactive experiences' },
        keywords: ['game engineer', 'game engineering', 'game dev', 'game development', 'mobile game', 'hyper-casual', 'unity project', 'unreal project'],
    },
    {
        nodeId: 'graphics',
        card: { type: 'spec_graphics', title: 'Graphics Dev', subtitle: 'Rendering, visual systems, game visuals' },
        keywords: ['graphics', 'rendering', 'visual systems', 'shader', 'opengl', 'computer graphics', 'game visuals', 'graphics development'],
    },
    {
        nodeId: 'freelance',
        card: { type: 'spec_freelance', title: 'Freelancer', subtitle: 'Active freelancer in web and app development' },
        keywords: ['freelance', 'freelancer', 'client', 'contract', 'hired', 'self-employed', 'freelance work', 'clients'],
    },

    // ── SOFTWARE ENGINEERING ──────────────────────────────────────────────
    {
        nodeId: 'se-intro',
        card: { type: 'se_intro', title: 'Software Engineering', subtitle: 'Enterprise systems & APIs' },
        keywords: ['software engineering', 'enterprise', 'api', 'systems', 'backend systems', 'software engineer', 'automation platform'],
    },
    {
        nodeId: 'se-weather',
        card: { type: 'se_dialog_weather', title: 'Dialog Weather App', subtitle: 'Fully functional weather forecasting website' },
        keywords: ['dialog weather', 'weather app', 'weather website', 'forecasting', 'weather forecast', 'dialog project'],
    },
    {
        nodeId: 'se-appmaker',
        card: { type: 'se_dialog_app_maker', title: 'Dialog App Maker', subtitle: 'Fully functional automation platform to build apps' },
        keywords: ['dialog app maker', 'app maker', 'automation platform', 'build apps', 'dialog automation', 'app builder'],
    },

    // ── PROJECTS & PORTFOLIO ──────────────────────────────────────────────
    {
        nodeId: 'portfolio',
        card: { type: 'project_portfolio', title: 'sadidula.github.io', subtitle: 'Personal portfolio — hub of projects, skills and identity' },
        keywords: ['portfolio', 'github.io', 'sadidula', 'personal site', 'personal website', 'this website', 'your site'],
    },
    {
        nodeId: 'nursery',
        card: { type: 'project_nursery', title: 'Paradise Valley Nursery', subtitle: 'Real client project — paradisevalleynursery.com.au' },
        keywords: ['paradise valley', 'nursery', 'plant nursery', 'paradisevalleynursery', 'client website', 'nursery website'],
    },

    // ── LIFESTYLE ─────────────────────────────────────────────────────────
    {
        nodeId: 'fps',
        card: null,
        keywords: ['apex', 'apex legends', 'battlefield', 'rainbow six', 'r6', 'fps', 'competitive gaming', 'shooter', 'gaming', 'games you play'],
    },
    {
        nodeId: 'gym',
        card: null,
        keywords: ['gym', 'fitness', 'workout', 'lift', 'exercise', 'training', 'health', 'physical'],
    },

    // ── GAME PROJECTS ─────────────────────────────────────────────────────
    {
        nodeId: 'ge-rope-gang',
        card: { type: 'ge_rope_gang', title: 'Rope Gang', subtitle: 'Hyper-casual 3D puzzle-action mobile game with 2M+ downloads' },
        keywords: ['rope gang', '2 million', '2m+', '2m downloads', 'rope', 'flagship game', 'puzzle action'],
    },
    {
        nodeId: 'ge-scribble',
        card: { type: 'ge_scribble_love', title: 'Scribble Love', subtitle: 'Casual puzzle game with physics-based drawing interactions' },
        keywords: ['scribble love', 'scribble', 'drawing game', 'physics drawing', 'draw puzzle', 'casual puzzle'],
    },
    {
        nodeId: 'ge-dressup',
        card: { type: 'ge_dress_up', title: 'Dress Up', subtitle: 'Arcade-style mobile game designed for a female audience' },
        keywords: ['dress up', 'dressup', 'fashion game', 'arcade style', 'female audience', 'styling game'],
    },
    {
        nodeId: 'ge-gangvgang',
        card: { type: 'ge_gang_vs_gang', title: 'Gang vs Gang', subtitle: 'Arcade-style crowd-control game inspired by Rope Gang' },
        keywords: ['gang vs gang', 'gang versus gang', 'crowd control', 'crowd game', 'rope gang inspired'],
    },
    {
        nodeId: 'ge-delivery',
        card: { type: 'ge_delivery_stacks', title: 'Delivery Stacks', subtitle: 'Hyper-casual mobile game with physics-based challenges' },
        keywords: ['delivery stacks', 'delivery game', 'stacking game', 'physics challenge', 'stack game'],
    },
    {
        nodeId: 'ge-dropfill',
        card: { type: 'ge_drop_n_fill', title: 'Drop N Fill', subtitle: 'Hyper-casual puzzle game with intuitive controls' },
        keywords: ['drop n fill', 'drop and fill', 'drop fill', 'fill puzzle', 'drop game'],
    },
    {
        nodeId: 'ge-phoneunlock',
        card: { type: 'ge_phone_unlock', title: 'Phone Unlock', subtitle: 'Puzzle-style mobile game with satisfying unlock mechanics' },
        keywords: ['phone unlock', 'unlock game', 'unlock puzzle', 'phone game', 'unlocking mechanic'],
    },

    // ── FRONTIER ──────────────────────────────────────────────────────────
    {
        nodeId: 'quantum',
        card: { type: 'frontier_quantum', title: 'Quantum Computing', subtitle: 'Current obsession — quantum engineering and computing' },
        keywords: ['quantum', 'quantum computing', 'quantum engineering', 'quantum mechanics', 'qubits', 'quantum tech'],
    },
    {
        nodeId: 'robotics',
        card: { type: 'frontier_robotics', title: 'Robotics', subtitle: 'New frontier — exploring robotics and engineering curiosity' },
        keywords: ['robotics', 'robot', 'robots', 'robotic engineering', 'automation', 'mechanical engineering', 'hardware'],
    },
]

/**
 * Given an LLM reply string, return the list of node IDs that should be unlocked.
 * Matching is case-insensitive.
 *
 * @param {string} replyText - The raw text of the LLM's reply
 * @returns {string[]} - Array of node IDs to unlock
 */
export function detectUnlocks(replyText) {
    if (!replyText) return []
    const lower = replyText.toLowerCase()
    const toUnlock = []

    for (const entry of SKILL_MAP) {
        if (entry.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
            toUnlock.push(entry.nodeId)
        }
    }

    return [...new Set(toUnlock)]   // deduplicate
}

/**
 * Given an array of freshly unlocked node IDs, return any cards
 * that should be surfaced in the ContentPanel.
 *
 * Only entries with a non-null `card` field are returned.
 *
 * @param {string[]} nodeIds
 * @returns {{ type: string, title: string, subtitle: string }[]}
 */
export function getCardsForNodes(nodeIds) {
    return nodeIds
        .map(id => SKILL_MAP.find(e => e.nodeId === id)?.card)
        .filter(Boolean)
}