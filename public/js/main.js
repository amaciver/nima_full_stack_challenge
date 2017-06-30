
document.addEventListener("DOMContentLoaded", (event) => {
    // Fetch data
    cars = fetchCars().then( (cars) => populateTable(cars) );

    submitBtn = document.getElementById('car-submit');
    submitBtn.addEventListener('click', submitCar);

    // Set up prices modal
    const pricesModal = document.getElementById('prices-modal');
    const pricesClose = document.getElementById('close-modal');
    const modalText = document.querySelector('.modal-text');

    pricesClose.onclick = () => { pricesModal.style.display = "none"; }
    window.onclick = (event) => {
      if (event.target == pricesModal) {
        pricesModal.style.display = "none";
        modalText.innerHTML = ``;
        // Clear chart on modal close
        if (chart != null) { chart.destroy() }
      }
    }

    // Set up error clearing
    const inputs = document.querySelectorAll('.car-input');
    inputs.forEach( (input) => {
      input.addEventListener('focus', () => {
        clearErrors(input.parentElement)
        submitBtn.className = 'car-submit';
        submitBtn.value = 'ADD';
      })
    })
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
  let isBlanks;
  const inputs = document.querySelectorAll('.car-input');
  inputs.forEach( (input) => {
    car[[input.name]] = input.value;
    if (input.value === '') {
      renderErrors(input.parentElement);
      isBlanks = true;
    }
  })
  if (!isBlanks) {
    const submitBtn = document.getElementById('car-submit');
    submitBtn.value = 'LOADING';
    submitBtn.className = 'car-submit loading';
    postCar(car)
    .then( (carRes) => {
      console.log(carRes);
      submitBtn.value = 'SUCCESS!';
      submitBtn.className = 'car-submit success';
      const inputs = document.querySelectorAll('.car-input');
      inputs.forEach( (input) => input.value = '')
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
  node.children[0].className = 'car-input';
  node.children[1].className = 'error hidden';
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
      fetchPrices(car).then( (prices) => {
        console.log(prices)
        makeChart(prices)
      })
      pricesModal.style.display = "block";
    }
    row.appendChild(cell);

    table.appendChild(row);
  })
}

let chart = null;

const makeChart = (prices) => {
  let make, model, carYear
  let uniqYears = {};
  Object.keys(prices).forEach( (price) => {
    if (uniqYears[prices[price].year]) {
      uniqYears[prices[price].year].push(prices[price].price)
    } else {
      uniqYears[prices[price].year] = [prices[price].price]
    }
    if (!make || !model || !carYear) {
      make = prices[price].make
      model = prices[price].model
      carYear = prices[price].car_year
    }
  });

  const modalText = document.querySelector('.modal-text');
  modalText.innerHTML = `${carYear} ${make} ${model}`;

  const max = Math.max(...Object.keys(uniqYears));
  const min = Math.min(...Object.keys(uniqYears));

  const years = Array.from(new Array(max+1-min), (x,i) => i + min);

  let data = years.map( (year) => {
    const pricesArr = uniqYears[year]
    if (pricesArr) {
      var total = pricesArr.reduce( ( acc, cur ) => acc + cur, 0);
      return (total/pricesArr.length);
    } else {
      return(null);
    }
  })
  console.log(uniqYears);
  console.log(years);
  console.log(data);


  // if (chart != null) { chart.destroy() }
  const ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: years,
          datasets: [{
              label: "Prices, Averaged by Year",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: data,
          }]
      },
      options: {spanGaps: true}
    });
}
