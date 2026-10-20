(() => {
    const approvalService = {
        submit(task, date, proof, comment = '') {
            const d = window.appDB.data;
            const approval = {
                id: `approval_${Date.now()}`,
                taskId: task.id,
                childId: task.memberId,
                date,
                status: 'pending',
                proof: proof || undefined,
                feedback: comment || '',
                createdAt: new Date().toISOString()
            };
            d.approvals = Array.isArray(d.approvals) ? d.approvals : [];
            d.approvals.unshift(approval);
            task.status = task.status || {};
            task.status[date] = 'awaiting_approval';
            return approval;
        },
        review(approvalId, status, feedback = '') {
            const d = window.appDB.data;
            const approval = (d.approvals || []).find(item => item.id === approvalId);
            if (!approval) return null;
            const task = (d.tasks || []).find(item => String(item.id) === String(approval.taskId));
            approval.status = status;
            approval.feedback = feedback;
            approval.reviewedAt = new Date().toISOString();
            if (task) {
                task.status = task.status || {};
                task.status[approval.date] = status === 'approved' ? 'approved' : 'rejected';
            }
            return approval;
        },
        pending(data) {
            return (data.approvals || []).filter(item => item.status === 'pending');
        }
    };
    window.familyServices = window.familyServices || {};
    window.familyServices.approval = approvalService;
})();
