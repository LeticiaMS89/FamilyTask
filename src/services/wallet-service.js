(() => {
    const DEFAULT_CONVERSION = { points: 10, money: 1 };
    const DEFAULT_SPLIT = { spend: 50, save: 40, help: 10 };

    const walletService = {
        ensure(childId, data) {
            data.wallets = data.wallets || {};
            if (!data.wallets[childId]) {
                data.wallets[childId] = {
                    id: `wallet_${childId}`,
                    childId,
                    points: 0,
                    money: 0,
                    split: { ...DEFAULT_SPLIT },
                    conversion: { ...DEFAULT_CONVERSION },
                    buckets: { spend: 0, save: 0, help: 0 }
                };
            }
            return data.wallets[childId];
        },
        award(childId, points, sourceId, description, data) {
            const wallet = this.ensure(childId, data);
            const amount = Math.max(0, Number(points) || 0);
            wallet.points += amount;
            const conversion = wallet.conversion || DEFAULT_CONVERSION;
            const earnedMoney = amount * conversion.money / conversion.points;
            wallet.money += earnedMoney;
            const split = wallet.split || DEFAULT_SPLIT;
            Object.keys(split).forEach(bucket => {
                wallet.buckets[bucket] = (wallet.buckets[bucket] || 0) + earnedMoney * (Number(split[bucket]) / 100);
            });
            data.transactions = data.transactions || [];
            data.transactions.unshift({ id: `transaction_${Date.now()}`, childId, type: 'task_reward', pointsDelta: amount, moneyDelta: earnedMoney, sourceId, description, createdAt: new Date().toISOString() });
            return wallet;
        },
        convert(childId, points, data) {
            const wallet = this.ensure(childId, data);
            const amount = Math.max(0, Math.min(wallet.points, Number(points) || 0));
            const conversion = wallet.conversion || DEFAULT_CONVERSION;
            const money = amount * conversion.money / conversion.points;
            wallet.points -= amount;
            wallet.money += money;
            data.transactions = data.transactions || [];
            data.transactions.unshift({ id: `transaction_${Date.now()}`, childId, type: 'conversion', pointsDelta: -amount, moneyDelta: money, description: `Conversão de ${amount} pontos`, createdAt: new Date().toISOString() });
            return wallet;
        },
        purchase(childId, reward, data) {
            const wallet = this.ensure(childId, data);
            if (!reward.active || wallet.points < reward.pointsCost) return false;
            wallet.points -= reward.pointsCost;
            data.transactions = data.transactions || [];
            data.transactions.unshift({ id: `transaction_${Date.now()}`, childId, type: 'reward_purchase', pointsDelta: -reward.pointsCost, moneyDelta: 0, sourceId: reward.id, description: `Resgate: ${reward.title}`, createdAt: new Date().toISOString() });
            if (typeof reward.stock === 'number') reward.stock = Math.max(0, reward.stock - 1);
            return true;
        }
    };
    window.familyServices = window.familyServices || {};
    window.familyServices.wallet = walletService;
})();
