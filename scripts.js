const Modal = {
    toggle() {
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const transactions = [];

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("nin.finances: transactions")) || [];
     },
    set(transactions) { 
        localStorage.setItem("nin.finances: transactions", JSON.stringify(transactions));
    },
}

const Transaction = {

    all: Storage.get(),

    async add(transaction) {
        try {
            const response = await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });
            if (!response.ok) {
                console.error("Error creating transaction:", response.status);
                return;
            }
            Transaction.all.push(transaction);
            App.reload();
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    },
    async update(index, transaction) {
        try {
            const response = await fetch(`http://localhost:3000/transactions/${transaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });
            if (!response.ok) {
                console.error("Error updating transaction:", response.status);
                return;
            }
            Transaction.all[index] = transaction;
            App.reload();
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    },
    async remove(id) {
        try {
            const response = await fetch(`http://localhost:3000/transactions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error("Error deleting transaction:", response.status);
                return;
            }
            Transaction.all = Transaction.all.filter(transaction => transaction._id !== id);
            Storage.set(Transaction.all);
            App.reload();
        } catch (error) {
            console.error("Error deleting transaction:", error);
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
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const cssClass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const html =
            `
                <td class="description">${transaction.description}</td>
                <td class="${cssClass}">${amount}</td>
                <td class="date">${Utils.formatDate(transaction.date)}</td>
                <td class="actions-icons">
                    <img class="edit-button" onclick="DOM.editTransaction(${index})" src="./assets/pencil.png" alt="Editar Transação">
                    <img onclick="Transaction.remove('${transaction._id}')" src="./assets/minus.svg" alt="Remover Transação">
                </td>
            `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    },
    async editTransaction(index) {
        const transaction = Transaction.all[index];
        Form.index.value = transaction._id;
        
        Form.description.value = transaction.description;
        Form.amount.value = transaction.amount / 100;
        Form.date.value = transaction.date;
        Modal.toggle();
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100;

        return value;
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]} `
    }
}

const Form = {
    index: document.querySelector('input#index'),
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            index: Form.index.value,
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor preencha todos os campos")
        }
    },

    formatValues() {
        let { index, description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        
        return {
            index,
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = "";
        Form.index.value = "";
        
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();
        try {
            Form.validateFields();
            const data = Form.formatValues();
            if (data.index) {
                Transaction.update(data.index, {...data, _id: data.index});
            } else {
                Transaction.add(data);
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
            const response = await fetch('http://localhost:3000/transactions', {
            });
            if (!response.ok) {
                console.error("Error fetching transactions:", response.status);
                Transaction.all = [];
                DOM.clearTransactions();
                DOM.updateBalance();
                return;
            }
            const transactions = await response.json();
            Transaction.all = transactions.map(transaction => ({
                ...transaction,
                id: transaction._id
            }));
            Transaction.all.forEach(DOM.addTransaction);
            DOM.updateBalance();
            Storage.set(Transaction.all);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();
