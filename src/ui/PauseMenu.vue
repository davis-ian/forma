<script lang="ts" setup></script>

<template>
    <div class="pause-menu">
        <h1 class="text-3xl">PAUSED</h1>
    </div>
</template>

<style scoped>
.pause-menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;

    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0.6;
    /* border: 2px solid white; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
