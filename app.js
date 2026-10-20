// Configuração de Estado Global
const state = {
    currentDate: new Date().toISOString().split('T')[0],
    waterTarget: 3200,
    waterLogs: {}, // { 'YYYY-MM-DD': total_em_ml }
    members: [],
    tasks: [],
    taskTypes: [],
    settings: {
        bonusWardrobe: 1.00 // Regra mantida inalterada
    }
};

// 1. Controle de Consumo de Água
function addWater(amount) {
    const today = state.currentDate;
    if (!state.waterLogs[today]) state.waterLogs[today] = 0;
    
    state.waterLogs[today] += amount;
    updateWaterUI();
    syncData('waterLogs', state.waterLogs); // Função abstrata para Firebase/Supabase
}

function updateWaterUI() {
    const today = state.currentDate;
    const consumed = state.waterLogs[today] || 0;
    const percent = Math.min((consumed / state.waterTarget) * 100, 100).toFixed(0);
    const remaining = Math.max(state.waterTarget - consumed, 0);
    
    const progressBar = document.getElementById('water-progress');
    const statusText = document.getElementById('water-status');
    
    progressBar.style.width = `${percent}%`;
    statusText.innerText = `${consumed} ml / ${state.waterTarget} ml (${percent}%) - Restante: ${remaining} ml`;
    
    if (consumed >= state.waterTarget) {
        progressBar.classList.add('goal-met');
    } else {
        progressBar.classList.remove('goal-met');
    }
}

// 2. Cadastro Dinâmico de Integrantes (Categorização Automática)
function addMember(name, age, avatarUrl = '', color = '#15171A') {
    let category = 'Adulto';
    if (age < 12) {
        category = 'Criança';
    } else if (age >= 12 && age <= 17) {
        category = 'Adolescente';
    }

    const newMember = {
        id: Date.now().toString(),
        name,
        age,
        category,
        avatarUrl,
        color,
        balance: 0
    };

    state.members.push(newMember);
    syncData('members', state.members);
}

// 3. Tipos de Tarefas Dinâmicos
function addTaskType(name, icon, description, color = '#3A465A') {
    const newType = { id: Date.now().toString(), name, icon, description, color };
    state.taskTypes.push(newType);
    syncData('taskTypes', state.taskTypes);
}

// 4. Regras de Pagamento e Bônus Existentes (Preservadas)
function calculateWeeklyEarnings(memberId, weekTasks) {
    const member = state.members.find(m => m.id === memberId);
    let totalEarning = 0;
    let wardrobeOrganized = true; // Lógica de verificação do histórico

    weekTasks.forEach(task => {
        if (task.assignee === memberId && task.status === 'completed' && task.isPaid) {
            totalEarning += task.value;
        }
        if (task.type === 'wardrobe' && task.status !== 'completed') {
            wardrobeOrganized = false;
        }
    });

    if (wardrobeOrganized) {
        totalEarning += state.settings.bonusWardrobe;
    }

    return totalEarning;
}

// 5. Gráfico de Desempenho (Filtros: Diário, Semanal, Mensal, Anual)
let chartInstance = null;
function updateChart() {
    const filter = document.getElementById('chart-filter').value;
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Simulação de busca de dados baseada no filtro selecionado
    // Em um caso real, filtre state.tasks usando filter (daily, weekly, etc.)
    const dataMock = {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], // Ex: Semanal
        completed: [5, 7, 4, 6, 8, 3, 5], // Fechamento corrigido aqui
        pending: [2, 1, 3, 0, 1, 4, 2],
        overdue: [0, 1, 0, 2, 0, 1, 0]
    };

    // Destrói o gráfico anterior antes de renderizar um novo para evitar sobreposição
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataMock.labels,
            datasets: [
                {
                    label: 'Concluídas',
                    data: dataMock.completed,
                    backgroundColor: '#4CAF50' // Verde (Sucesso)
                },
                {
                    label: 'Pendentes',
                    data: dataMock.pending,
                    backgroundColor: '#3A465A' // Cinza Azulado (Neutro/Secundário)
                },
                {
                    label: 'Atrasadas',
                    data: dataMock.overdue,
                    backgroundColor: '#E50914' // Vermelho (Alerta)
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}