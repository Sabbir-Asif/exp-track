import { addRecord } from './records.js';
import { renderSummary, renderRecords, renderReports, showPopup, hidePopup } from './ui.js';

function init() {
    renderSummary();
    renderRecords();

    document.getElementById('add-expense-btn').addEventListener('click', () => showPopup('expense'));
    document.getElementById('add-income-btn').addEventListener('click', () => showPopup('income'));

    document.getElementById('popup-cancel').addEventListener('click', hidePopup);
    document.getElementById('popup-save').addEventListener('click', () => {
        const type = document.getElementById('popup-type').value;
        const category = document.getElementById('popup-category').value;
        const amount = parseFloat(document.getElementById('popup-amount').value);
        const date = document.getElementById('popup-date').value;

        if (!amount || !category || !date) {
            alert('Fill all fields');
            return;
        }

        addRecord(type, category, amount, date);
        hidePopup();
        renderSummary();
        renderRecords();
    });

    document.getElementById('apply-filters-btn').addEventListener('click', () => {
        const year = document.getElementById('filter-year').value;
        const month = document.getElementById('filter-month').value;
        // console.log(year, month);
        renderRecords(year, month);
    });

    document.getElementById('show-reports-btn').addEventListener('click', () => {
        let reportButton = document.getElementById('show-reports-btn');
        if (reportButton.innerText === 'Show Reports') {
            reportButton.innerText = 'Hide Reports';
            const year = document.getElementById('report-year').value;
            renderReports(year);
            document.getElementById('reports-section').style.display = 'block';
        } else {
            reportButton.innerText = 'Show Reports';
            document.getElementById('reports-section').style.display = 'none';
        }

    });
}

init();
