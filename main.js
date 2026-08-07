
const DRILLS = {
  footwork: {
    title: '6-Point Footwork Mastery',
    time: 15,
    tag: 'Footwork',
    videoUrl: 'https://www.youtube.com/embed/1C_J3I92L-g',
    desc: 'Master split-step timing and smooth court coverage to all 6 corners.'
  },
  smash: {
    title: 'Forehand Smash Technique',
    time: 20,
    tag: 'Power',
    videoUrl: 'https://www.youtube.com/embed/9BqM2B_8CjE',
    desc: 'Learn wrist pronation, contact point height, and jump smash angles.'
  },
  drop: {
    title: 'Spinning Net Drop Control',
    time: 10,
    tag: 'Net Control',
    videoUrl: 'https://www.youtube.com/embed/B1uM1Q2UaUQ',
    desc: 'Precision net slicing techniques to make the shuttle tumble over the tape.'
  },
  grip: {
    title: 'Grip Switching Drills',
    time: 10,
    tag: 'Basics',
    videoUrl: 'https://www.youtube.com/embed/3LqT3-d9S_A',
    desc: 'Practice rapid thumb-position transitions between forehand and backhand.'
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let calendarData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

let activeDay = 'Monday';

document.addEventListener('DOMContentLoaded', () => {
  renderCalendarGrid();
  renderDayAgenda(activeDay);
});

function addDrillToCalendar() {
  const day = document.getElementById('scheduleDay').value;
  const drillKey = document.getElementById('scheduleDrill').value;
  const drillObj = DRILLS[drillKey];

  const newTask = {
    id: 'task_' + Date.now(),
    drillKey: drillKey,
    title: drillObj.title,
    time: drillObj.time,
    completed: false
  };

  calendarData[day].push(newTask);
  
  activeDay = day;

  renderCalendarGrid();
  renderDayAgenda(activeDay);
}

function renderCalendarGrid() {
  const gridContainer = document.getElementById('calendar-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  DAYS.forEach(day => {
    const dayTasks = calendarData[day];
    const isSelected = day === activeDay;
    const completedCount = dayTasks.filter(t => t.completed).length;

    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg';

    col.innerHTML = `
      <div class="card h-100 rounded-0 border p-3 calendar-day-card ${isSelected ? 'border-danger bg-light shadow-sm' : 'bg-white'}" onclick="selectDay('${day}')">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="fw-bold mb-0 ${isSelected ? 'text-danger' : ''}">${day}</h6>
          <span class="badge ${dayTasks.length > 0 ? 'bg-dark' : 'bg-secondary'} small">${dayTasks.length}</span>
        </div>
        
        <div class="calendar-task-preview mb-2">
          ${dayTasks.length === 0 ? '<span class="text-muted extra-small">Rest Day</span>' : ''}
          ${dayTasks.map(t => `
            <div class="task-pill small text-truncate ${t.completed ? 'text-decoration-line-through text-success' : ''}">
              • ${t.title}
            </div>
          `).join('')}
        </div>

        ${dayTasks.length > 0 ? `
          <div class="mt-auto pt-2 border-top extra-small text-muted d-flex justify-content-between">
            <span>Progress:</span>
            <span class="fw-bold text-dark">${completedCount}/${dayTasks.length} Done</span>
          </div>
        ` : ''}
      </div>
    `;

    gridContainer.appendChild(col);
  });
}

function selectDay(day) {
  activeDay = day;
  renderCalendarGrid();
  renderDayAgenda(activeDay);
}

function renderDayAgenda(day) {
  const dayTitle = document.getElementById('selected-day-title');
  const taskList = document.getElementById('day-task-list');
  const videoContainer = document.getElementById('day-video-container');
  const progressBar = document.getElementById('day-progress-bar');
  const percentText = document.getElementById('day-progress-percent');

  if (!taskList) return;

  if (dayTitle) dayTitle.textContent = `${day}'s Practice Agenda`;

  const tasks = calendarData[day];
  taskList.innerHTML = '';
  videoContainer.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <li class="list-group-item text-muted text-center py-4 rounded-0 bg-light">
        No practice sessions scheduled for ${day}. Use the form above to add drills to this day!
      </li>`;
    if (progressBar) progressBar.style.width = '0%';
    if (percentText) percentText.textContent = '0%';
    return;
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedTasks / tasks.length) * 100);

  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (percentText) percentText.textContent = `${percentage}%`;

  // Render Task Items
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center p-3 rounded-0 cursor-pointer ${task.completed ? 'completed-task bg-light' : ''}`;
    li.onclick = () => toggleTaskComplete(task.id);

    li.innerHTML = `
      <div class="d-flex align-items-center">
        <input class="form-check-input me-3 rounded-0" type="checkbox" ${task.completed ? 'checked' : ''}>
        <div>
          <span class="fw-bold ${task.completed ? 'text-decoration-line-through text-muted' : ''}">${task.title}</span>
          <span class="badge bg-danger ms-2">${task.time} mins</span>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger rounded-0" onclick="deleteTask('${task.id}', event)">Delete</button>
    `;
    taskList.appendChild(li);
  });

  // Render matching unique videos for scheduled tasks
  const uniqueDrillKeys = [...new Set(tasks.map(t => t.drillKey))];

  uniqueDrillKeys.forEach(key => {
    const drill = DRILLS[key];
    const isDrillDone = tasks.filter(t => t.drillKey === key).every(t => t.completed);

    const videoCol = document.createElement('div');
    videoCol.className = 'col-md-6';
    videoCol.innerHTML = `
      <div class="card h-100 border rounded-0 overflow-hidden shadow-sm ${isDrillDone ? 'border-success' : ''}">
        <div class="ratio ratio-16x9">
          <iframe src="${drill.videoUrl}" title="${drill.title}" allowfullscreen></iframe>
        </div>
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-danger">${drill.tag}</span>
            ${isDrillDone ? '<span class="badge bg-success">✓ Completed for Today</span>' : ''}
          </div>
          <h5 class="fw-bold mb-1">${drill.title}</h5>
          <p class="small text-muted mb-0">${drill.desc}</p>
        </div>
      </div>
    `;
    videoContainer.appendChild(videoCol);
  });
}

function toggleTaskComplete(taskId) {
  const task = calendarData[activeDay].find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
  }
  renderCalendarGrid();
  renderDayAgenda(activeDay);
}

function deleteTask(taskId, event) {
  event.stopPropagation();
  calendarData[activeDay] = calendarData[activeDay].filter(t => t.id !== taskId);
  renderCalendarGrid();
  renderDayAgenda(activeDay);
}