<template>
    <div class="page-root">

        <!-- ── Navbar ─────────────────────────────────────────────────── -->
        <div class="navbar-bar">
            <div class="navbar-brand">Kas.dev</div>
            <div class="navbar-meta">
                <span class="d-lg-block d-sm-none">Learn more about me</span>
                <span class="status-label">
                    <div class="status-pip"></div>
                    Online
                </span>
            </div>
        </div>

        <!-- ── Minimised tabs (top-center) ─────────────────────────────── -->
        <div class="minimised-tabs">
            <button
                v-for="tab in minimisedTabs"
                :key="tab.id"
                class="minimised-tab"
                :class="{ 'has-notification': notifications[tab.id] }"
                @click="openPanel(tab.id)"
                :title="`Restore ${tab.label}`"
            >
                <span class="tab-icon">{{ tab.icon }}</span>
                <span class="tab-label">{{ tab.label }}</span>
                <span v-if="notifications[tab.id]" class="tab-notif-dot"></span>
            </button>
        </div>

        <!-- ── Panel workspace ────────────────────────────────────────── -->
        <div class="workspace" :class="`open-${openCount}`">

            <!-- Content Panel -->
            <div
                v-show="panels.content.open"
                class="panel panel-content"
            >
                <button v-show="openCount > 1" class="panel-minimise-btn" @click="minimisePanel('content')" title="Minimise">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <ContentPanel ref="contentPanelRef" />
            </div>

            <!-- Skill Tree Panel -->
            <div
                v-show="panels.skilltree.open"
                class="panel panel-skilltree"
            >
                <button v-show="openCount > 1" class="panel-minimise-btn" @click="minimisePanel('skilltree')" title="Minimise">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <SkillTree ref="skillTreeRef" />
            </div>

            <!-- Live Chat Panel -->
            <div
                v-show="panels.livechat.open"
                class="panel panel-livechat"
            >
                <button v-show="openCount > 1" class="panel-minimise-btn" @click="minimisePanel('livechat')" title="Minimise">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <LiveChat @skills-unlocked="onSkillsUnlocked" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ContentPanel from '@/components/ContentPanel.vue'
import LiveChat from '@/components/LiveChat.vue'
import SkillTree from '@/components/SkillTree.vue'

// ─── Panel metadata ───────────────────────────────────────────────────────────
const PANEL_META = {
    content:   { id: 'content',   label: 'Content',   icon: '📋' },
    skilltree: { id: 'skilltree', label: 'Skill Tree', icon: '🌐' },
    livechat:  { id: 'livechat',  label: 'Live Chat',  icon: '💬' },
}

// ─── State ───────────────────────────────────────────────────────────────────
const isMobile = ref(false)

// Pending unlock notifications keyed by panel id — truthy when panel is
// minimised and has received an unlock it hasn't been seen yet.
const notifications = ref({
    content:   false,
    skilltree: false,
    livechat:  false,
})

const panels = ref({
    content:   { open: true },
    skilltree: { open: true },
    livechat:  { open: true },
})

// Tracks minimise order so tabs appear in the order panels were minimised
const minimisedOrder = ref([])

const minimisedTabs = computed(() =>
    minimisedOrder.value.map(id => PANEL_META[id])
)

const openCount = computed(() =>
    Object.values(panels.value).filter(p => p.open).length
)

// ─── Responsive detection ─────────────────────────────────────────────────────
const MOBILE_BP = 768

function applyMobileDefault() {
    panels.value.content.open   = false
    panels.value.skilltree.open = false
    panels.value.livechat.open  = true
    minimisedOrder.value = ['content', 'skilltree']
}

function applyDesktopDefault() {
    panels.value.content.open   = true
    panels.value.skilltree.open = true
    panels.value.livechat.open  = true
    minimisedOrder.value = []
}

let prevMobile = null

function handleResize() {
    const nowMobile = window.innerWidth < MOBILE_BP
    isMobile.value = nowMobile

    // Only react when crossing the breakpoint boundary
    if (nowMobile !== prevMobile) {
        prevMobile = nowMobile
        if (nowMobile) {
            applyMobileDefault()
        } else {
            applyDesktopDefault()
        }
    }
}

onMounted(() => {
    const nowMobile = window.innerWidth < MOBILE_BP
    isMobile.value = nowMobile
    prevMobile = nowMobile
    if (nowMobile) applyMobileDefault()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

// ─── Panel actions ────────────────────────────────────────────────────────────
function minimisePanel(id) {
    panels.value[id].open = false
    if (!minimisedOrder.value.includes(id)) {
        minimisedOrder.value.push(id)
    }
}

function openPanel(id) {
    if (isMobile.value) {
        // On mobile: auto-minimise whatever is currently open
        const currentOpen = Object.keys(panels.value).find(k => panels.value[k].open)
        if (currentOpen && currentOpen !== id) {
            panels.value[currentOpen].open = false
            if (!minimisedOrder.value.includes(currentOpen)) {
                minimisedOrder.value.push(currentOpen)
            }
        }
    }
    panels.value[id].open = true
    minimisedOrder.value = minimisedOrder.value.filter(i => i !== id)
    // Clear any pending notification when the panel is reopened
    notifications.value[id] = false
}

// ─── Skill unlock wiring ─────────────────────────────────────────────────────
const skillTreeRef    = ref(null)
const contentPanelRef = ref(null)

/**
 * Fired by LiveChat whenever the LLM reply triggers skill unlocks.
 * payload = { nodeIds: string[], cards: { type, title, subtitle }[] }
 */
function onSkillsUnlocked({ nodeIds, cards }) {
    skillTreeRef.value?.unlockNodes(nodeIds)
    cards.forEach(cardDef => contentPanelRef.value?.unlockCard(cardDef))

    // Notify minimised panels that something new was unlocked inside them
    if (!panels.value.skilltree.open && nodeIds.length > 0) {
        notifications.value.skilltree = true
    }
    if (!panels.value.content.open && cards.length > 0) {
        notifications.value.content = true
    }
}
</script>

<style scoped>
/* ─── Root ──────────────────────────────────────────────────────────────── */
.page-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

/* ─── Navbar ────────────────────────────────────────────────────────────── */
.navbar-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    height: 56px;
    flex-shrink: 0;
    /* border-bottom: 1px solid #dee2e6; */
}

.navbar-brand {
    font-size: 1.25rem;
    font-weight: 700;
}

.navbar-meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    font-size: 0.8em;
    color: #6c757d;
}

.status-label {
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-pip {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf82;
    flex-shrink: 0;
    animation: pip 2.4s ease-in-out infinite;
}

@keyframes pip {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.35; transform: scale(0.8); }
}

/* ─── Minimised tabs ────────────────────────────────────────────────────── */
.minimised-tabs {
    position: fixed;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    display: flex;
    flex-direction: row;
    gap: 4px;
    padding: 0;
    pointer-events: none;
    align-items: flex-start;
    /* anchor tabs to top so they grow downward */
}

.minimised-tab {
    pointer-events: all;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 6px 6px 0 0;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: background 0.2s ease, transform 0.2s ease, margin 0.2s ease;
    white-space: nowrap;
    transform: translateY(-2px);
}

.minimised-tab:hover {
    background: #2d5be3;
    transform: scaleX(1.15) scaleY(1.1) translateY(-3px);
}

.minimised-tab:nth-child(1):has(~ .minimised-tab:hover),
.minimised-tab:hover ~ .minimised-tab:nth-child(1) {
    transform: translateX(-15px) translateY(-2px);
}

.minimised-tab:nth-child(2):has(~ .minimised-tab:hover),
.minimised-tab:hover ~ .minimised-tab:nth-child(2) {
    transform: translateX(15px) translateY(-2px);
}

.tab-icon {
    font-size: 0.85em;
}

/* ─── Notification dot on minimised tab ─────────────────────────────────── */
.tab-notif-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4caf82;
    flex-shrink: 0;
    margin-left: 2px;
    animation: notif-pulse 1.8s ease-in-out infinite;
}

@keyframes notif-pulse {
    0%, 100% { opacity: 1;    transform: scale(1);    }
    50%       { opacity: 0.4; transform: scale(0.75); }
}

.minimised-tab.has-notification {
    box-shadow: 0 2px 12px rgba(76, 175, 130, 0.35);
}

/* ─── Workspace ─────────────────────────────────────────────────────────── */
.workspace {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 4px;
    gap: 4px;
    background: #dee2e600; /* gap colour matches original Split.js gutter */
}

/* ── All 3 open: replicate original layout (left 50% | right column 50%) ── */
.workspace.open-3 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 4px;
}

.open-3 .panel-content {
    grid-column: 1;
    grid-row: 1 / 3;  /* spans full height on left */
}

.open-3 .panel-skilltree {
    grid-column: 2;
    grid-row: 1;
}

.open-3 .panel-livechat {
    grid-column: 2;
    grid-row: 2;
}

/* ── 2 panels open: equal horizontal split ──────────────────────────────── */
.workspace.open-2 {
    display: flex;
    flex-direction: row;
    gap: 4px;
}

.open-2 .panel {
    flex: 1;
}

/* ── 1 panel open: fill everything ─────────────────────────────────────── */
.workspace.open-1 {
    display: flex;
}

.open-1 .panel {
    flex: 1;
}

/* ─── Panels ────────────────────────────────────────────────────────────── */
.panel {
    position: relative;
    overflow: hidden;
    border: 1px solid #dee2e6;
    min-width: 0;
    min-height: 0;
    background: #fff;
}

/* ─── Minimise button ───────────────────────────────────────────────────── */
.panel-minimise-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    color: #6c757d;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    backdrop-filter: blur(4px);
}

.panel-minimise-btn:hover {
    background: #fff;
    color: #1a1a1a;
    border-color: #999;
}

/* ─── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
    /*
     * On mobile only 1 panel is visible at a time — it always fills the screen.
     * All open-N variants collapse to a simple full-height flex container.
     */
    .workspace.open-3,
    .workspace.open-2,
    .workspace.open-1 {
        display: flex;
        flex-direction: column;
    }

    .workspace .panel {
        flex: 1;
    }
}
</style>