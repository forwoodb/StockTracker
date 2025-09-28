const table = document.querySelector("table");

// Sort table by ticker

// Google
export function sortTable(columnIndex) {
  const tbody = table.querySelector("tbody");
  let rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.toLowerCase();
    const cellB = b.cells[columnIndex].textContent.toLowerCase();
    if (cellA < cellB) return -1;
    if (cellA > cellB) return 1;

    console.log(cellA);
    

    if (parseFloat(cellA) < parseFloat(cellB)) return -1;
    if (parseFloat(cellA) > parseFloat(cellB)) return 1;
    return 0;
  });

  // Clear existing rows
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Append sorted rows
  rows.forEach((row) => tbody.appendChild(row));
}

// ChatGPT - with click event
export const sortColumns = (colId, colIndex=0, direction='ascending') => {
  document.getElementById(colId).addEventListener("click", () => {
    const table = document.querySelector("table");
    const rows = Array.from(table.rows).slice(1); // skip header

    const sorted = rows.sort((a, b) => {
      const valA = a.cells[colIndex].innerText.toLowerCase();
      const valB = b.cells[colIndex].innerText.toLowerCase();
      
      const numA = parseFloat(valA.replace(/[$,]/g, "")); // remove commas if any
      const numB = parseFloat(valB.replace(/[$,]/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        // numeric sort
        if (direction === 'descending') {
          return numB - numA;
        }
        return numA - numB;
      } else {
        // text sort
        if (direction === 'descending') {
          return valB.localeCompare(valA);
        }
        return valA.localeCompare(valB);
      }
    });
    const tbody = table.tBodies[0];
    tbody.append(...sorted); // put back sorted rows
  });
};

