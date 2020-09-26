<script lang="ts">
  import Button from './Button.svelte';
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    height: 80px;
  }
  .logo {
    width: 20px;
    height: 20px;
  }
</style>

<header>
  <div class="flex justify-between">
    <img
      src="images/svg/logos/cai.svg"
      class="logo"
      alt="Content Authenticity Initiative" />
    <h1 class="font-black uppercase text-sm ml-2">Content Authenticity</h1>
  </div>
  <div>
    <Button>Learn More</Button>
  </div>
</header>
