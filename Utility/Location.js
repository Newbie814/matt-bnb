import { async } from 'regenerator-runtime';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBxtimtjtAZZIGU1OaCnw3K5--1wZRFgyk';

export async function getCoordsFromAddress(address) {
  const urlAddress = encodeURI(address);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_MAPS_API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Could not locate coordinates.');
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

export async function getAddressFromCoords(coords) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Could not locate address.');
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;
  return address;
}
