(() => {
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const parseDate = value => {
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
        const date = new Date(`${value}T12:00:00`);
        return Number.isNaN(date.getTime()) || dateKey(date) !== value ? null : date;
    };

    const matchesStatus = (status, filter) => {
        if (filter === 'all') return true;
        if (filter === 'completed') return status === 'done' || status === 'approved';
        return status === filter;
    };

    const normalizeText = value => String(value || '').trim().toLocaleLowerCase('pt-BR')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const listOccurrences = (tasks, filters = {}) => {
        const from = parseDate(filters.from);
        const to = parseDate(filters.to);
        if (!from || !to || from > to) throw new RangeError('Informe um intervalo de datas válido.');

        const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
        const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
        const dayCount = Math.floor((toUtc - fromUtc) / 86400000) + 1;
        if (dayCount > 366) throw new RangeError('O intervalo máximo para análise é de 366 dias.');

        const search = normalizeText(filters.query);
        const occurrences = [];
        for (const task of tasks || []) {
            if (filters.memberId && filters.memberId !== 'all' && String(task.memberId) !== String(filters.memberId)) continue;
            if (filters.typeId && filters.typeId !== 'all' && String(task.type || '') !== String(filters.typeId)) continue;
            if (search && !normalizeText(task.title).includes(search)) continue;

            const dates = [];
            if (task.mode === 'single') {
                const taskDate = parseDate(task.date);
                if (taskDate && taskDate >= from && taskDate <= to) dates.push(task.date);
            } else if (Array.isArray(task.days) && task.days.length) {
                const date = new Date(from);
                for (let index = 0; index < dayCount; index += 1) {
                    if (task.days.includes(date.getDay())) dates.push(dateKey(date));
                    date.setDate(date.getDate() + 1);
                }
            }

            for (const date of dates) {
                const status = task.status?.[date] || 'pending';
                if (!matchesStatus(status, filters.status || 'all')) continue;
                occurrences.push({ task, date, status });
            }
        }

        return occurrences.sort((left, right) => left.date.localeCompare(right.date)
            || String(left.task.time || '').localeCompare(String(right.task.time || ''))
            || String(left.task.title || '').localeCompare(String(right.task.title || ''), 'pt-BR'));
    };

    const taskQueryService = { listOccurrences };
    if (typeof window !== 'undefined') {
        window.familyServices = window.familyServices || {};
        window.familyServices.taskQuery = taskQueryService;
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = taskQueryService;
})();
