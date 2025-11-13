/**
 * Design Tokens - Walky Admin Portal (TypeScript)
 *
 * Source: Figma Design System
 * File: https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal
 * Node: 1578-48979
 *
 * Auto-generated from Figma variables
 */

export const spacing = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  40: "40px",
} as const;

export const cornerRadius = {
  xxs: "4px",
  xs: "8px",
  xsPlus: "12px",
  s: "16px",
  xxl: "48px",
  round: "999px",
} as const;

export const colors = {
  // Primary
  primary: {
    purpleMain: "#526ac9",
    purpleVariant: "#546fd9",
    darkPurple: "#321fdb",
  },

  // Neutrals
  neutral: {
    white: "#ffffff",
    black: "#1d1b20",
    darkGrey: "#5b6168",
    greyMedium: "#acb6ba",
    chartsGrey: "#a9abac",
    greyHover: "#575e67",
    placeholder: "#676d70",
    disabledGrey: "#eef0f1",
    black40: "#00000066",
  },

  // Backgrounds
  background: {
    page: "#f4f5f7",
    container: "#f7f8fa",
    select: "#edf2ff",
    title: "#ebf0fa",
    dropdown: "#fcfdfd",
    table: "#f1f4f9",
    alert: "#ffebe9",
    flags: "#fff8f7",
  },

  // Icons
  icon: {
    user: { bg: "#e5e4ff", icon: "#8280ff" },
    events: { bg: "#ffded1", icon: "#ff9871" },
    spaces: { bg: "#d9e3f7", icon: "#4a4cd9" },
    ideas: { bg: "#fff3d6", icon: "#ebb129" },
    green: { bg: "#e9fcf4", icon: "#00c617" },
    orange: { bg: "#fcf3e9", icon: "#f69b39" },
    red: { bg: "#fce9e9", icon: "#ff8082" },
    lightblue: { bg: "#d9f7f7", icon: "#4ad9d4" },
  },

  // Alerts
  alert: {
    success: "#18682c",
    successToast: "#1c9e3e",
    error: "#d53425",
    active: "#36e04a",
  },

  // Borders
  border: {
    default: "#e0e0e0",
    outline: "#cac4d0",
    light: "#eef0f1",
    dark: "#d2d2d3",
    alert: "#ffcac5",
  },

  // Charts
  chart: {
    lines: {
      green: "#00b69b",
      lightblue: "#24aff5",
      darkblue: "#4379ee",
      brightgreen: "#00c943",
      purple: "#5e00b6",
      red: "#ee4343",
    },
    bars: {
      invitationsAccepted: "#389001",
      invitationsSent: "#98f4a0",
      invitationsIgnored: "#a0a0a0",
      reportedMessages: "#bff2ff",
      reportedSpaces: "#576cc2",
    },
    text: {
      events: "#ba5630",
      ideas: "#8a6818",
    },
  },

  // Chips
  chip: {
    reportedContent: {
      orange: { bg: "#fff4e4", text: "#8f5400" },
      pink: { bg: "#ffe2fa", text: "#91127c" },
      red: { bg: "#ffe5e4", text: "#a4181a" },
    },
    events: {
      public: { bg: "#d6e9c7", text: "#3b7809" },
      private: { bg: "#c1d0f5", text: "#0e3eb8" },
    },
    spaces: {
      clubs: { bg: "#e2e0f2", text: "#5f56a9" },
      fraternities: { bg: "#fbf1df", text: "#896726" },
      sororities: { bg: "#fbf6f3", text: "#816651" },
    },
    adminRoles: {
      schoolAdmin: { bg: "#cacaee", text: "#1c1cd3" },
      campusAdmin: { bg: "#cae1ee", text: "#0e4c6f" },
      moderator: { bg: "#f0e3c4", text: "#5f470b" },
      walkyAdmin: { bg: "#eed8ca", text: "#74370e" },
    },
    active: "#edffed",
  },

  // Others
  other: {
    export: "#ebf0fa",
    email: "#5088ff",
    orange500: "#ff9500",
    purple700: "#382f83",
  },

  // Secondary
  secondary: {
    blueVariant: "#6273b3",
    bluePastel: "#e4eefe",
  },
} as const;

export const typography = {
  fontFamily: {
    body: "'Lato', sans-serif",
    title: "'Lato', sans-serif",
    caption: "'Lato', sans-serif",
  },

  fontWeight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  fontSize: {
    xxxxs: "8px",
    s: "14px",
    m: "16px",
    l: "20px",
    xl: "24px",
  },

  // Web text styles
  web: {
    h1Bold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "32px",
      lineHeight: "100%",
    },
    h2Bold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "30px",
      lineHeight: "100%",
    },
    h3Bold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "28px",
      lineHeight: "100%",
    },
    h4Bold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "100%",
    },
    subtitleBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: "100%",
    },
    subtitleRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "20px",
      lineHeight: "100%",
    },
    bodyLargeBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: "100%",
    },
    bodyLargeSemibold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "100%",
    },
    bodyLargeRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "18px",
      lineHeight: "100%",
    },
    bodyBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "100%",
    },
    bodySemibold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "100%",
    },
    bodyRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "100%",
    },
    smallBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "100%",
    },
    smallSemibold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "100%",
    },
    smallRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "100%",
    },
    xsBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "12px",
      lineHeight: "100%",
    },
    xsSemibold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "100%",
    },
    xsRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "100%",
    },
    xsBlack: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 900,
      fontSize: "12px",
      lineHeight: "100%",
    },
  },

  // Mobile text styles
  mobile: {
    h2: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "100%",
    },
    subtitle: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: "100%",
    },
    cardTitle: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: "20px",
    },
    bodyBold: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "100%",
    },
    bodyRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "100%",
    },
    smallRegular: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "100%",
    },
    caption: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 400,
      fontSize: "8px",
      lineHeight: "100%",
    },
  },
} as const;

// Type exports for TypeScript
export type Spacing = typeof spacing;
export type CornerRadius = typeof cornerRadius;
export type Colors = typeof colors;
export type Typography = typeof typography;
