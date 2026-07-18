import React, { useState, useEffect, useRef } from "react";
import { Wallet, PiggyBank, GraduationCap, Plus, X, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Check, ChevronRight, ChevronLeft, Pencil, Trash2, BookOpen, CalendarClock, ClipboardList, Percent, Compass, FolderKanban, Link2, CheckSquare, StickyNote, ExternalLink, Archive as ArchiveIcon, Download, Upload, Settings, Star, Flag, Palette } from "lucide-react";
/* ---------------------------------------------------------------
   Tokens
   paper #EFEBE1  ink #232620  line #D9D2BE
   finance (pine ledger green) #2F5D4F / light #E3ECE6
   university (indigo ink)     #2E4374 / light #E5E8F2
   para (taupe ink)            #6E6355 / light #ECE7DA
   alert (brick)                #9C4A32 / light #F4E3DC
----------------------------------------------------------------*/
const FONT_HEAD = "'Fraunces', ui-serif, Georgia, serif";
const FONT_BODY = "'Inter', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";
const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d))
        return iso;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};
const monthKey = (iso) => (iso || "").slice(0, 7);
const thisMonthKey = () => todayISO().slice(0, 7);
const CURRENCIES = [
    { code: "EGP", label: "Egyptian Pound (EGP)" },
    { code: "USD", label: "US Dollar (USD)" },
    { code: "EUR", label: "Euro (EUR)" },
    { code: "GBP", label: "British Pound (GBP)" },
    { code: "SAR", label: "Saudi Riyal (SAR)" },
    { code: "AED", label: "UAE Dirham (AED)" },
    { code: "KWD", label: "Kuwaiti Dinar (KWD)" },
    { code: "QAR", label: "Qatari Riyal (QAR)" },
    { code: "JOD", label: "Jordanian Dinar (JOD)" },
    { code: "TRY", label: "Turkish Lira (TRY)" },
];
const fmtCur = (n, code) => {
    const v = Number(n) || 0;
    const c = code || "EGP";
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: c, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    }
    catch (e) {
        const sign = v < 0 ? "-" : "";
        return `${sign}${c} ${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
};
const EXPENSE_CATEGORIES = [
    "Food & Groceries", "Housing Expense", "Utilities", "Transportation", "Healthcare",
    "Shopping", "Entertainments", "Work & Learning", "Travel", "Subscription", "Charity", "Other"
];
const ACCOUNT_TYPES = ["Cash", "Debit Card", "Prepaid Card", "Savings", "Investment", "Other"];
const PROJECT_STATUSES = ["Inbox", "Planned", "In progress", "Done", "Archived"];
const RESOURCE_TYPES = ["Website", "File", "Book", "Video", "Other"];
/* ---------------------------------------------------------------
   Customization: color palette + icon choices for tabs
----------------------------------------------------------------*/
const PALETTE = [
    { name: "Pine", color: "#2F5D4F", light: "#E3ECE6" },
    { name: "Indigo", color: "#2E4374", light: "#E5E8F2" },
    { name: "Taupe", color: "#6E6355", light: "#ECE7DA" },
    { name: "Brick", color: "#9C4A32", light: "#F4E3DC" },
    { name: "Mustard", color: "#7A5C2E", light: "#EFE6D3" },
    { name: "Teal", color: "#3C6E71", light: "#E1EDEC" },
    { name: "Plum", color: "#6B4E71", light: "#EAE1EC" },
    { name: "Olive", color: "#4A5D3A", light: "#E5EADD" },
    { name: "Slate", color: "#5C5470", light: "#E7E5EE" },
    { name: "Rose", color: "#8C3B4A", light: "#F2DFE2" },
];
const TAB_ICONS = {
    Wallet, PiggyBank, GraduationCap, BookOpen, CalendarClock, ClipboardList,
    Percent, Compass, FolderKanban, Link2, CheckSquare, StickyNote,
    ArchiveIcon, Star, Flag, Palette,
};
const TAB_ICON_CHOICES = [
    "Compass", "FolderKanban", "Link2", "CheckSquare", "StickyNote", "BookOpen",
    "ClipboardList", "CalendarClock", "Percent", "Star", "Flag", "Palette", "ArchiveIcon",
];
const emptyCustomTabs = () => [];
const emptyFinance = () => ({ accounts: [], transactions: [], budgets: {}, goal: { name: "", target: 0, saved: 0, currency: "EGP" } });
const emptyUniversity = () => ({ years: [] });
const emptyPara = () => ({ areas: [], projects: [], resources: [], tasks: [], notes: [] });
/* ---------------------------------------------------------------
   Seed data — imported from the person's Notion "Second Brain" export
----------------------------------------------------------------*/
function buildSeedFinance() {
    const personal = uid(), wallet = uid(), savings = uid(), invest = uid();
    return {
        accounts: [
            { id: personal, name: "Personal Account", type: "Prepaid Card", currency: "EGP", initial: 870.31 },
            { id: wallet, name: "Wallet", type: "Cash", currency: "EGP", initial: 380 },
            { id: savings, name: "Savings", type: "Savings", currency: "EGP", initial: 10000.4 },
            { id: invest, name: "Investments", type: "Investment", currency: "EGP", initial: 0 },
        ],
        transactions: [
            { id: uid(), type: "expense", date: "2026-02-12", amount: 303, accountId: personal, category: "Food & Groceries", note: "Mosahahb 14 pcs - Bazooka" },
            { id: uid(), type: "expense", date: "2026-02-13", amount: 35, accountId: wallet, category: "Transportation", note: "Gates" },
            { id: uid(), type: "expense", date: "2026-02-14", amount: 125, accountId: wallet, category: "Work & Learning", note: "4 portfolios (SBS1214, IPP1208, SIM1213, MIC1210)" },
            { id: uid(), type: "expense", date: "2026-02-14", amount: 35, accountId: personal, category: "Food & Groceries", note: "بطاطس سوري" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 20, accountId: wallet, category: "Food & Groceries", note: "VCOLA" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 30, accountId: wallet, category: "Food & Groceries", note: "Kitkat" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 30, accountId: wallet, category: "Food & Groceries", note: "Double Turkish coffee" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 70, accountId: wallet, category: "Food & Groceries", note: "Iced Spanish latte" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 55, accountId: personal, category: "Food & Groceries", note: "Molto, sun top, chocolate sandwich" },
            { id: uid(), type: "expense", date: "2026-02-15", amount: 40, accountId: wallet, category: "Food & Groceries", note: "Molto and orange juice" },
            { id: uid(), type: "expense", date: "2026-02-16", amount: 15, accountId: wallet, category: "Food & Groceries", note: "Chocolate milk" },
            { id: uid(), type: "income", date: "2026-02-15", amount: 70, accountId: personal, category: undefined, note: "Spanish latte — from Khalid" },
        ],
        budgets: {
            "Food & Groceries": 500, "Housing Expense": 500, "Shopping": 200, "Transportation": 100,
            "Healthcare": 200, "Entertainments": 100, "Work & Learning": 100, "Travel": 200,
            "Subscription": 100, "Other": 100,
        },
        goal: { name: "", target: 0, saved: 0, currency: "EGP" },
    };
}
function buildSeedUniversity() {
    const anaModule = {
        id: uid(), code: "ANA1102", name: "Anatomy", lecturer: "", assistant: "",
        lectures: [
            {
                id: uid(), title: "Lecture 1 — Terminology (terms & planes)", date: "2025-06-23", attended: true,
                quiz: { assigned: false, score: 0, max: 0 }, formative: { assigned: false, score: 0, max: 0 },
                reflection: "Anatomy intro",
            },
            {
                id: uid(), title: "Lecture 2 — Skin & Fascia", date: "", attended: true,
                quiz: { assigned: false, score: 0, max: 0 }, formative: { assigned: false, score: 0, max: 0 },
                reflection: "",
            },
        ],
        deadlines: [],
        grades: [],
        resources: [
            { id: uid(), title: "Lecture 1 materials (OneDrive)", url: "https://buc1-my.sharepoint.com/personal/marwan_20197821_buc_edu_eg/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmarwan%5F20197821%5Fbuc%5Fedu%5Feg%2FDocuments%2FSemester%201%2FANA1102%2Flectures%2FLEC01&ga=1" },
            { id: uid(), title: "Lecture 2 video — Skin & Fascia (Stream)", url: "https://buc1-my.sharepoint.com/personal/marwan_20197821_buc_edu_eg/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmarwan%5F20197821%5Fbuc%5Fedu%5Feg%2FDocuments%2FSemester%201%2FANA1102%2Flectures%2FLEC02%2FVideo%2FLecture%202%20%20Skin%20and%20Fascia.mp4" },
        ],
    };
    return {
        years: [
            {
                id: uid(), name: "Year 1",
                semesters: [
                    { id: uid(), name: "Semester 1", modules: [anaModule] },
                    { id: uid(), name: "Semester 2", modules: [] },
                ],
            },
            {
                id: uid(), name: "Year 2",
                semesters: [
                    { id: uid(), name: "Semester 1", modules: [] },
                    { id: uid(), name: "Semester 2", modules: [] },
                ],
            },
        ],
    };
}
function buildSeedPara() {
    const areaPersonal = uid(), areaUni = uid(), areaGym = uid(), areaLang = uid();
    return {
        areas: [
            { id: areaUni, name: "BUC University", type: "University", archived: false },
            { id: areaPersonal, name: "Personal", type: "Personal", archived: false },
            { id: areaGym, name: "Gym", type: "Health", archived: false },
            { id: areaLang, name: "Language Learning", type: "Personal", archived: false },
        ],
        projects: [
            { id: uid(), name: "IPP", areaId: areaUni, status: "In progress", startDate: "2026-02-07", endDate: "", notes: "", archived: false },
            { id: uid(), name: "Self Hygiene", areaId: areaPersonal, status: "Inbox", startDate: "", endDate: "", notes: "", archived: false },
            { id: uid(), name: "Face Care Routine", areaId: areaPersonal, status: "Inbox", startDate: "", endDate: "", notes: "", archived: false },
        ],
        resources: [],
        tasks: [],
        notes: [],
    };
}
/* ---------------------------------------------------------------
   Persistence
----------------------------------------------------------------*/
function useStore(key, fallback) {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const first = useRef(true);
    useEffect(() => {
        (async () => {
            try {
                const res = await window.storage.get(key, false);
                setData(res && res.value ? JSON.parse(res.value) : fallback());
            }
            catch (e) {
                setData(fallback());
            }
            setLoaded(true);
        })();
    }, [key]);
    useEffect(() => {
        if (!loaded)
            return;
        if (first.current) {
            first.current = false;
            return;
        }
        (async () => {
            try {
                await window.storage.set(key, JSON.stringify(data), false);
            }
            catch (e) { /* best effort */ }
        })();
    }, [data, loaded]);
    return [data, setData, loaded];
}
/* ---------------------------------------------------------------
   Small shared UI atoms
----------------------------------------------------------------*/
function Sheet({ title, onClose, children, accent }) {
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", style: { background: "rgba(35,38,32,0.45)" } },
        React.createElement("div", { className: "w-full sm:max-w-md max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl", style: { background: "#FBFAF6", borderTop: `4px solid ${accent}` } },
            React.createElement("div", { className: "flex items-center justify-between px-5 pt-4 pb-3 sticky top-0", style: { background: "#FBFAF6" } },
                React.createElement("h3", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "text-lg font-semibold" }, title),
                React.createElement("button", { onClick: onClose, className: "p-1.5 rounded-full", style: { background: "#EFEBE1" } },
                    React.createElement(X, { size: 16, color: "#232620" }))),
            React.createElement("div", { className: "px-5 pb-6" }, children))));
}
function Field({ label, children }) {
    return (React.createElement("label", { className: "block mb-3" },
        React.createElement("span", { className: "block text-xs mb-1 tracking-wide uppercase", style: { color: "#8A8672", fontFamily: FONT_BODY } }, label),
        children));
}
const inputStyle = { fontFamily: FONT_BODY, background: "#F3F1E9", border: "1px solid #D9D2BE" };
const inputCls = "w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2";
function Btn({ children, onClick, accent, full, variant = "solid", type = "button", disabled }) {
    const base = "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium px-4 py-2 transition active:scale-[0.98]";
    const style = variant === "solid" ? { background: accent, color: "#FBFAF6" }
        : variant === "ghost" ? { background: "transparent", color: accent, border: `1px solid ${accent}` }
            : { background: "#EFEBE1", color: "#232620" };
    return (React.createElement("button", { type: type, disabled: disabled, onClick: onClick, className: base + (full ? " w-full" : ""), style: { ...style, fontFamily: FONT_BODY, opacity: disabled ? 0.5 : 1 } }, children));
}
function ProgressBar({ pct, color }) {
    const clamped = Math.max(0, Math.min(100, pct));
    return (React.createElement("div", { className: "w-full h-2 rounded-full overflow-hidden", style: { background: "#E3DFCF" } },
        React.createElement("div", { className: "h-full rounded-full", style: { width: `${clamped}%`, background: color } })));
}
function Ring({ pct, color, size = 84, label, sub }) {
    const clamped = Math.max(0, Math.min(100, pct));
    const r = 34, c = 2 * Math.PI * r;
    return (React.createElement("div", { className: "relative flex items-center justify-center", style: { width: size, height: size } },
        React.createElement("svg", { width: size, height: size, viewBox: "0 0 84 84" },
            React.createElement("circle", { cx: "42", cy: "42", r: r, fill: "none", stroke: "#E3DFCF", strokeWidth: "8" }),
            React.createElement("circle", { cx: "42", cy: "42", r: r, fill: "none", stroke: color, strokeWidth: "8", strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c - (clamped / 100) * c, transform: "rotate(-90 42 42)" })),
        React.createElement("div", { className: "absolute flex flex-col items-center" },
            React.createElement("span", { style: { fontFamily: FONT_MONO, color: "#232620" }, className: "text-sm font-semibold" }, label),
            sub && React.createElement("span", { style: { fontFamily: FONT_BODY, color: "#8A8672" }, className: "text-[10px]" }, sub))));
}
function SectionCard({ children, style }) {
    return React.createElement("div", { className: "rounded-xl p-4 mb-3", style: { background: "#FBFAF6", border: "1px solid #E3DFCF", ...style } }, children);
}
function EmptyState({ icon: Icon, text, accent }) {
    return (React.createElement("div", { className: "flex flex-col items-center text-center py-10 px-4" },
        React.createElement("div", { className: "w-12 h-12 rounded-full flex items-center justify-center mb-3", style: { background: accent + "20" } },
            React.createElement(Icon, { size: 20, color: accent })),
        React.createElement("p", { style: { fontFamily: FONT_BODY, color: "#8A8672" }, className: "text-sm max-w-[220px]" }, text)));
}
function Pill({ children, active, color, lightColor, onClick }) {
    return (React.createElement("button", { onClick: onClick, className: "px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: active ? color : lightColor, color: active ? "#FBFAF6" : color } }, children));
}
function SelectField({ label, value, onChange, options, placeholder }) {
    return (React.createElement(Field, { label: label },
        React.createElement("select", { value: value, onChange: onChange, className: inputCls, style: inputStyle },
            placeholder && React.createElement("option", { value: "" }, placeholder),
            options.map((o) => React.createElement("option", { key: o.value, value: o.value }, o.label)))));
}
/* =================================================================
   FINANCE MODULE
================================================================= */
function computeBalance(acc, transactions) {
    let bal = Number(acc.initial) || 0;
    transactions.forEach((t) => {
        if (t.type === "income" && t.accountId === acc.id)
            bal += Number(t.amount);
        else if (t.type === "expense" && t.accountId === acc.id)
            bal -= Number(t.amount);
        else if (t.type === "transfer") {
            if (t.accountId === acc.id)
                bal -= Number(t.amount);
            if (t.toAccountId === acc.id)
                bal += Number(t.amount);
        }
    });
    return bal;
}
function FinanceApp({ data, setData }) {
    const [view, setView] = useState("dashboard");
    const [showAddTx, setShowAddTx] = useState(false);
    const [editTx, setEditTx] = useState(null);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    const [showGoalEdit, setShowGoalEdit] = useState(false);
    const [txFilter, setTxFilter] = useState("all");
    const accounts = data.accounts.map((a) => ({ ...a, balance: computeBalance(a, data.transactions) }));
    const accountsById = {};
    accounts.forEach((a) => { accountsById[a.id] = a; });
    const currencyOf = (t) => t.currency || accountsById[t.accountId]?.currency || "EGP";
    // group balances by currency instead of summing incompatible currencies together
    const balanceByCurrency = {};
    accounts.forEach((a) => { const c = a.currency || "EGP"; balanceByCurrency[c] = (balanceByCurrency[c] || 0) + a.balance; });
    const balanceCurrencies = Object.keys(balanceByCurrency);
    const primaryCurrency = accounts[0]?.currency || "EGP";
    const monthTx = data.transactions.filter((t) => monthKey(t.date) === thisMonthKey());
    const incomeByCurrency = {}, expenseByCurrency = {};
    monthTx.forEach((t) => {
        const c = currencyOf(t);
        if (t.type === "income")
            incomeByCurrency[c] = (incomeByCurrency[c] || 0) + Number(t.amount);
        if (t.type === "expense")
            expenseByCurrency[c] = (expenseByCurrency[c] || 0) + Number(t.amount);
    });
    const monthExpensePrimary = expenseByCurrency[primaryCurrency] || 0;
    const totalBudget = Object.values(data.budgets).reduce((s, v) => s + (Number(v) || 0), 0);
    const spentByCategory = {};
    monthTx.filter((t) => t.type === "expense" && currencyOf(t) === primaryCurrency).forEach((t) => {
        spentByCategory[t.category] = (spentByCategory[t.category] || 0) + Number(t.amount);
    });
    const goalPct = data.goal.target > 0 ? (data.goal.saved / data.goal.target) * 100 : 0;
    const visibleTx = data.transactions.filter((t) => txFilter === "all" || t.type === txFilter);
    function addTransaction(tx) { setData((d) => ({ ...d, transactions: [{ ...tx, id: uid() }, ...d.transactions] })); }
    function patchTransaction(id, tx) { setData((d) => ({ ...d, transactions: d.transactions.map((t) => (t.id === id ? { ...tx, id } : t)) })); }
    function deleteTransaction(id) { setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) })); }
    function addAccount(acc) { setData((d) => ({ ...d, accounts: [...d.accounts, { ...acc, id: uid() }] })); }
    function patchAccount(id, acc) { setData((d) => ({ ...d, accounts: d.accounts.map((a) => (a.id === id ? { ...acc, id } : a)) })); }
    function deleteAccount(id) { setData((d) => ({ ...d, accounts: d.accounts.filter((a) => a.id !== id) })); }
    function setBudget(cat, val) { setData((d) => ({ ...d, budgets: { ...d.budgets, [cat]: val } })); }
    function saveGoal(goal) { setData((d) => ({ ...d, goal })); }
    const tabs = [
        { id: "dashboard", label: "Overview" },
        { id: "accounts", label: "Accounts" },
        { id: "budget", label: "Budget" },
    ];
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex gap-1 mb-4" }, tabs.map((t) => (React.createElement("button", { key: t.id, onClick: () => setView(t.id), className: "px-3 py-1.5 rounded-full text-xs font-medium transition", style: { fontFamily: FONT_BODY, background: view === t.id ? "#2F5D4F" : "#E3ECE6", color: view === t.id ? "#FBFAF6" : "#2F5D4F" } }, t.label)))),
        view === "dashboard" && (React.createElement("div", null,
            React.createElement(SectionCard, null,
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("div", { className: "text-xs uppercase tracking-wide", style: { color: "#8A8672", fontFamily: FONT_BODY } }, "Total balance"),
                        balanceCurrencies.length === 0 ? (React.createElement("div", { className: "text-2xl font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" } }, fmtCur(0, "EGP"))) : balanceCurrencies.length === 1 ? (React.createElement("div", { className: "text-2xl font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" } }, fmtCur(balanceByCurrency[balanceCurrencies[0]], balanceCurrencies[0]))) : (React.createElement("div", { className: "flex flex-col gap-0.5 mt-1" }, balanceCurrencies.map((c) => (React.createElement("span", { key: c, className: "text-lg font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" } }, fmtCur(balanceByCurrency[c], c))))))),
                    React.createElement(PiggyBank, { size: 26, color: "#2F5D4F" })),
                React.createElement("div", { className: "flex flex-col gap-1 mt-3 text-xs", style: { fontFamily: FONT_BODY } }, Object.keys({ ...incomeByCurrency, ...expenseByCurrency }).length === 0 ? (React.createElement("span", { style: { color: "#8A8672" } }, "No activity this month yet")) : (Object.keys({ ...incomeByCurrency, ...expenseByCurrency }).map((c) => (React.createElement("div", { key: c, className: "flex gap-4" },
                    React.createElement("span", { style: { color: "#2F5D4F" } },
                        "+",
                        fmtCur(incomeByCurrency[c] || 0, c),
                        " in"),
                    React.createElement("span", { style: { color: "#9C4A32" } },
                        "-",
                        fmtCur(expenseByCurrency[c] || 0, c),
                        " out"))))))),
            React.createElement("div", { className: "grid grid-cols-2 gap-3 mb-3" },
                React.createElement(SectionCard, { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
                    React.createElement(Ring, { pct: totalBudget > 0 ? (monthExpensePrimary / totalBudget) * 100 : 0, color: "#2F5D4F", label: totalBudget > 0 ? Math.round((monthExpensePrimary / totalBudget) * 100) + "%" : "—", sub: "of budget" }),
                    React.createElement("div", { className: "text-xs mt-2 text-center", style: { color: "#8A8672", fontFamily: FONT_BODY } },
                        fmtCur(monthExpensePrimary, primaryCurrency),
                        " / ",
                        fmtCur(totalBudget, primaryCurrency))),
                React.createElement(SectionCard, { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
                    React.createElement(Ring, { pct: goalPct, color: "#2E4374", label: data.goal.target > 0 ? Math.round(goalPct) + "%" : "—", sub: data.goal.name || "savings goal" }),
                    React.createElement("button", { onClick: () => setShowGoalEdit(true), className: "text-xs mt-2 underline", style: { color: "#8A8672", fontFamily: FONT_BODY } }, data.goal.target > 0 ? `${fmtCur(data.goal.saved, data.goal.currency)} / ${fmtCur(data.goal.target, data.goal.currency)}` : "Set a goal"))),
            React.createElement("div", { className: "flex items-center justify-between mb-2" },
                React.createElement("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm" }, "Activity"),
                React.createElement(Btn, { accent: "#2F5D4F", onClick: () => setShowAddTx(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Add")),
            React.createElement("div", { className: "flex gap-1.5 mb-2 overflow-x-auto", style: { scrollbarWidth: "none" } }, [["all", "All"], ["income", "Income"], ["expense", "Expense"], ["transfer", "Transfer"]].map(([id, label]) => (React.createElement(Pill, { key: id, active: txFilter === id, color: "#2F5D4F", lightColor: "#E3ECE6", onClick: () => setTxFilter(id) }, label)))),
            React.createElement(SectionCard, { style: { padding: 0 } }, visibleTx.length === 0 ? (React.createElement(EmptyState, { icon: ArrowLeftRight, accent: "#2F5D4F", text: "No transactions here yet. Log your first income or expense to start tracking." })) : (visibleTx.slice(0, 20).map((t, i) => (React.createElement("div", { key: t.id, className: "flex items-center justify-between px-4 py-3", style: { borderTop: i === 0 ? "none" : "1px solid #EDE9DB" } },
                React.createElement("div", { className: "flex items-center gap-3 min-w-0" },
                    React.createElement("div", { className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", style: { background: t.type === "income" ? "#E3ECE6" : t.type === "expense" ? "#F4E3DC" : "#E5E8F2" } }, t.type === "income" ? React.createElement(ArrowDownRight, { size: 14, color: "#2F5D4F" }) : t.type === "expense" ? React.createElement(ArrowUpRight, { size: 14, color: "#9C4A32" }) : React.createElement(ArrowLeftRight, { size: 14, color: "#2E4374" })),
                    React.createElement("div", { className: "min-w-0" },
                        React.createElement("div", { className: "text-sm truncate", style: { fontFamily: FONT_BODY, color: "#232620" } }, t.note || t.category || (t.type === "transfer" ? "Transfer" : "—")),
                        React.createElement("div", { className: "text-xs truncate", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                            fmtDate(t.date),
                            t.category ? ` · ${t.category}` : ""))),
                React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" },
                    React.createElement("span", { className: "text-sm font-medium", style: { fontFamily: FONT_MONO, color: t.type === "income" ? "#2F5D4F" : t.type === "expense" ? "#9C4A32" : "#2E4374" } },
                        t.type === "income" ? "+" : t.type === "expense" ? "-" : "",
                        fmtCur(t.amount, currencyOf(t))),
                    React.createElement("button", { onClick: () => setEditTx(t) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => deleteTransaction(t.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))))),
        view === "accounts" && (React.createElement("div", null,
            React.createElement("div", { className: "flex justify-end mb-2" },
                React.createElement(Btn, { accent: "#2F5D4F", onClick: () => setShowAddAccount(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Account")),
            accounts.length === 0 ? (React.createElement(SectionCard, null,
                React.createElement(EmptyState, { icon: Wallet, accent: "#2F5D4F", text: "Add an account (wallet, card, savings) \u2014 pick its currency when you create it." }))) : (accounts.map((a) => (React.createElement(SectionCard, { key: a.id },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, a.name),
                        React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                            a.type,
                            " \u00B7 ",
                            a.currency || "EGP")),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("span", { className: "text-base font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" } }, fmtCur(a.balance, a.currency)),
                        React.createElement("button", { onClick: () => setEditAccount(a) },
                            React.createElement(Pencil, { size: 14, color: "#8A8672" })),
                        React.createElement("button", { onClick: () => deleteAccount(a.id) },
                            React.createElement(Trash2, { size: 14, color: "#C7C1AC" })))))))))),
        view === "budget" && (React.createElement("div", null,
            React.createElement("p", { className: "text-xs mb-3", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                "Budgets are tracked in ",
                primaryCurrency,
                " (your first account's currency)."),
            EXPENSE_CATEGORIES.map((cat) => {
                const budget = Number(data.budgets[cat]) || 0;
                const spent = spentByCategory[cat] || 0;
                const pct = budget > 0 ? (spent / budget) * 100 : 0;
                return (React.createElement(SectionCard, { key: cat },
                    React.createElement("div", { className: "flex items-center justify-between mb-1.5" },
                        React.createElement("span", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, cat),
                        React.createElement("input", { defaultValue: budget || "", placeholder: "0", onBlur: (e) => setBudget(cat, Number(e.target.value) || 0), className: "w-20 text-right text-sm rounded px-2 py-0.5", style: { ...inputStyle, fontFamily: FONT_MONO }, type: "number" })),
                    React.createElement(ProgressBar, { pct: pct, color: pct > 100 ? "#9C4A32" : "#2F5D4F" }),
                    React.createElement("div", { className: "text-xs mt-1", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                        fmtCur(spent, primaryCurrency),
                        " spent this month",
                        budget === 0 ? " · not budgeted" : "")));
            }))),
        showAddTx && React.createElement(AddTransactionSheet, { accounts: data.accounts, onClose: () => setShowAddTx(false), onSave: (tx) => { addTransaction(tx); setShowAddTx(false); } }),
        editTx && React.createElement(AddTransactionSheet, { accounts: data.accounts, initial: editTx, onClose: () => setEditTx(null), onSave: (tx) => { patchTransaction(editTx.id, tx); setEditTx(null); } }),
        showAddAccount && React.createElement(AddAccountSheet, { onClose: () => setShowAddAccount(false), onSave: (acc) => { addAccount(acc); setShowAddAccount(false); } }),
        editAccount && React.createElement(AddAccountSheet, { initial: editAccount, onClose: () => setEditAccount(null), onSave: (acc) => { patchAccount(editAccount.id, acc); setEditAccount(null); } }),
        showGoalEdit && React.createElement(GoalSheet, { goal: data.goal, onClose: () => setShowGoalEdit(false), onSave: (g) => { saveGoal(g); setShowGoalEdit(false); } })));
}
function AddTransactionSheet({ accounts, initial, onClose, onSave }) {
    const [type, setType] = useState(initial?.type || "expense");
    const [amount, setAmount] = useState(initial?.amount ?? "");
    const [accountId, setAccountId] = useState(initial?.accountId || accounts[0]?.id || "");
    const [toAccountId, setToAccountId] = useState(initial?.toAccountId || accounts[1]?.id || "");
    const [currency, setCurrency] = useState(initial?.currency || accounts.find((a) => a.id === (initial?.accountId || accounts[0]?.id))?.currency || "EGP");
    const [category, setCategory] = useState(initial?.category || EXPENSE_CATEGORIES[0]);
    const [note, setNote] = useState(initial?.note || "");
    const [date, setDate] = useState(initial?.date || todayISO());
    function handleAccountChange(id) {
        setAccountId(id);
        const acc = accounts.find((a) => a.id === id);
        if (acc)
            setCurrency(acc.currency || "EGP");
    }
    const canSave = amount && Number(amount) > 0 && accountId && (type !== "transfer" || toAccountId);
    return (React.createElement(Sheet, { title: initial ? "Edit transaction" : "Add transaction", onClose: onClose, accent: "#2F5D4F" },
        React.createElement("div", { className: "flex gap-2 mb-4" }, [{ id: "expense", label: "Expense" }, { id: "income", label: "Income" }, { id: "transfer", label: "Transfer" }].map((o) => (React.createElement("button", { key: o.id, onClick: () => setType(o.id), className: "flex-1 py-2 rounded-lg text-sm font-medium", style: { fontFamily: FONT_BODY, background: type === o.id ? "#2F5D4F" : "#E3ECE6", color: type === o.id ? "#FBFAF6" : "#2F5D4F" } }, o.label)))),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement("div", { className: "flex-1" },
                React.createElement(Field, { label: "Amount" },
                    React.createElement("input", { type: "number", inputMode: "decimal", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }))),
            React.createElement("div", { style: { width: 118 } },
                React.createElement(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }))),
        React.createElement(SelectField, { label: type === "transfer" ? "From account" : "Account", value: accountId, onChange: (e) => handleAccountChange(e.target.value), options: accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currency || "EGP"})` })), placeholder: accounts.length === 0 ? "Add an account first" : undefined }),
        type === "transfer" && React.createElement(SelectField, { label: "To account", value: toAccountId, onChange: (e) => setToAccountId(e.target.value), options: accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currency || "EGP"})` })) }),
        type === "expense" && React.createElement(SelectField, { label: "Category", value: category, onChange: (e) => setCategory(e.target.value), options: EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })) }),
        React.createElement(Field, { label: "Date" },
            React.createElement("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Note (optional)" },
            React.createElement("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "What was it for?", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2F5D4F", full: true, disabled: !canSave, onClick: () => onSave({ type, amount: Number(amount), currency, accountId, toAccountId: type === "transfer" ? toAccountId : undefined, category: type === "expense" ? category : undefined, note, date }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function AddAccountSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [type, setType] = useState(initial?.type || "Cash");
    const [currency, setCurrency] = useState(initial?.currency || "EGP");
    const [initialBal, setInitialBal] = useState(initial?.initial ?? "");
    return (React.createElement(Sheet, { title: initial ? "Edit account" : "Add account", onClose: onClose, accent: "#2F5D4F" },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Wallet, Student card", className: inputCls, style: inputStyle })),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement("div", { className: "flex-1" },
                React.createElement(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: ACCOUNT_TYPES.map((t) => ({ value: t, label: t })) })),
            React.createElement("div", { style: { width: 130 } },
                React.createElement(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }))),
        React.createElement(Field, { label: "Starting balance" },
            React.createElement("input", { type: "number", value: initialBal, onChange: (e) => setInitialBal(e.target.value), placeholder: "0.00", className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } })),
        React.createElement(Btn, { accent: "#2F5D4F", full: true, disabled: !name, onClick: () => onSave({ name, type, currency, initial: Number(initialBal) || 0 }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function GoalSheet({ goal, onClose, onSave }) {
    const [name, setName] = useState(goal.name || "");
    const [target, setTarget] = useState(goal.target || "");
    const [saved, setSaved] = useState(goal.saved || "");
    const [currency, setCurrency] = useState(goal.currency || "EGP");
    return (React.createElement(Sheet, { title: "Savings goal", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Goal name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. New laptop", className: inputCls, style: inputStyle })),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement("div", { className: "flex-1" },
                React.createElement(Field, { label: "Target amount" },
                    React.createElement("input", { type: "number", value: target, onChange: (e) => setTarget(e.target.value), className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }))),
            React.createElement("div", { style: { width: 118 } },
                React.createElement(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }))),
        React.createElement(Field, { label: "Already saved" },
            React.createElement("input", { type: "number", value: saved, onChange: (e) => setSaved(e.target.value), className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } })),
        React.createElement(Btn, { accent: "#2E4374", full: true, onClick: () => onSave({ name, target: Number(target) || 0, saved: Number(saved) || 0, currency }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
/* =================================================================
   UNIVERSITY MODULE
================================================================= */
function moduleStats(mod) {
    const scored = [];
    mod.lectures.forEach((l) => {
        if (l.quiz?.assigned && l.quiz.max)
            scored.push({ score: l.quiz.score, max: l.quiz.max });
        if (l.formative?.assigned && l.formative.max)
            scored.push({ score: l.formative.score, max: l.formative.max });
    });
    (mod.grades || []).forEach((g) => { if (g.max)
        scored.push({ score: g.score, max: g.max }); });
    const avg = scored.length ? scored.reduce((s, x) => s + (Number(x.score) / Number(x.max)) * 100, 0) / scored.length : null;
    const attended = mod.lectures.filter((l) => l.attended).length;
    const attendancePct = mod.lectures.length ? (attended / mod.lectures.length) * 100 : null;
    const pendingDeadlines = (mod.deadlines || []).filter((d) => !d.done).length;
    return { avg, attendancePct, pendingDeadlines, lectureCount: mod.lectures.length };
}
function aggregateStats(modules) {
    const allStats = modules.map(moduleStats);
    const scored = allStats.filter((s) => s.avg !== null);
    const avg = scored.length ? scored.reduce((s, x) => s + x.avg, 0) / scored.length : null;
    const totalLectures = modules.reduce((s, m) => s + m.lectures.length, 0);
    const totalAttended = modules.reduce((s, m) => s + m.lectures.filter((l) => l.attended).length, 0);
    const attendancePct = totalLectures > 0 ? (totalAttended / totalLectures) * 100 : null;
    const pendingDeadlines = modules.reduce((s, m) => s + (m.deadlines || []).filter((d) => !d.done).length, 0);
    return { avg, attendancePct, pendingDeadlines, moduleCount: modules.length };
}
function StatChips({ stats, count, countLabel }) {
    return (React.createElement("div", { className: "flex gap-4 mt-2 text-xs", style: { fontFamily: FONT_MONO } },
        React.createElement("span", { style: { color: "#2E4374" } }, stats.avg !== null ? Math.round(stats.avg) + "% avg" : "no grades yet"),
        React.createElement("span", { style: { color: "#8A8672" } }, stats.attendancePct !== null ? Math.round(stats.attendancePct) + "% attendance" : "—"),
        stats.pendingDeadlines > 0 && React.createElement("span", { style: { color: "#9C4A32" } },
            stats.pendingDeadlines,
            " due"),
        count !== undefined && React.createElement("span", { style: { color: "#8A8672" } },
            count,
            " ",
            countLabel)));
}
/* ---- University root: drills Years -> Semesters -> Modules -> Module detail ---- */
function UniversityApp({ data, setData }) {
    const [path, setPath] = useState({ yearId: null, semesterId: null, moduleId: null });
    function setYears(years) { setData((d) => ({ ...d, years })); }
    function setSemesters(yearId, semesters) { setData((d) => ({ ...d, years: d.years.map((y) => (y.id === yearId ? { ...y, semesters } : y)) })); }
    function setModulesFor(yearId, semId, modules) {
        setData((d) => ({ ...d, years: d.years.map((y) => (y.id !== yearId ? y : { ...y, semesters: y.semesters.map((s) => (s.id === semId ? { ...s, modules } : s)) })) }));
    }
    function updateModule(yearId, semId, modId, patch) {
        setData((d) => ({ ...d, years: d.years.map((y) => (y.id !== yearId ? y : { ...y, semesters: y.semesters.map((s) => (s.id !== semId ? s : { ...s, modules: s.modules.map((m) => (m.id === modId ? { ...m, ...patch } : m)) })) })) }));
    }
    function deleteModuleAt(yearId, semId, modId) {
        setData((d) => ({ ...d, years: d.years.map((y) => (y.id !== yearId ? y : { ...y, semesters: y.semesters.map((s) => (s.id !== semId ? s : { ...s, modules: s.modules.filter((m) => m.id !== modId) })) })) }));
        setPath((p) => ({ ...p, moduleId: null }));
    }
    const activeYear = data.years.find((y) => y.id === path.yearId);
    const activeSemester = activeYear?.semesters.find((s) => s.id === path.semesterId);
    const activeModule = activeSemester?.modules.find((m) => m.id === path.moduleId);
    if (activeModule) {
        return (React.createElement(ModuleDetail, { mod: activeModule, onBack: () => setPath((p) => ({ ...p, moduleId: null })), onUpdate: (patch) => updateModule(path.yearId, path.semesterId, activeModule.id, patch), onDelete: () => deleteModuleAt(path.yearId, path.semesterId, activeModule.id) }));
    }
    if (activeSemester) {
        return (React.createElement(ModulesView, { yearName: activeYear.name, semester: activeSemester, setModules: (modules) => setModulesFor(path.yearId, path.semesterId, modules), onBack: () => setPath((p) => ({ ...p, semesterId: null })), onOpenModule: (id) => setPath((p) => ({ ...p, moduleId: id })) }));
    }
    if (activeYear) {
        return (React.createElement(SemestersView, { year: activeYear, setSemesters: (semesters) => setSemesters(path.yearId, semesters), onBack: () => setPath({ yearId: null, semesterId: null, moduleId: null }), onOpen: (id) => setPath((p) => ({ ...p, semesterId: id })) }));
    }
    return React.createElement(YearsView, { years: data.years, setYears: setYears, onOpen: (id) => setPath({ yearId: id, semesterId: null, moduleId: null }) });
}
function YearsView({ years, setYears, onOpen }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(y) { setYears([...years, { id: uid(), name: y.name, semesters: [{ id: uid(), name: "Semester 1", modules: [] }, { id: uid(), name: "Semester 2", modules: [] }] }]); }
    function patch(id, y) { setYears(years.map((x) => (x.id === id ? { ...x, ...y } : x))); }
    function del(id) { setYears(years.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex items-center justify-between mb-2" },
            React.createElement("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm" }, "Years"),
            React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Year")),
        years.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: GraduationCap, accent: "#2E4374", text: "Add your first year to start organizing semesters and modules." }))) : (years.map((y) => {
            const modules = y.semesters.flatMap((s) => s.modules);
            const stats = aggregateStats(modules);
            return (React.createElement(SectionCard, { key: y.id },
                React.createElement("button", { onClick: () => onOpen(y.id), className: "w-full text-left" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" } }, y.name),
                        React.createElement(ChevronRight, { size: 16, color: "#8A8672" })),
                    React.createElement(StatChips, { stats: stats, count: y.semesters.length, countLabel: "semesters" })),
                React.createElement("div", { className: "flex justify-end gap-2 mt-2" },
                    React.createElement("button", { onClick: () => setEdit(y) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(y.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))));
        })),
        showAdd && React.createElement(YearSheet, { onClose: () => setShowAdd(false), onSave: (y) => { add(y); setShowAdd(false); } }),
        edit && React.createElement(YearSheet, { initial: edit, onClose: () => setEdit(null), onSave: (y) => { patch(edit.id, y); setEdit(null); } })));
}
function YearSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    return (React.createElement(Sheet, { title: initial ? "Edit year" : "Add year", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Year 3", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function SemestersView({ year, setSemesters, onBack, onOpen }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(s) { setSemesters([...year.semesters, { id: uid(), name: s.name, modules: [] }]); }
    function patch(id, s) { setSemesters(year.semesters.map((x) => (x.id === id ? { ...x, ...s } : x))); }
    function del(id) { setSemesters(year.semesters.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" } },
            React.createElement(ChevronLeft, { size: 15 }),
            " All years"),
        React.createElement("div", { className: "flex items-center justify-between mb-2" },
            React.createElement("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm" },
                year.name,
                " \u00B7 Semesters"),
            React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Semester")),
        year.semesters.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: CalendarClock, accent: "#2E4374", text: "Add a semester to start adding modules." }))) : (year.semesters.map((s) => {
            const stats = aggregateStats(s.modules);
            return (React.createElement(SectionCard, { key: s.id },
                React.createElement("button", { onClick: () => onOpen(s.id), className: "w-full text-left" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" } }, s.name),
                        React.createElement(ChevronRight, { size: 16, color: "#8A8672" })),
                    React.createElement(StatChips, { stats: stats, count: s.modules.length, countLabel: "modules" })),
                React.createElement("div", { className: "flex justify-end gap-2 mt-2" },
                    React.createElement("button", { onClick: () => setEdit(s) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(s.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))));
        })),
        showAdd && React.createElement(SemesterSheet, { onClose: () => setShowAdd(false), onSave: (s) => { add(s); setShowAdd(false); } }),
        edit && React.createElement(SemesterSheet, { initial: edit, onClose: () => setEdit(null), onSave: (s) => { patch(edit.id, s); setEdit(null); } })));
}
function SemesterSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    return (React.createElement(Sheet, { title: initial ? "Edit semester" : "Add semester", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Semester 1", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function ModulesView({ yearName, semester, setModules, onBack, onOpenModule }) {
    const [showAddModule, setShowAddModule] = useState(false);
    function addModule(mod) {
        const newMod = { id: uid(), lectures: [], deadlines: [], grades: [], resources: [], ...mod };
        setModules([...semester.modules, newMod]);
        onOpenModule(newMod.id);
    }
    const allDeadlines = [];
    semester.modules.forEach((m) => (m.deadlines || []).forEach((d) => allDeadlines.push({ ...d, moduleName: m.code || m.name })));
    const upcoming = allDeadlines.filter((d) => !d.done).sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || "")).slice(0, 5);
    return (React.createElement("div", null,
        React.createElement("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" } },
            React.createElement(ChevronLeft, { size: 15 }),
            " ",
            yearName),
        semester.modules.length > 0 && (React.createElement(SectionCard, null,
            React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                React.createElement(CalendarClock, { size: 16, color: "#2E4374" }),
                React.createElement("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm" }, "Upcoming deadlines")),
            upcoming.length === 0 ? (React.createElement("p", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Nothing pending. Nice.")) : (upcoming.map((d) => (React.createElement("div", { key: d.id, className: "flex items-center justify-between py-1.5", style: { borderTop: "1px solid #EDE9DB" } },
                React.createElement("span", { className: "text-sm", style: { fontFamily: FONT_BODY, color: "#232620" } },
                    d.title,
                    " ",
                    React.createElement("span", { style: { color: "#8A8672" } },
                        "\u00B7 ",
                        d.moduleName)),
                React.createElement("span", { className: "text-xs", style: { fontFamily: FONT_MONO, color: "#9C4A32" } }, fmtDate(d.dueDate)))))))),
        React.createElement("div", { className: "flex items-center justify-between mb-2" },
            React.createElement("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm" },
                semester.name,
                " \u00B7 Modules"),
            React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAddModule(true) },
                React.createElement(Plus, { size: 14 }),
                " Module")),
        semester.modules.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: GraduationCap, accent: "#2E4374", text: "Add a module to start tracking lectures, grades, attendance and reflections." }))) : (semester.modules.map((m) => {
            const stats = moduleStats(m);
            return (React.createElement("button", { key: m.id, onClick: () => onOpenModule(m.id), className: "w-full text-left" },
                React.createElement(SectionCard, null,
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" } },
                                m.code ? `${m.code} · ` : "",
                                m.name),
                            React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, m.lecturer || "No lecturer set")),
                        React.createElement(ChevronRight, { size: 16, color: "#8A8672" })),
                    React.createElement(StatChips, { stats: stats }))));
        })),
        showAddModule && React.createElement(AddModuleSheet, { onClose: () => setShowAddModule(false), onSave: (m) => { addModule(m); setShowAddModule(false); } })));
}
function AddModuleSheet({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [assistant, setAssistant] = useState("");
    return (React.createElement(Sheet, { title: "Add module", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Module name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Intro to Analytics", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Module code" },
            React.createElement("input", { value: code, onChange: (e) => setCode(e.target.value), placeholder: "e.g. ANA1102", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Lecturer" },
            React.createElement("input", { value: lecturer, onChange: (e) => setLecturer(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Assistant / TA" },
            React.createElement("input", { value: assistant, onChange: (e) => setAssistant(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name, code, lecturer, assistant }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function ModuleDetail({ mod, onBack, onUpdate, onDelete }) {
    const [tab, setTab] = useState("lectures");
    const [showAddLecture, setShowAddLecture] = useState(false);
    const [editLecture, setEditLecture] = useState(null);
    const [showAddDeadline, setShowAddDeadline] = useState(false);
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [showAddResource, setShowAddResource] = useState(false);
    const stats = moduleStats(mod);
    function addLecture(l) { onUpdate({ lectures: [{ id: uid(), ...l }, ...mod.lectures] }); }
    function patchLecture(id, patch) { onUpdate({ lectures: mod.lectures.map((l) => (l.id === id ? { ...l, ...patch } : l)) }); }
    function deleteLecture(id) { onUpdate({ lectures: mod.lectures.filter((l) => l.id !== id) }); }
    function addDeadline(d) { onUpdate({ deadlines: [{ id: uid(), done: false, ...d }, ...(mod.deadlines || [])] }); }
    function toggleDeadline(id) { onUpdate({ deadlines: mod.deadlines.map((d) => (d.id === id ? { ...d, done: !d.done } : d)) }); }
    function deleteDeadline(id) { onUpdate({ deadlines: mod.deadlines.filter((d) => d.id !== id) }); }
    function addGrade(g) { onUpdate({ grades: [{ id: uid(), ...g }, ...(mod.grades || [])] }); }
    function deleteGrade(id) { onUpdate({ grades: mod.grades.filter((g) => g.id !== id) }); }
    function addResource(r) { onUpdate({ resources: [{ id: uid(), ...r }, ...(mod.resources || [])] }); }
    function deleteResource(id) { onUpdate({ resources: (mod.resources || []).filter((r) => r.id !== id) }); }
    const tabs = [
        { id: "lectures", label: "Lectures" },
        { id: "deadlines", label: "Deadlines" },
        { id: "grades", label: "Grades" },
        { id: "resources", label: "Materials" },
    ];
    return (React.createElement("div", null,
        React.createElement("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" } },
            React.createElement(ChevronLeft, { size: 15 }),
            " All modules"),
        React.createElement(SectionCard, null,
            React.createElement("div", { className: "flex items-start justify-between" },
                React.createElement("div", null,
                    React.createElement("div", { className: "text-base font-semibold", style: { fontFamily: FONT_HEAD, color: "#232620" } },
                        mod.code ? `${mod.code} · ` : "",
                        mod.name),
                    React.createElement("div", { className: "text-xs mt-0.5", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                        mod.lecturer && React.createElement(React.Fragment, null,
                            "Lecturer: ",
                            mod.lecturer,
                            "  "),
                        mod.assistant && React.createElement(React.Fragment, null,
                            "\u00B7 Assistant: ",
                            mod.assistant),
                        !mod.lecturer && !mod.assistant && "No lecturer or assistant set")),
                React.createElement("button", { onClick: onDelete },
                    React.createElement(Trash2, { size: 14, color: "#C7C1AC" }))),
            React.createElement("div", { className: "flex gap-4 mt-3 text-xs", style: { fontFamily: FONT_MONO } },
                React.createElement("span", { style: { color: "#2E4374" } }, stats.avg !== null ? Math.round(stats.avg) + "% avg grade" : "no grades yet"),
                React.createElement("span", { style: { color: "#8A8672" } }, stats.attendancePct !== null ? Math.round(stats.attendancePct) + "% attendance" : "—"))),
        React.createElement("div", { className: "flex gap-1 mb-4 overflow-x-auto", style: { scrollbarWidth: "none" } }, tabs.map((t) => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), className: "px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: tab === t.id ? "#2E4374" : "#E5E8F2", color: tab === t.id ? "#FBFAF6" : "#2E4374" } }, t.label)))),
        tab === "lectures" && (React.createElement("div", null,
            React.createElement("div", { className: "flex justify-end mb-2" },
                React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAddLecture(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Lecture")),
            mod.lectures.length === 0 ? (React.createElement(SectionCard, null,
                React.createElement(EmptyState, { icon: BookOpen, accent: "#2E4374", text: "Log each lecture or section \u2014 attendance, quiz/formative scores, and your own reflection." }))) : (mod.lectures.map((l) => (React.createElement(SectionCard, { key: l.id },
                React.createElement("div", { className: "flex items-start justify-between" },
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("button", { onClick: () => patchLecture(l.id, { attended: !l.attended }), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: l.attended ? "#2E4374" : "#E5E8F2" } }, l.attended && React.createElement(Check, { size: 12, color: "#FBFAF6" })),
                            React.createElement("span", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, l.title)),
                        l.date && React.createElement("div", { className: "text-xs mt-0.5 ml-7", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, fmtDate(l.date)),
                        React.createElement("div", { className: "ml-7 mt-2 flex flex-wrap gap-2 text-xs", style: { fontFamily: FONT_MONO } },
                            l.quiz?.assigned && React.createElement("span", { className: "px-2 py-0.5 rounded-full", style: { background: "#E5E8F2", color: "#2E4374" } },
                                "Quiz ",
                                l.quiz.max ? `${l.quiz.score}/${l.quiz.max}` : "assigned"),
                            l.formative?.assigned && React.createElement("span", { className: "px-2 py-0.5 rounded-full", style: { background: "#E5E8F2", color: "#2E4374" } },
                                "Formative ",
                                l.formative.max ? `${l.formative.score}/${l.formative.max}` : "assigned")),
                        l.reflection && (React.createElement("div", { className: "ml-7 mt-2 text-xs italic p-2 rounded-lg", style: { fontFamily: FONT_BODY, color: "#5C5847", background: "#F3F1E9" } },
                            "\"",
                            l.reflection,
                            "\""))),
                    React.createElement("div", { className: "flex flex-col gap-2 ml-2 flex-shrink-0" },
                        React.createElement("button", { onClick: () => setEditLecture(l) },
                            React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                        React.createElement("button", { onClick: () => deleteLecture(l.id) },
                            React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))))),
        tab === "deadlines" && (React.createElement("div", null,
            React.createElement("div", { className: "flex justify-end mb-2" },
                React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAddDeadline(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Deadline")),
            (mod.deadlines || []).length === 0 ? (React.createElement(SectionCard, null,
                React.createElement(EmptyState, { icon: ClipboardList, accent: "#2E4374", text: "Track assignment and exam deadlines for this module." }))) : ([...mod.deadlines].sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || "")).map((d) => (React.createElement(SectionCard, { key: d.id },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("button", { onClick: () => toggleDeadline(d.id), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: d.done ? "#2E4374" : "#E5E8F2" } }, d.done && React.createElement(Check, { size: 12, color: "#FBFAF6" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm", style: { fontFamily: FONT_BODY, color: d.done ? "#8A8672" : "#232620", textDecoration: d.done ? "line-through" : "none" } }, d.title),
                            React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_MONO, color: "#9C4A32" } }, fmtDate(d.dueDate)))),
                    React.createElement("button", { onClick: () => deleteDeadline(d.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" }))))))))),
        tab === "grades" && (React.createElement("div", null,
            React.createElement("div", { className: "flex justify-end mb-2" },
                React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAddGrade(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Grade")),
            (mod.grades || []).length === 0 ? (React.createElement(SectionCard, null,
                React.createElement(EmptyState, { icon: Percent, accent: "#2E4374", text: "Add exams, assignments or other graded work \u2014 quiz and formative scores from Lectures count too." }))) : (mod.grades.map((g) => (React.createElement(SectionCard, { key: g.id },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, g.title),
                        React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, g.type)),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("span", { className: "text-sm font-semibold", style: { fontFamily: FONT_MONO, color: "#2E4374" } },
                            g.score,
                            "/",
                            g.max),
                        React.createElement("button", { onClick: () => deleteGrade(g.id) },
                            React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))))),
        tab === "resources" && (React.createElement("div", null,
            React.createElement("div", { className: "flex justify-end mb-2" },
                React.createElement(Btn, { accent: "#2E4374", onClick: () => setShowAddResource(true) },
                    React.createElement(Plus, { size: 14 }),
                    " Material")),
            (mod.resources || []).length === 0 ? (React.createElement(SectionCard, null,
                React.createElement(EmptyState, { icon: Link2, accent: "#2E4374", text: "Save links to slides, recordings, or readings for this module." }))) : (mod.resources.map((r) => (React.createElement(SectionCard, { key: r.id },
                React.createElement("div", { className: "flex items-center justify-between gap-2" },
                    React.createElement("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm flex items-center gap-1.5 min-w-0", style: { fontFamily: FONT_BODY, color: "#2E4374" } },
                        React.createElement(ExternalLink, { size: 13, className: "flex-shrink-0" }),
                        React.createElement("span", { className: "truncate" }, r.title)),
                    React.createElement("button", { onClick: () => deleteResource(r.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" }))))))))),
        showAddLecture && React.createElement(LectureSheet, { onClose: () => setShowAddLecture(false), onSave: (l) => { addLecture(l); setShowAddLecture(false); } }),
        editLecture && React.createElement(LectureSheet, { initial: editLecture, onClose: () => setEditLecture(null), onSave: (l) => { patchLecture(editLecture.id, l); setEditLecture(null); } }),
        showAddDeadline && React.createElement(DeadlineSheet, { onClose: () => setShowAddDeadline(false), onSave: (d) => { addDeadline(d); setShowAddDeadline(false); } }),
        showAddGrade && React.createElement(GradeSheet, { onClose: () => setShowAddGrade(false), onSave: (g) => { addGrade(g); setShowAddGrade(false); } }),
        showAddResource && React.createElement(ResourceLinkSheet, { onClose: () => setShowAddResource(false), onSave: (r) => { addResource(r); setShowAddResource(false); } })));
}
function ResourceLinkSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    return (React.createElement(Sheet, { title: "Add material", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Lecture 3 slides", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Link" },
            React.createElement("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://\u2026", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !title || !url, onClick: () => onSave({ title, url }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function LectureSheet({ initial, onClose, onSave }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [date, setDate] = useState(initial?.date || todayISO());
    const [attended, setAttended] = useState(initial?.attended ?? true);
    const [quizAssigned, setQuizAssigned] = useState(initial?.quiz?.assigned || false);
    const [quizScore, setQuizScore] = useState(initial?.quiz?.score ?? "");
    const [quizMax, setQuizMax] = useState(initial?.quiz?.max ?? "");
    const [formAssigned, setFormAssigned] = useState(initial?.formative?.assigned || false);
    const [formScore, setFormScore] = useState(initial?.formative?.score ?? "");
    const [formMax, setFormMax] = useState(initial?.formative?.max ?? "");
    const [reflection, setReflection] = useState(initial?.reflection || "");
    return (React.createElement(Sheet, { title: initial ? "Edit lecture" : "Add lecture / section", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Lecture 3 \u2013 Regression", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Date" },
            React.createElement("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement("label", { className: "flex items-center gap-2 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#232620" } },
            React.createElement("input", { type: "checkbox", checked: attended, onChange: (e) => setAttended(e.target.checked) }),
            " Attended"),
        React.createElement("div", { className: "rounded-lg p-3 mb-3", style: { background: "#F3F1E9" } },
            React.createElement("label", { className: "flex items-center gap-2 text-sm mb-2", style: { fontFamily: FONT_BODY, color: "#232620" } },
                React.createElement("input", { type: "checkbox", checked: quizAssigned, onChange: (e) => setQuizAssigned(e.target.checked) }),
                " Quiz assigned"),
            quizAssigned && (React.createElement("div", { className: "flex gap-2" },
                React.createElement("input", { type: "number", placeholder: "score", value: quizScore, onChange: (e) => setQuizScore(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }),
                React.createElement("input", { type: "number", placeholder: "out of", value: quizMax, onChange: (e) => setQuizMax(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } })))),
        React.createElement("div", { className: "rounded-lg p-3 mb-3", style: { background: "#F3F1E9" } },
            React.createElement("label", { className: "flex items-center gap-2 text-sm mb-2", style: { fontFamily: FONT_BODY, color: "#232620" } },
                React.createElement("input", { type: "checkbox", checked: formAssigned, onChange: (e) => setFormAssigned(e.target.checked) }),
                " Formative assigned"),
            formAssigned && (React.createElement("div", { className: "flex gap-2" },
                React.createElement("input", { type: "number", placeholder: "score", value: formScore, onChange: (e) => setFormScore(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }),
                React.createElement("input", { type: "number", placeholder: "out of", value: formMax, onChange: (e) => setFormMax(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } })))),
        React.createElement(Field, { label: "Your reflection (optional)" },
            React.createElement("textarea", { value: reflection, onChange: (e) => setReflection(e.target.value), rows: 3, placeholder: "What stuck with you from this lesson?", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !title, onClick: () => onSave({
                title, date, attended,
                quiz: { assigned: quizAssigned, score: Number(quizScore) || 0, max: Number(quizMax) || 0 },
                formative: { assigned: formAssigned, score: Number(formScore) || 0, max: Number(formMax) || 0 },
                reflection,
            }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function DeadlineSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(todayISO());
    return (React.createElement(Sheet, { title: "Add deadline", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Assignment 2 submission", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Due date" },
            React.createElement("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !title, onClick: () => onSave({ title, dueDate }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function GradeSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Assignment");
    const [score, setScore] = useState("");
    const [max, setMax] = useState("");
    return (React.createElement(Sheet, { title: "Add grade", onClose: onClose, accent: "#2E4374" },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Midterm exam", className: inputCls, style: inputStyle })),
        React.createElement(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: ["Assignment", "Midterm", "Final", "Project", "Other"].map((t) => ({ value: t, label: t })) }),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement(Field, { label: "Score" },
                React.createElement("input", { type: "number", value: score, onChange: (e) => setScore(e.target.value), className: "w-28 rounded-lg px-3 py-2 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } })),
            React.createElement(Field, { label: "Out of" },
                React.createElement("input", { type: "number", value: max, onChange: (e) => setMax(e.target.value), className: "w-28 rounded-lg px-3 py-2 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }))),
        React.createElement(Btn, { accent: "#2E4374", full: true, disabled: !title || !max, onClick: () => onSave({ title, type, score: Number(score) || 0, max: Number(max) || 0 }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
/* =================================================================
   PARA — Areas / Projects / Resources / Tasks / Notes
================================================================= */
const PARA_COLOR = "#6E6355", PARA_LIGHT = "#ECE7DA";
function statusColor(status) {
    if (status === "Done")
        return "#2F5D4F";
    if (status === "In progress")
        return "#2E4374";
    if (status === "Archived")
        return "#8A8672";
    return "#6E6355";
}
function AreasView({ areas, setAreas }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(a) { setAreas([...areas, { id: uid(), archived: false, ...a }]); }
    function patch(id, a) { setAreas(areas.map((x) => (x.id === id ? { ...x, ...a } : x))); }
    function del(id) { setAreas(areas.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Area")),
        areas.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: Compass, accent: PARA_COLOR, text: "Areas are ongoing parts of your life you maintain, like university, health, or personal admin." }))) : (areas.map((a) => (React.createElement(SectionCard, { key: a.id },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", null,
                    React.createElement("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: a.archived ? "#8A8672" : "#232620" } }, a.name),
                    React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                        a.type,
                        a.archived ? " · archived" : "")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("button", { onClick: () => patch(a.id, { archived: !a.archived }) },
                        React.createElement(ArchiveIcon, { size: 14, color: a.archived ? PARA_COLOR : "#C7C1AC" })),
                    React.createElement("button", { onClick: () => setEdit(a) },
                        React.createElement(Pencil, { size: 14, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(a.id) },
                        React.createElement(Trash2, { size: 14, color: "#C7C1AC" })))))))),
        showAdd && React.createElement(AreaSheet, { onClose: () => setShowAdd(false), onSave: (a) => { add(a); setShowAdd(false); } }),
        edit && React.createElement(AreaSheet, { initial: edit, onClose: () => setEdit(null), onSave: (a) => { patch(edit.id, a); setEdit(null); } })));
}
function AreaSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [type, setType] = useState(initial?.type || "Personal");
    return (React.createElement(Sheet, { title: initial ? "Edit area" : "Add area", onClose: onClose, accent: PARA_COLOR },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. University, Health, Finances", className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Type" },
            React.createElement("input", { value: type, onChange: (e) => setType(e.target.value), placeholder: "e.g. Personal, University, Health", className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, type }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function ProjectsView({ projects, setProjects, areas }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(p) { setProjects([...projects, { id: uid(), archived: false, ...p }]); }
    function patch(id, p) { setProjects(projects.map((x) => (x.id === id ? { ...x, ...p } : x))); }
    function del(id) { setProjects(projects.filter((x) => x.id !== id)); }
    const areaName = (id) => areas.find((a) => a.id === id)?.name || "—";
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Project")),
        projects.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: FolderKanban, accent: PARA_COLOR, text: "Projects are things with an end point \u2014 an assignment, a move, a routine you're building." }))) : (projects.map((p) => (React.createElement(SectionCard, { key: p.id },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("div", { className: "text-sm font-medium truncate", style: { fontFamily: FONT_BODY, color: "#232620" } }, p.name),
                    React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                        areaName(p.areaId),
                        p.startDate ? ` · from ${fmtDate(p.startDate)}` : "")),
                React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" },
                    React.createElement("span", { className: "text-xs px-2 py-0.5 rounded-full", style: { fontFamily: FONT_BODY, background: statusColor(p.status) + "20", color: statusColor(p.status) } }, p.status),
                    React.createElement("button", { onClick: () => setEdit(p) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(p.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))),
        showAdd && React.createElement(ProjectSheet, { areas: areas, onClose: () => setShowAdd(false), onSave: (p) => { add(p); setShowAdd(false); } }),
        edit && React.createElement(ProjectSheet, { areas: areas, initial: edit, onClose: () => setEdit(null), onSave: (p) => { patch(edit.id, p); setEdit(null); } })));
}
function ProjectSheet({ areas, initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [areaId, setAreaId] = useState(initial?.areaId || areas[0]?.id || "");
    const [status, setStatus] = useState(initial?.status || "Inbox");
    const [startDate, setStartDate] = useState(initial?.startDate || "");
    const [endDate, setEndDate] = useState(initial?.endDate || "");
    return (React.createElement(Sheet, { title: initial ? "Edit project" : "Add project", onClose: onClose, accent: PARA_COLOR },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(SelectField, { label: "Area", value: areaId, onChange: (e) => setAreaId(e.target.value), options: areas.map((a) => ({ value: a.id, label: a.name })), placeholder: "No area" }),
        React.createElement(SelectField, { label: "Status", value: status, onChange: (e) => setStatus(e.target.value), options: PROJECT_STATUSES.map((s) => ({ value: s, label: s })) }),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement(Field, { label: "Start date" },
                React.createElement("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: inputCls, style: inputStyle })),
            React.createElement(Field, { label: "End date" },
                React.createElement("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: inputCls, style: inputStyle }))),
        React.createElement(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, areaId, status, startDate, endDate }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function ResourcesView({ resources, setResources }) {
    const [showAdd, setShowAdd] = useState(false);
    function add(r) { setResources([...resources, { id: uid(), ...r }]); }
    function del(id) { setResources(resources.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Resource")),
        resources.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: Link2, accent: PARA_COLOR, text: "Links, references and files worth keeping for later \u2014 outside of a specific module." }))) : (resources.map((r) => (React.createElement(SectionCard, { key: r.id },
            React.createElement("div", { className: "flex items-center justify-between gap-2" },
                React.createElement("div", { className: "min-w-0" },
                    r.url ? (React.createElement("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm flex items-center gap-1.5", style: { fontFamily: FONT_BODY, color: PARA_COLOR } },
                        React.createElement(ExternalLink, { size: 13, className: "flex-shrink-0" }),
                        React.createElement("span", { className: "truncate" }, r.name))) : (React.createElement("span", { className: "text-sm", style: { fontFamily: FONT_BODY, color: "#232620" } }, r.name)),
                    React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, r.type)),
                React.createElement("button", { onClick: () => del(r.id) },
                    React.createElement(Trash2, { size: 13, color: "#C7C1AC" }))))))),
        showAdd && React.createElement(ResourceSheet, { onClose: () => setShowAdd(false), onSave: (r) => { add(r); setShowAdd(false); } })));
}
function ResourceSheet({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState(RESOURCE_TYPES[0]);
    return (React.createElement(Sheet, { title: "Add resource", onClose: onClose, accent: PARA_COLOR },
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Link (optional)" },
            React.createElement("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://\u2026", className: inputCls, style: inputStyle })),
        React.createElement(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: RESOURCE_TYPES.map((t) => ({ value: t, label: t })) }),
        React.createElement(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, url, type }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function TasksView({ tasks, setTasks, projects }) {
    const [showAdd, setShowAdd] = useState(false);
    function add(t) { setTasks([{ id: uid(), done: false, ...t }, ...tasks]); }
    function toggle(id) { setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
    function del(id) { setTasks(tasks.filter((t) => t.id !== id)); }
    const projectName = (id) => projects.find((p) => p.id === id)?.name;
    const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate || "").localeCompare(b.dueDate || ""));
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Task")),
        tasks.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: CheckSquare, accent: PARA_COLOR, text: "Loose to-dos that aren't part of a module or a bigger project." }))) : (sorted.map((t) => (React.createElement(SectionCard, { key: t.id },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-2 min-w-0" },
                    React.createElement("button", { onClick: () => toggle(t.id), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: t.done ? PARA_COLOR : PARA_LIGHT } }, t.done && React.createElement(Check, { size: 12, color: "#FBFAF6" })),
                    React.createElement("div", { className: "min-w-0" },
                        React.createElement("div", { className: "text-sm truncate", style: { fontFamily: FONT_BODY, color: t.done ? "#8A8672" : "#232620", textDecoration: t.done ? "line-through" : "none" } }, t.name),
                        React.createElement("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" } },
                            t.dueDate ? fmtDate(t.dueDate) : "",
                            projectName(t.projectId) ? ` · ${projectName(t.projectId)}` : ""))),
                React.createElement("button", { onClick: () => del(t.id) },
                    React.createElement(Trash2, { size: 13, color: "#C7C1AC" }))))))),
        showAdd && React.createElement(TaskSheet, { projects: projects, onClose: () => setShowAdd(false), onSave: (t) => { add(t); setShowAdd(false); } })));
}
function TaskSheet({ projects, onClose, onSave }) {
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [projectId, setProjectId] = useState("");
    return (React.createElement(Sheet, { title: "Add task", onClose: onClose, accent: PARA_COLOR },
        React.createElement(Field, { label: "Task" },
            React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Due date (optional)" },
            React.createElement("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(SelectField, { label: "Project (optional)", value: projectId, onChange: (e) => setProjectId(e.target.value), options: projects.map((p) => ({ value: p.id, label: p.name })), placeholder: "No project" }),
        React.createElement(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, dueDate, projectId: projectId || undefined }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
function NotesView({ notes, setNotes }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(n) { setNotes([{ id: uid(), date: todayISO(), ...n }, ...notes]); }
    function patch(id, n) { setNotes(notes.map((x) => (x.id === id ? { ...x, ...n } : x))); }
    function del(id) { setNotes(notes.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Note")),
        notes.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: StickyNote, accent: PARA_COLOR, text: "Quick notes and freeform thoughts, kept simple." }))) : (notes.map((n) => (React.createElement(SectionCard, { key: n.id },
            React.createElement("div", { className: "flex items-start justify-between gap-2" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, n.title || "Untitled"),
                    n.body && React.createElement("div", { className: "text-xs mt-1 whitespace-pre-wrap", style: { fontFamily: FONT_BODY, color: "#5C5847" } }, n.body),
                    React.createElement("div", { className: "text-xs mt-1", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, fmtDate(n.date))),
                React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" },
                    React.createElement("button", { onClick: () => setEdit(n) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(n.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))),
        showAdd && React.createElement(NoteSheet, { onClose: () => setShowAdd(false), onSave: (n) => { add(n); setShowAdd(false); } }),
        edit && React.createElement(NoteSheet, { initial: edit, onClose: () => setEdit(null), onSave: (n) => { patch(edit.id, n); setEdit(null); } })));
}
function NoteSheet({ initial, onClose, onSave }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [body, setBody] = useState(initial?.body || "");
    return (React.createElement(Sheet, { title: initial ? "Edit note" : "Add note", onClose: onClose, accent: PARA_COLOR },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Note" },
            React.createElement("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 5, className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: PARA_COLOR, full: true, disabled: !title && !body, onClick: () => onSave({ title, body }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
/* =================================================================
   CUSTOM SECTIONS — generic list view for user-created tabs
================================================================= */
function CustomSectionView({ items, setItems, accent }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(n) { setItems([{ id: uid(), date: todayISO(), ...n }, ...items]); }
    function patch(id, n) { setItems(items.map((x) => (x.id === id ? { ...x, ...n } : x))); }
    function del(id) { setItems(items.filter((x) => x.id !== id)); }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex justify-end mb-2" },
            React.createElement(Btn, { accent: accent, onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Item")),
        items.length === 0 ? (React.createElement(SectionCard, null,
            React.createElement(EmptyState, { icon: StickyNote, accent: accent, text: "Nothing here yet \u2014 add your first item." }))) : (items.map((n) => (React.createElement(SectionCard, { key: n.id },
            React.createElement("div", { className: "flex items-start justify-between gap-2" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" } }, n.title || "Untitled"),
                    n.body && React.createElement("div", { className: "text-xs mt-1 whitespace-pre-wrap", style: { fontFamily: FONT_BODY, color: "#5C5847" } }, n.body),
                    React.createElement("div", { className: "text-xs mt-1", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, fmtDate(n.date))),
                React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" },
                    React.createElement("button", { onClick: () => setEdit(n) },
                        React.createElement(Pencil, { size: 13, color: "#8A8672" })),
                    React.createElement("button", { onClick: () => del(n.id) },
                        React.createElement(Trash2, { size: 13, color: "#C7C1AC" })))))))),
        showAdd && React.createElement(CustomItemSheet, { accent: accent, onClose: () => setShowAdd(false), onSave: (n) => { add(n); setShowAdd(false); } }),
        edit && React.createElement(CustomItemSheet, { accent: accent, initial: edit, onClose: () => setEdit(null), onSave: (n) => { patch(edit.id, n); setEdit(null); } })));
}
function CustomItemSheet({ initial, onClose, onSave, accent }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [body, setBody] = useState(initial?.body || "");
    return (React.createElement(Sheet, { title: initial ? "Edit item" : "Add item", onClose: onClose, accent: accent },
        React.createElement(Field, { label: "Title" },
            React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), className: inputCls, style: inputStyle })),
        React.createElement(Field, { label: "Details" },
            React.createElement("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 5, className: inputCls, style: inputStyle })),
        React.createElement(Btn, { accent: accent, full: true, disabled: !title && !body, onClick: () => onSave({ title, body }) },
            React.createElement(Check, { size: 15 }),
            " Save")));
}
/* =================================================================
   SETTINGS — recolor tabs, create/remove custom sections
================================================================= */
function ColorSwatchRow({ value, onPick }) {
    return (React.createElement("div", { className: "flex flex-wrap gap-2" }, PALETTE.map((p) => (React.createElement("button", { key: p.color, onClick: () => onPick(p), title: p.name, className: "w-7 h-7 rounded-full flex-shrink-0", style: { background: p.color, border: value === p.color ? "2px solid #232620" : "2px solid transparent", boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" } })))));
}
function SettingsSheet({ onClose, tabs, tabColors, setTabColors, customTabs, setCustomTabs }) {
    const [newName, setNewName] = useState("");
    const [newIcon, setNewIcon] = useState("Compass");
    const [newColor, setNewColor] = useState(PALETTE[0]);
    function recolor(tabId, palette) {
        setTabColors((prev) => ({ ...prev, [tabId]: { color: palette.color, light: palette.light } }));
    }
    function createTab() {
        if (!newName.trim())
            return;
        const t = { id: `custom-${uid()}`, label: newName.trim(), icon: newIcon, color: newColor.color, light: newColor.light, items: [] };
        setCustomTabs([...customTabs, t]);
        setNewName("");
        setNewIcon("Compass");
        setNewColor(PALETTE[0]);
    }
    function removeTab(tabId) {
        setCustomTabs(customTabs.filter((t) => t.id !== tabId));
    }
    return (React.createElement(Sheet, { title: "Customize", onClose: onClose, accent: "#2F5D4F" },
        React.createElement("div", { className: "text-xs uppercase tracking-[0.15em] mb-2", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Section colors"),
        React.createElement("div", { className: "space-y-4 mb-6" }, tabs.map((t) => {
            const current = tabColors[t.id]?.color || t.color;
            return (React.createElement("div", { key: t.id },
                React.createElement("div", { className: "text-sm mb-1.5 flex items-center justify-between", style: { fontFamily: FONT_BODY, color: "#232620" } },
                    React.createElement("span", null, t.label),
                    t.isCustom && (React.createElement("button", { onClick: () => removeTab(t.id), className: "text-xs flex items-center gap-1", style: { color: "#9C4A32" } },
                        React.createElement(Trash2, { size: 12 }),
                        " Remove"))),
                React.createElement(ColorSwatchRow, { value: current, onPick: (p) => recolor(t.id, p) })));
        })),
        React.createElement("div", { className: "text-xs uppercase tracking-[0.15em] mb-2", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "New section"),
        React.createElement(Field, { label: "Name" },
            React.createElement("input", { value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "e.g. Recipes, Reading list", className: inputCls, style: inputStyle })),
        React.createElement("div", { className: "mb-3" },
            React.createElement("div", { className: "text-xs mb-1.5", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Icon"),
            React.createElement("div", { className: "flex flex-wrap gap-2" }, TAB_ICON_CHOICES.map((key) => {
                const Icon = TAB_ICONS[key];
                const active = newIcon === key;
                return (React.createElement("button", { key: key, onClick: () => setNewIcon(key), className: "p-2 rounded-lg", style: { background: active ? newColor.color : "#EFEBE1", border: "1px solid #D9D2BE" } },
                    React.createElement(Icon, { size: 15, color: active ? "#FBFAF6" : "#5C5847" })));
            }))),
        React.createElement("div", { className: "mb-4" },
            React.createElement("div", { className: "text-xs mb-1.5", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Color"),
            React.createElement(ColorSwatchRow, { value: newColor.color, onPick: setNewColor })),
        React.createElement(Btn, { accent: "#2F5D4F", full: true, disabled: !newName.trim(), onClick: createTab },
            React.createElement(Plus, { size: 15 }),
            " Create section")));
}
/* =================================================================
   ROOT APP — the "binder"
================================================================= */
const TABS = [
    { id: "finance", label: "Finance", icon: Wallet, color: "#2F5D4F", light: "#E3ECE6" },
    { id: "university", label: "University", icon: GraduationCap, color: "#2E4374", light: "#E5E8F2" },
    { id: "areas", label: "Areas", icon: Compass, color: PARA_COLOR, light: PARA_LIGHT },
    { id: "projects", label: "Projects", icon: FolderKanban, color: PARA_COLOR, light: PARA_LIGHT },
    { id: "resources", label: "Resources", icon: Link2, color: PARA_COLOR, light: PARA_LIGHT },
    { id: "tasks", label: "Tasks", icon: CheckSquare, color: PARA_COLOR, light: PARA_LIGHT },
    { id: "notes", label: "Notes", icon: StickyNote, color: PARA_COLOR, light: PARA_LIGHT },
];
const BUILD_TAG = "b6";
export default function Binder() {
    const [tab, setTab] = useState("finance");
    const [financeData, setFinanceData, financeLoaded] = useStore("finance-data", emptyFinance);
    const [uniData, setUniData, uniLoaded] = useStore("university-data-v2", emptyUniversity);
    const [paraData, setParaData, paraLoaded] = useStore("para-data", emptyPara);
    const [tabColors, setTabColors, colorsLoaded] = useStore("tab-colors", () => ({}));
    const [customTabs, setCustomTabs, customTabsLoaded] = useStore("custom-tabs", emptyCustomTabs);
    const seeded = useRef(false);
    const loaded = financeLoaded && uniLoaded && paraLoaded && colorsLoaded && customTabsLoaded;
    useEffect(() => {
        if (!loaded || seeded.current)
            return;
        seeded.current = true;
        if (financeData.accounts.length === 0 && financeData.transactions.length === 0)
            setFinanceData(buildSeedFinance());
        if (uniData.years.length === 0)
            setUniData(buildSeedUniversity());
        if (paraData.areas.length === 0 && paraData.projects.length === 0)
            setParaData(buildSeedPara());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);
    // Merge built-in tabs with user-created ones, applying any color overrides
    const allTabs = [
        ...TABS.map((t) => ({ ...t, ...(tabColors[t.id] || {}) })),
        ...customTabs.map((t) => ({ ...t, icon: TAB_ICONS[t.icon] || Compass, isCustom: true, ...(tabColors[t.id] || { color: t.color, light: t.light }) })),
    ];
    const activeTab = allTabs.find((t) => t.id === tab) || allTabs[0];
    function setAreas(areas) { setParaData((d) => ({ ...d, areas })); }
    function setProjects(projects) { setParaData((d) => ({ ...d, projects })); }
    function setResources(resources) { setParaData((d) => ({ ...d, resources })); }
    function setTasks(tasks) { setParaData((d) => ({ ...d, tasks })); }
    function setNotes(notes) { setParaData((d) => ({ ...d, notes })); }
    function setCustomTabItems(tabId, items) {
        setCustomTabs(customTabs.map((t) => (t.id === tabId ? { ...t, items } : t)));
    }
    const fileInputRef = useRef(null);
    const [importMsg, setImportMsg] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    function exportBackup() {
        const payload = {
            __ledgerBackup: true,
            version: 2,
            exportedAt: new Date().toISOString(),
            finance: financeData,
            university: uniData,
            para: paraData,
            tabColors,
            customTabs,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const stamp = todayISO();
        a.href = url;
        a.download = `ledger-backup-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
    function triggerImport() {
        if (fileInputRef.current)
            fileInputRef.current.click();
    }
    function handleImportFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                if (!parsed || !parsed.__ledgerBackup)
                    throw new Error("Not a recognized backup file");
                const ok = window.confirm("Importing will replace all current data on this device with the backup. Continue?");
                if (!ok)
                    return;
                if (parsed.finance)
                    setFinanceData(parsed.finance);
                if (parsed.university)
                    setUniData(parsed.university);
                if (parsed.para)
                    setParaData(parsed.para);
                if (parsed.tabColors)
                    setTabColors(parsed.tabColors);
                if (parsed.customTabs)
                    setCustomTabs(parsed.customTabs);
                setImportMsg("Backup imported.");
                setTimeout(() => setImportMsg(""), 2500);
            }
            catch (err) {
                setImportMsg("Couldn't read that file — is it a ledger backup?");
                setTimeout(() => setImportMsg(""), 3500);
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    }
    return (React.createElement("div", { className: "min-h-screen w-full flex justify-center", style: { background: "#EFEBE1" } },
        React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 2px rgba(46,67,116,0.25); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `),
        React.createElement("div", { className: "w-full max-w-md pb-10" },
            React.createElement("div", { className: "px-5 pt-6 pb-3 flex items-start justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("div", { className: "text-xs uppercase tracking-[0.2em]", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Personal ledger"),
                    React.createElement("h1", { className: "text-2xl font-semibold", style: { fontFamily: FONT_HEAD, color: "#232620" } }, activeTab.label)),
                React.createElement("div", { className: "flex items-center gap-1.5 flex-shrink-0 pt-1" },
                    React.createElement("button", { onClick: () => setShowSettings(true), title: "Customize", className: "p-2 rounded-full", style: { background: "#E3DED0" } },
                        React.createElement(Settings, { size: 15, color: "#5C5847" })),
                    React.createElement("button", { onClick: exportBackup, title: "Export backup", className: "p-2 rounded-full", style: { background: "#E3DED0" } },
                        React.createElement(Download, { size: 15, color: "#5C5847" })),
                    React.createElement("button", { onClick: triggerImport, title: "Import backup", className: "p-2 rounded-full", style: { background: "#E3DED0" } },
                        React.createElement(Upload, { size: 15, color: "#5C5847" })),
                    React.createElement("input", { ref: fileInputRef, type: "file", accept: "application/json", onChange: handleImportFile, className: "hidden" }))),
            importMsg && (React.createElement("div", { className: "mx-5 mb-2 text-xs px-3 py-2 rounded-lg", style: { fontFamily: FONT_BODY, background: "#E5E8F2", color: "#2E4374" } }, importMsg)),
            React.createElement("div", { className: "flex px-5 gap-1.5 mb-4 overflow-x-auto no-scrollbar", style: { scrollbarWidth: "none" } }, allTabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), className: "flex items-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: active ? t.color : t.light, color: active ? "#FBFAF6" : t.color } },
                    React.createElement(Icon, { size: 14 }),
                    " ",
                    t.label));
            })),
            React.createElement("div", { className: "px-5" }, !loaded ? (React.createElement("div", { className: "py-16 text-center text-sm", style: { fontFamily: FONT_BODY, color: "#8A8672" } }, "Loading your ledger\u2026")) : tab === "finance" ? (React.createElement(FinanceApp, { data: financeData, setData: setFinanceData })) : tab === "university" ? (React.createElement(UniversityApp, { data: uniData, setData: setUniData })) : tab === "areas" ? (React.createElement(AreasView, { areas: paraData.areas, setAreas: setAreas })) : tab === "projects" ? (React.createElement(ProjectsView, { projects: paraData.projects, setProjects: setProjects, areas: paraData.areas })) : tab === "resources" ? (React.createElement(ResourcesView, { resources: paraData.resources, setResources: setResources })) : tab === "tasks" ? (React.createElement(TasksView, { tasks: paraData.tasks, setTasks: setTasks, projects: paraData.projects })) : tab === "notes" ? (React.createElement(NotesView, { notes: paraData.notes, setNotes: setNotes })) : (React.createElement(CustomSectionView, { items: (customTabs.find((t) => t.id === tab) || {}).items || [], setItems: (items) => setCustomTabItems(tab, items), accent: activeTab.color }))),
            React.createElement("div", { className: "text-center text-[10px] pt-6 pb-2", style: { fontFamily: FONT_BODY, color: "#C7C1AC" } },
                "Personal Ledger \u00B7 build ",
                BUILD_TAG)),
        showSettings && (React.createElement(SettingsSheet, { onClose: () => setShowSettings(false), tabs: allTabs, tabColors: tabColors, setTabColors: setTabColors, customTabs: customTabs, setCustomTabs: setCustomTabs }))));
}
