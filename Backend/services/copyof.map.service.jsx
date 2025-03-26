const axios = require('axios');
const captainModel = require('../models/captain.model');

// console.log('Using Google API Key:', process.env.GOOGLE_MAPS_API);


module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Unable to fetch coordinates: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`Error fetching coordinates for address ${address}:`, error.message);
        throw error;
    }
};


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`;
    ;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const elements = response.data.rows[0].elements[0];
            if (elements.status === 'ZERO_RESULTS') {
                throw new Error('No routes found between the given locations');
            }
            return elements;
        } else {
            throw new Error(`Google API Error: ${response.data.status}. ${response.data.error_message || 'Unable to fetch distance and time'}`);
        }
    } catch (err) {
        console.error(`Error fetching distance and time between ${origin} and ${destination}:`, err.message);
        throw err;
    }
};


module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error(`Unable to fetch suggestions: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error(`Error fetching autocomplete suggestions for query "${input}":`, err.message);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[ltd, lng], radius / 6371]
                }
            }
        });
        return captains;
    } catch (error) {
        console.error(`Error fetching captains within radius:`, error.message);
        throw error;
    }
}
