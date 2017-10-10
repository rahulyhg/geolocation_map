var map;

var mapCanvas;
var mapOptions;

var infowindow;
var service;
var marker;

var myLatLng;
var latval;
var lngval;

$(document).ready(function(){

  geoLocationInit();
    function geoLocationInit(){

        var apiGeolocationSuccess = function(position) {
         alert("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);

          latval = position.coords.latitude;
          lngval = position.coords.longitude;
          console.log(position);
          myLatLng = new google.maps.LatLng(latval, lngval);
          createMap(myLatLng);

         nearbySearch(myLatLng, 'school');
         //  searchG(latval,lngval);

        };

        var tryAPIGeolocation = function() {
          jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBUofPSyZz5lIiHQKJUxfaQCz99l2myHs8", function(success) {
            apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
          })
          .fail(function(err) {
            alert("API Geolocation error! \n\n"+ err);
          });
        };

      var browserGeolocationSuccess = function(position) {
       alert("Browser geolocation success!\n\n lat = " + position.coords.latitude + "\n lng = " + position.coords.longitude);

        latval = position.coords.latitude;
        lngval = position.coords.longitude;
        console.log(position);
        myLatLng = new google.maps.LatLng(latval, lngval);
        createMap(myLatLng);

      nearbySearch(myLatLng,'school');
    //     searchG(latval,lngval);

      };

      var browserGeolocationFail = function(error) {
        switch (error.code) {
          case error.TIMEOUT:
                              alert("Browser geolocation error !\n\n Timeout. Please Try Again \n\n");
                        break;
          case error.PERMISSION_DENIED:
                                      alert(error.message);
                                      alert("Hey, We will not misuse your permission \n\nIf you have accidently denied the permission. Please allow us your valuable permission by manually changing it from your browser \n\n So that we will serve you better\n\n");
                                  if(error.message.indexOf("Only secure origins are allowed") === 0) {
                                      tryAPIGeolocation();
                                    }
                              break;
          case error.POSITION_UNAVAILABLE:
                                        alert("Browser geolocation error !\n\n Position unavailable.\n\n Are you on Mars!!\n\n");
                                   break;
        }
      };

      var tryGeolocation = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( browserGeolocationSuccess, browserGeolocationFail,
            {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true}
            );
        }
      };

      tryGeolocation();

    }


    function createMap(myLatLng) {

           mapCanvas = document.getElementById("map");
           mapOptions = {
                          center: myLatLng,
                          zoom: 13,
                          mapTypeId: 'roadmap',
                          mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
                        };

            map = new google.maps.Map(mapCanvas, mapOptions);

              marker = new google.maps.Marker({
                map: map,
                //icon: icn,
                position: myLatLng,
                title: 'Here You are'
            });

           infowindow = new google.maps.InfoWindow();
           service = new google.maps.places.PlacesService(map);
    }

    //nearbySearch(myLatLng,'school');
    function nearbySearch(myLatLng,rqtype){

      var request = {
                location: myLatLng,
                radius: '2000',
                types: [rqtype]
              };
       // infowindow = new google.maps.InfoWindow();
       // service = new google.maps.places.PlacesService(map);

       service.nearbySearch(request, callback);

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

    }

    function createMarker(place) {

           marker = new google.maps.Marker({
                  map: map,
                  icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                  position: place.geometry.location,
                  title: place.name
              });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
          });

    }

    // function searchG(rq_glat,rq_glng){
    //
    //     $.post('/api/searchG', {glat:rq_glat, glng:rq_glng}, function(match){
    //
    //             $.each(match,function(array_index, array_val){
    //                   var g_name_val = array_val.gname;
    //
    //                   gLatLng = new google.maps.LatLng(array_val.glat, array_val.glng);
    //
    //                   createMarkerGirls(gLatLng, g_name_val);
    //         //       nearbySearchGirls(gLatLng, array_val.gname);
    //             });
    //     });
    // }


    // function createMarkerGirls(gLatLng , g_name_val) {
    //
    //       var marker = new google.maps.Marker({
    //             map: map,
    //             icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    //             position: gLatLng,
    //             title: g_name_val
    //       });
    //
    //       google.maps.event.addListener(marker, 'click', function() {
    //               infowindow.setContent(g_name_val);
    //               infowindow.open(map, this);
    //       });
    //
    // }



    //  $("#searchGirls").submit(function(e){
    //         e.preventDefault();
    //
    //         var dist_cord_val=$("#district").val();
    //         var city_cord_val=$("#cityloacation").val();
    //
    //
    //       $.post('/api/getLocationCoords', {dist_cord_val:dist_cord_val, city_cord_val:city_cord_val}, function(l_match){
    //               console.log(l_match);
    //
    //
    //               lLatLng = new google.maps.LatLng(l_match[0], l_match[1]);
    //
    //               createMap(lLatLng);
    //
    //               searchG(l_match[0],l_match[1]);
    //       });
    // });
    //
    // $("#district").click(function(){
    //     var distval=$("#district").val();
    //     $.post('/api/searchCity', {distval:distval}, function(match){
    //       $("#city").html(match);
    //     })
    //   });


});

