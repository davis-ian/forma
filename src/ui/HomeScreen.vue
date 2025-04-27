<template>
    <div class="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <!-- <img :src="logoUrl" alt="Diner of the Damned Logo" class="h-auto w-48" /> -->
        <h1 class="text-primary text-5xl font-extrabold drop-shadow-md">Diner of the Damned</h1>
        <p class="text-secondary max-w-md text-lg">
            Cook. Fight. Survive. The kitchen from hell awaits.
        </p>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <router-link to="/game">
                <button
                    class="bg-primary text-bg hover:bg-secondary cursor-pointer rounded px-6 py-3 font-semibold shadow-md transition"
                >
                    Start New Game
                </button>
            </router-link>
            <!-- <button
                class="bg-accent text-bg hover:bg-secondary cursor-pointer rounded px-6 py-3 font-semibold shadow-md transition"
            >
                Settings
            </button> -->
        </div>
    </div>
</template>

<script lang="ts" setup></script>
