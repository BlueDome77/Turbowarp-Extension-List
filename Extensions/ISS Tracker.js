/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function(ext) {

  var EARTH_RADIUS = 6371000; //meters

  //Radius in km to determine if the ISS is overhead
  var OVERHEAD_DIST = 500

  var locations = {};
  var issData = null;

  function getLocation(str, callback) {

    if (locations[str]) {
      callback(locations[str]);
      return;
    }

    $.ajax({
      type: "GET",
      url: "http://nominatim.openstreetmap.org/search/",
      dataType: "jsonp",
      data: {
        format: "json",
        q: str
      },
      jsonp: "json_callback",
      success: function(data) {
        locations[str] = {};
        locations[str].coords = [data[0].lon, data[0].lat];
        locations[str].overhead = false;
        callback(locations[str]);
      },
      error: function(jqxhr, textStatus, error) {
        callback(null);
      }
    });
  }

  function updateISSLocation() {
    $.ajax({
      type: "GET",
      dataType: "json",
      //url: "http://api.open-notify.org/iss-now.json",
      url: "https://api.wheretheiss.at/v1/satellites/25544",
      success: function(data) {
        issData = data;
      },
      error: function(jqxhr, textStatus, error) {
        console.log("Error downloading ISS data");
      }
    });
  }

  function distanceBetween(lat, lon, unit) {
    var lat1 = lat * (Math.PI/180);
    var lat2 = issData.latitude * (Math.PI/180);
    var d1 = (issData.latitude - lat) * (Math.PI/180);
    var d2 = (issData.longitude - lon) * (Math.PI/180);

    var a = Math.sin(d1/2) * Math.sin(d1/2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(d2/2) * Math.sin(d2/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist = EARTH_RADIUS * c;

    if (unit === "miles") dist *= 0.00062137;
    else dist /= 1000;

    return +(Math.round(dist + "e+2") + "e-2");
  }

  ext.whenISSPasses = function(str) {
    if (!issData) return;

    getLocation(str, function(loc) {
      var dist = distanceBetween(loc.coords[1], loc.coords[0], "kilometers");
      if (dist <= OVERHEAD_DIST) loc.overhead = true;
      else loc.overhead = false;
    });

    if (!locations[str])
      return false;

    return locations[str].overhead;
  };

  ext.distanceFrom = function(str, unit, callback) {
    getLocation(str, function(loc) {
      var dist = distanceBetween(loc.coords[1], loc.coords[0], unit);
      if (dist <= OVERHEAD_DIST) loc.overhead = true;
      else loc.overhead = false;
      callback(dist);
      return;
    });
  };

  ext.getISSInfo = function(stat) {
    if (!issData) return;
    if (stat === "longitude" || stat === "latitude")
      return issData[stat].toFixed(6).toString();
    else
      return issData[stat].toFixed(2).toString();
  };

  ext._getStatus = function() {
    return { status:2, msg:'Ready' };
  };

  ext._shutdown = function() {
    if (poller) {
      clearInterval(poller);
      poller = null;
    }
  };

  var descriptor = {
    blocks: [
      ['h', 'when ISS passes over %s', 'whenISSPasses', 'Boston, MA'],
      ['R', 'distance from %s in %m.measurements', 'distanceFrom', 'Boston, MA', 'kilometers'],
      ['r', 'current ISS %m.loc', 'getISSInfo', 'longitude']
    ],
    menus: {
      loc: ['longitude', 'latitude', 'altitude', 'velocity'],
      measurements: ['kilometers', 'miles']
    },
    url: 'http://khanning.github.io/scratch-isstracker-extension'
  };

  ScratchExtensions.register('ISS Tracker', descriptor, ext);

  updateISSLocation();
  var poller = setInterval(updateISSLocation, 2000);

})({});
