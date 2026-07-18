const RD = window.ReactDOM;
if (!RD) {
  throw new Error("window.ReactDOM is missing — the ReactDOM CDN script may have failed to load.");
}
export const createRoot = RD.createRoot;
export default RD;
