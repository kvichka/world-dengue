/* @ds-bundle: {"format":4,"namespace":"CHAIDesignSystem_eb475a","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"Stat","sourcePath":"components/feedback/Stat.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"4d9299a2a2b7","components/core/Button.jsx":"ac492b03df09","components/core/Card.jsx":"d9d17e5b1157","components/feedback/Callout.jsx":"dd0b923a07c8","components/feedback/Stat.jsx":"d43311208afb","ui_kits/slides/Slides.jsx":"a3904e4c04bf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CHAIDesignSystem_eb475a = window.CHAIDesignSystem_eb475a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  blue: {
    bg: "var(--chai-light-blue)",
    fg: "var(--chai-dark-blue)"
  },
  teal: {
    bg: "var(--chai-teal)",
    fg: "#08312c"
  },
  green: {
    bg: "var(--chai-green)",
    fg: "#06492b"
  },
  gold: {
    bg: "var(--chai-gold)",
    fg: "#3d2c00"
  },
  red: {
    bg: "var(--chai-dark-red)",
    fg: "#ffffff"
  },
  grey: {
    bg: "var(--chai-light-grey)",
    fg: "var(--chai-dark-grey)"
  }
};

/** CHAI Badge / status pill. */
function Badge({
  children,
  tone = "blue",
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-base)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      lineHeight: 1.2,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CHAI Button — primary action uses Dark Blue, accent uses Turquoise.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "6px 14px",
      fontSize: "var(--text-sm)"
    },
    md: {
      padding: "10px 20px",
      fontSize: "var(--text-base)"
    },
    lg: {
      padding: "13px 28px",
      fontSize: "var(--text-lg)"
    }
  };
  const variants = {
    primary: {
      background: "var(--color-primary)",
      color: "var(--color-text-inverse)",
      border: "var(--border-width) solid var(--color-primary)"
    },
    accent: {
      background: "var(--color-accent)",
      color: "var(--color-text-inverse)",
      border: "var(--border-width) solid var(--color-accent)"
    },
    secondary: {
      background: "transparent",
      color: "var(--color-primary)",
      border: "var(--border-width-strong) solid var(--color-primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--color-primary)",
      border: "var(--border-width-strong) solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "var(--font-base)",
      fontWeight: "var(--weight-bold)",
      lineHeight: 1,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--duration) var(--ease), border-color var(--duration) var(--ease)",
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.background = "var(--color-primary-hover)";else if (variant === "accent") e.currentTarget.style.background = "var(--color-accent-hover)";else e.currentTarget.style.background = "var(--chai-light-blue)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = variants[variant].background;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** CHAI Card — clean white surface, soft shadow, restrained rounding. */
function Card({
  children,
  padded = true,
  accent = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--color-surface)",
      border: "var(--border-width) solid var(--color-border)",
      borderTop: accent ? "4px solid var(--color-accent)" : undefined,
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      padding: padded ? "var(--space-5)" : 0,
      fontFamily: "var(--font-base)",
      color: "var(--color-text)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  blue: {
    bg: "var(--chai-light-blue)",
    fg: "var(--chai-dark-blue)",
    bar: "var(--chai-dark-blue)"
  },
  gold: {
    bg: "var(--chai-light-gold)",
    fg: "#3d2c00",
    bar: "var(--chai-gold)"
  },
  grey: {
    bg: "var(--chai-light-grey)",
    fg: "var(--chai-dark-grey)",
    bar: "var(--chai-grey)"
  }
};

/**
 * CHAI Callout box — the signature highlight block.
 * Light Blue background with Dark Blue text (per Identity Guide).
 */
function Callout({
  children,
  title,
  tone = "blue",
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: t.bg,
      color: t.fg,
      borderLeft: `4px solid ${t.bar}`,
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4) var(--space-5)",
      fontFamily: "var(--font-base)",
      fontSize: "var(--text-base)",
      lineHeight: "var(--leading-normal)",
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-lg)",
      marginBottom: "var(--space-2)"
    }
  }, title), children);
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** CHAI Stat — large impact figure with label. Used for program metrics. */
function Stat({
  value,
  label,
  sublabel,
  tone = "blue",
  align = "left",
  style = {},
  ...rest
}) {
  const colors = {
    blue: "var(--chai-dark-blue)",
    turquoise: "var(--chai-turquoise)",
    green: "var(--chai-green)",
    gold: "var(--chai-gold)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: "var(--font-base)",
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-4xl)",
      fontWeight: "var(--weight-bold)",
      lineHeight: 1,
      color: colors[tone] || colors.blue,
      letterSpacing: "var(--tracking-tight)"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)"
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "2px",
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)"
    }
  }, sublabel));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/slides/Slides.jsx
try { (() => {
/* CHAI Template A — faithful recreation of the uploaded PowerPoint layouts.
   All geometry derived from ppt/slideMasters + ppt/slideLayouts (EMU → px at 96/in).
   Slide size 13.333 × 7.5in = 1280 × 720px. Theme: "CHAI", font Trebuchet MS. */

const IN = 96;
const NAVY = "#003E78"; // theme dk2 / tx2
const ACCENT1 = "#003D78";
const LIGHTBLUE = "#D5E7EF"; // theme lt2 / bg2
const INK = "#000000"; // theme dk1 / tx1
const FOOTER = "FOR CHAI INTERNAL USE ONLY";
function Frame({
  children,
  bg = "#FFFFFF",
  num
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      background: bg,
      position: "relative",
      fontFamily: "var(--font-base)",
      overflow: "hidden"
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4.42 * IN,
      top: 6.95 * IN,
      width: 4.5 * IN,
      height: 0.4 * IN,
      fontSize: 16,
      color: INK,
      textAlign: "center",
      letterSpacing: ".01em"
    }
  }, FOOTER), num != null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 9.87 * IN,
      top: 6.95 * IN,
      width: 3 * IN,
      height: 0.4 * IN,
      fontSize: 13.3,
      color: INK,
      textAlign: "right",
      paddingRight: 8
    }
  }, num));
}

/* Master chrome shared by all content layouts: title + light-blue rule. */
function MasterTitle({
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.47 * IN,
      top: 0.19 * IN,
      width: 11.21 * IN,
      height: 0.89 * IN,
      fontSize: 32,
      fontWeight: 700,
      color: NAVY,
      lineHeight: 1.1,
      display: "flex",
      alignItems: "flex-end"
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.47 * IN,
      top: 1.08 * IN,
      width: 12.4 * IN,
      height: 0.12 * IN,
      background: LIGHTBLUE
    }
  }));
}
function Bullets({
  items,
  size = 24
}) {
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: "none",
      fontSize: size,
      color: INK,
      lineHeight: 1.25
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "0.25in 1fr",
      marginTop: i ? 13.3 : 0,
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, t))));
}

/* ── Layout 1 — "Title Slide Blue" ───────────────────────────────────────── */
function TitleSlideBlue({
  title = ["Insert title here,", "two lines maximum"],
  subtitle = "Click to edit text"
}) {
  return /*#__PURE__*/React.createElement(Frame, {
    bg: `linear-gradient(135deg, ${LIGHTBLUE} 0%, ${LIGHTBLUE} 40%, #3F7DA2 100%)`
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-blue.png",
    alt: "Clinton Health Access Initiative",
    style: {
      position: "absolute",
      left: 0.9 * IN,
      top: 0.71 * IN,
      width: 2.25 * IN,
      height: 1.21 * IN,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 838199 / 914400 * IN,
      top: 2409508 / 914400 * IN,
      width: 7315200 / 914400 * IN,
      height: 2069510 / 914400 * IN,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      fontSize: 72,
      fontWeight: 700,
      color: INK,
      lineHeight: 1
    }
  }, title.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 848359 / 914400 * IN,
      top: 4615543 / 914400 * IN,
      width: 7315200 / 914400 * IN,
      fontSize: 32,
      color: INK,
      lineHeight: 1.2
    }
  }, subtitle));
}

/* ── Layout 4 — "Section Title" ──────────────────────────────────────────── */
function SectionTitle({
  title = ["Insert section heading here,", "two lines maximum"],
  num = 2
}) {
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 2.03 * IN,
      top: 1.89 * IN,
      width: 9.26 * IN,
      height: 1.6 * IN,
      fontSize: 48,
      fontWeight: 700,
      color: NAVY,
      textAlign: "center",
      lineHeight: 1.1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, title.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 2.01 * IN,
      top: 3.33 * IN,
      width: 9.32 * IN,
      height: 0.12 * IN,
      background: LIGHTBLUE
    }
  }));
}

/* ── Layout 5 — "Title and Content" ──────────────────────────────────────── */
function TitleAndContent({
  title = "Insert your heading here, 2 lines max.",
  items,
  num = 3
}) {
  const body = items || ["First level bullet, set in Trebuchet MS at 18pt", "Second level bullet for supporting detail", "Third level bullet where further breakdown is needed"];
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement(MasterTitle, null, title), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.47 * IN,
      top: 1.6 * IN,
      width: 12.4 * IN,
      height: 5.1 * IN
    }
  }, /*#__PURE__*/React.createElement(Bullets, {
    items: body
  })));
}

/* ── Layout 6 — "Title Two Content" ──────────────────────────────────────── */
function TitleTwoContent({
  title = "Insert your heading here, 2 lines max.",
  left,
  right,
  num = 4
}) {
  const l = left || ["Edit Master text styles", "Second level", "Third level"];
  const r = right || ["Edit Master text styles", "Second level", "Third level"];
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement(MasterTitle, null, title), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.47 * IN,
      top: 1.6 * IN,
      width: 6 * IN,
      height: 5.1 * IN
    }
  }, /*#__PURE__*/React.createElement(Bullets, {
    items: l
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 6.87 * IN,
      top: 1.6 * IN,
      width: 6 * IN,
      height: 5.1 * IN
    }
  }, /*#__PURE__*/React.createElement(Bullets, {
    items: r
  })));
}

/* ── Layout 7 — "Title Only" ─────────────────────────────────────────────── */
function TitleOnly({
  title = "Insert your heading here, 2 lines max.",
  children,
  num = 5
}) {
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement(MasterTitle, null, title), children, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark-white.png",
    alt: "",
    style: {
      position: "absolute",
      left: 12.24 * IN,
      top: 7.06 * IN,
      width: 0.42 * IN,
      height: 0.23 * IN
    }
  }));
}

/* ── Layout 9 — "Final Slide White" ──────────────────────────────────────── */
function FinalSlideWhite({
  text = "Click to edit text",
  num = 6
}) {
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.67 * IN,
      top: 1.56 * IN,
      width: 12 * IN,
      height: 1.69 * IN,
      fontSize: 32,
      color: NAVY,
      textAlign: "center",
      lineHeight: 1.2
    }
  }, text), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-blue-lg.png",
    alt: "Clinton Health Access Initiative",
    style: {
      position: "absolute",
      left: 4.58 * IN,
      top: 3.87 * IN,
      width: 4.18 * IN,
      height: 2.7 * IN,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 3.72 * IN,
      top: 6.39 * IN,
      width: 5.89 * IN,
      height: 0.34 * IN,
      fontSize: 18.7,
      color: ACCENT1,
      textAlign: "center"
    }
  }, "www.clintonhealthaccess.org"));
}

/* ── Extensions ──────────────────────────────────────────────────────────────
   Not layouts in Template A. Both are built on the template's own "Title Only"
   chrome (24pt navy master title at 0.47/0.19in, light-blue rule at y 1.08in,
   master footer + slide number) so they drop into a Template A deck unchanged. */

/* Impact figures — uses the master content box at 0.47/1.60in, 12.4 × 5.1in. */
function StatsSlide({
  title = "CHAI at a glance",
  stats,
  num = 7
}) {
  const items = stats || [{
    value: "35+",
    label: "Countries",
    sublabel: "where we work"
  }, {
    value: "85%",
    label: "Staff based in",
    sublabel: "programme countries"
  }, {
    value: "20+",
    label: "Years",
    sublabel: "of partnership"
  }];
  return /*#__PURE__*/React.createElement(Frame, {
    num: num
  }, /*#__PURE__*/React.createElement(MasterTitle, null, title), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0.47 * IN,
      top: 1.6 * IN,
      width: 12.4 * IN,
      height: 5.1 * IN,
      display: "grid",
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      gap: 0.5 * IN,
      alignContent: "center"
    }
  }, items.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: `${0.12 * IN}px solid ${LIGHTBLUE}`,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 96,
      fontWeight: 700,
      color: NAVY,
      lineHeight: 1
    }
  }, s.value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      color: INK,
      marginTop: 12
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      color: INK,
      opacity: 0.7
    }
  }, s.sublabel)))));
}

/* Pull quote — light-blue field, navy text, attribution in accent blue. */
function QuoteSlide({
  quote = "We work at the invitation of governments, and we measure our work by what remains after we leave.",
  attribution = "Programme lead, national malaria programme",
  num = 8
}) {
  return /*#__PURE__*/React.createElement(Frame, {
    bg: LIGHTBLUE,
    num: num
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 1.5 * IN,
      top: 1.6 * IN,
      width: 10.33 * IN,
      height: 4.2 * IN,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44,
      fontWeight: 700,
      color: NAVY,
      lineHeight: 1.2,
      textWrap: "pretty"
    }
  }, "\u201C", quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      color: ACCENT1,
      marginTop: 0.4 * IN
    }
  }, attribution)), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-blue.png",
    alt: "Clinton Health Access Initiative",
    style: {
      position: "absolute",
      left: 10.83 * IN,
      top: 5.9 * IN,
      width: 1.5 * IN,
      height: 0.81 * IN,
      objectFit: "contain"
    }
  }));
}
Object.assign(window, {
  Frame,
  MasterTitle,
  Bullets,
  TitleSlideBlue,
  SectionTitle,
  TitleAndContent,
  TitleTwoContent,
  TitleOnly,
  FinalSlideWhite,
  StatsSlide,
  QuoteSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/slides/Slides.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Stat = __ds_scope.Stat;

})();
