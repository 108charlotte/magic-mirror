import './popup-style.scss'

document.addEventListener("DOMContentLoaded", () => {
    var alarmButton = document.getElementById("alarm")
    var eventButton = document.getElementById("event")
    var focusButton = document.getElementById("schedule-focus")
    var resetButton = document.getElementById("reset-table")

    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    loadTableData()
    sortTableByStartTime()
    if (!window.alarmListenerAdded) {
        alarmButton.addEventListener('click', function() {
            console.log("Alarm button clicked")
            const timePattern = /^\d{1,2}(:[0-5]\d)?$/
            let time
            while (true) {
                time = prompt("What time are you waking up? ")
                if (time === null) return
                if (timePattern.test(time.trim())) break
                alert("Please enter a valid time in H:MM format (e.g., 7:30 or 7).")
            }
            if (time.length == 1) {
                time += ":00"
            }
            var row = scheduleTable.insertRow()
            row.insertCell(0).textContent = time
            row.insertCell(1).textContent = addMinsToTime(time, 30)
            row.insertCell(2).textContent = "Wake up, brush teeth, walk"

            // sets up ability to change row values
            changeVals(row)
            row.classList.add('alarm-row')

            var row2 = scheduleTable.insertRow()
            row2.insertCell(0).textContent = addMinsToTime(time, 45)
            row2.insertCell(1).textContent = addMinsToTime(time, 75)
            row2.insertCell(2).textContent = "Breakfast"

            changeVals(row2)
            row2.classList.add('alarm-row')

            sortTableByStartTime()
            saveTableData()
        })
    }
    window.alarmListenerAdded = true

    eventButton.addEventListener('click', function() {
        fetch('/popup-with-dropdown.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('popup-content').innerHTML = html + '<button id="close-popup" style="position:absolute; top:10px; right:10px;">X</button>'
                document.getElementById('popup-modal').style.display = 'flex'
                document.getElementById('close-popup').onclick = function() {
                    document.getElementById('popup-modal').style.display = 'none'
                }

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

                    changeVals(row)

                    console.log('Event addition form submitted')
                    document.getElementById('popup-modal').style.display = 'none'

                    sortTableByStartTime()
                    saveTableData()
                })
            })
    })

    function changeVals(row) {

        function changeVal(cell) {
            if (cell.querySelector('input')) return

            const currVal = cell.textContent
            const input = document.createElement('input')
            input.type = 'text'
            input.value = currVal
            input.style.width = '4em'
            cell.textContent = ''
            cell.appendChild(input)
            input.focus()

            function save() {
                cell.textContent = input.value
                sortTableByStartTime()
                saveTableData()
            }

            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    save()
                } else if (e.key === 'Escape') {
                    cell.textContent = currVal
                }
            })
            input.addEventListener('blur', save)
        }

        var startTimeCell = row.cells[0]
        var endTimeCell = row.cells[1]
        var eventNameCell = row.cells[2]
        startTimeCell.addEventListener('click', function() { changeVal(startTimeCell) })
        endTimeCell.addEventListener('click', function() { changeVal(endTimeCell) })
        eventNameCell.addEventListener('click', function() { changeVal(eventNameCell) })
    }

    focusButton.addEventListener('click', function() {
        fetch('/popup-with-dropdown-focus.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('popup-content').innerHTML = html + '<button id="close-popup" style="position:absolute; top:10px; right:10px;">X</button>'
                document.getElementById('popup-modal').style.display = 'flex'
                document.getElementById('close-popup').onclick = function() {
                    document.getElementById('popup-modal').style.display = 'none'
                }

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
                    
                    const objective = document.getElementById('objective').value
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

                    row.classList.add('focus-row')

                    row.insertCell(0).textContent = startTime
                    row.insertCell(1).textContent = endTimeValue
                    row.insertCell(2).textContent = objective

                    changeVals(row)

                    console.log('Focus scheduling form submitted')
                    document.getElementById('popup-modal').style.display = 'none'

                    sortTableByStartTime()
                    saveTableData()
                })
            })
    })

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('scheduleTable')
        scheduleTable.innerHTML = ''
    })

    function saveTableData() {
        const rows = []; 
        for (let tr of scheduleTable.rows) {
            const cells = Array.from(tr.cells).map(td => td.textContent)
            const isFocusRow = tr.classList.contains('focus-row')
            const isAlarmRow = tr.classList.contains('alarm-row')
            rows.push({cells, isFocusRow, isAlarmRow})
        }
        localStorage.setItem('scheduleTable', JSON.stringify(rows))
    }

    function loadTableData() {
        scheduleTable.innerHTML = ''
        const data = JSON.parse(localStorage.getItem('scheduleTable') || '[]')
        for (let rowData of data) {
            const row = scheduleTable.insertRow()
            for (let cellData of rowData.cells) {
                row.insertCell().textContent = cellData
            }
            if (rowData.isFocusRow) {
                row.classList.add('focus-row')
            }
            if (rowData.isAlarmRow) {
                row.classList.add('alarm-row')
            }
            changeVals(row)
        }
    }

    function sortTableByStartTime() {
        let rows = Array.from(scheduleTable.rows)
        rows.sort((a, b) => {
            const timeA = a.cells[0].textContent.padStart(5, '0')
            const timeB = b.cells[0].textContent.padStart(5, '0')
            return timeA.localeCompare(timeB)
        })
        scheduleTable.innerHTML = ''
        for (let row of rows) {
            scheduleTable.appendChild(row)
        }
        highlightOverlaps()
    }

    function highlightOverlaps() {
        let prevEndTime = null
        for (let row of scheduleTable.rows) {
            row.classList.remove('overlap')
            const startTime = row.cells[0].textContent
            const endTime = row.cells[1].textContent
            if (prevEndTime && compareTimes(startTime, prevEndTime) < 0) {
                row.classList.add('overlap')
            }
            prevEndTime = endTime
        }
    }

    function compareTimes(a, b) {
        const [ha, ma] = a.split(':').map(Number);
        const [hb, mb] = b.split(':').map(Number);
        return (ha * 60 + ma) - (hb * 60 + mb);
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

export function highlightCurrentEvent(currTime) {
    const mins = currTime.getHours() * 60 + currTime.getMinutes()

    // shouldn't cause any issues since its inside of index.js's DOMContentLoaded
    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    for (let row of scheduleTable.rows) {
        var startTime = row.cells[0].textContent
        var endTime = row.cells[1].textContent
        
        // convert everything to minutes so i can compare directly
        const startMins = timeStrToMins(startTime)
        const endMins = timeStrToMins(endTime)

        if (mins >= startMins && mins < endMins) {
            row.classList.add("current-event")
        } else {
            row.classList.remove("current-event")
        }
    }

    function timeStrToMins(str) {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
    }
}