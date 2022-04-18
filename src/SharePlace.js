import { Modal } from './Modal';
import { Map } from './Map';

// function addGoogleScript() {
//   const googleMapsScript = document.createElement('script');
//   googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`;
//   // process.env.GOOGLE_MAPS_API_KEY is the variable set in webpac k.config.js
//   googleMapsScript.defer = true;

//   document.head.appendChild(googleMapsScript);
// }

class PlaceFinder {
  constructor() {
    // addGoogleScript();
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  selectPlace(coordinates) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
  }

  locateUserHandler() {
    if (!navigator.geolocation) {
      alert('Location is not available. Please enter an address.');
      return;
    }
    const modal = new Modal(
      'loading-modal-content',
      'Finding location... Please wait.'
    );
    modal.show();
    navigator.geolocation.getCurrentPosition(
      (successResult) => {
        modal.hide();
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        this.selectPlace(coordinates);
      },
      (error) => {
        modal.hide();
        alert('Could not locate you. Please enter an address.');
      }
    );
  }

  findAddressHandler() {}
}

new PlaceFinder();
