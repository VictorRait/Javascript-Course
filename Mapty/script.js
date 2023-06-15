'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.distance = distance; // km
    this.duration = duration; // min
    this.coords = coords; // [lat,lng]
  }
  _setdescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setdescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setdescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////////////
//  APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    document
      .querySelector('.workouts')
      .addEventListener('click', this._movetoPopUp.bind(this));
    // document
    //   .querySelectorAll('.workout__details')
    //   .forEach(detail =>
    //     detail.addEventListener('click', this._editWorkout.bind(this))
    //   );
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert(`Could not get position`);
      }
    );
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    document.querySelector('.form').classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    // prettier-ignore
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';
    document.querySelector('.form').style.display = 'none';
    document.querySelector('.form').classList.add('hidden');
    setTimeout(() => (document.querySelector('.form').style.display = 'grid')),
      1000;
  }
  _toggleElevationField() {
    console.log('change');
    console.log(inputCadence.closest('.form__row'));
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();

    const validInput = (...input) => input.every(inp => Number.isFinite(inp));
    const allPositive = (...input) => input.every(inp => inp > 0);
    // Data from from
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    // check if data is valid
    let workout;
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Input has to be positive numbers');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Input has to be positive numbers');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    this.#workouts.push(workout);
    console.log(workout);
    //if running create running object
    //if cycling create cycling object
    // add object to workout array
    // add object to map

    // clear and hide form
    // Display marker
    this._renderMapWorkout(workout);
    this._renderWorkout(workout);
    this._setLocalStorage();
  }
  _loadMap(position) {
    {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
      const coords = [latitude, longitude];
      this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.#map);

      this.#map.on('click', this._showForm.bind(this));
      this.#workouts.forEach(work => {
        this._renderMapWorkout(work);
      });
    }
  }
  _renderMapWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: `${workout.type}-popup`,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = ` <li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === 'running') {
      html += `
       <div class="workout__details ">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value pace">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit calculatedDetail">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>  
    </div> </li>`;
    }
    if (workout.type === 'cycling') {
      html += `
      <div class="workout__details ">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value speed">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit calculatedDetail">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div> </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
    this._hideForm();
    document
      .querySelectorAll('.workout__details')
      .forEach(detail =>
        detail.addEventListener('click', this._editWorkout.bind(this))
      );
  }
  _movetoPopUp(e) {
    const workoutEl = e.target.closest('.workout');
    // console.log(workoutEl);
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }
  _editWorkout(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    const details = e.target.closest('.workout__details');
    const unit = details.querySelector('.workout__unit').textContent;
    const containsDetail = details.querySelector('.workout__value');
    console.log(details);
    console.log(unit);
    let change;
    if (
      details
        .querySelector('.workout__unit')
        .classList.contains('calculatedDetail')
    ) {
      alert("Can't change this value");
    } else {
      change = prompt('Change this value?');
    }
    if (unit === 'km') {
      workout.distance = change;
    }
    if (unit === 'min') {
      workout.duration = change;
    }
    if (unit === 'spm') {
      workout.cadence = change;
    }
    if (unit === 'm') {
      workout.elevationGain = change;
    }

    details.querySelector('.workout__value').textContent = change;
    if (workout.type === 'running') {
      workout.pace = Math.trunc(workout.duration / workout.distance);
      workoutEl.querySelector('.pace').textContent = workout.pace;
    }
    if (workout.type === 'cycling') {
      workout.speed = Math.trunc(workout.distance / (workout.duration / 60));
      e.target.closest('.workout').querySelector('.speed').textContent =
        workout.speed;
    }
    console.log(workout);
    // value becomes form when clicked

    this._setLocalStorage();
  }
  _setLocalStorage() {
    localStorage.setItem('workout', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workout'));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  reset() {
    localStorage.removeItem('workout');
    location.reload();
  }
}
const app = new App();
