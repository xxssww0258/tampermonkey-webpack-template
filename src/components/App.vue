<template>
    <div>
        <div class="app">vue demo</div>
        <img width="30" src="../img/avator.svg" alt="" />
        <div>{{ count }}</div>
        <button class="btn" @click="add">add</button>
        <hr />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
const count: Ref<number> = ref(0)
function add() {
    count.value++
}
</script>

<style lang="scss">
.app {
    font-size: 20px;
}
</style>
