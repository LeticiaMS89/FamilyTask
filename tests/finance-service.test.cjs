const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('src/services/finance-service.js', 'utf8'), context);
const financeService = context.window.financeService;

const member = { id: 'member-1' };
const types = [
    { id: 'bonus', rule: 'bonus' },
    { id: 'paid', rule: 'paid' }
];

test('includes completed category, random, and wardrobe bonuses in the monthly base', () => {
    const tasks = [
        { id: 'task-bonus', memberId: 'member-1', type: 'bonus', bonusValue: 5, status: { '2026-10-01': 'done' } },
        { id: 'random-bonus', memberId: 'member-1', type: 'paid', isRandomBonus: true, bonusValue: 3.5, status: { '2026-10-02': 'done' } },
        { id: 'wardrobe', memberId: 'member-1', title: 'Organizar guarda-roupa', status: { '2026-10-03': 'done' } }
    ];

    const result = financeService.calculateMonth(member, tasks, '2026-10', 20, types, true);

    assert.equal(result.taskBonus, 8.5);
    assert.equal(result.wardrobeAmount, 1);
    assert.equal(result.baseWithBonuses, 29.5);
    assert.equal(result.total, 29.5);
});

test('counts only completed monthly bonuses and honors disabled wardrobe bonuses', () => {
    const tasks = [
        { id: 'pending', memberId: 'member-1', type: 'bonus', bonusValue: 4, status: { '2026-10-01': 'pending' } },
        { id: 'other-month', memberId: 'member-1', isRandomBonus: true, bonusValue: 9, status: { '2026-09-30': 'done' } },
        { id: 'wardrobe', memberId: 'member-1', title: 'Organizar guarda-roupa', status: { '2026-10-03': 'done' } }
    ];

    const result = financeService.calculateMonth(member, tasks, '2026-10', 20, types, false);

    assert.equal(result.taskBonus, 0);
    assert.equal(result.wardrobeAmount, 0);
    assert.equal(result.baseWithBonuses, 20);
    assert.equal(result.total, 20);
});

test('counts approved bonus tasks and approved wardrobe tasks as completed', () => {
    const tasks = [
        { id: 'approved-bonus', memberId: 'member-1', isBonusTask: true, bonusValue: 6, status: { '2026-10-01': 'approved' } },
        { id: 'approved-wardrobe', memberId: 'member-1', title: 'Organizar guarda-roupa', status: { '2026-10-02': 'approved' } }
    ];

    const result = financeService.calculateMonth(member, tasks, '2026-10', 20, types, true);

    assert.equal(result.taskBonus, 6);
    assert.equal(result.wardrobeAmount, 1);
    assert.equal(result.baseWithBonuses, 27);
    assert.equal(result.total, 27);
});

test('subtracts failures without reducing the base that includes earned bonuses', () => {
    const tasks = [
        { id: 'random-bonus', memberId: 'member-1', isRandomBonus: true, status: { '2026-10-01': 'done' } },
        { id: 'failed', memberId: 'member-1', type: 'paid', status: { '2026-10-02': 'failed' } }
    ];

    const result = financeService.calculateMonth(member, tasks, '2026-10', 20, types, false);

    assert.equal(result.taskBonus, 1);
    assert.equal(result.failures, 1);
    assert.equal(result.baseWithBonuses, 21);
    assert.equal(result.total, 20);
});
