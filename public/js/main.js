
document.addEventListener("DOMContentLoaded", (event) => {
    cars = fetchCars().then( (cars) => populateTable(cars) );
  });

const fetchCars = () => {
  return $.ajax({
    method: 'GET',
    url: '/cars'
  });
};

const createCar = (car) => {
  return $.ajax({
    method: 'POST',
    url: '/cars'
    data: {car}
  });
};

const populateTable = (cars) => {
  const table = document.getElementsByTagName('tbody')[0];
  Object.keys(cars).forEach( (car) => {
    const row = document.createElement('tr');
    row.className = 'table-row';
    let cell = document.createElement('td')
    cell.textContent = `${cars[car].make}`;
    row.appendChild(cell);
    cell = document.createElement('td')
    cell.textContent = `${cars[car].model}`;
    row.appendChild(cell);
    cell = document.createElement('td')
    cell.textContent = `${cars[car].year}`;
    row.appendChild(cell);
    cell = document.createElement('td')
    cell.innerHTML = "<img class='data-icon' src='images/data-icon.png' alt='data-icon'>"
    row.appendChild(cell);

    table.appendChild(row);
  })
}
