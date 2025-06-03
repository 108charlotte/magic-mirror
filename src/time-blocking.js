import './popup-style.scss'
const PATH = '/magic-mirror/'

document.addEventListener("DOMContentLoaded", () => {
    var alarmButton = document.getElementById("alarm")
    var eventButton = document.getElementById("event")
    var focusButton = document.getElementById("schedule-focus")
    var resetButton = document.getElementById("reset-table")
    var viewTomorrow = document.getElementById("view-tomorrow")
    var viewToday = document.getElementById("view-today")

    var currDay = "today"

    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    loadTableData()
    sortTableByStartTime()
    highlightOverlaps()

    scheduleMidnightRollover()

    viewTomorrow.addEventListener('click', function(event) {
        currDay = "tomorrow"
        filterRowsByDay()
    })

    viewToday.addEventListener('click', function(event) {
        currDay = "today"
        filterRowsByDay()
    })

    function filterRowsByDay() {
        for (let row of scheduleTable.rows) {
            if (row.classList.contains(currDay)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
        updateTableRounding()
    }

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

            const classes1 = {
                isAlarmRow: true, 
                isToday: currDay === "today",
                isTomorrow: currDay === "tomorrow",
            }

            addNewRow(time + " AM", addMinsToTime(time, 30), "Wake up, brush teeth, walk", classes1)

            const classes2 = {
                isAlarmRow: true, 
                isToday: currDay === "today",
                isTomorrow: currDay === "tomorrow",
            }

            addNewRow(addMinsToTime(time, 45), addMinsToTime(time, 75), "Breakfast", classes2)

            sortTableByStartTime()
            saveTableData()
        })
    }
    window.alarmListenerAdded = true

    eventButton.addEventListener('click', function() {
        fetch(PATH + 'popup-with-dropdown.html')
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
                    let startTime = document.getElementById('start-time').value.replace(/\s?(AM|PM)$/i, "")

                    const startTimeAMPM = document.getElementById("start-time-am-pm-dropdown")
                    const endTimeAMPM = document.getElementById("end-time-am-pm-dropdown")

                    if (startTime.length == 1) {
                        startTime += ":00"
                    }

                    const type = document.getElementById('dropdown').value
                    const endTimeInput = document.getElementById('end-time-input').value;
                    const endTimeAMPMValue = endTimeAMPM ? endTimeAMPM.value : "";
                    let endTimeValue = endTimeInput + (endTimeAMPMValue ? " " + endTimeAMPMValue : "");
                    const durationValue = document.getElementById('duration-input').value

                    console.log("durationValue: " + durationValue)

                    if (type == "duration-dropdown") {
                        endTimeValue = addMinsToTime(
                            startTime + (startTimeAMPM ? " " + startTimeAMPM.value : ""),
                            durationValue
                        )
                    }

                    let eventClasses = {
                        isToday: currDay === "today",
                        isTomorrow: currDay === "tomorrow",
                    }

                    addNewRow(startTime + (startTimeAMPM ? " " + startTimeAMPM.value : ""), endTimeValue, eventName, eventClasses)

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
        fetch(PATH + 'popup-with-dropdown-focus.html')
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
                    let startTime = document.getElementById('start-time').value.replace(/\s?(AM|PM)$/i, "")
                    if (startTime.length == 1) {
                        startTime += ":00"
                    }
                    const startTimeAMPM = document.getElementById("start-time-am-pm-dropdown")
                    const fullStartTime = startTime + (startTimeAMPM ? " " + startTimeAMPM.value : "")

                    const type = document.getElementById('dropdown').value;
                    const durationValue = document.getElementById('duration-input').value;
                    let endTimeValue = "";

                    if (type == "duration-dropdown") {
                        endTimeValue = addMinsToTime(fullStartTime, durationValue)
                    } else {
                        const endTimeInput = document.getElementById('end-time-input').value
                        const endTimeAMPM = document.getElementById("end-time-am-pm-dropdown")
                        const endTimeAMPMValue = endTimeAMPM ? endTimeAMPM.value : ""
                        endTimeValue = endTimeInput + (endTimeAMPMValue ? " " + endTimeAMPMValue : "")
                    }

                    let focusClasses = {
                        isFocusRow: true,
                        isToday: currDay === "today",
                        isTomorrow: currDay === "tomorrow",
                    }

                    if (objective.length == 0) {
                        alert("Please enter an objective.")
                        return
                    }

                    addNewRow(fullStartTime, endTimeValue, objective, focusClasses)

                    console.log('Focus scheduling form submitted')
                    document.getElementById('popup-modal').style.display = 'none'

                    sortTableByStartTime()
                    saveTableData()
                })
            })
    })

    resetButton.addEventListener('click', function() {
        for (let row of Array.from(scheduleTable.rows)) {
            if (row.classList.contains(currDay)) {
                scheduleTable.deleteRow(row.rowIndex - 1)
            }
        }
        saveTableData()
    })

    function saveTableData() {
        const rows = []; 
        for (let tr of scheduleTable.rows) {
            const cells = Array.from(tr.cells).map(td => td.textContent)
            const isFocusRow = tr.classList.contains('focus-row')
            const isAlarmRow = tr.classList.contains('alarm-row')
            const isToday = tr.classList.contains('today')
            const isTomorrow = tr.classList.contains('tomorrow')
            const isOldEvent = tr.classList.contains('old-event')
            rows.push({cells, isFocusRow, isAlarmRow, isToday, isTomorrow, isOldEvent})
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
            if (rowData.isFocusRow) row.classList.add('focus-row')
        if (rowData.isAlarmRow) row.classList.add('alarm-row')
        if (rowData.isToday) row.classList.add('today')
        if (rowData.isTomorrow) row.classList.add('tomorrow')
        if (rowData.isOldEvent) row.classList.add('old-event')
            changeVals(row)
        }

        for (let row of scheduleTable.rows) {
            addTrashcans(row)
        }

        filterRowsByDay()
    }

    function sortTableByStartTime() {
        let rows = Array.from(scheduleTable.rows)
        rows.sort((a, b) => {
            const timeA = timeStrToMins(a.cells[0].textContent)
            const timeB = timeStrToMins(b.cells[0].textContent)
            return timeA - timeB
        })
        scheduleTable.innerHTML = ''
        for (let row of rows) {
            scheduleTable.appendChild(row)
        }
        highlightOverlaps()
    }

    function highlightOverlaps() {
        const dayRows = Array.from(scheduleTable.rows)
            .filter(row => row.classList.contains(currDay))
            .sort((a, b) => timeStrToMins(a.cells[0].textContent) - timeStrToMins(b.cells[0].textContent))

        for (let row of dayRows) {
            row.classList.remove('overlap')
        }

        for (let i = 0; i < dayRows.length; i++) {
            const row1 = dayRows[i]
            const start1 = timeStrToMins(row1.cells[0].textContent)
            const end1 = timeStrToMins(row1.cells[1].textContent)

            for (let j = 0; j < dayRows.length; j++) {
                if (i === j) continue
                const row2 = dayRows[j]
                const start2 = timeStrToMins(row2.cells[0].textContent)
                const end2 = timeStrToMins(row2.cells[1].textContent)

                if (start1 < end2 && start2 < end1) {
                    row1.classList.add('overlap')
                    row2.classList.add('overlap')
                }
            }
        }
    }

    // updates which row has the tag for being the last row, important for css rounding to make the bottom of the table rounded like the top
    function updateTableRounding() {
        for (let row of scheduleTable.rows) {
            row.classList.remove('last-visible-row');
        }
        
        // makes sure its only checking today or tomorrow/whatever ur on
        const visibleRows = Array.from(scheduleTable.rows).filter(row => row.style.display !== 'none');
        if (visibleRows.length > 0) {
            visibleRows[visibleRows.length - 1].classList.add('last-visible-row');
        }
    }

    function addMinsToTime(timeStr, minsToAdd) {
        let formatted = timeStr.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/)
        if (!formatted) return timeStr

        let h = parseInt(formatted[1], 10)
        let m = parseInt(formatted[2], 10)
        let ampm = formatted[3]

        if (ampm === "AM" && h === 12) h = 0
        if (ampm === "PM" && h < 12) h += 12
        let totalMins = h * 60 + m + Number(minsToAdd)

        totalMins = ((totalMins % 1440) + 1440) % 1440

        let newH = Math.floor(totalMins / 60);
        let newM = totalMins % 60;
        let newAMPM = newH >= 12 ? "PM" : "AM";
        if (newH === 0) newH = 12;
        else if (newH > 12) newH -= 12;

        return `${newH}:${String(newM).padStart(2, "0")} ${newAMPM}`
    }


    // called at midnight, initiates rollover logic from last day to current day
    function newDay() {
        for (let row of Array.from(scheduleTable.rows)) {
            if (row.classList.contains("today")) {
                scheduleTable.deleteRow(row.rowIndex-1)
            }
        }

        for (let row of Array.from(scheduleTable.rows)) {
            if (row.classList.contains('tomorrow')) {
                row.classList.remove('tomorrow');
                row.classList.add('today');
            }
        }

        saveTableData()
        filterRowsByDay()
    }

    function scheduleMidnightRollover() {
        const now = new Date()
        const millisTillMidnight = new Date(
            now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0
        ) - now
        setTimeout(function() {
            newDay()
            setInterval(newDay, 24 * 60 * 60 * 1000)
        }, millisTillMidnight)
    }

    function addNewRow(startTime, endTime, description, {
        isFocusRow = false,
        isAlarmRow = false,
        isToday = false,
        isTomorrow = false,
        isOldEvent = false} = {}) {

        var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]
        var row = scheduleTable.insertRow()

        row.insertCell(0).textContent = startTime
        row.insertCell(1).textContent = endTime
        row.insertCell(2).textContent = description

        addTrashcans(row)

        if (isFocusRow) row.classList.add('focus-row')
        if (isAlarmRow) row.classList.add('alarm-row')
        if (isToday) row.classList.add('today')
        if (isTomorrow) row.classList.add('tomorrow')
        if (isOldEvent) row.classList.add('old-event')

        changeVals(row)
        updateTableRounding()
        return row
    }

    function addTrashcans(row) {
        let imgCell = row.cells[3] ? row.cells[3] : row.insertCell(3)

        let img = document.createElement("img")
        img.src = PATH + "assets/trash-can-icon.svg"
        img.style.width = "1.5em"
        img.style.height = "1.5em"

        imgCell.appendChild(img)

        img.addEventListener('click', function() {
            const rowIndex = Array.from(row.parentNode.rows).indexOf(row)
            scheduleTable.deleteRow(rowIndex)
            saveTableData()
        })
    }
})

export function greyoutPastEvents(currTime) {
    const mins = currTime.getHours() * 60 + currTime.getMinutes()

    // shouldn't cause any issues since its inside of index.js's DOMContentLoaded
    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]

    for (let row of scheduleTable.rows) {
        let endTime = row.cells[1]?.textContent

        if (!endTime) {
            row.classList.remove("old-event")
            continue
        }
        
        // convert everything to minutes so i can compare directly
        const endMins = timeStrToMins(endTime)
        if (isNaN(endMins)) {
            row.classList.remove("old-event")
            continue
        }

        if (mins >= endMins && !row.classList.contains("tomorrow")) {
            row.classList.add("old-event")
        } else {
            row.classList.remove("old-event")
        }
    }
}

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
}

function timeStrToMins(str) {
    if (!str) return NaN
    str = str.trim().toUpperCase()
    const formatted = str.match(/^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i)
    if (!formatted) return NaN
    let h = parseInt(formatted[1], 10)
    let m = parseInt(formatted[2], 10)
    let ampm = formatted[3]
    if (ampm === "AM" && h === 12) h = 0;
    if (ampm === "PM" && h < 12) h += 12
    return h * 60 + m;
}