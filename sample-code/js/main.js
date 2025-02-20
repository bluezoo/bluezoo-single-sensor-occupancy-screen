// Found on the Profile page of the BlueZoo dashboard
let userAccessKey = "AccessKey XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";

// Found within the properties panel of a specific sensor location
let sensorLocationId = 0;

let sensor = {
  location_name: "Location name",
  occupancy_limit: 10,
};

// Sets the update interval for retrieval of realtime count data. Our cloud platform collects count data every 30 seconds from active sensors.
let updateInterval = 60000; // In milliseconds. Default: 1 minute

//  On load function.
$(function () {
  //  Retrieves each sensor's location name and max occupancy value
  getLocationInfo();

  setTimeout(function () {
    //  Retrieves each sensor's realtime occupancy count
    getRealtimeCount();

    //  Updates the realtime occupancy count according to the set interval
    setInterval(getRealtimeCount, updateInterval);

    // Removes the loadscreen
    $("#loading-screen").fadeOut(500);
  }, 1500);
});

//  ForEach Iterator
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};

function redrawCountGauges(count) {
  //  Radial gauge offset (-219.99078369140625)
  var gaugeOffset = -219.99078369140625;
  forEach(document.querySelectorAll(".location-0"), function (index, value) {
    //  If the current occupancy count is above or equal to the max occupancy value
    if (count >= sensor.occupancy_limit) {
      //  Sets the gauge fill percentage to full
      value
        .querySelector(".fill")
        .setAttribute("style", "stroke-dashoffset: " + 0);
      //  Sets the gauge color to red
      value.querySelector(".fill").style.stroke = "#FA5E3E";
    }
    //  If the current occupancy count is above half of the max occupancy value
    else if (count >= sensor.occupancy_limit / 2) {
      //  Sets the gauge fill percentage
      value
        .querySelector(".fill")
        .setAttribute(
          "style",
          "stroke-dashoffset: " +
            ((sensor.occupancy_limit - count) / sensor.occupancy_limit) * gaugeOffset
        );
      //  Sets the gauge color to yellow
      value.querySelector(".fill").style.stroke = "#F29100";
    }
    //  If the current occupancy count is below half the max occupancy value
    else {
      //  Sets the gauge fill percentage
      value
        .querySelector(".fill")
        .setAttribute(
          "style",
          "stroke-dashoffset: " +
            ((sensor.occupancy_limit - count) / sensor.occupancy_limit) * gaugeOffset
        );
      //  Sets the gauge color to green
      value.querySelector(".fill").style.stroke = "#56BF6B";
    }
    //  Sets the current real-time count text
    value.querySelector(".count-value").innerHTML = count;
    //  Sets the sensor location name
    value.querySelector(".location-name").innerHTML = sensor.location_name;
    //  Sets the max occupancy value "Limit"
    value.querySelector(".limit-text").innerHTML = "Limit: " + sensor.occupancy_limit;
  });
}

//  Returns the realtime occupancy count for a specified sensor location
var getRealtimeCount = function () {
  $.ajax({
    // Request
    url: "https://hermes.apollo.bluezoo.io/v2/" + "get_occupancy_count?id=" + sensorLocationId,
    type: "GET",
    // Request header with authentication token
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/plain");
      xhr.setRequestHeader("authorization", userAccessKey);
    },
    success: function (response) {
      if (response["inner_occupancy_count"]) {
        redrawCountGauges(response["inner_occupancy_count"]);
      }
    },
  });
};

//  Returns general information about a specified sensor location
var getLocationInfo = function () {
  $.ajax({
    //  Request
    url: "https://hermes.apollo.bluezoo.io/v3/" + "sensor_locations/" + sensorLocationId,
    type: "GET",
    //  Request header with authentication token
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/plain");
      xhr.setRequestHeader("authorization", userAccessKey);
    },
    success: function (response) {
       sensor.occupancy_limit = response.occupancy_limit;
       sensor.location_name = response.name;
    },
  });
};

