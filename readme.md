# BlueZoo - Single Sensor Occupancy Screen

## Getting started

1. API access must be enabled for your account through the BlueZoo Cloud Platform Dashboard

https://dashboard.bluezoo.io

2. Add the provided authentication AccessKey (found on the Profile page of the dashboard) to main.js, line 2.

3. Add a sensor location ID (found on the properties panel of a sensor location within the dashboard) to main.js, line 5.

4. Run index.html with a web browser such as Google Chrome or a BrightSign device.

5. Real-time occupancy information from your sensor location will be displayed within the count gauge of the page.

Explore the BlueZoo API through our documentation listed below.

## Structure of a BlueZoo API request

To form a request URL for a given endpoint, simply append the endpoint name to the base URL

[Base API URL]

https://hermes.apollo.bluezoo.io/

[Full Request URL]

https://hermes.apollo.bluezoo.io/v2/get_occupancy_count?id=0

Each successful HTTP request should return 200 as HTTP Status Code.

When requests are made too frequently to the API, code 429 may be returned as HTTP Status Code.

## BlueZoo API Documentation

A full list of API endpoints is available in our documentation: [BlueZoo API](https://api.bluezoo.io/)


### Libraries

- [jQuery](https://jquery.com/)
