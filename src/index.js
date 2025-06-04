import './style.scss'
import dateFormat from 'dateformat'
import { highlightCurrentEvent, greyoutPastEvents } from './time-blocking.js'

document.addEventListener('DOMContentLoaded', () => {
  customMessage()
  showDate()
  showTime()
  
  let time = new Date()
  let goalElement = document.getElementById('goal')
  let scheduleTable = document.getElementById('schedule-table')
  let lastTask = null

  setInterval(function() {
    showTime()
    highlightCurrentEvent(time)
    greyoutPastEvents(time)

    // set current task to objective of current focus session, if any
    
    let found = false
    let currentTask = null

    for (let row of scheduleTable.rows) {
      if (row.classList.contains('current-event') && row.classList.contains('focus-row')) {
        currentTask = row.cells[2].textContent
        found = true
        break
      }
    }
    
    // allows new active task button to override timetable objective
    let manualTask = localStorage.getItem('currentGoal');
    if (manualTask && manualTask.length > 0) {
      currentTask = manualTask
    } else {
      for (let row of scheduleTable.rows) {
        if (row.classList.contains('current-event') && row.classList.contains('focus-row')) {
          currentTask = row.cells[2].textContent
          break
        }
      }
      if (!currentTask) currentTask = "No task set"
    }

    // update dom if task changed
    if (goalElement.querySelector('.task-text')?.textContent !== currentTask) {
      goalElement.innerHTML = 'Current Task: <span class="task-text">' + currentTask + '</span>'
      if (lastTask !== currentTask) {
        localStorage.setItem('taskCrossedOff', 'false')
        lastTask = currentTask
      }
    }

    // cross off task if crossed off in localStorage
    let taskSpan = goalElement.querySelector('.task-text')
    let taskCrossedOff = localStorage.getItem('taskCrossedOff')
    if (taskCrossedOff === 'true' && taskSpan && taskSpan.textContent !== "No task set") {
      taskSpan.style.textDecoration = "line-through"
      taskSpan.style.color = "gray"
    } else if (taskSpan) {
      taskSpan.style.textDecoration = "none"
      taskSpan.style.color = "black"
    }
  }, 1000)

  let addTaskButton = document.getElementById('new-task')
  addTaskButton.style.display = "block"
  addTaskButton.textContent = "New Active Task"

  addTaskButton.addEventListener('click', function() {
    let newGoal = prompt("Enter your goal:")
    localStorage.setItem('currentGoal', newGoal ? newGoal : "")
    localStorage.setItem('taskCrossedOff', 'false')
  })

  goalElement.addEventListener('click', function() {
    crossOffTask()
  })
})

function customMessage() {
  let myDate = new Date()
  let hrs = myDate.getHours()
  let mins = myDate.getMinutes()
  let greet

  //   morning |  5:30-11:59
  // afternoon | 12:00-17:59
  //   evening | 18:00-05:29
  if (hrs >= 5 && ((hrs == 5 && mins >= 30) || (hrs > 5 && hrs < 12)))
    greet = 'Good Morning'
  else if (hrs >= 12 && hrs < 18)
    greet = 'Good Afternoon'
  else if ((hrs >= 18 && hrs < 24) || hrs > 0)
    greet = 'Good Evening'
  else
    greet = 'Error'

  document.getElementById('greeting').textContent = greet 
}

function showTime() {
    let date = new Date()
    let formattedTime = dateFormat(date, "h:MM:ss TT")
    document.getElementById('hours').textContent = dateFormat(date, "h")
    document.getElementById('minutes').textContent = dateFormat(date, "MM")
    document.getElementById('seconds').textContent = dateFormat(date, "ss")
    document.getElementById('am-pm').textContent = dateFormat(date, "TT")
}

function showDate() {
    let now = new Date();
    let formattedDate = dateFormat(now, "dddd, mmmm dS, yyyy");
    document.getElementById('date').textContent = "Current Date: " + formattedDate;
}

function crossOffTask() {
  let taskSpan = document.querySelector('#goal .task-text')
  if (!taskSpan) return
  if (taskSpan.style.textDecoration === "line-through") {
    taskSpan.style.textDecoration = "none"
    taskSpan.style.color = "black"
    localStorage.setItem('taskCrossedOff', 'false')
  } else if (taskSpan.textContent !== "No task set") {
    taskSpan.style.textDecoration = "line-through"
    taskSpan.style.color = "gray"
    localStorage.setItem('taskCrossedOff', 'true')
  } else {
    alert("Please set a task first.")
  }
}