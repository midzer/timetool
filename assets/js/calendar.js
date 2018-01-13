// Calendar
var cal = document.querySelector('#calendar');
var template = document.querySelector('#day-card');
var clone = document.importNode(template.content, true);

function pad(n) {
  var n_ = n.toString();
  return new Array(3 - n_.length).join('0') + n_;
}

function iso8601(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function renderMonth(date) {
  var day = date;
  var columns = document.createElement('div');
  columns.className = 'columns is-multiline';
  var daysInMonth = new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
  
  for (var i = 1; i <= daysInMonth; i++) {
    var dayClone = clone.cloneNode(true);
    dayClone.querySelector(".card-header-title").innerHTML = iso8601(day);
    columns.appendChild(dayClone);
    day = new Date(day);
    day.setDate(day.getDate() + 1);
  }
  return columns;
}

  
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

var prev = document.createElement('button');
prev.className = 'button prev is-large is-pulled-left';
prev.setAttribute('aria-label', 'Previous month');
var next = document.createElement('button');
next.className = 'button next is-large is-pulled-right';
next.setAttribute('aria-label', 'Next month');
var monthyear = document.createElement('span');
monthyear.className = 'monthyear is-size-3 has-text-centered has-text-weight-bold';
var monthHeader = document.createElement('div');
monthHeader.className = "is-flex"
monthHeader.appendChild(prev);
monthHeader.appendChild(monthyear);
monthHeader.appendChild(next);
cal.appendChild(monthHeader);

cal.year = function () {return cal.getAttribute('year') ? parseInt(cal.getAttribute('year'), 10) : null;};
cal.month = function () {return cal.getAttribute('month') ? parseInt(cal.getAttribute('month'), 10) : null;};
//table.findCell = function (date) {return cal.querySelector('[date="' + iso8601(date) + '"]');};

var months = []; // cache
cal.changeMonth = function (date) {
  //var now = new Date();
  //var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var year = date.getFullYear();
  var month = date.getMonth();
  monthyear.innerHTML = monthNames[month] + ' ' + year;

  cal.setAttribute('year', year);
  cal.setAttribute('month', month + 1);

  // Remove old month first if necessary
  if (cal.childElementCount === 2) {
      cal.removeChild(cal.lastChild);
  }
  // If this month has already been rendered in the cache, use it.
  var tr = months[iso8601(date)];
  if (!tr) {
    // Render
    tr = renderMonth(date);
    months[iso8601(date)] = tr;
  }

  // Either way, we need to run through each day and set some classes.
  //for (var i = 0; i < tr.children.length; i++) {
  //  tr.children[i].className = tr.children[i].getAttribute('month') == month + 1 ? 'current' : 'extra'
  //  tr.children[i].className += tr.children[i].getAttribute('date') === iso8601(today) ? ' today' : ''
  //}
  cal.appendChild(tr);
};

prev.addEventListener('click', function () {
  cal.changeMonth(new Date(cal.year() - (cal.month() === 1  ? 1 : 0), cal.month() === 1 ? 11 : cal.month() - 2, 1));
});
next.addEventListener('click', function () {
  cal.changeMonth(new Date(cal.year() + (cal.month() === 12 ? 1 : 0), cal.month() === 12 ? 0 : cal.month(), 1));
});

var date = new Date();
cal.changeMonth(new Date(date.getFullYear(), date.getMonth(), 1));

function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

query(".show-btn").forEach(function(item) {
  item.onclick = function() {
    this.classList.add('is-hidden');
    this.nextElementSibling.classList.remove('is-hidden');
    this.parentElement.nextElementSibling.classList.remove('is-hidden');
  }
});
