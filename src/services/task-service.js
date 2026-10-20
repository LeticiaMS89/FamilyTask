(() => {
    const taskService = {
        pointsFor() { return 1; },
        nextRotationMember(task, members) {
            if (!task || !Array.isArray(task.rotation?.memberIds) || task.rotation.memberIds.length === 0) {
                return null;
            }

            const list = task.rotation.memberIds
                .map(memberId => String(memberId))
                .filter(memberId => members.some(member => String(member.id) === memberId));

            if (!list.length) return null;
            const currentIndex = Number(task.rotation.currentIndex) || 0;
            const index = currentIndex % list.length;
            return list[index];
        },
        rotateTaskOwner(task, members) {
            if (!task || !task.rotation || !task.rotation.enabled) return task?.memberId ?? null;
            const list = task.rotation.memberIds
                .map(memberId => String(memberId))
                .filter(memberId => members.some(member => String(member.id) === memberId));

            if (!list.length) return task.memberId ?? null;
            const currentIndex = Number(task.rotation.currentIndex) || 0;
            const nextIndex = (currentIndex + 1) % list.length;
            const nextMemberId = list[nextIndex];
            task.rotation.currentIndex = nextIndex;
            task.memberId = nextMemberId;
            return nextMemberId;
        }
    };

    window.familyServices = window.familyServices || {};
    window.familyServices.task = taskService;
})();
