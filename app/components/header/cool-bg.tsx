"use client"

import { useEffect } from "react";
import "./coolbg.css"

export default function CoolBg() {
  useEffect(() => {
    const root = [...(document.getElementById("coolbg_card_shatter")?.children ?? [])];

    function pulse(time: number) {
      if (time < 0.5) return 0;
      if (time < 0.7) return (time - 0.5) / 0.2;
      if (time < 1.5) return (1.5 - time) / 0.8;
      return 0;
    }

    function calcOffset(offset: number, fade: number) {
      if (offset >= 1) offset -= 1;
      return offset < 0.2 ? fade * (4 * offset) : fade * (1 - offset);
    }

    const cycle = 1.30434782609;

    setInterval(() => {
      const t = performance.now() / 1000;
      const anim_progress = (t % cycle) / cycle;
      const fade_factor = Math.min(1, Math.max(0, (t - 0.6) / 2));

      let throb_a = pulse(t) + calcOffset(anim_progress + 0.03, fade_factor);
      let throb_b = pulse(t - 0.08) + calcOffset(anim_progress - 0.05, fade_factor);
      let throb_c = pulse(t - 0.16) + calcOffset(anim_progress - 0.1, fade_factor);

      root.forEach((element: any) => {
        element.style.setProperty("--throb-a", throb_a);
        element.style.setProperty("--throb-b", throb_b);
        element.style.setProperty("--throb-c", throb_c);
      });
    }, 1);
  })

  return (
    <div id="coolbg_wrapper">
      <div id="coolbg_deck_block">
        <div id="coolbg_card_shatter">
          <img id="coolbg_card_shatter_glass_a" src="/res/cool-bg/glass-a.png" />
          <img id="coolbg_card_shatter_glass_b" src="/res/cool-bg/glass-b.png" />
          <img id="coolbg_card_shatter_glass_c" src="/res/cool-bg/glass-c.png" />
          <img id="coolbg_card_shatter_throb_a" src="/res/cool-bg/throb-a.png" />
          <img id="coolbg_card_shatter_throb_b" src="/res/cool-bg/throb-b.png" />
          <img id="coolbg_card_shatter_throb_c" src="/res/cool-bg/throb-c.png" />
        </div>
      </div>
    </div>
  )

}