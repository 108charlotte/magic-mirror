import './popup-style.scss';

document.addEventListener("DOMContentLoaded", () => {
    var alarmButton = document.getElementById("alarm")
    var eventButton = document.getElementById("event")
    var focusButton = document.getElementById("schedule-focus")
    var resetButton = document.getElementById("reset-table")

    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    loadTableData()

    alarmButton.addEventListener('click', function() {
        var time = prompt("What time are you waking up? ")
        while (parseInt(time) == null) {
            alert("Please enter a valid integer. ")
            time = prompt("What time are you waking up? ")
        }
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
    })

    eventButton.addEventListener('click', function() {
        fetch('/popup-with-dropdown.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('popup-content').innerHTML = html + '<button id="close-popup" style="position:absolute; top:10px; right:10px;">X</button>';
                document.getElementById('popup-modal').style.display = 'flex';
                document.getElementById('close-popup').onclick = function() {
                    document.getElementById('popup-modal').style.display = 'none';
                };

                const select = document.getElementById("dropdown");
                const durationBlock = document.getElementById("duration");
                const endtimeBlock = document.getElementById("end-time");

                select.addEventListener('change', function() {
                    if (select.value === 'duration-dropdown') {
                        durationBlock.style.display = '';
                        endtimeBlock.style.display = 'none';
                    } else if (select.value === 'endtime-dropdown') {
                        durationBlock.style.display = 'none';
                        endtimeBlock.style.display = '';
                    }
                })
            })
    })

    focusButton.addEventListener('click', function() {
        
    })

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('scheduleTable')
        scheduleTable.innerHTML = ''
    })
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