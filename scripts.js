const Modal = {
    toggle() {
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("nin.finances: transactions")) || [];
    },
    set(transactions) {
        localStorage.setItem("nin.finances: transactions", JSON.stringify(transactions));
    },
    getToken() {
        const token = localStorage.getItem("nin.finances: token");
        console.log('Getting token:', token ? 'Token exists' : 'No token');
        return token;
    },
    setToken(token) {
        console.log('Setting token:', token ? 'Token received' : 'No token');
        localStorage.setItem("nin.finances: token", token);
    },
    clearToken() {
        console.log('Clearing token');
        localStorage.removeItem("nin.finances: token");
    }
}

const Transaction = {
    all: Storage.get(),

    async add(transaction) {
        try {
            const token = Storage.getToken();
            if (!token) {
                console.log('No token found, redirecting to login');
                window.location.href = '/login.html';
                return;
            }

            console.log('Adding transaction with token:', token ? 'Token exists' : 'No token');
            const response = await fetch(`${window.APP_CONFIG.backendUrl}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Unauthorized, clearing token and redirecting to login');
                    Storage.clearToken();
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newTransaction = await response.json();
            Transaction.all.push(newTransaction);
            App.reload();
        } catch (error) {
            console.error("Error creating transaction:", error);
            alert("Error creating transaction. Please try again.");
        }
    },

    async remove(index) {
        try {
            const token = Storage.getToken();
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const transaction = Transaction.all[index];
            if (!transaction || !transaction._id) {
                throw new Error('Invalid transaction');
            }

            const response = await fetch(`${window.APP_CONFIG.backendUrl}/api/transactions/${transaction._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Storage.clearToken();
                    window.location.href = '/login.html';
                    return;
                }
                const error = await response.json();
                throw new Error(error.message || 'Error removing transaction');
            }

            Transaction.all.splice(index, 1);
            App.reload();
        } catch (error) {
            console.error("Error removing transaction:", error);
            alert(error.message);
        }
    },

    edit(index) {
        const transaction = Transaction.all[index];
        if (!transaction || !transaction._id) {
            alert('Invalid transaction');
            return;
        }
        Form.description.value = transaction.description;
        Form.amount.value = transaction.amount / 100;
        Form.date.value = transaction.date.split('/').reverse().join('-');
        Form.index.value = index;
        Modal.toggle();
    },

    async update(index, transaction) {
        try {
            const token = Storage.getToken();
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const oldTransaction = Transaction.all[index];
            if (!oldTransaction || !oldTransaction._id) {
                throw new Error('Invalid transaction');
            }

            const response = await fetch(`${window.APP_CONFIG.backendUrl}/api/transactions/${oldTransaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Storage.clearToken();
                    window.location.href = '/login.html';
                    return;
                }
                const error = await response.json();
                throw new Error(error.message || 'Error updating transaction');
            }

            const updatedTransaction = await response.json();
            Transaction.all[index] = updatedTransaction;
            App.reload();
        } catch (error) {
            console.error("Error updating transaction:", error);
            alert(error.message);
        }
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <div class="actions-icons">
                    <img onclick="Transaction.edit(${index})" class="edit-button" src="./assets/pencil.png" alt="Editar transação">
                    <img onclick="Transaction.remove(${index})" class="edit-button" src="./assets/minus.svg" alt="Remover transação">
                </div>
            </td>
        `;
        return html;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100;
        return value;
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    index: document.querySelector('input#index'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        };
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        return {
            description,
            amount,
            date
        };
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
        Form.index.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            
            if (Form.index.value) {
                Transaction.update(Form.index.value, transaction);
            } else {
                Transaction.add(transaction);
            }
            
            Form.clearFields();
            Modal.toggle();
        } catch (error) {
            alert(error.message);
        }
    }
}

const App = {
    async init() {
        try {
            const token = Storage.getToken();
            if (!token) {
                console.log('No token found, redirecting to login');
                window.location.href = '/login.html';
                return;
            }

            // Get user info from token
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userEmail = document.getElementById('user-email');
            if (userEmail) {
                userEmail.textContent = tokenData.email || localStorage.getItem('userEmail') || '';
            }

            console.log('Fetching transactions with token:', token ? 'Token exists' : 'No token');
            const response = await fetch(`${window.APP_CONFIG.backendUrl}/api/transactions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Unauthorized, clearing token and redirecting to login');
                    Storage.clearToken();
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const transactions = await response.json();
            Transaction.all = transactions;
            Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index));
            DOM.updateBalance();
            Storage.set(Transaction.all);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            alert("Error loading transactions. Please try again.");
        }
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    },

    async logout() {
        try {
            const token = Storage.getToken();
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            await fetch(`${window.APP_CONFIG.backendUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            Storage.clearToken();
            window.location.href = '/login.html';
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out. Please try again.");
        }
    }
}

App.init();
