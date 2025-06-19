<script setup>
import { textProps } from 'element-plus'

const props = defineProps({
  text: {
    type: String,
    default: '搜索'
  }
})
</script>

<template>
  <button class="button"><span></span>{{ text }}</button>
</template>
<style scoped>
.button {
  background-color: #82a9e7;
  cursor: pointer;
  padding: 0.5em;
  width: 5rem;
  font-size: 14px;
  box-shadow: 0 0.4rem hsl(209, 78%, 82%);
  border-radius: 27px;
  overflow: hidden;
  z-index: 2;
  color: #fff;
  transition: 0.2s;
  border: 2px solid rgb(253, 253, 255);
}

.button:hover {
  transform: translateY(0.2rem);
  box-shadow: 0 0.25rem #adbfdb;
  letter-spacing: 2px;
  color: #fefefe;
}

.button:active {
  transform: translateY(0.6rem);
  box-shadow: none;
  transition: 0.1s;
}

.button span {
  background-color: #a5bee5;
  border-radius: 27px;
  height: 100%;
  width: 0%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1;
  transition: 0.2s ease-in-out;
}

.button:hover span {
  width: 100%;
}
</style>
