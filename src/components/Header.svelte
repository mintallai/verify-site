<script lang="ts">
  import logo from '../../assets/svg/logo.svg';
  import Icon from '../components/Icon.svelte';
</script>

<style lang="postcss">
  header {
    @apply col-span-3 border-gray-200 border-b px-5 flex items-center;
    height: 80px;
  }
</style>

<header>
  <div class="flex">
    <Icon svg={logo} />
    <h1 class="font-black uppercase text-sm ml-2">Image Report</h1>
  </div>
</header>
