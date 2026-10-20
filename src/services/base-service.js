(() => {
    const normalizeMonth = (month) => String(month || '').slice(0, 7);
    const currentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const getForMonth = (member, month) => {
        const normalizedMonth = normalizeMonth(month);
        const history = member?.baseHistory && typeof member.baseHistory === 'object' ? member.baseHistory : {};
        const historyValue = Number(history[normalizedMonth]);
        if (Number.isFinite(historyValue)) return historyValue;
        if (normalizedMonth === currentMonth() && Number.isFinite(Number(member?.base))) return Number(member.base);
        return 0;
    };

    const setForMonth = (member, month, value) => {
        const normalizedMonth = normalizeMonth(month);
        if (!normalizedMonth) return Number(member?.base || 0);
        member.baseHistory = member.baseHistory && typeof member.baseHistory === 'object' ? member.baseHistory : {};
        const amount = Math.max(0, Number(value) || 0);
        member.baseHistory[normalizedMonth] = amount;
        if (normalizedMonth === currentMonth()) member.base = amount;
        return amount;
    };

    const baseService = { getForMonth, setForMonth };
    if (typeof window !== 'undefined') window.baseService = baseService;
    if (typeof module !== 'undefined' && module.exports) module.exports = baseService;
})();
