<template>
    <label class="inline-flex cursor-pointer items-center">
        <input
            type="checkbox"
            class="sr-only"
            :checked="modelValue"
            @change="$emit('update:modelValue', !modelValue)"
        />
        <div
            class="h-6 w-10 rounded-full transition-colors"
            :class="modelValue ? 'bg-green-500' : 'bg-gray-600'"
        >
            <div
                class="h-6 w-6 transform rounded-full bg-white shadow transition-transform"
                :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
            ></div>
        </div>
        <span class="ml-2 text-white">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
defineProps<{
    modelValue: boolean
    label?: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>
