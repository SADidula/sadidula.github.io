<template>
    <div class="skill-tree-container bg-cream">

        <!-- Header -->
        <div class="tree-header">
            <div class="tree-header-label">What You Know</div>
            <div class="tree-header-row">
                <div class="tree-header-title">About Me</div>
                <div class="discovery-count">{{ unlockedCount }} / {{ totalNodes }} unlocked</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
        </div>

        <!-- SVG Tree -->
        <div class="tree-wrap" ref="treeWrapRef" @wheel.prevent="onWheel" @mousedown="onPanStart" @mousemove="onPanMove"
            @mouseup="onPanEnd" @mouseleave="onPanEnd" @touchstart.prevent="onTouchStart"
            @touchmove.prevent="onTouchMove" @touchend="onTouchEnd"
            :style="{ cursor: isPanning ? 'grabbing' : 'grab' }">

            <!-- Zoom controls -->
            <div class="zoom-controls">
                <button class="zoom-btn" @click.stop="zoomIn" title="Zoom in">+</button>
                <button class="zoom-btn zoom-reset" @click.stop="resetZoom" title="Reset view">⊙</button>
                <button class="zoom-btn" @click.stop="zoomOut" title="Zoom out">−</button>
            </div>

            <svg :viewBox="`-60 -60 ${SVG_W} ${SVG_H}`" xmlns="http://www.w3.org/2000/svg" class="tree-svg"
                :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: 'center center' }">

                <!-- Connectors -->
                <line v-for="conn in connections" :key="conn.id" :x1="conn.x1" :y1="conn.y1" :x2="conn.x2" :y2="conn.y2"
                    :class="['connector', { active: isConnectionActive(conn) }]" />

                <!-- Hex Nodes -->
                <g v-for="node in nodes" :key="node.id" :transform="`translate(${node.x}, ${node.y})`" class="hex-group"
                    :class="{ unlocked: node.unlocked, locked: !node.unlocked }" @click="onNodeClick(node)">
                    <!-- Hex shape -->
                    <polygon :points="hexPoints(node.isCenter ? 26 : 22)" class="hex-bg" :style="hexStyle(node)" />

                    <!-- Icon -->
                    <text class="hex-icon" :style="{ opacity: node.unlocked ? 1 : 0.3 }" y="1">
                        {{ node.unlocked ? node.icon : '🔒' }}
                    </text>

                    <!-- Label below hex -->
                    <text class="hex-label" :y="node.isCenter ? 38 : 32" :class="{ unlocked: node.unlocked }">
                        {{ node.label }}
                    </text>

                    <!-- "NEW" flash badge on fresh unlock -->
                    <g v-if="node.justUnlocked">
                        <rect x="-14" y="-34" width="28" height="12" rx="2" fill="#2d5be3" />
                        <text x="0" y="-25" class="new-badge">NEW</text>
                    </g>
                </g>

            </svg>
        </div>

        <!-- Legend -->
        <div class="tree-legend">
            <div class="legend-item">
                <div class="legend-hex" style="background:#e8ecfb;border:1.5px solid #6c7fdd"></div>
                Identity / Skills
            </div>
            <div class="legend-item">
                <div class="legend-hex" style="background:#eef4ff;border:1.5px solid #4a72d4"></div>
                Software Eng.
            </div>
            <div class="legend-item">
                <div class="legend-hex" style="background:#fce8ea;border:1.5px solid #e06070"></div>
                Game Projects
            </div>
            <div class="legend-item">
                <div class="legend-hex" style="background:#f0ebff;border:1.5px solid #8b5cf6"></div>
                Frontier
            </div>
            <div class="legend-item">
                <div class="legend-hex" style="background:#f0ede8;border:1.5px solid #ccc9c1"></div>
                Locked
            </div>
        </div>

        <!-- Node detail tooltip -->
        <Transition name="tooltip">
            <div v-if="activeTooltip" class="node-tooltip">
                <div class="tooltip-icon">{{ activeTooltip.icon }}</div>
                <div class="tooltip-body">
                    <div class="tooltip-name">{{ activeTooltip.label }}</div>
                    <div class="tooltip-desc">{{ activeTooltip.description }}</div>
                    <div v-if="!activeTooltip.unlocked" class="tooltip-hint">
                        Keep chatting to unlock this node
                    </div>
                </div>
                <button class="tooltip-close" @click="activeTooltip = null">✕</button>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ─────────────────────────────────────────
// PROPS & EMITS
// ─────────────────────────────────────────

/**
 * Pass an array of node IDs to unlock them from the parent.
 * e.g. :unlocked-ids="['identity', 'edu-bsc', 'edu-mit']"
 *
 * Or call the exposed unlockNode(id) method directly.
 */
const props = defineProps({
    unlockedIds: {
        type: Array,
        default: () => ['center']
    }
})

const emit = defineEmits(['node-unlocked', 'node-clicked'])

// ─────────────────────────────────────────
// SVG DIMENSIONS
// ─────────────────────────────────────────
const SVG_W = 1100
const SVG_H = 950

// ─────────────────────────────────────────────
//  DIDULA'S SKILL TREE — nodes & connections
//  Drop these into your skilltree.vue
// ─────────────────────────────────────────────

const nodes = ref([

    // ── CENTER ──
    {
        id: 'center', label: 'Didula', icon: '🧑‍💻',
        description: 'Full-stack dev, game engineer, postgrad & perpetual learner. Sri Lankan soul, Australian hustle.',
        x: 500, y: 400, zone: 'center', isCenter: true,
        unlocked: false, justUnlocked: false
    },

    // ── RING 1 — IDENTITY ──
    {
        id: 'origin', label: 'Sri Lanka', icon: '🇱🇰',
        description: 'Born in Sri Lanka in 1999. Cultural roots that shaped a competitive, driven mindset.',
        x: 500, y: 220, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'age', label: '26 y/o', icon: '🎂',
        description: 'Born 1999. Already holds two degrees, shipped real products, and is just getting started.',
        x: 680, y: 265, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'location', label: 'Melbourne, AU', icon: '🇦🇺',
        description: 'Currently based in Melbourne, Australia — studying, building, and freelancing.',
        x: 720, y: 380, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'personality', label: 'Ambivert', icon: '🎭',
        description: 'Loud and noisy one moment, completely invisible the next. Ambivert who thrives in solo deep work.',
        x: 680, y: 535, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'drive', label: 'Thirst to Learn', icon: '🔥',
        description: 'Core motivation: learn as much as possible about as many things as possible. Never stops.',
        x: 500, y: 580, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'mindset', label: 'Leader', icon: '👑',
        description: 'Ambitious, competitive, and a natural leader. Loves to teach even while still learning himself.',
        x: 320, y: 535, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'solo', label: 'Solo Dev', icon: '🧩',
        description: 'Prefers to build alone — full ownership, full creative control. Thrives in independent environments.',
        x: 280, y: 380, zone: 'identity',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'traveller', label: 'Traveller', icon: '✈️',
        description: 'Sri Lanka → London → Melbourne and many countries in between. Worldly perspective.',
        x: 320, y: 265, zone: 'identity',
        unlocked: false, justUnlocked: false
    },

    // ── RING 2 — EDUCATION ──
    {
        id: 'bsc', label: 'BSc Westminster', icon: '🎓',
        description: 'BSc Computer Science — Games & Computer Graphic Development. University of Westminster, London.',
        x: 500, y: 90, zone: 'education',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'msc', label: 'MSc Swinburne', icon: '🏛️',
        description: 'Master of IT Professional Computing (Software Dev). Swinburne University, Melbourne. Covered Maths, Quantum Computing, AI, Cloud.',
        x: 820, y: 160, zone: 'education',
        unlocked: false, justUnlocked: false
    },

    // ── RING 3 — TECH STACK ──
    {
        id: 'languages', label: 'Languages', icon: '💬',
        description: 'Java, JavaScript, PHP, C#, C++, Python, Ruby, HTML, CSS. Polyglot developer.',
        x: 920, y: 290, zone: 'tech',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'frameworks', label: 'Frameworks', icon: '🧱',
        description: 'Vue, React, Rails. Frontend to full-stack — comfortable across the whole web layer.',
        x: 920, y: 400, zone: 'tech',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'game-engines', label: 'Game Engines', icon: '🎮',
        description: 'Unity, Unreal Engine, and getting started with Godot. Game engineering is a core specialisation.',
        x: 880, y: 510, zone: 'tech',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'cloud-ai', label: 'Cloud & AI', icon: '☁️',
        description: 'Cloud computing and AI studied at postgrad level. Applied across projects and freelance work.',
        x: 820, y: 610, zone: 'tech',
        unlocked: false, justUnlocked: false
    },

    // ── RING 3 — SPECIALISATIONS ──
    {
        id: 'fullstack', label: 'Full-Stack Dev', icon: '🖥️',
        description: 'End-to-end web and app development — frontend, backend, deployment. The complete picture.',
        x: 180, y: 160, zone: 'specialisation',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'game-eng', label: 'Game Engineering', icon: '🕹️',
        description: 'Deep expertise in game engineering — the specialisation Didula is most proud of.',
        x: 80, y: 290, zone: 'specialisation',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'graphics', label: 'Graphics Dev', icon: '🎨',
        description: 'Computer graphics development from the BSc. Rendering, visual systems, game visuals.',
        x: 80, y: 400, zone: 'specialisation',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'freelance', label: 'Freelancer', icon: '💼',
        description: 'Active freelancer specialising in web and app development. Real clients, real deliverables.',
        x: 120, y: 510, zone: 'specialisation',
        unlocked: false, justUnlocked: false
    },

    // ── RING 4 — SOFTWARE ENGINEERING BRANCH ──
    {
        id: 'se-intro', label: 'Software Eng.', icon: '⚙️',
        description: 'Enterprise systems, APIs and automation platforms. Software engineering at scale.',
        x: 270, y: 100, zone: 'se',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'se-weather', label: 'Dialog Weather', icon: '🌦️',
        description: 'Fully functional weather forecasting website built for Dialog. Real-time data, clean UI.',
        x: 150, y: 40, zone: 'se',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'se-appmaker', label: 'Dialog App Maker', icon: '🏗️',
        description: 'Full automation platform to build and deploy apps — built for Dialog. A true engineering challenge.',
        x: 370, y: 30, zone: 'se',
        unlocked: false, justUnlocked: false
    },

    // ── RING 4 — PROJECTS & PORTFOLIO ──
    {
        id: 'portfolio', label: 'sadidula.github.io', icon: '🌐',
        description: 'Personal portfolio — sadidula.github.io. Hub of projects, skills, and identity online.',
        x: 180, y: 620, zone: 'projects',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'nursery', label: 'Paradise Valley', icon: '🌿',
        description: 'Built paradisevalleynursery.com.au — a real client project for a plant nursery in Australia.',
        x: 320, y: 695, zone: 'projects',
        unlocked: false, justUnlocked: false
    },

    // ── RING 4 — LIFESTYLE ──
    {
        id: 'fps', label: 'Competitive FPS', icon: '🎯',
        description: 'Apex Legends, Battlefield, Rainbow Six Siege. Plays competitive FPS — precision and strategy.',
        x: 500, y: 720, zone: 'lifestyle',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'gym', label: 'Gym', icon: '💪',
        description: 'Hits the gym regularly. Discipline outside of code mirrors discipline inside it.',
        x: 680, y: 695, zone: 'lifestyle',
        unlocked: false, justUnlocked: false
    },

    // ── RING 5 — GAME PROJECTS (from game-eng) ──
    {
        id: 'ge-rope-gang', label: 'Rope Gang', icon: '🪢',
        description: 'Hyper-casual 3D puzzle-action mobile game with 2M+ downloads. The flagship title.',
        x: -60, y: 220, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-scribble', label: 'Scribble Love', icon: '✏️',
        description: 'Casual puzzle game with unique physics-based drawing interactions. Creative and playful.',
        x: -80, y: 330, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-dressup', label: 'Dress Up', icon: '👗',
        description: 'Arcade-style mobile game designed primarily for a female audience.',
        x: -80, y: 440, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-gangvgang', label: 'Gang vs Gang', icon: '⚔️',
        description: 'Arcade-style crowd-control game inspired by Rope Gang mechanics.',
        x: -60, y: 545, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-delivery', label: 'Delivery Stacks', icon: '📦',
        description: 'Hyper-casual mobile game with fun physics-based challenges.',
        x: 20, y: 630, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-dropfill', label: 'Drop N Fill', icon: '🪣',
        description: 'Hyper-casual puzzle game with intuitive controls and playful visual feedback.',
        x: 110, y: 690, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'ge-phoneunlock', label: 'Phone Unlock', icon: '📱',
        description: 'Puzzle-style mobile game with satisfying unlocking mechanics and rewards.',
        x: 210, y: 730, zone: 'gameproject',
        unlocked: false, justUnlocked: false
    },

    // ── RING 5 — FRONTIER ──
    {
        id: 'quantum', label: 'Quantum Computing', icon: '⚛️',
        description: 'Current obsession. Quantum engineering and computing — studied at MSc, actively diving deeper.',
        x: 820, y: 780, zone: 'frontier',
        unlocked: false, justUnlocked: false
    },
    {
        id: 'robotics', label: 'Robotics', icon: '🤖',
        description: 'New frontier. Exploring robotics as part of a broader engineering curiosity that never stops.',
        x: 500, y: 840, zone: 'frontier',
        unlocked: false, justUnlocked: false
    },

])

// ─────────────────────────────────────────────
//  CONNECTIONS
// ─────────────────────────────────────────────

const connections = computed(() => {
    const n = Object.fromEntries(nodes.value.map(nd => [nd.id, nd]))
    return [

        // center → identity ring
        { id: 'c-or', from: 'center', to: 'origin' },
        { id: 'c-ag', from: 'center', to: 'age' },
        { id: 'c-lo', from: 'center', to: 'location' },
        { id: 'c-pe', from: 'center', to: 'personality' },
        { id: 'c-dr', from: 'center', to: 'drive' },
        { id: 'c-mn', from: 'center', to: 'mindset' },
        { id: 'c-sl', from: 'center', to: 'solo' },
        { id: 'c-tr', from: 'center', to: 'traveller' },

        // identity → education
        { id: 'or-bsc', from: 'origin', to: 'bsc' },
        { id: 'tr-bsc', from: 'traveller', to: 'bsc' },
        { id: 'ag-msc', from: 'age', to: 'msc' },
        { id: 'lo-msc', from: 'location', to: 'msc' },

        // education → tech
        { id: 'bsc-lang', from: 'bsc', to: 'languages' },
        { id: 'msc-lang', from: 'msc', to: 'languages' },
        { id: 'msc-fw', from: 'msc', to: 'frameworks' },
        { id: 'msc-ca', from: 'msc', to: 'cloud-ai' },
        { id: 'bsc-ge', from: 'bsc', to: 'game-engines' },

        // education → specialisations
        { id: 'bsc-geng', from: 'bsc', to: 'game-eng' },
        { id: 'bsc-gr', from: 'bsc', to: 'graphics' },
        { id: 'msc-fs', from: 'msc', to: 'fullstack' },

        // identity → specialisations
        { id: 'sl-fs', from: 'solo', to: 'fullstack' },
        { id: 'sl-fl', from: 'solo', to: 'freelance' },
        { id: 'mn-geng', from: 'mindset', to: 'game-eng' },

        // tech → specialisations
        { id: 'fw-fs', from: 'frameworks', to: 'fullstack' },
        { id: 'ge-geng', from: 'game-engines', to: 'game-eng' },
        { id: 'ge-gr', from: 'game-engines', to: 'graphics' },
        { id: 'lang-fl', from: 'languages', to: 'freelance' },

        // specialisations → software engineering branch
        { id: 'fs-se', from: 'fullstack', to: 'se-intro' },
        { id: 'se-wth', from: 'se-intro', to: 'se-weather' },
        { id: 'se-app', from: 'se-intro', to: 'se-appmaker' },

        // specialisations → projects
        { id: 'fs-port', from: 'fullstack', to: 'portfolio' },
        { id: 'fl-nur', from: 'freelance', to: 'nursery' },
        { id: 'gr-port', from: 'graphics', to: 'portfolio' },

        // game-eng → game projects
        { id: 'ge-rg', from: 'game-eng', to: 'ge-rope-gang' },
        { id: 'ge-sc', from: 'game-eng', to: 'ge-scribble' },
        { id: 'ge-du', from: 'game-eng', to: 'ge-dressup' },
        { id: 'ge-gvg', from: 'game-eng', to: 'ge-gangvgang' },
        { id: 'ge-dl', from: 'game-eng', to: 'ge-delivery' },
        { id: 'ge-df', from: 'game-eng', to: 'ge-dropfill' },
        { id: 'ge-pu', from: 'game-eng', to: 'ge-phoneunlock' },

        // identity → lifestyle
        { id: 'pe-fps', from: 'personality', to: 'fps' },
        { id: 'dr-gym', from: 'drive', to: 'gym' },
        { id: 'mn-fps', from: 'mindset', to: 'fps' },

        // lifestyle/drive → frontier (locked)
        { id: 'ca-qc', from: 'cloud-ai', to: 'quantum' },
        { id: 'gym-rob', from: 'gym', to: 'robotics' },
        { id: 'dr-qc', from: 'drive', to: 'quantum' },
        { id: 'fps-rob', from: 'fps', to: 'robotics' },

    ].map(c => ({
        ...c,
        x1: n[c.from]?.x ?? 0,
        y1: n[c.from]?.y ?? 0,
        x2: n[c.to]?.x ?? 0,
        y2: n[c.to]?.y ?? 0,
    }))
})

function isConnectionActive(conn) {
    const fromNode = nodes.value.find(n => n.id === conn.from)
    const toNode = nodes.value.find(n => n.id === conn.to)
    return fromNode?.unlocked && toNode?.unlocked
}

// ─────────────────────────────────────────
// HEX GEOMETRY
// ─────────────────────────────────────────
function hexPoints(r = 22) {
    // Flat-top hexagon
    return Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 180) * (60 * i - 30)
        return `${(r * Math.cos(angle)).toFixed(2)},${(r * Math.sin(angle)).toFixed(2)}`
    }).join(' ')
}

// ─────────────────────────────────────────
// COLOUR ZONES
// ─────────────────────────────────────────
const ZONE_COLOURS = {
    center: { fill: '#fff8e6', stroke: '#d4a017', lockFill: '#f5f3ef', lockStroke: '#ccc9c1' },
    identity: { fill: '#e8ecfb', stroke: '#6c7fdd', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    education: { fill: '#e8ecfb', stroke: '#6c7fdd', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    tech: { fill: '#e4f2f0', stroke: '#4aaba0', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    specialisation: { fill: '#e8ecfb', stroke: '#6c7fdd', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    se: { fill: '#eef4ff', stroke: '#4a72d4', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    projects: { fill: '#e4f2f0', stroke: '#4aaba0', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    lifestyle: { fill: '#fef3e2', stroke: '#d4891a', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    gameproject: { fill: '#fce8ea', stroke: '#e06070', lockFill: '#fce8ea', lockStroke: '#e0a0a8' },
    frontier: { fill: '#f0ebff', stroke: '#8b5cf6', lockFill: '#f0ebff', lockStroke: '#c4b0f0' },
    indigo: { fill: '#e8ecfb', stroke: '#6c7fdd', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    teal: { fill: '#e4f2f0', stroke: '#4aaba0', lockFill: '#f0ede8', lockStroke: '#ccc9c1' },
    rose: { fill: '#fce8ea', stroke: '#e06070', lockFill: '#fce8ea', lockStroke: '#e0a0a8' },
}

function hexStyle(node) {
    const z = ZONE_COLOURS[node.zone] ?? ZONE_COLOURS.indigo
    if (node.unlocked) {
        return { fill: z.fill, stroke: z.stroke, strokeWidth: '1.5' }
    }
    const isDeepLocked = node.zone === 'rose'
    return {
        fill: z.lockFill,
        stroke: z.lockStroke,
        strokeWidth: '1.5',
        opacity: isDeepLocked ? 0.45 : 1,
    }
}

// ─────────────────────────────────────────
// UNLOCK LOGIC
// ─────────────────────────────────────────
const totalNodes = computed(() => nodes.value.length)
const unlockedCount = computed(() => nodes.value.filter(n => n.unlocked).length)
const progressPercent = computed(() => Math.round((unlockedCount.value / totalNodes.value) * 100))

/**
 * Unlock a node by ID.
 * Called either by the prop watcher or exposed for parent use.
 */
function unlockNode(id) {
    const node = nodes.value.find(n => n.id === id)
    if (!node || node.unlocked) return

    node.unlocked = true
    node.justUnlocked = true
    emit('node-unlocked', { id, label: node.label, icon: node.icon })

    // Clear the "NEW" badge after 3s
    setTimeout(() => { node.justUnlocked = false }, 3000)
}

/**
 * Unlock multiple nodes at once.
 */
function unlockNodes(ids) {
    ids.forEach(id => unlockNode(id))
}

// Watch prop changes so parent can drive unlocks declaratively
watch(
    () => props.unlockedIds,
    (ids) => { ids.forEach(id => unlockNode(id)) },
    { immediate: true, deep: true }
)

// Expose for parent to call directly: treeRef.value.unlockNode('edu-bsc')
defineExpose({ unlockNode, unlockNodes })

// ─────────────────────────────────────────
// ZOOM & PAN
// ─────────────────────────────────────────
const treeWrapRef = ref(null)
const zoom = ref(3)
const panX = ref(0)
const panY = ref(0)

const ZOOM_MIN = 0.3
const ZOOM_MAX = 3
const ZOOM_STEP = 0.15

function clampZoom(val) {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, val))
}

function zoomIn() {
    zoom.value = clampZoom(zoom.value + ZOOM_STEP)
}

function zoomOut() {
    zoom.value = clampZoom(zoom.value - ZOOM_STEP)
}

function resetZoom() {
    zoom.value = 1
    panX.value = 0
    panY.value = 0
}

function onWheel(e) {
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
    const prevZoom = zoom.value
    const newZoom = clampZoom(prevZoom + delta)
    const rect = treeWrapRef.value.getBoundingClientRect()
    const mouseX = e.clientX - rect.left - rect.width / 2
    const mouseY = e.clientY - rect.top - rect.height / 2
    const scale = newZoom / prevZoom
    panX.value = mouseX + (panX.value - mouseX) * scale
    panY.value = mouseY + (panY.value - mouseY) * scale
    zoom.value = newZoom
}

const isPanning = ref(false)
let panStartX = 0
let panStartY = 0

function onPanStart(e) {
    isPanning.value = true
    panStartX = e.clientX - panX.value
    panStartY = e.clientY - panY.value
}

function onPanMove(e) {
    if (!isPanning.value) return
    panX.value = e.clientX - panStartX
    panY.value = e.clientY - panStartY
}

function onPanEnd() {
    isPanning.value = false
}

let lastTouchDist = null
let panStartTX = 0
let panStartTY = 0

function getTouchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
}

function onTouchStart(e) {
    if (e.touches.length === 2) {
        lastTouchDist = getTouchDist(e.touches)
    } else if (e.touches.length === 1) {
        isPanning.value = true
        panStartTX = e.touches[0].clientX - panX.value
        panStartTY = e.touches[0].clientY - panY.value
    }
}

function onTouchMove(e) {
    if (e.touches.length === 2) {
        const dist = getTouchDist(e.touches)
        if (lastTouchDist) {
            const prevZoom = zoom.value
            const newZoom = clampZoom(prevZoom * (dist / lastTouchDist))
            const rect = treeWrapRef.value.getBoundingClientRect()
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - rect.width / 2
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - rect.height / 2
            const ratio = newZoom / prevZoom
            panX.value = midX + (panX.value - midX) * ratio
            panY.value = midY + (panY.value - midY) * ratio
            zoom.value = newZoom
        }
        lastTouchDist = dist
    } else if (e.touches.length === 1 && isPanning.value) {
        panX.value = e.touches[0].clientX - panStartTX
        panY.value = e.touches[0].clientY - panStartTY
    }
}

function onTouchEnd() {
    lastTouchDist = null
    isPanning.value = false
}

// ─────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────
const activeTooltip = ref(null)

function onNodeClick(node) {
    activeTooltip.value = activeTooltip.value?.id === node.id ? null : node
    emit('node-clicked', node)
}
</script>

<style scoped>
/* ── CONTAINER ── */
.skill-tree-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
}

/* ── HEADER ── */
.tree-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid #e2dfd8;
    flex-shrink: 0;
}

.tree-header-label {
    font-size: 9px;
    letter-spacing: 0.18em;
    color: #9a9690;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.tree-header-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.tree-header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

.discovery-count {
    font-size: 10px;
    color: #2d5be3;
    letter-spacing: 0.06em;
}

.progress-bar {
    margin-top: 10px;
    height: 2px;
    background: #e2dfd8;
}

.progress-fill {
    height: 100%;
    background: #2d5be3;
    transition: width 0.6s ease;
}

/* ── SVG TREE ── */
.tree-wrap {
    flex: 1;
    overflow: hidden;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.tree-svg {
    width: 100%;
    max-width: 310px;
    height: auto;
    overflow: visible;
    transition: transform 0.05s linear;
    will-change: transform;
}

/* ── ZOOM CONTROLS ── */
.zoom-controls {
    position: absolute;
    bottom: 14px;
    right: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 20;
}

.zoom-btn {
    width: 28px;
    height: 28px;
    background: #ffffff;
    border: 1px solid #e2dfd8;
    color: #444;
    font-size: 16px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: background 0.15s, border-color 0.15s;
    padding: 0;
    border-radius: 4px;
}

.zoom-btn:hover {
    background: #f5f3ef;
    border-color: #6c7fdd;
    color: #2d5be3;
}

.zoom-reset {
    font-size: 13px;
}

/* Connectors */
.connector {
    stroke: #e2dfd8;
    stroke-width: 1.5;
    fill: none;
    transition: stroke 0.4s ease;
}

.connector.active {
    stroke: #c5d3f8;
}

/* Hex groups */
.hex-group {
    cursor: pointer;
}

.hex-bg {
    transition: fill 0.35s ease, stroke 0.35s ease, opacity 0.2s ease;
}

.hex-group:hover .hex-bg {
    opacity: 0.82;
}

.hex-group.unlocked .hex-bg {
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.08));
}

/* Text inside hex */
.hex-icon {
    font-size: 13px;
    dominant-baseline: middle;
    text-anchor: middle;
    user-select: none;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.hex-label {
    font-size: 6.5px;
    fill: #aaa;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.hex-label.unlocked {
    fill: #444;
}

/* NEW badge */
.new-badge {
    font-size: 6px;
    fill: #ffffff;
    text-anchor: middle;
    dominant-baseline: middle;
    letter-spacing: 0.1em;
    pointer-events: none;
    animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badgePop {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}

/* ── LEGEND ── */
.tree-legend {
    padding: 12px 20px;
    border-top: 1px solid #e2dfd8;
    display: flex;
    gap: 16px;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
    color: #9a9690;
    letter-spacing: 0.06em;
}

.legend-hex {
    width: 12px;
    height: 12px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    flex-shrink: 0;
}

/* ── TOOLTIP ── */
.node-tooltip {
    position: absolute;
    bottom: 64px;
    left: 12px;
    right: 12px;
    background: #ffffff;
    border: 1px solid #e2dfd8;
    padding: 14px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    z-index: 10;
}

.tooltip-icon {
    font-size: 22px;
    flex-shrink: 0;
    margin-top: 2px;
}

.tooltip-body {
    flex: 1;
    min-width: 0;
}

.tooltip-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.tooltip-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.55;
}

.tooltip-hint {
    font-size: 9px;
    color: #2d5be3;
    letter-spacing: 0.06em;
    margin-top: 6px;
    text-transform: uppercase;
}

.tooltip-close {
    background: none;
    border: none;
    color: #9a9690;
    cursor: pointer;
    font-size: 11px;
    padding: 0;
    flex-shrink: 0;
    line-height: 1;
}

.tooltip-close:hover {
    color: #1a1a1a;
}

/* Tooltip transition */
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: translateY(6px);
}
</style>