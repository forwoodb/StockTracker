import { sortColumns, sortTable } from "./script.js";

const rows = document.querySelectorAll("tr");

const numPos = document.querySelector("#num-pos");
// Account balance form
const accBalInput = document.querySelector("#accountBalance");
const accButton = document.querySelector("#acc-button");
const accBalSpan = document.querySelector("#account-balance");
// Stop Loss Form
const stopLossInput = document.querySelector("#stopLoss");
const stopLossButton = document.querySelector("#stop-loss-button");
const stopLossSpan = document.querySelector("#stop-loss");

const avgPos = document.querySelector("#avg-pos-size");
const maxPos = document.querySelector("#max-pos-size");

// Get values from local storage
accBalSpan.innerText = localStorage.getItem("accountBalance");
stopLossSpan.innerText = localStorage.getItem("stopLoss");

const stopLossPct = stopLossSpan.innerText;
const stopLossDecimal = stopLossPct / 100;

for (let i = 0; i < rows.length; i++) {
  numPos.innerText = i;
}

// Get average position size
const avgAmt = Number(accBalSpan.innerText) / Number(numPos.innerText);
avgPos.innerText = avgAmt.toFixed(2);

// Get Maximum Position Size
const maxAmt = avgAmt * stopLossPct;
maxPos.textContent = maxAmt.toFixed(2);

// Sort Table
sortTable(0);
sortColumns("dataTickerCol", 0);
sortColumns("timeCol", 1);
sortColumns("closeCol", 2);
sortColumns("avgCostCol", 7);
sortColumns("posSizePctCol", 8);
sortColumns("posSizeCol", 9);
sortColumns("entryCol", 10, "descending");

let entryTotal = 0;

// Calculate Percentage
rows.forEach((row, i) => {
  if (i === 0) return; // skip header

  const ticker = row.cells[0].textContent;
  const close = Number(row.cells[2].textContent);
  const five = Number(row.cells[3].textContent);
  const ten = Number(row.cells[4].textContent);
  const twenty = Number(row.cells[5].textContent);
  const fifty = Number(row.cells[6].textContent);
  const avgCost = Number(row.cells[7].textContent);

  const movingAverage = (ma, colIndex) => {
    const posSizePct = (((avgCost - ma) / avgCost) * 100).toFixed(2);
    // const posSizePrice = ((stopLossDecimal / posSizePct) * avgAmt).toFixed(2);
    // row.cells[6].textContent = posSizePrice;
    row.cells[8].textContent = posSizePct;

    const entryPct = (close - ma) / close;
    const entryPrice = ((stopLossDecimal / entryPct) * avgAmt).toFixed(2);
    row.cells[10].textContent = entryPrice;

    // Get total of all entries
    if (entryPrice > maxAmt) {
      entryTotal = entryTotal += Number(maxAmt);
    } else {
      entryTotal = entryTotal += Number(entryPrice);
    }
    console.log(entryTotal);

    // Highlight MA Column
    for (let i = 0; i < row.cells.length; i++) {
      if (i != colIndex) {
        row.cells[i].style.color = "black";
      } else {
        row.cells[colIndex].style.color = "green";
      }
    }

    // Color Indicators
    switch (true) {
      case close < ma:
        row.cells[2].style.color = "red";
        row.cells[9].style.color = "red";
        break;
      case close < avgCost:
        row.cells[2].style.color = "orange";
        row.cells[9].style.color = "orange";
        break;
      default:
        row.cells[2].style.color = "black";
        row.cells[9].style.color = "black";
    }
  };

  // Alternate Moving averages
  const changeMA = (colId = fiftyDCol, ma = fifty, colIndex = 5) => {
    const column = document.getElementById(colId);
    // console.log("DEBUG", ticker, close, ten, fifty, avgCost);

    column.addEventListener("click", () => {
      movingAverage(ma, colIndex);
    });
  };

  movingAverage(ten, 4);
  changeMA("fiveDCol", five, 3);
  changeMA("tenDCol", ten, 4);
  changeMA("twentyDCol", twenty, 5);
  changeMA("fiftyDCol", fifty, 6);
});

// Update account balance
const localStorageSave = (button, lsItem, span, input) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    // Set Stored Values
    localStorage.setItem(lsItem, input.value);

    // Get Stored Values
    const storedItem = localStorage.getItem(lsItem);

    // Assign stored values to card
    span.innerText = storedItem;

    // Calculate average position size
    const avgAmt = Number(accBalSpan.innerText) / Number(numPos.innerText);

    // Assign average position size to card
    avgPos.innerText = avgAmt.toFixed(2);
    input.value = "";
    // stopLossInput.value = "";
  });
};

localStorageSave(accButton, "accountBalance", accBalSpan, accBalInput);
localStorageSave(stopLossButton, "stopLoss", stopLossSpan, stopLossInput);
