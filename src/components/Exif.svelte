<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { date, time, _ } from 'svelte-i18n';
  import { ExifSummary, generateMapUrl } from '../lib/exif';
  import AboutSection from './inspect/AboutSection.svelte';

  export let data: ExifSummary;

  $: locationImgSrc = generateMapUrl(data);
</script>

{#if data.creator}
  <div>
    <dl>
      <AboutSection title={$_('comp.exif.creator')}>
        <dl data-test-id="exif.creator">
          <dd>{data.creator}</dd>
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if data.copyright}
  <div>
    <dl>
      <AboutSection title={$_('comp.exif.copyright')}>
        <dl data-test-id="exif.copyright">
          <dd>{data.copyright}</dd>
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if data.captureDate && data.captureDate.toString() !== 'Invalid Date'}
  <div>
    <dl>
      <AboutSection title={$_('comp.exif.captureDate')}>
        <dl data-test-id="exif.captureDate">
          {$date(data.captureDate, { format: 'long' })}{' at '}
          {$time(data.captureDate, { format: 'short' })}
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if data.captureDetails.length}
  <div>
    <dl>
      <AboutSection title={$_('comp.exif.captureDetails')}>
        <dl data-test-id="exif.captureDetails">
          <dd>
            <ul class="list-disc list-inside">
              {#each data.captureDetails as { value, label } (label)}
                <li data-test-id={`exif.captureDetails.${label}`}>
                  {$_(`comp.exif.captureDetails.${label}`)}: {value}
                </li>
              {/each}
            </ul>
          </dd>
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if data.location}
  <div>
    <dl>
      <AboutSection title={$_('comp.exif.approximateLocation')}>
        <dl data-test-id="exif.location">
          <dd>
            <img
              src={locationImgSrc}
              class="w-full h-[280px] object-cover select-none rounded overflow-hidden" />
          </dd>
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
