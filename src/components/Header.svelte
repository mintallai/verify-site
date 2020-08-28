<script lang="ts">
  import logo from '../../assets/svg/logo.svg';
  import Icon from '../components/Icon.svelte';
  import Button from './Button.svelte';
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center justify-between;
    height: 80px;
  }
</style>

<header>
  <div class="flex justify-between">
    <Icon svg={logo} />
    <h1 class="font-black uppercase text-sm ml-2">Image Report</h1>
  </div>
  <div>
    <a href="/" class="font-bold text-sm mr-4 hover:underline">FAQs</a>
    <Button>Upload New Image</Button>
  </div>
</header>
