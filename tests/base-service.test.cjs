const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('src/services/base-service.js', 'utf8'), context);
const baseService = context.window.baseService;

test('atualiza o valor base do mês atual sem alterar o mês anterior', () => {
    const member = {
        base: 20,
        baseHistory: { '2026-09': 15 }
    };

    baseService.setForMonth(member, '2026-10', 25);

    assert.equal(member.base, 25);
    assert.equal(member.baseHistory['2026-09'], 15);
    assert.equal(member.baseHistory['2026-10'], 25);
    assert.equal(baseService.getForMonth(member, '2026-10'), 25);
    assert.equal(baseService.getForMonth(member, '2026-09'), 15);
});

test('mantém o valor legado como compatibilidade no mês atual', () => {
    const member = { base: 30, baseHistory: {} };

    assert.equal(baseService.getForMonth(member, '2026-10'), 30);
    assert.equal(baseService.getForMonth(member, '2026-09'), 0);
});

test('salvar um mês anterior não altera o valor base do mês atual', () => {
    const member = { base: 50, baseHistory: {} };

    baseService.setForMonth(member, '2026-09', 20);

    assert.equal(member.base, 50);
    assert.equal(baseService.getForMonth(member, '2026-09'), 20);
    assert.equal(baseService.getForMonth(member, '2026-10'), 50);
});
