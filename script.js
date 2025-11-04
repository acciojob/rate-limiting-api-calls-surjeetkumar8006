const fetchBtn = document.getElementById("fetchBtn");
const countDisplay = document.getElementById("count");
const resultsDiv = document.getElementById("results");

let clickCount = 0;
let callQueue = [];
let lastResetTime = Date.now();
let isProcessing = false;

// Function to fetch and display API data
async function fetchData() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();

    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Title:</strong> ${data.title}</p>
      <p><strong>Completed:</strong> ${data.completed}</p>
    `;
    resultsDiv.appendChild(item);
  } catch (err) {
    console.error("API Error:", err);
  }
}

// Rate limiter function to process at most 5 requests per 10 seconds
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (callQueue.length > 0) {
    const batch = callQueue.splice(0, 5); // Take 5 requests at a time
    await Promise.all(batch.map(fn => fn())); // Execute them
    await new Promise(res => setTimeout(res, 10000)); // Wait 10 seconds before next batch
  }

  isProcessing = false;
}

// Button click handler
fetchBtn.addEventListener("click", () => {
  clickCount++;
  countDisplay.textContent = clickCount;

  // Reset count after 10 seconds
  if (Date.now() - lastResetTime >= 10000) {
    clickCount = 0;
    lastResetTime = Date.now();
  }

  // Add the fetch task to the queue
  callQueue.push(fetchData);
  processQueue();
});
