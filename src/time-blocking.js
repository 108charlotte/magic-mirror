import './popup-style.scss'

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
        if (time.length == 1) {
            time += ":00"
        }
        var row = scheduleTable.insertRow()
        row.insertCell(0).textContent = time
        row.insertCell(1).textContent = addMinsToTime(time, 30)
        row.insertCell(2).textContent = "Wake up, brush teeth, walk"
        saveTableData()
    })

    eventButton.addEventListener('click', function() {
        fetch('/popup-with-dropdown.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('popup-content').innerHTML = html + '<button id="close-popup" style="position:absolute; top:10px; right:10px;">X</button>'
                document.getElementById('popup-modal').style.display = 'flex'
                document.getElementById('close-popup').onclick = function() {
                    document.getElementById('popup-modal').style.display = 'none'
                };

                const select = document.getElementById("dropdown")
                const durationBlock = document.getElementById("duration")
                const endtimeBlock = document.getElementById("end-time")

                select.addEventListener('change', function() {
                    if (select.value === 'duration-dropdown') {
                        durationBlock.style.display = ''
                        endtimeBlock.style.display = 'none'
                    } else if (select.value === 'endtime-dropdown') {
                        durationBlock.style.display = 'none'
                        endtimeBlock.style.display = ''
                    }
                })

                const form = document.querySelector('#popup-content form')
                form.addEventListener('submit', function(event) {
                    event.preventDefault()
                    
                    const eventName = document.getElementById('event-name').value
                    var startTime = document.getElementById('start-time').value

                    if (startTime.length == 1) {
                        startTime += ":00"
                    }

                    const type = document.getElementById('dropdown').value
                    var endTimeValue = document.getElementById('end-time-input').value
                    const durationValue = document.getElementById('duration-input').value

                    console.log("durationValue: " + durationValue)

                    if (type == "duration-dropdown") {
                        endTimeValue = addMinsToTime(startTime, durationValue)
                    }

                    var row = scheduleTable.insertRow()
                    row.insertCell(0).textContent = startTime
                    row.insertCell(1).textContent = endTimeValue
                    row.insertCell(2).textContent = eventName

                    console.log('Event addition form submitted')
                    document.getElementById('popup-modal').style.display = 'none'

                    saveTableData()
                })
            })
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
            const cells = Array.from(tr.cells).map(td => td.textContent)
            rows.push(cells); 
        }
        localStorage.setItem('scheduleTable', JSON.stringify(rows))
    }

    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('scheduleTable') || '[]')
        for (let rowData of data) {
            const row = scheduleTable.insertRow()
            for (let cellData of rowData) {
                row.insertCell().textContent = cellData
            }
        }
    }

    function addMinsToTime(timeStr, minsToAdd) {
        const [hrs, mins] = timeStr.split(":").map(Number)
        if (isNaN(hrs)) hrs = 0
        if (isNaN(mins)) mins = 0

        let addH = 0, addM = 0
        if (typeof minsToAdd === "string" && minsToAdd.includes(":")) {
            [addH, addM] = minsToAdd.split(":").map(Number)
        } else {
            addM = Number(minsToAdd)
        }
        if (isNaN(addH)) addH = 0
        if (isNaN(addM)) addM = 0

        let totalMins = hrs * 60 + mins + addH * 60 + addM
        let newHrs = Math.floor(totalMins / 60)
        let newMins = totalMins % 60

        return `${String(newHrs)}:${String(newMins).padStart(2, "0")}`
    }
})