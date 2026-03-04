<script setup>
import { ref } from 'vue'
import ContextCard from './cards/ContextCard.vue'

// ─── card definitions ────────────────────────────────────────────────────────
// Cards start collapsed; they unlock / expand when the LLM mentions them.
// ─── card definitions ────────────────────────────────────────────────────────
// Cards start collapsed; they unlock / expand when the LLM mentions them.
const cards = ref([

    // ── CENTER ──
    {
        id: 1,
        title: 'Didula',
        subtitle: 'Full-stack dev, game engineer & perpetual learner',
        expanded: true,
        type: 'intro',
        unlocked: true,         // always visible
    },

    // ── IDENTITY ──
    {
        id: 2,
        title: 'Sri Lanka',
        subtitle: 'Born in Sri Lanka in 1999 — cultural roots that shaped a driven mindset',
        expanded: false,
        type: 'identity_origin',
        unlocked: false,
    },
    {
        id: 3,
        title: '26 y/o',
        subtitle: 'Born 1999 — two degrees, real products shipped, just getting started',
        expanded: false,
        type: 'identity_age',
        unlocked: false,
    },
    {
        id: 4,
        title: 'Melbourne, AU',
        subtitle: 'Currently based in Melbourne — studying, building, and freelancing',
        expanded: false,
        type: 'identity_location',
        unlocked: false,
    },
    {
        id: 5,
        title: 'Ambivert',
        subtitle: 'Loud one moment, invisible the next — thrives in solo deep work',
        expanded: false,
        type: 'identity_personality',
        unlocked: false,
    },
    {
        id: 6,
        title: 'Thirst to Learn',
        subtitle: 'Core drive — learn as much as possible about as many things as possible',
        expanded: false,
        type: 'identity_drive',
        unlocked: false,
    },
    {
        id: 7,
        title: 'Leader',
        subtitle: 'Ambitious, competitive, natural leader who loves to teach',
        expanded: false,
        type: 'identity_mindset',
        unlocked: false,
    },
    {
        id: 8,
        title: 'Solo Dev',
        subtitle: 'Prefers full ownership and creative control — independent by nature',
        expanded: false,
        type: 'identity_solo',
        unlocked: false,
    },
    {
        id: 9,
        title: 'Traveller',
        subtitle: 'Sri Lanka → London → Melbourne and many countries in between',
        expanded: false,
        type: 'identity_traveller',
        unlocked: false,
    },

    // ── EDUCATION ──
    {
        id: 10,
        title: 'BSc Westminster',
        subtitle: 'BSc Computer Science — Games & Computer Graphic Development, London',
        expanded: false,
        type: 'edu_bsc',
        unlocked: false,
    },
    {
        id: 11,
        title: 'MSc Swinburne',
        subtitle: 'Master of IT Professional Computing — AI, Quantum, Cloud, Software Dev',
        expanded: false,
        type: 'edu_msc',
        unlocked: false,
    },

    // ── TECH STACK ──
    {
        id: 12,
        title: 'Languages',
        subtitle: 'Java, JavaScript, PHP, C#, C++, Python, Ruby, HTML, CSS',
        expanded: false,
        type: 'tech_languages',
        unlocked: false,
    },
    {
        id: 13,
        title: 'Frameworks',
        subtitle: 'Vue, React, Rails — frontend to full-stack across the whole web layer',
        expanded: false,
        type: 'tech_frameworks',
        unlocked: false,
    },
    {
        id: 14,
        title: 'Game Engines',
        subtitle: 'Unity, Unreal Engine, and getting started with Godot',
        expanded: false,
        type: 'tech_game_engines',
        unlocked: false,
    },
    {
        id: 15,
        title: 'Cloud & AI',
        subtitle: 'Cloud computing and AI studied at postgrad level, applied across projects',
        expanded: false,
        type: 'tech_cloud_ai',
        unlocked: false,
    },

    // ── SPECIALISATIONS ──
    {
        id: 16,
        title: 'Full-Stack Dev',
        subtitle: 'End-to-end web and app development — frontend, backend, deployment',
        expanded: false,
        type: 'spec_fullstack',
        unlocked: false,
    },
    {
        id: 17,
        title: 'Game Engineering',
        subtitle: 'Deep expertise in game engineering — the specialisation he is most proud of',
        expanded: false,
        type: 'ge_intro',
        unlocked: false,
    },
    {
        id: 18,
        title: 'Graphics Dev',
        subtitle: 'Computer graphics development — rendering, visual systems, game visuals',
        expanded: false,
        type: 'spec_graphics',
        unlocked: false,
    },
    {
        id: 19,
        title: 'Freelancer',
        subtitle: 'Active freelancer specialising in web and app development',
        expanded: false,
        type: 'spec_freelance',
        unlocked: false,
    },

    // ── SOFTWARE ENGINEERING ──
    {
        id: 20,
        title: 'Software Engineering',
        subtitle: 'Enterprise systems, APIs and automation platforms',
        expanded: false,
        type: 'se_intro',
        unlocked: false,
    },
    {
        id: 21,
        title: 'Dialog Weather App',
        subtitle: 'Fully functional weather forecasting website',
        expanded: false,
        type: 'se_dialog_weather',
        unlocked: false,
    },
    {
        id: 22,
        title: 'Dialog App Maker',
        subtitle: 'Fully functional automation platform to build apps',
        expanded: false,
        type: 'se_dialog_app_maker',
        unlocked: false,
    },

    // ── PROJECTS & PORTFOLIO ──
    {
        id: 23,
        title: 'sadidula.github.io',
        subtitle: 'Personal portfolio — hub of projects, skills, and identity online',
        expanded: false,
        type: 'project_portfolio',
        unlocked: false,
    },
    {
        id: 24,
        title: 'Paradise Valley Nursery',
        subtitle: 'Real client project — paradisevalleynursery.com.au',
        expanded: false,
        type: 'project_nursery',
        unlocked: false,
    },

    // ── LIFESTYLE ──
    {
        id: 25,
        title: 'Competitive FPS',
        subtitle: 'Apex Legends, Battlefield, Rainbow Six Siege — precision and strategy',
        expanded: false,
        type: 'lifestyle_fps',
        unlocked: false,
    },
    {
        id: 26,
        title: 'Gym',
        subtitle: 'Hits the gym regularly — discipline outside code mirrors discipline inside it',
        expanded: false,
        type: 'lifestyle_gym',
        unlocked: false,
    },

    // ── GAME PROJECTS ──
    {
        id: 27,
        title: 'Rope Gang',
        subtitle: 'Hyper-casual 3D puzzle-action mobile game with 2M+ downloads',
        expanded: false,
        type: 'ge_rope_gang',
        unlocked: false,
    },
    {
        id: 28,
        title: 'Scribble Love',
        subtitle: 'Casual puzzle game with unique physics based drawing interactions',
        expanded: false,
        type: 'ge_scribble_love',
        unlocked: false,
    },
    {
        id: 29,
        title: 'Dress Up',
        subtitle: 'Arcade-style mobile game designed primarily for a female audience',
        expanded: false,
        type: 'ge_dress_up',
        unlocked: false,
    },
    {
        id: 30,
        title: 'Gang vs Gang',
        subtitle: 'Arcade-style crowd-control game inspired by the Rope Gang mechanics',
        expanded: false,
        type: 'ge_gang_vs_gang',
        unlocked: false,
    },
    {
        id: 31,
        title: 'Delivery Stacks',
        subtitle: 'Hyper-casual mobile game with fun physics-based challenges',
        expanded: false,
        type: 'ge_delivery_stacks',
        unlocked: false,
    },
    {
        id: 32,
        title: 'Drop N Fill',
        subtitle: 'Hyper-casual puzzle game with intuitive controls and playful visual feedback',
        expanded: false,
        type: 'ge_drop_n_fill',
        unlocked: false,
    },
    {
        id: 33,
        title: 'Phone Unlock',
        subtitle: 'Puzzle-style mobile game with satisfying unlocking mechanics and rewards',
        expanded: false,
        type: 'ge_phone_unlock',
        unlocked: false,
    },

    // ── FRONTIER ──
    {
        id: 34,
        title: 'Quantum Computing',
        subtitle: 'Current obsession — quantum engineering studied at MSc, actively diving deeper',
        expanded: false,
        type: 'frontier_quantum',
        unlocked: false,
    },
    {
        id: 35,
        title: 'Robotics',
        subtitle: 'New frontier — exploring robotics as part of a broader engineering curiosity',
        expanded: false,
        type: 'frontier_robotics',
        unlocked: false,
    },

])

let nextId = cards.value.length + 1

// ─── highlight toast ─────────────────────────────────────────────────────────
const highlight = ref('Chat with Kas to unlock cards!')

function setHighlight(text, duration = 4000) {
    highlight.value = text
    setTimeout(() => {
        highlight.value = 'Chat with Kas to unlock cards!'
    }, duration)
}

// ─── toggle ──────────────────────────────────────────────────────────────────
function toggleCard(id) {
    const card = cards.value.find(c => c.id === id)
    if (card) card.expanded = !card.expanded
}

// ─── unlock an existing card by its type ─────────────────────────────────────
/**
 * Called by the parent when the LLM reply triggers a skill unlock.
 * If a card with this type already exists, expand it and scroll it into view.
 * If it doesn't exist yet, push it as a new card.
 *
 * @param {{ type: string, title: string, subtitle: string }} cardDef
 */
function unlockCard(cardDef) {
    const existing = cards.value.find(c => c.type === cardDef.type)

    if (existing) {
        if (!existing.unlocked) {
            existing.unlocked = true
            existing.expanded = true        // open it so the user sees it
            existing.justUnlocked = true
            setTimeout(() => { existing.justUnlocked = false }, 3000)
            setHighlight(`🔓 Unlocked: ${existing.title}`)
        }
    } else {
        // Dynamically add a brand-new card (for any type not in the default list)
        cards.value.unshift({
            id: nextId++,
            title: cardDef.title,
            subtitle: cardDef.subtitle,
            type: cardDef.type,
            expanded: true,
            unlocked: true,
            justUnlocked: true,
        })
        setHighlight(`🔓 Unlocked: ${cardDef.title}`)
        setTimeout(() => {
            const c = cards.value.find(cd => cd.type === cardDef.type)
            if (c) c.justUnlocked = false
        }, 3000)
    }
}

// ─── expose to parent ────────────────────────────────────────────────────────
defineExpose({ unlockCard })
</script>

<template>
    <div class="container-fluid bg-cream d-flex flex-column h-100 overflow-y-auto" style="scrollbar-width: none;">
        <div class="col-12 d-flex flex-column h-100">

            <!-- Header -->
            <div class="row p-4 border-bottom flex-shrink-0">
                <div class="col-6">
                    <div class="row text-secondary text-uppercase pb-1" style="font-size: 0.8em;">
                        context panel
                    </div>
                    <div class="row fw-bolder">
                        Related Content
                    </div>
                </div>
                <div class="col-6 d-flex justify-content-end align-items-center">
                    <div class="border border-primary align-items-center bg-primary-subtle rounded-3 px-2 py-1">
                        <label class="text-primary fw-bold" style="font-size: 0.75em;">
                            {{ highlight }}
                        </label>
                    </div>
                </div>
            </div>

            <!-- Card list — only unlocked cards are rendered -->
            <div class="flex-grow-1 overflow-y-auto p-3" style="scrollbar-width: none;">
                <TransitionGroup name="card-reveal" tag="div">
                    <template v-for="card in cards" :key="card.id">
                        <div v-if="card.unlocked" class="card-wrapper" :class="{ 'card-just-unlocked': card.justUnlocked }">
                            <ContextCard :card="card" @toggle="toggleCard(card.id)" />
                        </div>
                    </template>
                </TransitionGroup>
            </div>

        </div>
    </div>
</template>

<style>
/* Card reveal animation */
.card-reveal-enter-active {
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-reveal-enter-from {
    opacity: 0;
    transform: translateY(-12px) scale(0.97);
}

/* Glow pulse on fresh unlock */
.card-just-unlocked {
    animation: unlockPulse 0.6s ease-out;
}
@keyframes unlockPulse {
    0%   { box-shadow: 0 0 0 0 rgba(45, 91, 227, 0.4); }
    60%  { box-shadow: 0 0 0 10px rgba(45, 91, 227, 0); }
    100% { box-shadow: none; }
}
</style>