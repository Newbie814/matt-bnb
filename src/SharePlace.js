import { Modal } from './Modal';
import { Map } from './Map';
import {
  getCoordsFromAddress,
  getAddressFromCoords,
} from '../Utility/Location';

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
    this.shareBtn = document.getElementById('share-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    // this.shareBtn.addEventListener('click', this.findAddressHandler.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    this.shareBtn.disabled = false;
    const shareLinkInputElement = document.getElementById('share-link');
    shareLinkInputElement.value = `${
      location.origin
    }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
      coordinates.lng
    }`;
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
      async (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert('Could not locate you. Please enter an address.');
      }
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector('input').value;
    if (!address || address.trim() === '') {
      alert('Please enter an address.');
      return;
    }
    const modal = new Modal('loading-modal-content', 'Fetching location...');
    modal.show();
    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch (err) {
      modal.hide();
      alert(err.message);
    }
    modal.hide();
  }
}

const placeFinder = new PlaceFinder();
