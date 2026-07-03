const axios = require("axios");

const getRoadDistance = async (
  lat1,
  lon1,
  lat2,
  lon2
) => {

  try {

    const url =
      `https://router.project-osrm.org/route/v1/foot/` +
      `${lon1},${lat1};${lon2},${lat2}` +
      `?overview=false`;

    const response = await axios.get(url);

    const distance =
      response.data.routes[0].distance;

    return distance;

  } catch (error) {

    console.log(error);

    return Infinity;
  }
};

const nearestNeighbor = async (
  startPoint,
  locations
) => {

  let route = [];

  let current = startPoint;

  let unvisited = [...locations];

  while (unvisited.length > 0) {

    let nearestIndex = 0;

    let nearestDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {

      const distance =
        await getRoadDistance(
          current.latitude,
          current.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );

      if (distance < nearestDistance) {

        nearestDistance = distance;

        nearestIndex = i;
      }
    }

    const nearestLocation =
      unvisited.splice(nearestIndex, 1)[0];

    route.push(nearestLocation);

    current = nearestLocation;
  }

  return route;
};

module.exports = { nearestNeighbor };