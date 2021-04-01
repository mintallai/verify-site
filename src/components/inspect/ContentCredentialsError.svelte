<script context="module" lang="ts">
  export enum Status {
    Missing = 'missing',
    None = 'none',
  }
</script>

<script lang="ts">
  export let status: Status = Status.Missing;
</script>

<div class="h-full flex flex-col justify-center items-center px-4">
  <svg
    width="126"
    height="90"
    xmlns="http://www.w3.org/2000/svg"
    class="message-illustration mb-4"
  >
    <g
      stroke="currentColor"
      fill="none"
      fill-rule="evenodd"
      stroke-linecap="round"
    >
      <path
        stroke-width="3"
        stroke-linejoin="round"
        d="M1.5 56.551l19.3-19.2M20.8 56.551l-19.3-19.2M9.585 32.855V5.502a4 4 0 014-4h106a4 4 0 014 4v79a4 4 0 01-4 4h-106a4 4 0 01-4-4V61.32"
      />
      <path
        d="M28.392 47.307l13.866-15.352a4.001 4.001 0 015.719-.063L103.585 87.5M75.987 59.692L86.26 48.955a4 4 0 015.718-.064l31.608 31.61M106.085 27c0 5.522-4.478 10-10 10s-10-4.478-10-10 4.478-10 10-10 10 4.478 10 10z"
        stroke-width="2"
      />
    </g>
  </svg>
  {#if status === Status.Missing}
    <div class="message-heading">Missing content credentials</div>
    <div class="message-text">
      The producer edited this asset without attaching complete content
      credentials. Other data may be available in the content record. <a
        class="link"
        href="https://contentauthenticity.org/faq"
        target="_blank">Learn more</a
      >
    </div>
  {:else if status === Status.None}
    <div class="message-heading">No content credentials for this asset</div>
    <div class="message-text">
      This asset doesn’t have a content record attached.
    </div>
  {/if}
</div>
