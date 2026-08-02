"use client";

import React from "react";

export interface HugeIconProps {
  name?: string;
  category?: "Push" | "Pull" | "Legs" | "Core" | "Cardio" | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hugeicons SVG Vector Component System for Gym & Fitness Exercises
 * Provides distinct stroke-based SVG icons tailored to specific exercise movements.
 */
export default function HugeIcon({
  name = "",
  category = "Push",
  size = 22,
  color = "currentColor",
  strokeWidth = 2,
  style,
}: HugeIconProps) {
  const n = name.toLowerCase();

  // Common SVG wrapper props
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
  };

  // 3. Flat Barbell Bench Press
  if (
    n.includes("bench press") ||
    (n.includes("bench") && n.includes("barbell"))
  ) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        color="currentColor"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 3V8M6 3V8"></path>
        <path d="M20.5 4V5.5M20.5 5.5V7M20.5 5.5H22M3.5 4V5.5M3.5 5.5V7M3.5 5.5H2"></path>
        <path d="M18 5.5L6 5.5"></path>
        <path d="M10 5.5V10M14 5.5V10"></path>
        <path d="M18.9517 16H5.06243M14.2556 10H10.2066C9.19904 10 8.82575 10.1443 8.27172 10.9923L5.25854 15.6043C5.07336 15.8877 5 16.1138 5 16.4581C5 18.6114 5.87314 19 7.8469 19H16.0969C18.1334 19 19 18.6165 19 16.4079C19 16.1018 18.9432 15.8986 18.7957 15.6351L16.2591 11.1056C15.725 10.1518 15.3409 10 14.2556 10Z"></path>
        <path d="M16 19V21M8 19V21"></path>
      </svg>
    );
  }

  // 4. Dumbbell Press / Dumbbell Fly / Flat DB Press
  if (
    n.includes("dumbbell press") ||
    n.includes("db press") ||
    n.includes("flat db")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M5 6v12M19 6v12" />
        <rect x="3" y="8" width="4" height="8" rx="1" />
        <rect x="17" y="8" width="4" height="8" rx="1" />
        <path d="M7 12h10" />
      </svg>
    );
  }

  // 5. Chest Fly / Pec Deck / Cable Crossover
  if (n.includes("fly") || n.includes("pec deck") || n.includes("crossover")) {
    return (
      <svg {...svgProps}>
        <path d="M12 4c-5 0-9 3.5-9 8s4 8 9 8 9-3.5 9-8-4-8-9-8z" />
        <path d="M7 12c2.5-3 7.5-3 10 0" />
        <path d="M12 7v10" />
      </svg>
    );
  }

  // 6. Push-Ups / Diamond Pushups
  if (n.includes("push-up") || n.includes("pushup")) {
    return (
      <svg {...svgProps}>
        <path d="M3 18h18" />
        <path d="M6 14l6-4 6 4" />
        <circle cx="12" cy="6" r="2.5" />
        <path d="M9 18v-4M15 18v-4" />
      </svg>
    );
  }

  // 7. Overhead Press / Shoulder Press / Arnold Press
  if (
    n.includes("overhead press") ||
    n.includes("shoulder press") ||
    n.includes("arnold")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M5 8h14" />
        <path d="M12 8V2M9 5l3-3 3 3" />
        <path d="M6 8v11M18 8v11" />
        <path d="M3 19h18" />
      </svg>
    );
  }

  // 8. Lateral Raise / Front Raise / Delts
  if (
    n.includes("lateral raise") ||
    n.includes("front raise") ||
    n.includes("delt")
  ) {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v10" />
        <path d="M4 11l8-2 8 2" />
        <path d="M3 13l2-2M21 13l-2-2" />
      </svg>
    );
  }

  // 9. Upright Row / Shrugs
  if (n.includes("upright row") || n.includes("shrug")) {
    return (
      <svg {...svgProps}>
        <path d="M6 16h12" />
        <path d="M6 16l6-8 6 8" />
        <path d="M12 8V4M9 6l3-2 3 2" />
      </svg>
    );
  }

  // 10. Tricep Pushdown / Rope Pushdown / Kickback
  if (n.includes("pushdown") || n.includes("kickback")) {
    return (
      <svg {...svgProps}>
        <path d="M12 3v12" />
        <circle cx="12" cy="3" r="1.5" />
        <path d="M8 15l4 4 4-4" />
        <path d="M6 21h12" />
      </svg>
    );
  }

  // 11. Overhead Tricep Extension / Skull Crushers
  if (n.includes("tricep extension") || n.includes("skull crusher")) {
    return (
      <svg {...svgProps}>
        <path d="M12 21V9" />
        <path d="M8 13l4-4 4 4" />
        <circle cx="12" cy="5" r="2.5" />
      </svg>
    );
  }

  // 12. Dips (Parallel Bar / Bench Dips)
  if (n.includes("dip")) {
    return (
      <svg {...svgProps}>
        <path d="M5 4v16M19 4v16" />
        <path d="M9 10v6M15 10v6" />
        <path d="M7 10h10" />
        <circle cx="12" cy="6" r="2" />
      </svg>
    );
  }

  // 13. Deadlift / RDL / Rack Pulls
  if (
    n.includes("deadlift") ||
    n.includes("rack pull") ||
    n.includes("good morning")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M2 17h20" />
        <rect x="4" y="11" width="3" height="9" rx="1" />
        <rect x="17" y="11" width="3" height="9" rx="1" />
        <path d="M7 15.5h10" />
        <path d="M12 10V4M9 7l3-3 3 3" />
      </svg>
    );
  }

  // 14. Barbell Row / Pendlay Row / Yates Row / T-Bar Row
  if (n.includes("row") && !n.includes("upright")) {
    return (
      <svg {...svgProps}>
        <path d="M4 17l8-8 8 8" />
        <path d="M12 9v11" />
        <path d="M8 6h8" />
        <circle cx="12" cy="4" r="2" />
      </svg>
    );
  }

  // 15. Pull Up / Chin Up
  if (n.includes("pull up") || n.includes("chin up")) {
    return (
      <svg {...svgProps}>
        <path d="M3 5h18" />
        <path d="M7 5v4M17 5v4" />
        <circle cx="12" cy="11" r="2.5" />
        <path d="M9 18l3-3 3 3" />
        <path d="M12 15v6" />
      </svg>
    );
  }

  // 16. Lat Pulldown
  if (n.includes("pulldown")) {
    return (
      <svg {...svgProps}>
        <path d="M3 4h18" />
        <path d="M12 4v11" />
        <path d="M8 12l4 4 4-4" />
        <path d="M6 19h12" />
      </svg>
    );
  }

  // 17. Face Pull
  if (n.includes("face pull")) {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="6" r="3" />
        <path d="M5 16l7-4 7 4" />
        <path d="M12 12v9" />
      </svg>
    );
  }

  // 18. Bicep Curl / Hammer Curl / Preacher Curl / Spider Curl / Zottman
  if (n.includes("curl")) {
    return (
      <svg {...svgProps}>
        <path d="M6 18a6 6 0 0 1 6-6h5" />
        <path d="M16 8a4 4 0 0 1 4 4v2" />
        <circle cx="6" cy="18" r="2.5" />
        <path d="M14 6l3 3-3 3" />
      </svg>
    );
  }

  // 19. Squat (Back, Front, Goblet, Hack, Box, Zercher)
  if (n.includes("squat")) {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="4" r="2.5" />
        <path d="M8 10h8" />
        <path d="M8 10l-2 6 3 4" />
        <path d="M16 10l2 6-3 4" />
      </svg>
    );
  }

  // 20. Leg Press
  if (n.includes("leg press")) {
    return (
      <svg {...svgProps}>
        <path d="M4 20l14-14" />
        <path d="M14 4h6v6" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
      </svg>
    );
  }

  // 21. Leg Extension
  if (n.includes("leg extension")) {
    return (
      <svg {...svgProps}>
        <rect x="4" y="6" width="10" height="10" rx="2" />
        <path d="M14 11l6 4" />
        <circle cx="20" cy="15" r="2" />
      </svg>
    );
  }

  // 22. Leg Curl (Lying / Seated)
  if (n.includes("leg curl")) {
    return (
      <svg {...svgProps}>
        <rect x="4" y="6" width="10" height="10" rx="2" />
        <path d="M14 13l4-5" />
        <circle cx="18" cy="8" r="2" />
      </svg>
    );
  }

  // 23. Lunges / Bulgarian Split Squat
  if (n.includes("lunge") || n.includes("split squat")) {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v6" />
        <path d="M12 12l-5 4v5" />
        <path d="M12 12l5 2v7" />
      </svg>
    );
  }

  // 24. Hip Thrust / Glute Bridge / Abductor / Adductor
  if (
    n.includes("thrust") ||
    n.includes("glute") ||
    n.includes("abductor") ||
    n.includes("adductor")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M3 16c4-6 14-6 18 0" />
        <path d="M12 10v6" />
        <circle cx="12" cy="6" r="2.5" />
        <path d="M6 20h12" />
      </svg>
    );
  }

  // 25. Calf Raise / Tibialis
  if (n.includes("calf") || n.includes("tibialis")) {
    return (
      <svg {...svgProps}>
        <path d="M8 20l4-16 4 16" />
        <path d="M6 20h12" />
        <path d="M10 14h4" />
      </svg>
    );
  }

  // 26. Cable Crunch / Ab Wheel / Russian Twist / Woodchopper
  if (
    n.includes("crunch") ||
    n.includes("wheel") ||
    n.includes("twist") ||
    n.includes("woodchopper") ||
    n.includes("sit-up") ||
    n.includes("situp")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M6 18c0-4 3-8 6-8s6 4 6 8" />
        <circle cx="12" cy="5" r="2.5" />
        <path d="M4 21h16" />
      </svg>
    );
  }

  // 27. Leg Raise / Knee Raise / Captain's Chair
  if (
    n.includes("leg raise") ||
    n.includes("knee raise") ||
    n.includes("v-ups") ||
    n.includes("flutter")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M5 4v16" />
        <path d="M5 14l12-6" />
        <circle cx="17" cy="8" r="2" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  // 28. Plank / Side Plank / Hollow Body / Deadbug / Dragon Flag
  if (
    n.includes("plank") ||
    n.includes("hollow") ||
    n.includes("deadbug") ||
    n.includes("dragon")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M3 15h18" />
        <circle cx="6" cy="11" r="2" />
        <path d="M3 19h18" />
      </svg>
    );
  }

  // 29. Cardio / Treadmill / Bike / Stairmaster / Rowing / Rope
  if (
    category === "Cardio" ||
    n.includes("treadmill") ||
    n.includes("bike") ||
    n.includes("stair") ||
    n.includes("rope") ||
    n.includes("run") ||
    n.includes("burpee") ||
    n.includes("sled")
  ) {
    return (
      <svg {...svgProps}>
        <path d="M13 3l-2 3H7l-2 4h4l-2 6" />
        <circle cx="16" cy="5" r="2" />
        <path d="M14 11l4 2 2 6" />
      </svg>
    );
  }

  // 30. Category Fallbacks (Push, Pull, Legs, Core, Cardio)
  if (category === "Chest") {
    return (
      <svg {...svgProps}>
        <path d="M5 6v12M19 6v12" />
        <rect x="3" y="8" width="4" height="8" rx="1" />
        <rect x="17" y="8" width="4" height="8" rx="1" />
        <path d="M7 12h10" />
      </svg>
    );
  }

  if (category === "Shoulders") {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="5" r="2.5" />
        <path d="M7 6l5 3 5-3" />
        <path d="M12 9v7" />
        <path d="M9 21l3-5 3 5" />
      </svg>
    );
  }

  if (category === "Triceps") {
    return (
      <svg {...svgProps}>
        <path d="M5 18l5-5 7 2" />
        <path d="M10 13l3-7" />
        <circle cx="13" cy="6" r="1.5" />
      </svg>
    );
  }

  if (category === "Back") {
    return (
      <svg {...svgProps}>
        <path d="M12 3v13" />
        <circle cx="12" cy="3" r="1.5" />
        <path d="M7 16l5 4 5-4" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (category === "Biceps") {
    return (
      <svg {...svgProps}>
        <path d="M4 16l7-2 4-6" />
        <path d="M15 8a3 3 0 0 1-4 6" />
        <circle cx="17" cy="6" r="1.5" />
      </svg>
    );
  }

  if (category === "Glutes") {
    return (
      <svg {...svgProps}>
        <path d="M4 18h16" />
        <circle cx="12" cy="7" r="2.5" />
        <path d="M7 18l3-5 5 2 2 3" />
      </svg>
    );
  }

  if (category === "Forearms") {
    return (
      <svg {...svgProps}>
        <rect x="8" y="4" width="8" height="6" rx="2" />
        <path d="M10 10v9M14 10v9" />
        <path d="M7 19h10" />
      </svg>
    );
  }

  if (category === "Legs") {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="4" r="2.5" />
        <path d="M8 10h8" />
        <path d="M8 10l-2 6 3 4" />
        <path d="M16 10l2 6-3 4" />
      </svg>
    );
  }

  if (category === "Core") {
    return (
      <svg {...svgProps}>
        <path d="M6 18c0-4 3-8 6-8s6 4 6 8" />
        <circle cx="12" cy="5" r="2.5" />
        <path d="M4 21h16" />
      </svg>
    );
  }

  // Universal Barbell Hugeicon
  return (
    <svg {...svgProps}>
      <path d="M2 12h20" />
      <path d="M6 6v12M18 6v12" />
      <path d="M8 8v8M16 8v8" />
      <rect x="4" y="9" width="2" height="6" rx="0.5" />
      <rect x="18" y="9" width="2" height="6" rx="0.5" />
    </svg>
  );
}
