<template>
  <v-overlay
        opacity="1"
        absolute
        :value="true"
        dark
        color="black"
        class="black--text text-center"
        style="z-index: 1000;"
    >
      <v-img 
        eager contain height="10vh" 
        class="mx-auto" 
        position="center center"
        src="/logo.png"
      />
  </v-overlay>
</template>

<script>
export default {
  head: {
    title: `Fishka`,
  },
  layout: "blank",
  mounted() {
    setTimeout(() => this.$router.push('/dashboard'), 3000);
  }
}
</script>

<style>
html {
  background: black;
  overflow: hidden;
}
</style>
