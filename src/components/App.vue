<template>
    <div class="dd">
        <div>测试demo</div>
        <div>{{ count }}</div>
        <button class="btn" @click="add">add</button>
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
.dd {
    font-size: 100px;

    .btn {
        font-size: 30px;
    }
}
</style>
