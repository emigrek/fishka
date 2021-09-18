<template>
  <v-img @click="$router.push('/dashboard');" eager contain height="80vh" class="mx-auto" position="center center" style="cursor: pointer;" src="/logo.png"/>
</template>

<script>
export default {
  head: {
    title: `Fishka`,
  },
  layout: "blank"
}
</script>

<style>
html {
  background: black;
  overflow: hidden;
}
</style>
