# BlueZoo - Single Sensor Occupancy Screen

## Getting started

1. Fetch API access must be enabled for your account and sensor through the BlueZoo Cloud Platform Dashboard

https://apollo-psq.bluefoxengage.com/login (Americas)

https://artemis-psq.bluefoxengage.com/login (Europe & Asia)

2. Add the provided access and secret authentication tokens for your sensor to the sensor object in main.js, Line 8.

3. Run index.html with a web browser such as Google Chrome.

4. Realtime occupancy information from your sensor will be displayed within the count gauge and historical chart on the page.

5. Explore the BlueZoo Fetch API through our documentation listed below.

## Structure of a BlueZoo Fetch API request

To form a request URL for a given endpoint, simply append the endpoint name to the base URL.

[Base API URL]

https://apollo-psq.bluefoxengage.com/third_party_fetch_api/v100

[Full Request URL]

https://apollo-psq.bluefoxengage.com/third_party_fetch_api/v100/get_location_realtime_occupancy_count

Each successful HTTP request should return 200 as HTTP Status Code.

When requests are made too frequently to the API, code 429 may be returned as HTTP Status Code.

## BlueZoo API Documentation

A full list of API endpoints is available in our documentation: [BlueZoo Fetch API](https://api.bluezoo.io/)


### Libraries

- [DyGraph](https://https://dygraphs.com/)
- [DyGraph - Smooth Plotter](https://dygraphs.com/src/extras/smooth-plotter.js)
- [DyGraph - Smooth Fill Plotter](https://github.com/olivier-monaco/dygraphs/blob/c977717cdec1990eae9f8a89d3c028430f45f60f/src/extras/smooth-fill-plotter.js)
- [jQuery](https://jquery.com/)
