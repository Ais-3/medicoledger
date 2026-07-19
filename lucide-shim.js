// Tries the real icon set from esm.sh. If that CDN request fails for any
// reason (network hiccup, CORS, outage), every icon silently falls back to
// a blank placeholder instead of taking the whole app down with it. Icons
// are cosmetic — the app should stay usable even if this one CDN request
// fails.
const R = window.React;

function BlankIcon(props) {
  const size = (props && props.size) || 14;
  return R.createElement("span", {
    style: { display: "inline-block", width: size, height: size, flexShrink: 0 },
  });
}

const NAMES = [
  "Wallet", "PiggyBank", "GraduationCap", "Plus", "X", "ArrowUpRight",
  "ArrowDownRight", "ArrowLeftRight", "Check", "ChevronRight", "ChevronLeft",
  "Pencil", "Trash2", "BookOpen", "CalendarClock", "ClipboardList", "Percent",
  "Compass", "FolderKanban", "Link2", "CheckSquare", "StickyNote",
  "ExternalLink", "Archive", "Download", "Upload", "Settings", "Star", "Flag",
  "Palette", "RefreshCw",
];

let mod = null;
try {
  mod = await import("https://esm.sh/lucide-react@0.383.0?external=react");
} catch (e) {
  console.warn("lucide-react failed to load from CDN — using blank placeholder icons instead.", e);
}

const resolved = {};
for (const name of NAMES) {
  resolved[name] = (mod && mod[name]) ? mod[name] : BlankIcon;
}

export const Wallet = resolved.Wallet;
export const PiggyBank = resolved.PiggyBank;
export const GraduationCap = resolved.GraduationCap;
export const Plus = resolved.Plus;
export const X = resolved.X;
export const ArrowUpRight = resolved.ArrowUpRight;
export const ArrowDownRight = resolved.ArrowDownRight;
export const ArrowLeftRight = resolved.ArrowLeftRight;
export const Check = resolved.Check;
export const ChevronRight = resolved.ChevronRight;
export const ChevronLeft = resolved.ChevronLeft;
export const Pencil = resolved.Pencil;
export const Trash2 = resolved.Trash2;
export const BookOpen = resolved.BookOpen;
export const CalendarClock = resolved.CalendarClock;
export const ClipboardList = resolved.ClipboardList;
export const Percent = resolved.Percent;
export const Compass = resolved.Compass;
export const FolderKanban = resolved.FolderKanban;
export const Link2 = resolved.Link2;
export const CheckSquare = resolved.CheckSquare;
export const StickyNote = resolved.StickyNote;
export const ExternalLink = resolved.ExternalLink;
export const Archive = resolved.Archive;
export const Download = resolved.Download;
export const Upload = resolved.Upload;
export const Settings = resolved.Settings;
export const Star = resolved.Star;
export const Flag = resolved.Flag;
export const Palette = resolved.Palette;
export const RefreshCw = resolved.RefreshCw;
