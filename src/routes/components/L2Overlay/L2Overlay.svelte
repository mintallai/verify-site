<script>
  export let imageUrl;
  import Pin from '../../../../assets/svg/CR_Pin.svg';
  import Popup from './Popup.svelte'; // Import the Popup component

  let isPopupOpen = false;

  function togglePopup() {
    isPopupOpen = !isPopupOpen;
  }
</script>

<div class="group relative">
  <img
    src={imageUrl}
    alt="overlay"
    class="w-[full - 20px] h-[full - 20px] rounded-xl" />

  <!-- Overlay -->
  <div
    class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
    <!-- Logo in the top-right corner -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={togglePopup}>
      <img
        src={Pin}
        alt="Logo"
        class="absolute right-4 top-4 h-[24px] w-[24px] hover:cursor-pointer" />
    </div>
  </div>

  <!-- Include the Popup component -->
  <Popup isOpen={isPopupOpen} {togglePopup} />
</div>
