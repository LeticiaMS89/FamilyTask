(() => {
    const isWardrobeTask = task => task.isWardrobe || /guarda\s*roupa|guarda-roupa|arm[aá]rio/i.test(task.title || '');
    const isCompleted = status => status === 'done' || status === 'approved';

    const calculateMonth = (member, tasks, month, baseValue, types, wardrobeBonusEnabled) => {
        const bonusTypeIds = new Set(types.filter(type => type.rule === 'bonus').map(type => String(type.id)));
        const monthStatuses = [];
        let taskBonus = 0;
        let failures = 0;

        tasks.filter(task => String(task.memberId) === String(member.id)).forEach(task => {
            Object.entries(task.status || {}).forEach(([date, status]) => {
                if (!date.startsWith(month)) return;
                monthStatuses.push({ task, status });

                if (isCompleted(status) && !isWardrobeTask(task) && (bonusTypeIds.has(String(task.type)) || task.isRandomBonus || task.isBonusTask)) {
                    const value = Number(task.bonusValue ?? 1);
                    taskBonus += Number.isFinite(value) ? value : 1;
                }

                if (status === 'failed' && !isWardrobeTask(task) && !task.isRandomBonus && !task.isBonusTask) {
                    failures++;
                }
            });
        });

        const wardrobeStatuses = monthStatuses.filter(({ task }) => isWardrobeTask(task));
        let wardrobeAmount = 0;
        if (wardrobeBonusEnabled && wardrobeStatuses.length) {
            const allDone = wardrobeStatuses.every(({ status }) => isCompleted(status));
            const hasFailure = wardrobeStatuses.some(({ status }) => status === 'failed');
            wardrobeAmount = allDone ? 1 : hasFailure ? -1 : 0;
        }

        const baseWithBonuses = Number(baseValue) + taskBonus + Math.max(wardrobeAmount, 0);
        return {
            taskBonus,
            wardrobeAmount,
            hasWardrobeTasks: wardrobeStatuses.length > 0,
            failures,
            baseWithBonuses,
            total: baseWithBonuses - failures + Math.min(wardrobeAmount, 0)
        };
    };

    const financeService = { calculateMonth };
    if (typeof window !== 'undefined') window.financeService = financeService;
    if (typeof module !== 'undefined' && module.exports) module.exports = financeService;
})();
