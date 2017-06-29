
document.addEventListener("DOMContentLoaded", (event) => {
    cars = fetchCars().then( (cars) => populateTable(cars) );
    submitBtn = document.getElementById('car-submit');
    submitBtn.addEventListener('click', submitCar);

    const pricesModal = document.getElementById('prices-modal');
    const pricesClose = document.getElementById("close-modal");
    pricesClose.onclick = () => { pricesModal.style.display = "none"; }
    window.onclick = (event) => {
      if (event.target == pricesModal) { pricesModal.style.display = "none"; }
    }
  });

const fetchCars = () => {
  return $.ajax({
    method: 'GET',
    url: '/cars'
  });
};

const fetchPrices = (carId) => {
  console.log(carId);
  return $.ajax({
    method: 'GET',
    url: '/prices',
    data: carId
  });
};

const postCar = (car) => {
  return $.ajax({
    method: 'POST',
    url: '/cars',
    data: JSON.stringify(car),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });
};

const submitCar = (e) => {
  e.preventDefault();
  const car = {};
  const inputs = document.querySelectorAll('.car-input');
  let isBlanks;
  inputs.forEach( (input) => {
    input.addEventListener('focus', clearErrors(input.parentElement))
    car[[input.name]] = input.value;
    if (input.value === '') {
      renderErrors(input.parentElement);
      isBlanks = true;
    }
  })
  if (!isBlanks) {
    postCar(car)
    .then( () => {
      fetchCars().then( (cars) => {
        populateTable(cars);
      })
    })
    .catch( () => {
      console.log('fail');
    })
  }
}

const renderErrors = (node) => {
  node.children[0].className = 'car-input has-error';
  node.children[1].className = 'error';
}

const clearErrors = (node) => {
  return (e) => {
    node.children[0].className = 'car-input';
    node.children[1].className = 'error hidden';
  }
}

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
    const pricesModal = document.getElementById('prices-modal');
    cell.children[0].onclick = () => {
      // console.log(car);
      fetchPrices(car).then( (prices) => console.log(prices))
      pricesModal.style.display = "block";
    }

    row.appendChild(cell);

    table.appendChild(row);
  })
}
