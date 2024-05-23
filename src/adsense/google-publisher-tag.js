/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import styles from './styling.module.css'


// Official GPT sources.
const GPT_STANDARD_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
const GPT_LIMITED_ADS_URL =
  'https://pagead2.googlesyndication.com/tag/js/gpt.js';

// Keep track of defined ad slots.
let adSlots = {};
let adSlotCount = 0;

if (typeof window !== 'undefined') {
  // Ensure we can interact with the GPT command array.
  window.googletag = window.googletag || { cmd: [] };
  

  // Prepare GPT to display ads.
  window.googletag.cmd.push(() => {
    // Disable initial load, to precisely control when ads are requested.
    window.googletag.pubads().disableInitialLoad();

    // Enable SRA and services.
    window.googletag.pubads().enableSingleRequest();
    window.googletag.enableServices();
  });
}

export function InitializeGPT({ limitedAds }) {
  // Reset tracking variables.
  adSlots = {};
  adSlotCount = 0;
  
  return (
    <script src={limitedAds ? GPT_LIMITED_ADS_URL : GPT_STANDARD_URL} async />
  );
}

export function DefineAdSlot({ adUnit, size }) {
  const slotId = `slot-${adSlotCount++}`;

  useEffect(() => {
    // Register the slot with GPT when the component is loaded.
    window.googletag.cmd.push(() => {
      const slot = window.googletag.defineSlot(adUnit, size, slotId);
      if (slot) {
        slot.addService(window.googletag.pubads());
        window.googletag.display(slot);
        adSlots[slotId] = slot;
      }
    });

    // Clean up the slot when the component is unloaded.
    return () => {
        window.googletag.cmd.push(() => {
        if (adSlots[slotId]) {
            window.googletag.destroySlots([adSlots[slotId]]);
          delete adSlots[slotId];
        }
      });
    };
  }, []);

  // Create the ad slot container.
  return (
    <div
      className={`${styles.adSlot} ${styles.centered}`}
      id={slotId}
    ></div>
  );
}

export function RequestAds() {
  useEffect(() => {
    window.googletag.cmd.push(() => {
      // Request ads for all ad slots defined up to this point.
      //
      // In many real world scenarios, requesting ads for *all*
      // slots is not optimal. Instead, care should be taken to
      // only refresh newly added/updated slots.
      const slots = Object.values(adSlots);
      window.googletag.pubads().refresh(slots);
    });
  }, []);
}
