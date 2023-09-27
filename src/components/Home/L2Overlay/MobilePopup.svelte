<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let isOpen = false;

  let isMobile = false;

  // Function to toggle the menu
  export function togglePopup() {
    isOpen = !isOpen;
  }

  onMount(() => {
    function handleResize() {
      isMobile = window.innerWidth <= 768;
    }

    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div
  class:visible={isOpen}
  style={isMobile
    ? 'position: fixed; bottom: 0; left: 0; width: 100%; height: auto; z-index: 1000;'
    : ''}
  class="popup shadow-lg absolute right-4 top-12 mb-10 rounded-lg p-2"
  transition:fly={{ y: 200, duration: 300 }}>
  {#if isOpen}
    <!-- Your Popup Content Here -->
    <div class="h-20 bg-brand-orange">hello world!</div>
  {/if}
</div>
