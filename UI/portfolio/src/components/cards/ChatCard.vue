<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    user: String,
    time: Number,   // timestamp (milliseconds)
    convo: String
})

const now = ref(Date.now())
let interval = null

onMounted(() => {
    interval = setInterval(() => {
        now.value = Date.now()
    }, 20000)
})

onBeforeUnmount(() => {
    clearInterval(interval)
})

const timeAgo = computed(() => {
    const diff = Math.floor((now.value - props.time) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`

    return `${Math.floor(diff / 86400)}d ago`
})
</script>

<template>
    <div class="d-flex w-100 p-2">

        <div class="chat-bubble" :class="[
            user === 'Kas' ? 'me-auto bg-light text-black border border-secondary-subtle rounded-end rounded-bottom' :
                'ms-auto bg-dark text-white border border-secondary-subtle rounded-start rounded-bottom'
        ]">
            <div class="d-flex small text-secondary mb-1" :class="[
                user === 'Kas' ? 'justify-content-start' :
                    'justify-content-end'
            ]">
                {{ user }} • {{ timeAgo }}
            </div>

            <div>
                {{ convo }}
            </div>
        </div>

    </div>
</template>

<style scoped>
.chat-bubble {
    max-width: 70%;
    padding: 10px 14px;
    word-break: break-word;
}
</style>