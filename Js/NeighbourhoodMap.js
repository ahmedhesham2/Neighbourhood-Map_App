//represent the model which contains all locations data
var All_locations = [
    {
        "name": "L'AntiCafé Louvre",
        "location": {
            "lat": 48.864176597929635,
            "lng": 2.336246967315674
        },
        "id": "5318c03b498e5ea5cf57b72d"
    }, {
        "name": "L'AntiCafé Olympiades",
        "location": {
            "lat": 48.8256604845249,
            "lng": 2.3664236420115032
        },
        "id": "544f9a0b498ece3f8d42959c"
    }, {
        "name": "Coutume Instituutti",
        "location": {
            "lat": 48.850272389609614,
            "lng": 2.3434848718922203
        },
        "id": "526282fa11d201a787f28e5d"
    }, {
        "name": "Coworkshop",
        "location": {
            "lat": 48.873131,
            "lng": 2.362437
        },
        "id": "5392e19d498eae4bad78b309"
    }, {
        "name": "Craft",
        "location": {
            "lat": 48.873186908994434,
            "lng": 2.3631128669444834
        },
        "id": "50420756e4b0047a41a495fc"
    }, {
        "name": "Draft - Les Ateliers Connectés",
        "location": {
            "lat": 48.88802088292197,
            "lng": 2.362205516926689
        },
        "id": "537bb0fd498e043d3810ad17"
    }
];

//function to handle map loading error if occured
function map_Error_handle () {
    window.alert("can't load map , there is some kind of problem ....");
}

// to create an object for each element in locations list
var locationObject = function(data) {
    this.name = data.name;
    this.location = data.location;
    this.marker = "";
    this.venue = data.id + "/?";
    this.photoUrl = "";
    this.shortUrl = "";
}

// foursquare api elements
var foursquare_url = "https://api.foursquare.com/v2/venues/",
    foursquare_client_id = "client_id=3FAKI0ODGPNRNE4WUYKSBPBMVXKEK2SOGAQRJXKLKJ3RAROD",
    foursquare_client_secret = "&client_secret=NXUI5XCQFVATBOQYW2ESSGEL4D4423ACZ5L2E053A2Z0YMJL",
    foursqure_version = "&v=20161507";


//google api global elements
var map, bounds, largeInfowindow;

//function to set color of marker icon dependent on action
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

//function to make marker bounces when clicked
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 700);
    }
};

//funcion to open info window of marker which has been clicked
function populateInfoWindow(map, marker, infowindow) {
    var contentString = "<h3>" + marker.name +
        "</h3><br><div style='width:200px;min-height:120px'><img src=" + '"' +
        marker.photoUrl + '"></div>';

    infowindow.setContent(contentString);
    infowindow.open(map, marker.marker);
}

//called when page and map are loaded
function InitMap() {

    // loading the map with specific options on the Dom
    map = new google.maps.Map(document.getElementById('map'), {
        "center": {
            "lat": 48.8676305,
            "lng": 2.3495396
        },
        zoom: 13,
        styles: [{
            featureType: 'water',
            stylers: [{
                color: '#19a0d8'
            }]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#ffffff'
            }, {
                weight: 6
            }]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#e85113'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#efe9e4'
            }, {
                lightness: -40
            }]
        }, {
            featureType: 'transit.station',
            stylers: [{
                weight: 9
            }, {
                hue: '#e85113'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                lightness: 100
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                lightness: -100
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{
                visibility: 'on'
            }, {
                color: '#f0e4d3'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#efe9e4'
            }, {
                lightness: -25
            }]
        }],
        mapTypeControl: true

    });

    bounds = new google.maps.LatLngBounds();

    largeInfowindow = new google.maps.InfoWindow();

    //setting marker icon color
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    //closing all opening InfoWindow when map is clicked
    map.addListener("click", function(){
        largeInfowindow.close(largeInfowindow);
      });

    //creating viewmodel to set data using knockout.js
    var ViewModel = function() {
        var self = this;
        this.All_locations_list = ko.observableArray();

        All_locations.forEach(function(locItem) {

            self.All_locations_list.push(new locationObject(locItem));

        });

        //creating marker for each location in locations list
        for (var iter = 0; iter < self.All_locations_list().length; iter++) {
            self.All_locations_list()[iter].marker = new google.maps.Marker({
                map: map,
                position: self.All_locations_list()[iter].location,
                icon: defaultIcon,
                animation: google.maps.Animation.DROP
            });

            // to change the colors back and forth.
            self.All_locations_list()[iter].marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            self.All_locations_list()[iter].marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });

            bounds.extend(self.All_locations_list()[iter].marker.position)

        }
        map.fitBounds(bounds);

        window.onresize = function() {
            map.fitBounds(bounds);
        };

        //making ajax request to foursquare api to get data
        self.All_locations_list().forEach(function(loc_obj) {
            loc_obj.marker.addListener('click', function() {
                map.panTo(loc_obj.marker.position);
                toggleBounce(this);
                populateInfoWindow(map, loc_obj, largeInfowindow);


            });
            var request_url = foursquare_url + loc_obj.venue + foursquare_client_id + foursquare_client_secret + foursqure_version;
            $.ajax({
                type: "GET",
                url: request_url,
                dataType: "json",
                cache: false,
                success: function(data) {
                    var response = data.response ? data.response : "";
                    var venue = response.venue ? data.venue : "";
                    loc_obj.shortUrl = response.venue["shortUrl"];
                    loc_obj.photoUrl = response.venue.bestPhoto["prefix"] + "height150" +
                        response.venue.bestPhoto["suffix"];
                },
                error: function(e) {
                alert("Error in requesting data .. try again later");
            }
            });
        });

        //filtering listview depending on search filter
        self.Input_txt = ko.observable("");
        this.locationClicked = function(location) {
            map.panTo(location.marker.position);
            toggleBounce(location.marker);
            populateInfoWindow(map, location, largeInfowindow);
        }

        this.locations_filtered_list = ko.dependentObservable(function() {

            var filter_value = this.Input_txt().toLowerCase();

            if (filter_value) {
                return ko.utils.arrayFilter(self.All_locations_list(), function(item) {
                    if (item.name.toLowerCase().indexOf(filter_value) >= 0) {
                        item.marker.setMap(map);
                        return true;
                    } else {
                        item.marker.setMap(null);
                        return false;
                    }
                });

            } else {

                return ko.utils.arrayFilter(self.All_locations_list(), function(item) {
                    item.marker.setMap(map);
                    return true;
                });
            }

        }, this);
    }

    //Activating Knockout.js
    ko.applyBindings(new ViewModel());
}