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
    // ── EDUCATION ──
    {
        id: 2,
        title: 'BSc Westminster',
        subtitle: 'BSc Computer Science — Games & Computer Graphic Development, London',
        expanded: false,
        type: 'edu_bsc',
        unlocked: false,
    },
    {
        id: 3,
        title: 'MSc Swinburne',
        subtitle: 'Master of IT Professional Computing — AI, Quantum, Cloud, Software Dev',
        expanded: false,
        type: 'edu_msc',
        unlocked: false,
    },
    // -- WORK EXPERIENCE ──
    {
        id: 4,
        title: 'Game Engineering',
        subtitle: 'Deep expertise in game engineering — the specialisation he is most proud of',
        expanded: false,
        type: 'ge_intro',
        unlocked: false,
    },
    {
        id: 5,
        title: 'Software Engineering',
        subtitle: 'Enterprise systems, APIs and automation platforms',
        expanded: false,
        type: 'se_intro',
        unlocked: false,
    },
    // -- PROJECTS ──
    {
        id: 6,
        title: 'Dialog Weather App',
        subtitle: 'Fully functional weather forecasting website',
        expanded: false,
        type: 'se_dialog_weather',
        unlocked: false,
    },
    {
        id: 7,
        title: 'Dialog App Maker',
        subtitle: 'Fully functional automation platform to build apps',
        expanded: false,
        type: 'se_dialog_app_maker',
        unlocked: false,
    },
    {
        id: 8,
        title: 'Rope Gang',
        subtitle: 'Hyper-casual 3D puzzle-action mobile game with 2M+ downloads',
        expanded: false,
        type: 'ge_rope_gang',
        unlocked: false,
    },
    {
        id: 9,
        title: 'Scribble Love',
        subtitle: 'Casual puzzle game with unique physics based drawing interactions',
        expanded: false,
        type: 'ge_scribble_love',
        unlocked: false,
    },
    {
        id: 10,
        title: 'Dress Up',
        subtitle: 'Arcade-style mobile game designed primarily for a female audience',
        expanded: false,
        type: 'ge_dress_up',
        unlocked: false,
    },
    {
        id: 11,
        title: 'Gang vs Gang',
        subtitle: 'Arcade-style crowd-control game inspired by the Rope Gang mechanics',
        expanded: false,
        type: 'ge_gang_vs_gang',
        unlocked: false,
    },
    {
        id: 12,
        title: 'Delivery Stacks',
        subtitle: 'Hyper-casual mobile game with fun physics-based challenges',
        expanded: false,
        type: 'ge_delivery_stacks',
        unlocked: false,
    },
    {
        id: 13,
        title: 'Drop N Fill',
        subtitle: 'Hyper-casual puzzle game with intuitive controls and playful visual feedback',
        expanded: false,
        type: 'ge_drop_n_fill',
        unlocked: false,
    },
    {
        id: 14,
        title: 'Phone Unlock',
        subtitle: 'Puzzle-style mobile game with satisfying unlocking mechanics and rewards',
        expanded: false,
        type: 'ge_phone_unlock',
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
    console.log(cardDef);
    const existing = cards.value.find(c => c.type === cardDef.type)
    console.log('Existing card:', existing);

    if (existing) {
        if (!existing.unlocked) {
            existing.unlocked = true
            existing.expanded = true        // open it so the user sees it
            existing.justUnlocked = true
            setTimeout(() => { existing.justUnlocked = false }, 3000)
            setHighlight(`🔓 Unlocked: ${existing.title}`)
        }
    } 
    // else {
    //     // Dynamically add a brand-new card (for any type not in the default list)
    //     cards.value.unshift({
    //         id: nextId++,
    //         title: cardDef.title,
    //         subtitle: cardDef.subtitle,
    //         type: cardDef.type,
    //         expanded: true,
    //         unlocked: true,
    //         justUnlocked: true,
    //     })
    //     setHighlight(`🔓 Unlocked: ${cardDef.title}`)
    //     setTimeout(() => {
    //         const c = cards.value.find(cd => cd.type === cardDef.type)
    //         if (c) c.justUnlocked = false
    //     }, 3000)
    // }
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