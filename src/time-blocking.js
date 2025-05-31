document.addEventListener("DOMContentLoaded", () => {
    var alarmButton = document.getElementById("alarm")
    var eventButton = document.getElementById("event")
    var focusButton = document.getElementById("schedule-focus")
    var resetButton = document.getElementById("reset-table")

    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    loadTableData()

    alarmButton.addEventListener('click', function() {
        var time = parseInt(prompt("What time are you waking up? "))
        while (time == null) {
            alert("Please enter a valid integer. ")
            time = parseInt(prompt("What time are you waking up? "))
        }
        if (time) {
            var row = scheduleTable.insertRow(); 
            switch (time) {
                case "5": 
                    row.insertCell(0).textContent = "5:00"
                    break; 
                case "4": 
                    row.insertCell(0).textContent = "4:00"
                    break; 
                default: 
                    row.insertCell(0).textContent = time; 
            }
            row.insertCell(1).textContent = "Wake up"
            saveTableData(); 
        }
    })

    eventButton.addEventListener('click', function() {
        
    })

    focusButton.addEventListener('click', function() {
        
    })

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('scheduleTable')
        scheduleTable.innerHTML = ''
    })

    function saveTableData() {
        const rows = []; 
        for (let tr of scheduleTable.rows) {
            const cells = Array.from(tr.cells).map(td => td.textContent); 
            rows.push(cells); 
        }
        localStorage.setItem('scheduleTable', JSON.stringify(rows)); 
    }

    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('scheduleTable') || '[]');
        for (let rowData of data) {
            const row = scheduleTable.insertRow();
            for (let cellData of rowData) {
                row.insertCell().textContent = cellData;
            }
        }
    }
})