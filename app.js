import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from "react";
import { Wallet, PiggyBank, GraduationCap, Plus, X, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Check, ChevronRight, ChevronLeft, Pencil, Trash2, BookOpen, CalendarClock, ClipboardList, Percent, Compass, FolderKanban, Link2, CheckSquare, StickyNote, ExternalLink, Archive as ArchiveIcon, Download, Upload } from "lucide-react";
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
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", style: { background: "rgba(35,38,32,0.45)" }, children: _jsxs("div", { className: "w-full sm:max-w-md max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl", style: { background: "#FBFAF6", borderTop: `4px solid ${accent}` }, children: [_jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-3 sticky top-0", style: { background: "#FBFAF6" }, children: [_jsx("h3", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "text-lg font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-full", style: { background: "#EFEBE1" }, children: _jsx(X, { size: 16, color: "#232620" }) })] }), _jsx("div", { className: "px-5 pb-6", children: children })] }) }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "block mb-3", children: [_jsx("span", { className: "block text-xs mb-1 tracking-wide uppercase", style: { color: "#8A8672", fontFamily: FONT_BODY }, children: label }), children] }));
}
const inputStyle = { fontFamily: FONT_BODY, background: "#F3F1E9", border: "1px solid #D9D2BE" };
const inputCls = "w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2";
function Btn({ children, onClick, accent, full, variant = "solid", type = "button", disabled }) {
    const base = "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium px-4 py-2 transition active:scale-[0.98]";
    const style = variant === "solid" ? { background: accent, color: "#FBFAF6" }
        : variant === "ghost" ? { background: "transparent", color: accent, border: `1px solid ${accent}` }
            : { background: "#EFEBE1", color: "#232620" };
    return (_jsx("button", { type: type, disabled: disabled, onClick: onClick, className: base + (full ? " w-full" : ""), style: { ...style, fontFamily: FONT_BODY, opacity: disabled ? 0.5 : 1 }, children: children }));
}
function ProgressBar({ pct, color }) {
    const clamped = Math.max(0, Math.min(100, pct));
    return (_jsx("div", { className: "w-full h-2 rounded-full overflow-hidden", style: { background: "#E3DFCF" }, children: _jsx("div", { className: "h-full rounded-full", style: { width: `${clamped}%`, background: color } }) }));
}
function Ring({ pct, color, size = 84, label, sub }) {
    const clamped = Math.max(0, Math.min(100, pct));
    const r = 34, c = 2 * Math.PI * r;
    return (_jsxs("div", { className: "relative flex items-center justify-center", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, viewBox: "0 0 84 84", children: [_jsx("circle", { cx: "42", cy: "42", r: r, fill: "none", stroke: "#E3DFCF", strokeWidth: "8" }), _jsx("circle", { cx: "42", cy: "42", r: r, fill: "none", stroke: color, strokeWidth: "8", strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c - (clamped / 100) * c, transform: "rotate(-90 42 42)" })] }), _jsxs("div", { className: "absolute flex flex-col items-center", children: [_jsx("span", { style: { fontFamily: FONT_MONO, color: "#232620" }, className: "text-sm font-semibold", children: label }), sub && _jsx("span", { style: { fontFamily: FONT_BODY, color: "#8A8672" }, className: "text-[10px]", children: sub })] })] }));
}
function SectionCard({ children, style }) {
    return _jsx("div", { className: "rounded-xl p-4 mb-3", style: { background: "#FBFAF6", border: "1px solid #E3DFCF", ...style }, children: children });
}
function EmptyState({ icon: Icon, text, accent }) {
    return (_jsxs("div", { className: "flex flex-col items-center text-center py-10 px-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center mb-3", style: { background: accent + "20" }, children: _jsx(Icon, { size: 20, color: accent }) }), _jsx("p", { style: { fontFamily: FONT_BODY, color: "#8A8672" }, className: "text-sm max-w-[220px]", children: text })] }));
}
function Pill({ children, active, color, lightColor, onClick }) {
    return (_jsx("button", { onClick: onClick, className: "px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: active ? color : lightColor, color: active ? "#FBFAF6" : color }, children: children }));
}
function SelectField({ label, value, onChange, options, placeholder }) {
    return (_jsx(Field, { label: label, children: _jsxs("select", { value: value, onChange: onChange, className: inputCls, style: inputStyle, children: [placeholder && _jsx("option", { value: "", children: placeholder }), options.map((o) => _jsx("option", { value: o.value, children: o.label }, o.value))] }) }));
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
    return (_jsxs("div", { children: [_jsx("div", { className: "flex gap-1 mb-4", children: tabs.map((t) => (_jsx("button", { onClick: () => setView(t.id), className: "px-3 py-1.5 rounded-full text-xs font-medium transition", style: { fontFamily: FONT_BODY, background: view === t.id ? "#2F5D4F" : "#E3ECE6", color: view === t.id ? "#FBFAF6" : "#2F5D4F" }, children: t.label }, t.id))) }), view === "dashboard" && (_jsxs("div", { children: [_jsxs(SectionCard, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-xs uppercase tracking-wide", style: { color: "#8A8672", fontFamily: FONT_BODY }, children: "Total balance" }), balanceCurrencies.length === 0 ? (_jsx("div", { className: "text-2xl font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" }, children: fmtCur(0, "EGP") })) : balanceCurrencies.length === 1 ? (_jsx("div", { className: "text-2xl font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" }, children: fmtCur(balanceByCurrency[balanceCurrencies[0]], balanceCurrencies[0]) })) : (_jsx("div", { className: "flex flex-col gap-0.5 mt-1", children: balanceCurrencies.map((c) => (_jsx("span", { className: "text-lg font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" }, children: fmtCur(balanceByCurrency[c], c) }, c))) }))] }), _jsx(PiggyBank, { size: 26, color: "#2F5D4F" })] }), _jsx("div", { className: "flex flex-col gap-1 mt-3 text-xs", style: { fontFamily: FONT_BODY }, children: Object.keys({ ...incomeByCurrency, ...expenseByCurrency }).length === 0 ? (_jsx("span", { style: { color: "#8A8672" }, children: "No activity this month yet" })) : (Object.keys({ ...incomeByCurrency, ...expenseByCurrency }).map((c) => (_jsxs("div", { className: "flex gap-4", children: [_jsxs("span", { style: { color: "#2F5D4F" }, children: ["+", fmtCur(incomeByCurrency[c] || 0, c), " in"] }), _jsxs("span", { style: { color: "#9C4A32" }, children: ["-", fmtCur(expenseByCurrency[c] || 0, c), " out"] })] }, c)))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [_jsxs(SectionCard, { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [_jsx(Ring, { pct: totalBudget > 0 ? (monthExpensePrimary / totalBudget) * 100 : 0, color: "#2F5D4F", label: totalBudget > 0 ? Math.round((monthExpensePrimary / totalBudget) * 100) + "%" : "—", sub: "of budget" }), _jsxs("div", { className: "text-xs mt-2 text-center", style: { color: "#8A8672", fontFamily: FONT_BODY }, children: [fmtCur(monthExpensePrimary, primaryCurrency), " / ", fmtCur(totalBudget, primaryCurrency)] })] }), _jsxs(SectionCard, { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [_jsx(Ring, { pct: goalPct, color: "#2E4374", label: data.goal.target > 0 ? Math.round(goalPct) + "%" : "—", sub: data.goal.name || "savings goal" }), _jsx("button", { onClick: () => setShowGoalEdit(true), className: "text-xs mt-2 underline", style: { color: "#8A8672", fontFamily: FONT_BODY }, children: data.goal.target > 0 ? `${fmtCur(data.goal.saved, data.goal.currency)} / ${fmtCur(data.goal.target, data.goal.currency)}` : "Set a goal" })] })] }), _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm", children: "Activity" }), _jsxs(Btn, { accent: "#2F5D4F", onClick: () => setShowAddTx(true), children: [_jsx(Plus, { size: 14 }), " Add"] })] }), _jsx("div", { className: "flex gap-1.5 mb-2 overflow-x-auto", style: { scrollbarWidth: "none" }, children: [["all", "All"], ["income", "Income"], ["expense", "Expense"], ["transfer", "Transfer"]].map(([id, label]) => (_jsx(Pill, { active: txFilter === id, color: "#2F5D4F", lightColor: "#E3ECE6", onClick: () => setTxFilter(id), children: label }, id))) }), _jsx(SectionCard, { style: { padding: 0 }, children: visibleTx.length === 0 ? (_jsx(EmptyState, { icon: ArrowLeftRight, accent: "#2F5D4F", text: "No transactions here yet. Log your first income or expense to start tracking." })) : (visibleTx.slice(0, 20).map((t, i) => (_jsxs("div", { className: "flex items-center justify-between px-4 py-3", style: { borderTop: i === 0 ? "none" : "1px solid #EDE9DB" }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", style: { background: t.type === "income" ? "#E3ECE6" : t.type === "expense" ? "#F4E3DC" : "#E5E8F2" }, children: t.type === "income" ? _jsx(ArrowDownRight, { size: 14, color: "#2F5D4F" }) : t.type === "expense" ? _jsx(ArrowUpRight, { size: 14, color: "#9C4A32" }) : _jsx(ArrowLeftRight, { size: 14, color: "#2E4374" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm truncate", style: { fontFamily: FONT_BODY, color: "#232620" }, children: t.note || t.category || (t.type === "transfer" ? "Transfer" : "—") }), _jsxs("div", { className: "text-xs truncate", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [fmtDate(t.date), t.category ? ` · ${t.category}` : ""] })] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsxs("span", { className: "text-sm font-medium", style: { fontFamily: FONT_MONO, color: t.type === "income" ? "#2F5D4F" : t.type === "expense" ? "#9C4A32" : "#2E4374" }, children: [t.type === "income" ? "+" : t.type === "expense" ? "-" : "", fmtCur(t.amount, currencyOf(t))] }), _jsx("button", { onClick: () => setEditTx(t), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => deleteTransaction(t.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }, t.id)))) })] })), view === "accounts" && (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: "#2F5D4F", onClick: () => setShowAddAccount(true), children: [_jsx(Plus, { size: 14 }), " Account"] }) }), accounts.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: Wallet, accent: "#2F5D4F", text: "Add an account (wallet, card, savings) \u2014 pick its currency when you create it." }) })) : (accounts.map((a) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" }, children: a.name }), _jsxs("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [a.type, " \u00B7 ", a.currency || "EGP"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-base font-semibold", style: { fontFamily: FONT_MONO, color: "#232620" }, children: fmtCur(a.balance, a.currency) }), _jsx("button", { onClick: () => setEditAccount(a), children: _jsx(Pencil, { size: 14, color: "#8A8672" }) }), _jsx("button", { onClick: () => deleteAccount(a.id), children: _jsx(Trash2, { size: 14, color: "#C7C1AC" }) })] })] }) }, a.id))))] })), view === "budget" && (_jsxs("div", { children: [_jsxs("p", { className: "text-xs mb-3", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: ["Budgets are tracked in ", primaryCurrency, " (your first account's currency)."] }), EXPENSE_CATEGORIES.map((cat) => {
                        const budget = Number(data.budgets[cat]) || 0;
                        const spent = spentByCategory[cat] || 0;
                        const pct = budget > 0 ? (spent / budget) * 100 : 0;
                        return (_jsxs(SectionCard, { children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("span", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" }, children: cat }), _jsx("input", { defaultValue: budget || "", placeholder: "0", onBlur: (e) => setBudget(cat, Number(e.target.value) || 0), className: "w-20 text-right text-sm rounded px-2 py-0.5", style: { ...inputStyle, fontFamily: FONT_MONO }, type: "number" })] }), _jsx(ProgressBar, { pct: pct, color: pct > 100 ? "#9C4A32" : "#2F5D4F" }), _jsxs("div", { className: "text-xs mt-1", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [fmtCur(spent, primaryCurrency), " spent this month", budget === 0 ? " · not budgeted" : ""] })] }, cat));
                    })] })), showAddTx && _jsx(AddTransactionSheet, { accounts: data.accounts, onClose: () => setShowAddTx(false), onSave: (tx) => { addTransaction(tx); setShowAddTx(false); } }), editTx && _jsx(AddTransactionSheet, { accounts: data.accounts, initial: editTx, onClose: () => setEditTx(null), onSave: (tx) => { patchTransaction(editTx.id, tx); setEditTx(null); } }), showAddAccount && _jsx(AddAccountSheet, { onClose: () => setShowAddAccount(false), onSave: (acc) => { addAccount(acc); setShowAddAccount(false); } }), editAccount && _jsx(AddAccountSheet, { initial: editAccount, onClose: () => setEditAccount(null), onSave: (acc) => { patchAccount(editAccount.id, acc); setEditAccount(null); } }), showGoalEdit && _jsx(GoalSheet, { goal: data.goal, onClose: () => setShowGoalEdit(false), onSave: (g) => { saveGoal(g); setShowGoalEdit(false); } })] }));
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
    return (_jsxs(Sheet, { title: initial ? "Edit transaction" : "Add transaction", onClose: onClose, accent: "#2F5D4F", children: [_jsx("div", { className: "flex gap-2 mb-4", children: [{ id: "expense", label: "Expense" }, { id: "income", label: "Income" }, { id: "transfer", label: "Transfer" }].map((o) => (_jsx("button", { onClick: () => setType(o.id), className: "flex-1 py-2 rounded-lg text-sm font-medium", style: { fontFamily: FONT_BODY, background: type === o.id ? "#2F5D4F" : "#E3ECE6", color: type === o.id ? "#FBFAF6" : "#2F5D4F" }, children: o.label }, o.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(Field, { label: "Amount", children: _jsx("input", { type: "number", inputMode: "decimal", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }) }) }), _jsx("div", { style: { width: 118 }, children: _jsx(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }) })] }), _jsx(SelectField, { label: type === "transfer" ? "From account" : "Account", value: accountId, onChange: (e) => handleAccountChange(e.target.value), options: accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currency || "EGP"})` })), placeholder: accounts.length === 0 ? "Add an account first" : undefined }), type === "transfer" && _jsx(SelectField, { label: "To account", value: toAccountId, onChange: (e) => setToAccountId(e.target.value), options: accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currency || "EGP"})` })) }), type === "expense" && _jsx(SelectField, { label: "Category", value: category, onChange: (e) => setCategory(e.target.value), options: EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })) }), _jsx(Field, { label: "Date", children: _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Note (optional)", children: _jsx("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "What was it for?", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2F5D4F", full: true, disabled: !canSave, onClick: () => onSave({ type, amount: Number(amount), currency, accountId, toAccountId: type === "transfer" ? toAccountId : undefined, category: type === "expense" ? category : undefined, note, date }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function AddAccountSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [type, setType] = useState(initial?.type || "Cash");
    const [currency, setCurrency] = useState(initial?.currency || "EGP");
    const [initialBal, setInitialBal] = useState(initial?.initial ?? "");
    return (_jsxs(Sheet, { title: initial ? "Edit account" : "Add account", onClose: onClose, accent: "#2F5D4F", children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Wallet, Student card", className: inputCls, style: inputStyle }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: ACCOUNT_TYPES.map((t) => ({ value: t, label: t })) }) }), _jsx("div", { style: { width: 130 }, children: _jsx(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }) })] }), _jsx(Field, { label: "Starting balance", children: _jsx("input", { type: "number", value: initialBal, onChange: (e) => setInitialBal(e.target.value), placeholder: "0.00", className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }) }), _jsxs(Btn, { accent: "#2F5D4F", full: true, disabled: !name, onClick: () => onSave({ name, type, currency, initial: Number(initialBal) || 0 }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function GoalSheet({ goal, onClose, onSave }) {
    const [name, setName] = useState(goal.name || "");
    const [target, setTarget] = useState(goal.target || "");
    const [saved, setSaved] = useState(goal.saved || "");
    const [currency, setCurrency] = useState(goal.currency || "EGP");
    return (_jsxs(Sheet, { title: "Savings goal", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Goal name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. New laptop", className: inputCls, style: inputStyle }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(Field, { label: "Target amount", children: _jsx("input", { type: "number", value: target, onChange: (e) => setTarget(e.target.value), className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }) }) }), _jsx("div", { style: { width: 118 }, children: _jsx(SelectField, { label: "Currency", value: currency, onChange: (e) => setCurrency(e.target.value), options: CURRENCIES.map((c) => ({ value: c.code, label: c.code })) }) })] }), _jsx(Field, { label: "Already saved", children: _jsx("input", { type: "number", value: saved, onChange: (e) => setSaved(e.target.value), className: inputCls, style: { ...inputStyle, fontFamily: FONT_MONO } }) }), _jsxs(Btn, { accent: "#2E4374", full: true, onClick: () => onSave({ name, target: Number(target) || 0, saved: Number(saved) || 0, currency }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
    return (_jsxs("div", { className: "flex gap-4 mt-2 text-xs", style: { fontFamily: FONT_MONO }, children: [_jsx("span", { style: { color: "#2E4374" }, children: stats.avg !== null ? Math.round(stats.avg) + "% avg" : "no grades yet" }), _jsx("span", { style: { color: "#8A8672" }, children: stats.attendancePct !== null ? Math.round(stats.attendancePct) + "% attendance" : "—" }), stats.pendingDeadlines > 0 && _jsxs("span", { style: { color: "#9C4A32" }, children: [stats.pendingDeadlines, " due"] }), count !== undefined && _jsxs("span", { style: { color: "#8A8672" }, children: [count, " ", countLabel] })] }));
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
        return (_jsx(ModuleDetail, { mod: activeModule, onBack: () => setPath((p) => ({ ...p, moduleId: null })), onUpdate: (patch) => updateModule(path.yearId, path.semesterId, activeModule.id, patch), onDelete: () => deleteModuleAt(path.yearId, path.semesterId, activeModule.id) }));
    }
    if (activeSemester) {
        return (_jsx(ModulesView, { yearName: activeYear.name, semester: activeSemester, setModules: (modules) => setModulesFor(path.yearId, path.semesterId, modules), onBack: () => setPath((p) => ({ ...p, semesterId: null })), onOpenModule: (id) => setPath((p) => ({ ...p, moduleId: id })) }));
    }
    if (activeYear) {
        return (_jsx(SemestersView, { year: activeYear, setSemesters: (semesters) => setSemesters(path.yearId, semesters), onBack: () => setPath({ yearId: null, semesterId: null, moduleId: null }), onOpen: (id) => setPath((p) => ({ ...p, semesterId: id })) }));
    }
    return _jsx(YearsView, { years: data.years, setYears: setYears, onOpen: (id) => setPath({ yearId: id, semesterId: null, moduleId: null }) });
}
function YearsView({ years, setYears, onOpen }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(y) { setYears([...years, { id: uid(), name: y.name, semesters: [{ id: uid(), name: "Semester 1", modules: [] }, { id: uid(), name: "Semester 2", modules: [] }] }]); }
    function patch(id, y) { setYears(years.map((x) => (x.id === id ? { ...x, ...y } : x))); }
    function del(id) { setYears(years.filter((x) => x.id !== id)); }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm", children: "Years" }), _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Year"] })] }), years.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: GraduationCap, accent: "#2E4374", text: "Add your first year to start organizing semesters and modules." }) })) : (years.map((y) => {
                const modules = y.semesters.flatMap((s) => s.modules);
                const stats = aggregateStats(modules);
                return (_jsxs(SectionCard, { children: [_jsxs("button", { onClick: () => onOpen(y.id), className: "w-full text-left", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" }, children: y.name }), _jsx(ChevronRight, { size: 16, color: "#8A8672" })] }), _jsx(StatChips, { stats: stats, count: y.semesters.length, countLabel: "semesters" })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-2", children: [_jsx("button", { onClick: () => setEdit(y), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => del(y.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }, y.id));
            })), showAdd && _jsx(YearSheet, { onClose: () => setShowAdd(false), onSave: (y) => { add(y); setShowAdd(false); } }), edit && _jsx(YearSheet, { initial: edit, onClose: () => setEdit(null), onSave: (y) => { patch(edit.id, y); setEdit(null); } })] }));
}
function YearSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    return (_jsxs(Sheet, { title: initial ? "Edit year" : "Add year", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Year 3", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function SemestersView({ year, setSemesters, onBack, onOpen }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(s) { setSemesters([...year.semesters, { id: uid(), name: s.name, modules: [] }]); }
    function patch(id, s) { setSemesters(year.semesters.map((x) => (x.id === id ? { ...x, ...s } : x))); }
    function del(id) { setSemesters(year.semesters.filter((x) => x.id !== id)); }
    return (_jsxs("div", { children: [_jsxs("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" }, children: [_jsx(ChevronLeft, { size: 15 }), " All years"] }), _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm", children: [year.name, " \u00B7 Semesters"] }), _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Semester"] })] }), year.semesters.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: CalendarClock, accent: "#2E4374", text: "Add a semester to start adding modules." }) })) : (year.semesters.map((s) => {
                const stats = aggregateStats(s.modules);
                return (_jsxs(SectionCard, { children: [_jsxs("button", { onClick: () => onOpen(s.id), className: "w-full text-left", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" }, children: s.name }), _jsx(ChevronRight, { size: 16, color: "#8A8672" })] }), _jsx(StatChips, { stats: stats, count: s.modules.length, countLabel: "modules" })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-2", children: [_jsx("button", { onClick: () => setEdit(s), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => del(s.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }, s.id));
            })), showAdd && _jsx(SemesterSheet, { onClose: () => setShowAdd(false), onSave: (s) => { add(s); setShowAdd(false); } }), edit && _jsx(SemesterSheet, { initial: edit, onClose: () => setEdit(null), onSave: (s) => { patch(edit.id, s); setEdit(null); } })] }));
}
function SemesterSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    return (_jsxs(Sheet, { title: initial ? "Edit semester" : "Add semester", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Semester 1", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
    return (_jsxs("div", { children: [_jsxs("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" }, children: [_jsx(ChevronLeft, { size: 15 }), " ", yearName] }), semester.modules.length > 0 && (_jsxs(SectionCard, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(CalendarClock, { size: 16, color: "#2E4374" }), _jsx("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm", children: "Upcoming deadlines" })] }), upcoming.length === 0 ? (_jsx("p", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: "Nothing pending. Nice." })) : (upcoming.map((d) => (_jsxs("div", { className: "flex items-center justify-between py-1.5", style: { borderTop: "1px solid #EDE9DB" }, children: [_jsxs("span", { className: "text-sm", style: { fontFamily: FONT_BODY, color: "#232620" }, children: [d.title, " ", _jsxs("span", { style: { color: "#8A8672" }, children: ["\u00B7 ", d.moduleName] })] }), _jsx("span", { className: "text-xs", style: { fontFamily: FONT_MONO, color: "#9C4A32" }, children: fmtDate(d.dueDate) })] }, d.id))))] })), _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h4", { style: { fontFamily: FONT_HEAD, color: "#232620" }, className: "font-semibold text-sm", children: [semester.name, " \u00B7 Modules"] }), _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAddModule(true), children: [_jsx(Plus, { size: 14 }), " Module"] })] }), semester.modules.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: GraduationCap, accent: "#2E4374", text: "Add a module to start tracking lectures, grades, attendance and reflections." }) })) : (semester.modules.map((m) => {
                const stats = moduleStats(m);
                return (_jsx("button", { onClick: () => onOpenModule(m.id), className: "w-full text-left", children: _jsxs(SectionCard, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-semibold", style: { fontFamily: FONT_BODY, color: "#232620" }, children: [m.code ? `${m.code} · ` : "", m.name] }), _jsx("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: m.lecturer || "No lecturer set" })] }), _jsx(ChevronRight, { size: 16, color: "#8A8672" })] }), _jsx(StatChips, { stats: stats })] }) }, m.id));
            })), showAddModule && _jsx(AddModuleSheet, { onClose: () => setShowAddModule(false), onSave: (m) => { addModule(m); setShowAddModule(false); } })] }));
}
function AddModuleSheet({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [assistant, setAssistant] = useState("");
    return (_jsxs(Sheet, { title: "Add module", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Module name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Intro to Analytics", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Module code", children: _jsx("input", { value: code, onChange: (e) => setCode(e.target.value), placeholder: "e.g. ANA1102", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Lecturer", children: _jsx("input", { value: lecturer, onChange: (e) => setLecturer(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Assistant / TA", children: _jsx("input", { value: assistant, onChange: (e) => setAssistant(e.target.value), className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !name, onClick: () => onSave({ name, code, lecturer, assistant }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
    return (_jsxs("div", { children: [_jsxs("button", { onClick: onBack, className: "flex items-center gap-1 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#2E4374" }, children: [_jsx(ChevronLeft, { size: 15 }), " All modules"] }), _jsxs(SectionCard, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-base font-semibold", style: { fontFamily: FONT_HEAD, color: "#232620" }, children: [mod.code ? `${mod.code} · ` : "", mod.name] }), _jsxs("div", { className: "text-xs mt-0.5", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [mod.lecturer && _jsxs(_Fragment, { children: ["Lecturer: ", mod.lecturer, "  "] }), mod.assistant && _jsxs(_Fragment, { children: ["\u00B7 Assistant: ", mod.assistant] }), !mod.lecturer && !mod.assistant && "No lecturer or assistant set"] })] }), _jsx("button", { onClick: onDelete, children: _jsx(Trash2, { size: 14, color: "#C7C1AC" }) })] }), _jsxs("div", { className: "flex gap-4 mt-3 text-xs", style: { fontFamily: FONT_MONO }, children: [_jsx("span", { style: { color: "#2E4374" }, children: stats.avg !== null ? Math.round(stats.avg) + "% avg grade" : "no grades yet" }), _jsx("span", { style: { color: "#8A8672" }, children: stats.attendancePct !== null ? Math.round(stats.attendancePct) + "% attendance" : "—" })] })] }), _jsx("div", { className: "flex gap-1 mb-4 overflow-x-auto", style: { scrollbarWidth: "none" }, children: tabs.map((t) => (_jsx("button", { onClick: () => setTab(t.id), className: "px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: tab === t.id ? "#2E4374" : "#E5E8F2", color: tab === t.id ? "#FBFAF6" : "#2E4374" }, children: t.label }, t.id))) }), tab === "lectures" && (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAddLecture(true), children: [_jsx(Plus, { size: 14 }), " Lecture"] }) }), mod.lectures.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: BookOpen, accent: "#2E4374", text: "Log each lecture or section \u2014 attendance, quiz/formative scores, and your own reflection." }) })) : (mod.lectures.map((l) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => patchLecture(l.id, { attended: !l.attended }), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: l.attended ? "#2E4374" : "#E5E8F2" }, children: l.attended && _jsx(Check, { size: 12, color: "#FBFAF6" }) }), _jsx("span", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" }, children: l.title })] }), l.date && _jsx("div", { className: "text-xs mt-0.5 ml-7", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: fmtDate(l.date) }), _jsxs("div", { className: "ml-7 mt-2 flex flex-wrap gap-2 text-xs", style: { fontFamily: FONT_MONO }, children: [l.quiz?.assigned && _jsxs("span", { className: "px-2 py-0.5 rounded-full", style: { background: "#E5E8F2", color: "#2E4374" }, children: ["Quiz ", l.quiz.max ? `${l.quiz.score}/${l.quiz.max}` : "assigned"] }), l.formative?.assigned && _jsxs("span", { className: "px-2 py-0.5 rounded-full", style: { background: "#E5E8F2", color: "#2E4374" }, children: ["Formative ", l.formative.max ? `${l.formative.score}/${l.formative.max}` : "assigned"] })] }), l.reflection && (_jsxs("div", { className: "ml-7 mt-2 text-xs italic p-2 rounded-lg", style: { fontFamily: FONT_BODY, color: "#5C5847", background: "#F3F1E9" }, children: ["\"", l.reflection, "\""] }))] }), _jsxs("div", { className: "flex flex-col gap-2 ml-2 flex-shrink-0", children: [_jsx("button", { onClick: () => setEditLecture(l), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => deleteLecture(l.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }) }, l.id))))] })), tab === "deadlines" && (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAddDeadline(true), children: [_jsx(Plus, { size: 14 }), " Deadline"] }) }), (mod.deadlines || []).length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: ClipboardList, accent: "#2E4374", text: "Track assignment and exam deadlines for this module." }) })) : ([...mod.deadlines].sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || "")).map((d) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => toggleDeadline(d.id), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: d.done ? "#2E4374" : "#E5E8F2" }, children: d.done && _jsx(Check, { size: 12, color: "#FBFAF6" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { fontFamily: FONT_BODY, color: d.done ? "#8A8672" : "#232620", textDecoration: d.done ? "line-through" : "none" }, children: d.title }), _jsx("div", { className: "text-xs", style: { fontFamily: FONT_MONO, color: "#9C4A32" }, children: fmtDate(d.dueDate) })] })] }), _jsx("button", { onClick: () => deleteDeadline(d.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] }) }, d.id))))] })), tab === "grades" && (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAddGrade(true), children: [_jsx(Plus, { size: 14 }), " Grade"] }) }), (mod.grades || []).length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: Percent, accent: "#2E4374", text: "Add exams, assignments or other graded work \u2014 quiz and formative scores from Lectures count too." }) })) : (mod.grades.map((g) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" }, children: g.title }), _jsx("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: g.type })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-semibold", style: { fontFamily: FONT_MONO, color: "#2E4374" }, children: [g.score, "/", g.max] }), _jsx("button", { onClick: () => deleteGrade(g.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }) }, g.id))))] })), tab === "resources" && (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: "#2E4374", onClick: () => setShowAddResource(true), children: [_jsx(Plus, { size: 14 }), " Material"] }) }), (mod.resources || []).length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: Link2, accent: "#2E4374", text: "Save links to slides, recordings, or readings for this module." }) })) : (mod.resources.map((r) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm flex items-center gap-1.5 min-w-0", style: { fontFamily: FONT_BODY, color: "#2E4374" }, children: [_jsx(ExternalLink, { size: 13, className: "flex-shrink-0" }), _jsx("span", { className: "truncate", children: r.title })] }), _jsx("button", { onClick: () => deleteResource(r.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] }) }, r.id))))] })), showAddLecture && _jsx(LectureSheet, { onClose: () => setShowAddLecture(false), onSave: (l) => { addLecture(l); setShowAddLecture(false); } }), editLecture && _jsx(LectureSheet, { initial: editLecture, onClose: () => setEditLecture(null), onSave: (l) => { patchLecture(editLecture.id, l); setEditLecture(null); } }), showAddDeadline && _jsx(DeadlineSheet, { onClose: () => setShowAddDeadline(false), onSave: (d) => { addDeadline(d); setShowAddDeadline(false); } }), showAddGrade && _jsx(GradeSheet, { onClose: () => setShowAddGrade(false), onSave: (g) => { addGrade(g); setShowAddGrade(false); } }), showAddResource && _jsx(ResourceLinkSheet, { onClose: () => setShowAddResource(false), onSave: (r) => { addResource(r); setShowAddResource(false); } })] }));
}
function ResourceLinkSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    return (_jsxs(Sheet, { title: "Add material", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Title", children: _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Lecture 3 slides", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Link", children: _jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://\u2026", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !title || !url, onClick: () => onSave({ title, url }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
    return (_jsxs(Sheet, { title: initial ? "Edit lecture" : "Add lecture / section", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Title", children: _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Lecture 3 \u2013 Regression", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Date", children: _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: inputCls, style: inputStyle }) }), _jsxs("label", { className: "flex items-center gap-2 mb-3 text-sm", style: { fontFamily: FONT_BODY, color: "#232620" }, children: [_jsx("input", { type: "checkbox", checked: attended, onChange: (e) => setAttended(e.target.checked) }), " Attended"] }), _jsxs("div", { className: "rounded-lg p-3 mb-3", style: { background: "#F3F1E9" }, children: [_jsxs("label", { className: "flex items-center gap-2 text-sm mb-2", style: { fontFamily: FONT_BODY, color: "#232620" }, children: [_jsx("input", { type: "checkbox", checked: quizAssigned, onChange: (e) => setQuizAssigned(e.target.checked) }), " Quiz assigned"] }), quizAssigned && (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: "score", value: quizScore, onChange: (e) => setQuizScore(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }), _jsx("input", { type: "number", placeholder: "out of", value: quizMax, onChange: (e) => setQuizMax(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } })] }))] }), _jsxs("div", { className: "rounded-lg p-3 mb-3", style: { background: "#F3F1E9" }, children: [_jsxs("label", { className: "flex items-center gap-2 text-sm mb-2", style: { fontFamily: FONT_BODY, color: "#232620" }, children: [_jsx("input", { type: "checkbox", checked: formAssigned, onChange: (e) => setFormAssigned(e.target.checked) }), " Formative assigned"] }), formAssigned && (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: "score", value: formScore, onChange: (e) => setFormScore(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }), _jsx("input", { type: "number", placeholder: "out of", value: formMax, onChange: (e) => setFormMax(e.target.value), className: "w-1/2 rounded-lg px-2 py-1.5 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } })] }))] }), _jsx(Field, { label: "Your reflection (optional)", children: _jsx("textarea", { value: reflection, onChange: (e) => setReflection(e.target.value), rows: 3, placeholder: "What stuck with you from this lesson?", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !title, onClick: () => onSave({
                    title, date, attended,
                    quiz: { assigned: quizAssigned, score: Number(quizScore) || 0, max: Number(quizMax) || 0 },
                    formative: { assigned: formAssigned, score: Number(formScore) || 0, max: Number(formMax) || 0 },
                    reflection,
                }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function DeadlineSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(todayISO());
    return (_jsxs(Sheet, { title: "Add deadline", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Title", children: _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Assignment 2 submission", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Due date", children: _jsx("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !title, onClick: () => onSave({ title, dueDate }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function GradeSheet({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Assignment");
    const [score, setScore] = useState("");
    const [max, setMax] = useState("");
    return (_jsxs(Sheet, { title: "Add grade", onClose: onClose, accent: "#2E4374", children: [_jsx(Field, { label: "Title", children: _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Midterm exam", className: inputCls, style: inputStyle }) }), _jsx(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: ["Assignment", "Midterm", "Final", "Project", "Other"].map((t) => ({ value: t, label: t })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Field, { label: "Score", children: _jsx("input", { type: "number", value: score, onChange: (e) => setScore(e.target.value), className: "w-28 rounded-lg px-3 py-2 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }) }), _jsx(Field, { label: "Out of", children: _jsx("input", { type: "number", value: max, onChange: (e) => setMax(e.target.value), className: "w-28 rounded-lg px-3 py-2 text-sm", style: { ...inputStyle, fontFamily: FONT_MONO } }) })] }), _jsxs(Btn, { accent: "#2E4374", full: true, disabled: !title || !max, onClick: () => onSave({ title, type, score: Number(score) || 0, max: Number(max) || 0 }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
    return (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Area"] }) }), areas.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: Compass, accent: PARA_COLOR, text: "Areas are ongoing parts of your life you maintain, like university, health, or personal admin." }) })) : (areas.map((a) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: a.archived ? "#8A8672" : "#232620" }, children: a.name }), _jsxs("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [a.type, a.archived ? " · archived" : ""] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => patch(a.id, { archived: !a.archived }), children: _jsx(ArchiveIcon, { size: 14, color: a.archived ? PARA_COLOR : "#C7C1AC" }) }), _jsx("button", { onClick: () => setEdit(a), children: _jsx(Pencil, { size: 14, color: "#8A8672" }) }), _jsx("button", { onClick: () => del(a.id), children: _jsx(Trash2, { size: 14, color: "#C7C1AC" }) })] })] }) }, a.id)))), showAdd && _jsx(AreaSheet, { onClose: () => setShowAdd(false), onSave: (a) => { add(a); setShowAdd(false); } }), edit && _jsx(AreaSheet, { initial: edit, onClose: () => setEdit(null), onSave: (a) => { patch(edit.id, a); setEdit(null); } })] }));
}
function AreaSheet({ initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [type, setType] = useState(initial?.type || "Personal");
    return (_jsxs(Sheet, { title: initial ? "Edit area" : "Add area", onClose: onClose, accent: PARA_COLOR, children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. University, Health, Finances", className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Type", children: _jsx("input", { value: type, onChange: (e) => setType(e.target.value), placeholder: "e.g. Personal, University, Health", className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, type }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function ProjectsView({ projects, setProjects, areas }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(p) { setProjects([...projects, { id: uid(), archived: false, ...p }]); }
    function patch(id, p) { setProjects(projects.map((x) => (x.id === id ? { ...x, ...p } : x))); }
    function del(id) { setProjects(projects.filter((x) => x.id !== id)); }
    const areaName = (id) => areas.find((a) => a.id === id)?.name || "—";
    return (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Project"] }) }), projects.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: FolderKanban, accent: PARA_COLOR, text: "Projects are things with an end point \u2014 an assignment, a move, a routine you're building." }) })) : (projects.map((p) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", style: { fontFamily: FONT_BODY, color: "#232620" }, children: p.name }), _jsxs("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [areaName(p.areaId), p.startDate ? ` · from ${fmtDate(p.startDate)}` : ""] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full", style: { fontFamily: FONT_BODY, background: statusColor(p.status) + "20", color: statusColor(p.status) }, children: p.status }), _jsx("button", { onClick: () => setEdit(p), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => del(p.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }) }, p.id)))), showAdd && _jsx(ProjectSheet, { areas: areas, onClose: () => setShowAdd(false), onSave: (p) => { add(p); setShowAdd(false); } }), edit && _jsx(ProjectSheet, { areas: areas, initial: edit, onClose: () => setEdit(null), onSave: (p) => { patch(edit.id, p); setEdit(null); } })] }));
}
function ProjectSheet({ areas, initial, onClose, onSave }) {
    const [name, setName] = useState(initial?.name || "");
    const [areaId, setAreaId] = useState(initial?.areaId || areas[0]?.id || "");
    const [status, setStatus] = useState(initial?.status || "Inbox");
    const [startDate, setStartDate] = useState(initial?.startDate || "");
    const [endDate, setEndDate] = useState(initial?.endDate || "");
    return (_jsxs(Sheet, { title: initial ? "Edit project" : "Add project", onClose: onClose, accent: PARA_COLOR, children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(SelectField, { label: "Area", value: areaId, onChange: (e) => setAreaId(e.target.value), options: areas.map((a) => ({ value: a.id, label: a.name })), placeholder: "No area" }), _jsx(SelectField, { label: "Status", value: status, onChange: (e) => setStatus(e.target.value), options: PROJECT_STATUSES.map((s) => ({ value: s, label: s })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Field, { label: "Start date", children: _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "End date", children: _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: inputCls, style: inputStyle }) })] }), _jsxs(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, areaId, status, startDate, endDate }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function ResourcesView({ resources, setResources }) {
    const [showAdd, setShowAdd] = useState(false);
    function add(r) { setResources([...resources, { id: uid(), ...r }]); }
    function del(id) { setResources(resources.filter((x) => x.id !== id)); }
    return (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Resource"] }) }), resources.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: Link2, accent: PARA_COLOR, text: "Links, references and files worth keeping for later \u2014 outside of a specific module." }) })) : (resources.map((r) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [r.url ? (_jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm flex items-center gap-1.5", style: { fontFamily: FONT_BODY, color: PARA_COLOR }, children: [_jsx(ExternalLink, { size: 13, className: "flex-shrink-0" }), _jsx("span", { className: "truncate", children: r.name })] })) : (_jsx("span", { className: "text-sm", style: { fontFamily: FONT_BODY, color: "#232620" }, children: r.name })), _jsx("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: r.type })] }), _jsx("button", { onClick: () => del(r.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] }) }, r.id)))), showAdd && _jsx(ResourceSheet, { onClose: () => setShowAdd(false), onSave: (r) => { add(r); setShowAdd(false); } })] }));
}
function ResourceSheet({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState(RESOURCE_TYPES[0]);
    return (_jsxs(Sheet, { title: "Add resource", onClose: onClose, accent: PARA_COLOR, children: [_jsx(Field, { label: "Name", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Link (optional)", children: _jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://\u2026", className: inputCls, style: inputStyle }) }), _jsx(SelectField, { label: "Type", value: type, onChange: (e) => setType(e.target.value), options: RESOURCE_TYPES.map((t) => ({ value: t, label: t })) }), _jsxs(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, url, type }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function TasksView({ tasks, setTasks, projects }) {
    const [showAdd, setShowAdd] = useState(false);
    function add(t) { setTasks([{ id: uid(), done: false, ...t }, ...tasks]); }
    function toggle(id) { setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
    function del(id) { setTasks(tasks.filter((t) => t.id !== id)); }
    const projectName = (id) => projects.find((p) => p.id === id)?.name;
    const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate || "").localeCompare(b.dueDate || ""));
    return (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Task"] }) }), tasks.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: CheckSquare, accent: PARA_COLOR, text: "Loose to-dos that aren't part of a module or a bigger project." }) })) : (sorted.map((t) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("button", { onClick: () => toggle(t.id), className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { background: t.done ? PARA_COLOR : PARA_LIGHT }, children: t.done && _jsx(Check, { size: 12, color: "#FBFAF6" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm truncate", style: { fontFamily: FONT_BODY, color: t.done ? "#8A8672" : "#232620", textDecoration: t.done ? "line-through" : "none" }, children: t.name }), _jsxs("div", { className: "text-xs", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: [t.dueDate ? fmtDate(t.dueDate) : "", projectName(t.projectId) ? ` · ${projectName(t.projectId)}` : ""] })] })] }), _jsx("button", { onClick: () => del(t.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] }) }, t.id)))), showAdd && _jsx(TaskSheet, { projects: projects, onClose: () => setShowAdd(false), onSave: (t) => { add(t); setShowAdd(false); } })] }));
}
function TaskSheet({ projects, onClose, onSave }) {
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [projectId, setProjectId] = useState("");
    return (_jsxs(Sheet, { title: "Add task", onClose: onClose, accent: PARA_COLOR, children: [_jsx(Field, { label: "Task", children: _jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Due date (optional)", children: _jsx("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(SelectField, { label: "Project (optional)", value: projectId, onChange: (e) => setProjectId(e.target.value), options: projects.map((p) => ({ value: p.id, label: p.name })), placeholder: "No project" }), _jsxs(Btn, { accent: PARA_COLOR, full: true, disabled: !name, onClick: () => onSave({ name, dueDate, projectId: projectId || undefined }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
}
function NotesView({ notes, setNotes }) {
    const [showAdd, setShowAdd] = useState(false);
    const [edit, setEdit] = useState(null);
    function add(n) { setNotes([{ id: uid(), date: todayISO(), ...n }, ...notes]); }
    function patch(id, n) { setNotes(notes.map((x) => (x.id === id ? { ...x, ...n } : x))); }
    function del(id) { setNotes(notes.filter((x) => x.id !== id)); }
    return (_jsxs("div", { children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsxs(Btn, { accent: PARA_COLOR, onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 14 }), " Note"] }) }), notes.length === 0 ? (_jsx(SectionCard, { children: _jsx(EmptyState, { icon: StickyNote, accent: PARA_COLOR, text: "Quick notes and freeform thoughts, kept simple." }) })) : (notes.map((n) => (_jsx(SectionCard, { children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", style: { fontFamily: FONT_BODY, color: "#232620" }, children: n.title || "Untitled" }), n.body && _jsx("div", { className: "text-xs mt-1 whitespace-pre-wrap", style: { fontFamily: FONT_BODY, color: "#5C5847" }, children: n.body }), _jsx("div", { className: "text-xs mt-1", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: fmtDate(n.date) })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsx("button", { onClick: () => setEdit(n), children: _jsx(Pencil, { size: 13, color: "#8A8672" }) }), _jsx("button", { onClick: () => del(n.id), children: _jsx(Trash2, { size: 13, color: "#C7C1AC" }) })] })] }) }, n.id)))), showAdd && _jsx(NoteSheet, { onClose: () => setShowAdd(false), onSave: (n) => { add(n); setShowAdd(false); } }), edit && _jsx(NoteSheet, { initial: edit, onClose: () => setEdit(null), onSave: (n) => { patch(edit.id, n); setEdit(null); } })] }));
}
function NoteSheet({ initial, onClose, onSave }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [body, setBody] = useState(initial?.body || "");
    return (_jsxs(Sheet, { title: initial ? "Edit note" : "Add note", onClose: onClose, accent: PARA_COLOR, children: [_jsx(Field, { label: "Title", children: _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: inputCls, style: inputStyle }) }), _jsx(Field, { label: "Note", children: _jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 5, className: inputCls, style: inputStyle }) }), _jsxs(Btn, { accent: PARA_COLOR, full: true, disabled: !title && !body, onClick: () => onSave({ title, body }), children: [_jsx(Check, { size: 15 }), " Save"] })] }));
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
export default function Binder() {
    const [tab, setTab] = useState("finance");
    const [financeData, setFinanceData, financeLoaded] = useStore("finance-data", emptyFinance);
    const [uniData, setUniData, uniLoaded] = useStore("university-data-v2", emptyUniversity);
    const [paraData, setParaData, paraLoaded] = useStore("para-data", emptyPara);
    const seeded = useRef(false);
    const loaded = financeLoaded && uniLoaded && paraLoaded;
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
    const activeTab = TABS.find((t) => t.id === tab);
    const fileInputRef = useRef(null);
    const [importMsg, setImportMsg] = useState("");
    function exportBackup() {
        const payload = {
            __ledgerBackup: true,
            version: 1,
            exportedAt: new Date().toISOString(),
            finance: financeData,
            university: uniData,
            para: paraData,
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
    function setAreas(areas) { setParaData((d) => ({ ...d, areas })); }
    function setProjects(projects) { setParaData((d) => ({ ...d, projects })); }
    function setResources(resources) { setParaData((d) => ({ ...d, resources })); }
    function setTasks(tasks) { setParaData((d) => ({ ...d, tasks })); }
    function setNotes(notes) { setParaData((d) => ({ ...d, notes })); }
    return (_jsxs("div", { className: "min-h-screen w-full flex justify-center", style: { background: "#EFEBE1" }, children: [_jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 2px rgba(46,67,116,0.25); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      ` }), _jsxs("div", { className: "w-full max-w-md pb-10", children: [_jsxs("div", { className: "px-5 pt-6 pb-3 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-[0.2em]", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: "Personal ledger" }), _jsx("h1", { className: "text-2xl font-semibold", style: { fontFamily: FONT_HEAD, color: "#232620" }, children: activeTab.label })] }), _jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0 pt-1", children: [_jsx("button", { onClick: exportBackup, title: "Export backup", className: "p-2 rounded-full", style: { background: "#E3DED0" }, children: _jsx(Download, { size: 15, color: "#5C5847" }) }), _jsx("button", { onClick: triggerImport, title: "Import backup", className: "p-2 rounded-full", style: { background: "#E3DED0" }, children: _jsx(Upload, { size: 15, color: "#5C5847" }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "application/json", onChange: handleImportFile, className: "hidden" })] })] }), importMsg && (_jsx("div", { className: "mx-5 mb-2 text-xs px-3 py-2 rounded-lg", style: { fontFamily: FONT_BODY, background: "#E5E8F2", color: "#2E4374" }, children: importMsg })), _jsx("div", { className: "flex px-5 gap-1.5 mb-4 overflow-x-auto no-scrollbar", style: { scrollbarWidth: "none" }, children: TABS.map((t) => {
                            const Icon = t.icon;
                            const active = tab === t.id;
                            return (_jsxs("button", { onClick: () => setTab(t.id), className: "flex items-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium flex-shrink-0", style: { fontFamily: FONT_BODY, background: active ? t.color : t.light, color: active ? "#FBFAF6" : t.color }, children: [_jsx(Icon, { size: 14 }), " ", t.label] }, t.id));
                        }) }), _jsx("div", { className: "px-5", children: !loaded ? (_jsx("div", { className: "py-16 text-center text-sm", style: { fontFamily: FONT_BODY, color: "#8A8672" }, children: "Loading your ledger\u2026" })) : tab === "finance" ? (_jsx(FinanceApp, { data: financeData, setData: setFinanceData })) : tab === "university" ? (_jsx(UniversityApp, { data: uniData, setData: setUniData })) : tab === "areas" ? (_jsx(AreasView, { areas: paraData.areas, setAreas: setAreas })) : tab === "projects" ? (_jsx(ProjectsView, { projects: paraData.projects, setProjects: setProjects, areas: paraData.areas })) : tab === "resources" ? (_jsx(ResourcesView, { resources: paraData.resources, setResources: setResources })) : tab === "tasks" ? (_jsx(TasksView, { tasks: paraData.tasks, setTasks: setTasks, projects: paraData.projects })) : (_jsx(NotesView, { notes: paraData.notes, setNotes: setNotes })) })] })] }));
}
