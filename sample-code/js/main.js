//  Bluefox Fetch API Base URL
//  https://apollo-psq.bluefoxengage.com/third_party_fetch_api/v100/ (Americas) https://artemis-psq.bluefoxengage.com/third_party_fetch_api/v100/ (Europe & Asia)
let serverApiBaseUrl =
  "https://apollo-psq.bluefoxengage.com/third_party_fetch_api/v100/";

//  Fetch API tokens (Access and Secret) are available for each sensor in the BlueFox Count Platform Dashboard
//  https://apollo-psq.bluefoxengage.com/login (Americas) https://artemis-psq.bluefoxengage.com/login (Europe & Asia)
let sensor = {
  access_token: "ACCESS-1B2973A9-FBBE-4892-980B-A7AEF8XXXXXX",
  secret_token: "SECRET-2986C69A-09D3-4351-BEDD-3C5B60XXXXXX",
  name: "Location Name",
  max_count: 1, 
};

// Sets the update interval for retrieval of realtime count data. Our cloud platform collects count data every 20 seconds from active sensors.
let updateInterval = 60000; // In milliseconds. Default: 1 minute

//  On load function.
$(function () {
  //  Retrieves each sensor's location name and max occupancy value
  //  By disabling this call, location name and max occupancy value can be set manually in the sensor object
  getLocationInfo();

  setTimeout(function () {
    //  Retrieves each sensor's realtime occupancy count
    getRealtimeCount();

    //  Updates the sensor location name and max occupancy value according at the set interval
    //  By disabling this call, the location name and max occupancy value can be set manually in the sensor object
    setInterval(getLocationInfo, updateInterval);

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
    if (count >= sensor.max_count) {
      //  Sets the gauge fill percentage to full
      value
        .querySelector(".fill")
        .setAttribute("style", "stroke-dashoffset: " + 0);
      //  Sets the gauge color to red
      value.querySelector(".fill").style.stroke = "#FA5E3E";
      //  Retrieves the historical count and sets the historical chart color to red
      getHistoricalCount("#FA5E3E");
    }
    //  If the current occupancy count is above half of the max occupancy value
    else if (count >= sensor.max_count / 2) {
      //  Sets the gauge fill percentage
      value
        .querySelector(".fill")
        .setAttribute(
          "style",
          "stroke-dashoffset: " +
            ((sensor.max_count - count) / sensor.max_count) * gaugeOffset
        );
      //  Sets the gauge color to yellow
      value.querySelector(".fill").style.stroke = "#F29100";
      //  Retrieves the historical count and sets the historical chart color to yellow
      getHistoricalCount("#F29100");
    }
    //  If the current occupancy count is below half the max occupancy value
    else {
      //  Sets the gauge fill percentage
      value
        .querySelector(".fill")
        .setAttribute(
          "style",
          "stroke-dashoffset: " +
            ((sensor.max_count - count) / sensor.max_count) * gaugeOffset
        );
      //  Sets the gauge color to green
      value.querySelector(".fill").style.stroke = "#56BF6B";
      //  Retrieves the historical count and sets the historical chart color to green
      getHistoricalCount("#56BF6B");
    }
    //  Sets the current real-time count text
    value.querySelector(".count-value").innerHTML = count;
    //  Sets the sensor location name
    value.querySelector(".location-name").innerHTML = sensor.name;
    //  Sets the max occupancy value "Limit"
    value.querySelector(".limit-text").innerHTML = "Limit " + sensor.max_count;
  });
}

//  Returns the realtime occupancy count for a specified sensor location.
var getRealtimeCount = function () {
  $.ajax({
    // Request
    url: serverApiBaseUrl + "get_location_realtime_occupancy_count",
    data: "{}",
    type: "POST",
    // Request header with authentication tokens
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/plain");
      xhr.setRequestHeader("x-api-access-token", sensor.access_token);
      xhr.setRequestHeader("x-api-secret-token", sensor.secret_token);
    },
    success: function (response) {
      //  Floor occupancy count is used to offset devices in the count which are always detected
      if (
        response.occupancy_count_flooring_enabled &&
        response["occupancy_count"] - response["floor_occupancy_count"] > 0
      ) {
        redrawCountGauges(
          response["occupancy_count"] - response["floor_occupancy_count"]
        );
      } else if (response["occupancy_count"] > 0) {
        redrawCountGauges(response["occupancy_count"]);
      } else {
        redrawCountGauges(0);
      }
    },
  });
};

//  Returns general information about a specified sensor location.
var getLocationInfo = function () {
  $.ajax({
    //  Request
    url: serverApiBaseUrl + "get_location_info",
    data: "{}",
    type: "POST",
    //  Request header with authentication tokens
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/plain");
      xhr.setRequestHeader("x-api-access-token", sensor.access_token);
      xhr.setRequestHeader("x-api-secret-token", sensor.secret_token);
    },
    success: function (response) {
      if (response.status == "TOKEN_AUTHENTICATION_ERROR") {
        alert(
          "Enable Fetch API access for your sensor and add its authentication tokens (Access and Secret) to the sensor object in main.js, Line 8"
        );
      } else {
        //  By disabling this call, the max occupancy value can be set manually in the sensor object
        sensor.max_count = response.location_info.max_occupancy_count;
        //  By disabling this call, the location name value can be set manually in the sensor object
        sensor.name = response.location_info.nickname;
      }
      //  Other response examples
      //  response.location_info.location_uuid;
      //  response.location_info.timezone_name;
      //  response.location_info.occupancy_count_flooring_enabled;
      //  response.location_info.floor_occupancy_count;
      //  response.location_info.occupancy_count_alert_enabled;
      //  response.location_info.sensor_last_connected_at;
      //  response.location_info.subscription_valid_until;
    },
  });
};

//  Returns the historical occupancy counts for a specified number of days
var getHistoricalCount = function (alertColor) {
  $.ajax({
    //  Request
    url: serverApiBaseUrl + "get_location_historical_occupancy_counts",
    data: '{"day_span": ' + 1 + "}", //  Sets the span of days to return historical data for
    type: "POST",
    //  Request header with authentication tokens
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/plain");
      xhr.setRequestHeader("x-api-access-token", sensor.access_token);
      xhr.setRequestHeader("x-api-secret-token", sensor.secret_token);
    },
    success: function (response) {
      var data = [];
      var rawData = [];
      $.each(response["occupancy_count_slots"], function (i, v) {
        if (rawData[i - 1]) {
          if (rawData[i - 1] + 1 != v[0]) {
            for (var i = rawData[i - 1] + 1; i < v[0]; i += 900) {
              data.push([new Date(parseInt(i + "000")), 0]);
            }
          }
        }
        data.push([new Date(parseInt(v[0] + "000")), v[3]]);
        rawData.push(v[1]);
      });
      //  Draws chart using parsed historical count data
      drawHistory(data, alertColor);
    },
  });
};

//  Draws historical chart using the Dygraph library
function drawHistory(data, alertColor) {
  g = new Dygraph(document.getElementById("historical-chart"), data, {
    drawGrid: false,
    drawAxis: true,
    strokeWidth: 4,
    color: alertColor,
    axisLabelFontSize: 20,
    axisLabelWidth: 100,
    axisLabelHeight: 300,
    axisLineColor: "#607183",
    axisLineWidth: 2,
    fillGraph: true,
    stackedGraph: true,
    plotter: [Dygraph.smoothFillPlotter, Dygraph.smoothPlotter],
  });
}
