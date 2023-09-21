<!-- Popup.svelte -->
<script>
  export let isOpen = false; // To control the menu's visibility

  // Function to toggle the menu
  export function togglePopup() {
    isOpen = !isOpen;
  }
</script>

<!-- Popup markup -->
<div
  class="popup absolute top-12 right-4 shadow-lg rounded-lg p-2"
  class:visible={isOpen}>
  {#if isOpen}
    <div>
      <h2>Popup Content</h2>
      <!-- Add your content here -->
    </div>
  {/if}
</div>
