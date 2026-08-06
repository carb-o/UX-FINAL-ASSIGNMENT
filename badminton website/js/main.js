document.addEventListener("DOMContentLoaded", function () {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (navbarPlaceholder) {
    navbarPlaceholder.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
        <div class="container position-relative">
          <a class="navbar-brand fw-bold fs-3 text-dark tracking-wide mb-0" href="index.html">
            SHUTTLE<span class="text-danger">CRAFT</span>
          </a>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul class="navbar-nav fw-bold text-uppercase fs-6 align-items-center">
              <li class="nav-item"><a class="nav-link nav-hover text-dark px-3" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link nav-hover text-dark px-3" href="gear-guide.html">Gear Guide</a></li>
              <li class="nav-item"><a class="nav-link nav-hover text-dark px-3" href="improve.html">How to Improve</a></li>
              <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
                <a class="nav-link nav-community-pill fw-bold px-3" href="join.html">JOIN OUR COMMUNITY</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = navbarPlaceholder.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        if (link.classList.contains("nav-community-pill")) {
          link.classList.add("active");
        } else {
          link.classList.add("active", "text-danger");
          link.classList.remove("text-dark");
        }
      }
    });
  }
});

let selectedDrills = [];

function toggleDrill(id, name, time) {
  const index = selectedDrills.findIndex(d => d.id === id);
  const btn = document.getElementById(`btn-${id}`);

  if (index === -1) {
    selectedDrills.push({ id: id, name: name, time: time });
    if (btn) {
      btn.classList.remove('btn-outline-dark');
      btn.classList.add('btn-danger');
      btn.textContent = `✓ ${name} (${time} mins)`;
    }
  } else {
    selectedDrills.splice(index, 1);
    if (btn) {
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-outline-dark');
      btn.textContent = `+ ${name} (${time} mins)`;
    }
  }

  updateRoutineUI();
}

function removeDrill(id) {
  const drillObj = selectedDrills.find(d => d.id === id);
  if (drillObj) {
    toggleDrill(id, drillObj.name, drillObj.time);
  }
}

function updateRoutineUI() {
  const routineList = document.getElementById('routine-list');
  const totalTimeEl = document.getElementById('total-time');
  const videoStatusText = document.getElementById('video-status-text');

  if (!routineList) return;

  routineList.innerHTML = '';
  let totalTime = 0;

  if (selectedDrills.length === 0) {
    routineList.innerHTML = `<li class="list-group-item text-muted small px-0">No drills selected yet. Click any button on the left to add drills!</li>`;
    if (videoStatusText) {
      videoStatusText.textContent = "Select topics above to load corresponding video tutorials.";
    }
  } else {
    if (videoStatusText) {
      videoStatusText.textContent = "Showing video tutorials for your selected topics below:";
    }

    selectedDrills.forEach(drill => {
      totalTime += drill.time;
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent';
      li.innerHTML = `
        <div>
          <span class="fw-semibold">${drill.name}</span>
          <span class="badge bg-danger rounded-pill ms-2">${drill.time} mins</span>
        </div>
        <button class="btn btn-sm btn-outline-danger py-0 px-2 rounded-0" onclick="removeDrill('${drill.id}')">Remove</button>
      `;
      routineList.appendChild(li);
    });
  }

  if (totalTimeEl) {
    totalTimeEl.textContent = totalTime;
  }

  const allVideoCards = document.querySelectorAll('.drill-video');
  allVideoCards.forEach(card => card.classList.add('d-none'));

  selectedDrills.forEach(drill => {
    const videoCard = document.getElementById(`video-${drill.id}`);
    if (videoCard) {
      videoCard.classList.remove('d-none');
    }
  });
}