const test = require('node:test');
const assert = require('node:assert/strict');
const taskQueryService = require('../src/services/task-query-service.js');

const tasks = [
    {
        id: 'weekly',
        title: 'Organizar a mesa',
        memberId: 'member-1',
        type: 'paid',
        days: [1, 3],
        status: { '2026-10-12': 'done', '2026-10-14': 'failed' }
    },
    {
        id: 'single',
        title: 'Estudar matemática',
        memberId: 'member-2',
        type: 'bonus',
        mode: 'single',
        date: '2026-10-13',
        status: { '2026-10-13': 'approved' }
    }
];

test('lists weekly and one-time occurrences chronologically without changing stored tasks', () => {
    const snapshot = JSON.stringify(tasks);
    const result = taskQueryService.listOccurrences(tasks, {
        from: '2026-10-12',
        to: '2026-10-18'
    });

    assert.deepEqual(result.map(item => [item.task.id, item.date, item.status]), [
        ['weekly', '2026-10-12', 'done'],
        ['single', '2026-10-13', 'approved'],
        ['weekly', '2026-10-14', 'failed']
    ]);
    assert.equal(JSON.stringify(tasks), snapshot);
});

test('filters task occurrences by member, category, status group and title', () => {
    const result = taskQueryService.listOccurrences(tasks, {
        from: '2026-10-12',
        to: '2026-10-18',
        memberId: 'member-1',
        typeId: 'paid',
        status: 'completed',
        query: 'MESA'
    });

    assert.deepEqual(result.map(item => item.date), ['2026-10-12']);
});

test('matches approved tasks and ignores accents in the title search', () => {
    const result = taskQueryService.listOccurrences(tasks, {
        from: '2026-10-13',
        to: '2026-10-13',
        status: 'completed',
        query: 'MATEMATICA'
    });

    assert.deepEqual(result.map(item => item.status), ['approved']);
});

test('keeps daily recurring occurrences intact across daylight-saving changes', () => {
    const result = taskQueryService.listOccurrences([{
        id: 'daily',
        title: 'Tarefa diária',
        days: [0, 1, 2, 3, 4, 5, 6]
    }], {
        from: '2026-03-07',
        to: '2026-03-10'
    });

    assert.deepEqual(result.map(item => item.date), [
        '2026-03-07',
        '2026-03-08',
        '2026-03-09',
        '2026-03-10'
    ]);
});

test('supports the full 366-day leap year range', () => {
    const result = taskQueryService.listOccurrences([{
        title: 'Tarefa diária',
        days: [0, 1, 2, 3, 4, 5, 6]
    }], {
        from: '2024-01-01',
        to: '2024-12-31'
    });

    assert.equal(result.length, 366);
});

test('rejects invalid and excessively broad date ranges', () => {
    assert.throws(() => taskQueryService.listOccurrences(tasks, {
        from: '2026-02-30',
        to: '2026-03-01'
    }), RangeError);
    assert.throws(() => taskQueryService.listOccurrences(tasks, {
        from: '2025-01-01',
        to: '2026-01-02'
    }), RangeError);
});
