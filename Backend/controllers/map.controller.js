const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const axios = require('axios');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// module.exports.getAutoCompleteSuggestions = async (req, res, next) => {

//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { input } = req.query;

//         const suggestions = await mapService.getAutoCompleteSuggestions(input);

//         res.status(200).json(suggestions);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }    


module.exports.getAutoCompleteSuggestions = async (input) => {
    try {
        const apiKey = 'YOUR_API_KEY';  // Make sure this is valid and correctly set
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: input,
                key: apiKey
            }
        });

        if (response.data.status !== 'OK') {
            throw new Error(`API Error: ${response.data.status}`);
        }

        return response.data.predictions;
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw new Error('Unable to fetch suggestions');
    }
};
