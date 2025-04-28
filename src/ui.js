import { incomeCategories, expenseCategories } from './categories.js';
import { records, deleteRecord } from './records.js';

export function renderSummary() {
    const now = new Date();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    let income = 0, expense = 0;

    records.forEach(record => {
        const d = new Date(record.date);
        if (d.getMonth() === month && d.getFullYear() === year) {
            if (record.type === 'income') income += record.amount;
            if (record.type === 'expense') expense += record.amount;
        }
    });

    document.getElementById('current-month').textContent = monthName + ' ' + year;
    document.getElementById('total-income').textContent = income;
    document.getElementById('total-expense').textContent = expense;
    document.getElementById('total-remaining').textContent = income - expense;
}

function getMonthIndex(month) {
    const months = {
        "January": 0,
        "February": 1,
        "March": 2, "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    return months[month] || -1;
}

export function renderRecords(filterYear = "", filterMonth = "") {

    filterMonth = getMonthIndex(filterMonth);

    const years = [...new Set(records.map(r => new Date(r.date).getFullYear()))];
    const months = [...new Set(records.map(r => new Date(r.date).toLocaleString('default', { month: 'long' })))];

    // console.log("years", years);
    // console.log("months", months);
    const yearSelect = document.getElementById('filter-year');
    const monthSelect = document.getElementById('filter-month');
    const yearOptions = years.map(y => `<option value="${y}">${y}</option>`).join('');
    const monthOptions = months.map((m) => `<option value="${m}">${m}</option>`).join('');
    yearSelect.innerHTML = yearOptions.length ? `${yearOptions}` : `<option>None</option>`;
    monthSelect.innerHTML = monthOptions.length ? `${monthOptions}` : `<option>None</option>`;

    // console.log("yearSelect", yearSelect);
    // console.log("monthSelect", monthSelect);

    const tbody = document.querySelector('#records-table tbody');
    tbody.innerHTML = "";

    records.forEach((r, index) => {
        const d = new Date(r.date);
        if ((filterYear === "" || d.getFullYear() == filterYear) && (filterMonth === "" || d.getMonth() == filterMonth)) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${r.type}</td>
        <td>${r.category}</td>
        <td>${r.amount}</td>
        <td>${new Date(r.date).toLocaleDateString()}</td>
        <td><button onclick="handleDelete(${index})">Delete</button></td>
      `;
            tbody.appendChild(tr);
        }
    });
}

export function renderReports(selectedYear) {

    const yearSelect = document.getElementById('report-year');
    const years = [...new Set(records.map(r => new Date(r.date).getFullYear()))];
    const yearOptions = years.map(y => `<option value="${y}">${y}</option>`).join('');
    yearSelect.innerHTML = yearOptions.length ? `${yearOptions}` : `<option>None</option>`;
    yearSelect.value = selectedYear;
    yearSelect.addEventListener('change', (e) => {
        selectedYear = e.target.value;
        renderReports(selectedYear);
    });

    const tbody = document.querySelector('#yearly-expense-table tbody');
    tbody.innerHTML = "";

    for (let m = 0; m < 12; m++) {
        let monthExpense = 0;
        let monthIncome = 0;
        records.forEach(r => {
            const d = new Date(r.date);
            if (r.type === 'expense' && d.getFullYear() == selectedYear && d.getMonth() === m) {
                monthExpense += r.amount;
            } else if (r.type === 'income' && d.getFullYear() == selectedYear && d.getMonth() === m) {
                monthIncome += r.amount;
            }
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${new Date(0, m).toLocaleString('default', { month: 'long' })}</td>
      <td>${monthExpense}</td>
      <td>${monthIncome}</td>
    `;
        tbody.appendChild(tr);
    }
}

export function showPopup(type) {
    document.getElementById('popup-form').style.display = 'block';
    document.getElementById('popup-type').value = type;
    populateCategories(type);
}

export function hidePopup() {
    document.getElementById('popup-form').style.display = 'none';
}

function populateCategories(type) {
    const select = document.getElementById('popup-category');
    select.innerHTML = '';
    const list = type === 'income' ? incomeCategories : expenseCategories;

    list.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

window.handleDelete = function (index) {
    if (confirm('Are you sure?')) {
        deleteRecord(index);
        renderSummary();
        renderRecords();
    }
};
