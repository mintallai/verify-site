<footer>
  <span>Copyright © __year__ Adobe. All rights reserved.</span>
  <a href="https://www.adobe.com/privacy.html" target="_blank">Privacy</a>
  <a href="https://www.adobe.com/legal/terms.html" target="_blank"
    >Terms of use</a
  >
  <a href="https://contentauthenticity.org/contact" target="_blank"
    >Contact us</a
  >
</footer>

<style lang="postcss">
  footer {
    @apply flex justify-center items-center text-75 border-t-2 border-gray-200;
    grid-area: footer;
    max-width: 100vw;
  }
  footer a {
    @apply underline;
  }
  footer a::before {
    @apply px-1;
    content: '|';
  }
</style>
