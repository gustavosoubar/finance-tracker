// Inicializar o mês atual
function initializeMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    document.getElementById('month').value = `${year}-${month}`;
}

// Obter dados armazenados
function getStorageData() {
    const monthInput = document.getElementById('month').value;
    const storageKey = `finance-${monthInput}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : { incomes: [], expenses: [] };
}

// Salvar dados
function saveData(data) {
    const monthInput = document.getElementById('month').value;
    const storageKey = `finance-${monthInput}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

// Adicionar receita
function addIncome() {
    const description = document.getElementById('incomeDescription').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);

    if (!description || !amount || amount <= 0) {
        alert('Por favor, preencha todos os campos com valores válidos');
        return;
    }

    const data = getStorageData();
    data.incomes.push({
        id: Date.now(),
        description: description,
        amount: amount
    });

    saveData(data);
    document.getElementById('incomeDescription').value = '';
    document.getElementById('incomeAmount').value = '';
    
    updateDisplay();
}

// Adicionar despesa
function addExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (!description || !amount || amount <= 0) {
        alert('Por favor, preencha todos os campos com valores válidos');
        return;
    }

    const data = getStorageData();
    data.expenses.push({
        id: Date.now(),
        description: description,
        amount: amount
    });

    saveData(data);
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    
    updateDisplay();
}

// Deletar receita
function deleteIncome(id) {
    const data = getStorageData();
    data.incomes = data.incomes.filter(item => item.id !== id);
    saveData(data);
    updateDisplay();
}

// Deletar despesa
function deleteExpense(id) {
    const data = getStorageData();
    data.expenses = data.expenses.filter(item => item.id !== id);
    saveData(data);
    updateDisplay();
}

// Formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Atualizar exibição
function updateDisplay() {
    const data = getStorageData();

    // Calcular totais
    const totalIncome = data.incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = data.expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;

    // Atualizar resumo
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    
    const balanceElement = document.getElementById('totalBalance');
    balanceElement.textContent = formatCurrency(balance);
    balanceElement.style.color = balance >= 0 ? '#fff' : '#fff';

    // Atualizar cor do saldo se negativo
    const balanceCard = document.querySelector('.summary-card.balance');
    if (balance < 0) {
        balanceCard.style.background = 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)';
    } else {
        balanceCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    // Atualizar lista de receitas
    const incomeList = document.getElementById('incomeList');
    if (data.incomes.length === 0) {
        incomeList.innerHTML = '<li class="empty-message">Nenhuma receita registrada</li>';
    } else {
        incomeList.innerHTML = data.incomes.map(income => `
            <li>
                <span class="description">${income.description}</span>
                <span class="value income">${formatCurrency(income.amount)}</span>
                <button class="btn btn-delete" onclick="deleteIncome(${income.id})">Deletar</button>
            </li>
        `).join('');
    }

    // Atualizar lista de despesas
    const expenseList = document.getElementById('expenseList');
    if (data.expenses.length === 0) {
        expenseList.innerHTML = '<li class="empty-message">Nenhuma despesa registrada</li>';
    } else {
        expenseList.innerHTML = data.expenses.map(expense => `
            <li>
                <span class="description">${expense.description}</span>
                <span class="value expense">${formatCurrency(expense.amount)}</span>
                <button class="btn btn-delete" onclick="deleteExpense(${expense.id})">Deletar</button>
            </li>
        `).join('');
    }
}

// Event listeners
document.getElementById('month').addEventListener('change', updateDisplay);

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initializeMonth();
    updateDisplay();
});
