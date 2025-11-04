const button = document.getElementById("fetch-button");
const clickCountEl = document.getElementById("click-count");
const resultsEl = document.getElementById("results");

let clickCount = 0;
let apiQueue = [];
let activeCalls = 0;
let lastResetTime = Date.now();

// Function to fetch data from API
const fetchData = () => {
  return fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(res => res.json())
    .then(data => {
      const div = document.createElement("div");
      div.textContent = `ID: ${data.id}, Title: ${data.title}, Completed: ${data.completed}`;
      resultsEl.appendChild(div);
    });
};

// Rate limiter function
const rateLimiter = () => {
  const now = Date.now();

  // Reset click count every 10 seconds
  if (now - lastResetTime > 10000) {
    clickCount = 0;
    clickCountEl.textContent = "0";
    lastResetTime = now;
  }

  // If more than 5 clicks in 10 seconds, delay next batch
  if (clickCount >= 5) {
    alert("Too many API calls. Please wait and try again.");
    return;
  }

  clickCount++;
  clickCountEl.textContent = clickCount;

  apiQueue.push(fetchData);
};

// Execute up to 5 API calls per second
setInterval(() => {
  if (apiQueue.length > 0 && activeCalls < 5) {
    const task = apiQueue.shift();
    activeCalls++;
    task().finally(() => activeCalls--);
  }
}, 200);

// Reset click count after 10 seconds
setInterval(() => {
  clickCount = 0;
  clickCountEl.textContent = "0";
}, 10000);

// Button click
button.addEventListener("click", rateLimiter);
