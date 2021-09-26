<script>
export default {
  middleware: [
    function({ redirect }) {
      redirect('/dashboard');
    },
  ],
}
</script>
