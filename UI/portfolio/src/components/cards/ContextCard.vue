<script setup>
import LinksView from '@/components/cards/LinksView.vue';
import IntroContext from '../context-visual-cards/IntroContext.vue';
import SEIntro from '../context-visual-cards/SE Cards/SEIntro.vue';
import DialogWeather from '../context-visual-cards/SE Cards/DialogWeather.vue';
import DialogAppM from '../context-visual-cards/SE Cards/DialogAppM.vue';
import GEIntro from '../context-visual-cards/GE Cards/GEIntro.vue';
import DeliveryStacks from '../context-visual-cards/GE Cards/DeliveryStacks.vue';
import RopeGang from '../context-visual-cards/GE Cards/RopeGang.vue';
import ScribbleLove from '../context-visual-cards/GE Cards/ScribbleLove.vue';
import DressUp from '../context-visual-cards/GE Cards/DressUp.vue';
import DropNFill from '../context-visual-cards/GE Cards/DropNFill.vue';
import GangvsGang from '../context-visual-cards/GE Cards/GangvsGang.vue';
import PhoneUnlock from '../context-visual-cards/GE Cards/PhoneUnlock.vue';

const props = defineProps({
    card: {
        type: Object,
        required: true,
        // { id, title, subtitle, expanded, type }
    }
})

const emit = defineEmits(['toggle'])
</script>

<template>
    <div class="context-card border rounded-3 bg-white mb-2 overflow-hidden">

        <!-- Card Header — always visible, clickable -->
        <div class="d-flex align-items-center justify-content-between p-3 cursor-pointer select-none"
            style="cursor: pointer; user-select: none;" @click="emit('toggle')">
            <div>
                <div class="fw-bold" style="font-size: 0.95em;">{{ card.title }}</div>
                <div class="text-secondary" style="font-size: 0.78em;">{{ card.subtitle }}</div>
            </div>

            <!-- Chevron indicator -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
                class="chevron text-secondary flex-shrink-0 ms-2" :class="{ 'chevron--open': card.expanded }">
                <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
        </div>

        <!-- Card Body — expand/collapse -->
        <div class="card-body-wrapper" :class="{ 'card-body-wrapper--open': card.expanded }">
            <div class="card-body-inner border-top">

                <IntroContext v-if="card.type === 'intro'" :card="card" />

                <!-- Full-stack cards -->
                <SEIntro v-else-if="card.type === 'se_intro'" :card="card" />
                <DialogWeather v-else-if="card.type === 'se_dialog_weather'" :card="card" />
                <DialogAppM v-else-if="card.type === 'se_dialog_app_maker'" :card="card" />

                <!-- Game Engineering cards -->
                <GEIntro v-else-if="card.type === 'ge_intro'" :card="card" />
                <DeliveryStacks v-else-if="card.type === 'ge_delivery_stacks'" :card="card" />
                <RopeGang v-else-if="card.type === 'ge_rope_gang'" :card="card" />
                <ScribbleLove v-else-if="card.type === 'ge_scribble_love'" :card="card" />
                <DressUp v-else-if="card.type === 'ge_dress_up'" :card="card" />
                <DropNFill v-else-if="card.type === 'ge_drop_n_fill'" :card="card" />
                <GangvsGang v-else-if="card.type === 'ge_gang_vs_gang'" :card="card" />
                <PhoneUnlock v-else-if="card.type === 'ge_phone_unlock'" :card="card" />

                <!-- Personal Cards -->


                <!-- Generic fallback -->
                <template v-else>
                    <div class="p-4">
                        <p class="text-secondary">{{ card.title }}</p>
                    </div>
                </template>

            </div>
        </div>

    </div>
</template>

<style scoped>
.context-card {
    transition: box-shadow 0.2s ease;
}

.context-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Chevron rotation */
.chevron {
    transition: transform 0.25s ease;
}

.chevron--open {
    transform: rotate(180deg);
}

/* Accordion collapse — max-height trick for smooth animation */
.card-body-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
}

.card-body-wrapper--open {
    grid-template-rows: 1fr;
}

.card-body-inner {
    overflow: hidden;
}
</style>