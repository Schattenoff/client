let modalEvent = document.getElementById("myModalEvent");
let modalTitle = document.getElementsByClassName("modal-titleEvent")[0];
let dayBtn = document.getElementById("dayBtn");
let modalConfirm = document.getElementById("myModalConfirm");
let fnEvent = onLoadEvents();

function openModal(i, month, year) {
  modalEvent.style.display = "block";
  modalTitle.innerHTML = `${helper.createNumber(i)}.${helper.createNumber(month)}.${year}`;
  fnEvent(`${helper.createNumber(i)}.${helper.createNumber(month)}.${year}`);
}

function closeModal() {
  modalEvent.style.display = "none";
  document.getElementsByClassName("container_events")[0].innerHTML = "";
}

function onLoadEvents() {
  let temp = null;
  return function(data = temp){ 
    if(temp == null) {
      temp = data
    }
    else temp = data;
    fetch('https://calendar-server-test.herokuapp.com/events', {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(result => {
      for(let i = 0; i < result.length; i++){
      if(result[i].date == data) {
        document.getElementsByClassName("container_events")[0].innerHTML += `<div class="event" id="event_${i}" onclick="openDescription(${i});">${result[i].title}<div class="event_description" id="event_description_${i}">${result[i].description}</div><span id="${i}" class="delete" onclick="openConfirm(${i});">&times;</span></div>`
      }
    }
  })
    return temp;
  }
}

function openDescription(id) {
  let description = document.getElementById(`event_description_${id}`);
  let event = document.getElementById(`event_${id}`);
  if (event.style.height == '60px') {
    event.style.height = '40px';
    description.style.display = 'none';
  } else {
    event.style.height = '60px';
    description.style.display = 'inline';
  }
}

function openConfirm(id) {
  modalConfirm.style.display = "block";
  let initButtons = modalConfirm.getElementsByClassName('initButtons')[0];
  initButtons.innerHTML += `<button class="btn yes" onclick="onDeleteEvent(${id})">Yes</button>`;
  initButtons.innerHTML += `<button class="btn no" onclick="closeConfirm()">No</button>`;
}

function closeConfirm() {
  modalConfirm.style.display = "none";
  let initButtons = modalConfirm.getElementsByClassName('initButtons')[0];
  initButtons.innerHTML = '';
}

function onDeleteEvent(id) {
  fetch('https://calendar-server-test.herokuapp.com/delete-event', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({id})
      })
      .then(res => res.json())
      .then(result => {
      console.log(result)
  })
  document.getElementsByClassName('container_events')[0].remove();
  document.getElementsByClassName('modal-content_event')[0].innerHTML += "<div class='container_events'></div>";
  setTimeout(() => fnEvent(), 100);
  closeConfirm();
  let calendar = new Calendar();
  calendar.renderCalendar();
}







