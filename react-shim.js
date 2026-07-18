// Wraps the UMD-global React build (loaded via a plain <script> tag from a
// long-established CDN pattern) as an ES module, so app.js's
// `import React, { useState, ... } from "react"` resolves to it without
// needing any ESM-CDN resolution for React itself. Fewer moving parts on
// the most critical path = fewer ways for the app to fail to load.
const R = window.React;
if (!R) {
  throw new Error("window.React is missing — the React CDN script may have failed to load.");
}
export default R;
export const useState = R.useState;
export const useEffect = R.useEffect;
export const useRef = R.useRef;
export const useMemo = R.useMemo;
export const useCallback = R.useCallback;
export const useContext = R.useContext;
export const useReducer = R.useReducer;
export const createElement = R.createElement;
export const Fragment = R.Fragment;
export const forwardRef = R.forwardRef;
export const memo = R.memo;
