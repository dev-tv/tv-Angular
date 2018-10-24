.controller('HomeCtrl', ['$scope','ApiService','toaster', '$uibModal','$localStorage', function ($scope, ApiService, toaster, $uibModal, $localStorage) {
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  $scope.selected = "Date";
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

    function getBannerImages() {
        ApiService.getBannerImages().then(function(res){
            if(res.data.status == 1){
                $scope.slides = res.data.data;
                if($scope.slides.length == 0){
                   $scope.sliderEmpty = true;
                }

            }else{
                toaster.pop('error', "Error", res.data.message);
            }
        })
    }

    getBannerImages();

  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }

  // On Sale

    $scope.onSalefilter = {
        "currentPage": 1,
        "pageSize": 4,
        "sortBy": "location",
        "eventType": "ONSALE"
    };
    $scope.onsaledata = [];

    $scope.loadMoreOnSaleEvents = function(){
        $scope.onSalefilter.currentPage += 1;
        loadOnSaleEvents();
    }

    function loadOnSaleEvents(){
        ApiService.getEvents($scope.onSalefilter).then(function(res){
            if(res.data.status == 1){

                $scope.onsaledata =  $scope.onsaledata.concat(res.data.data);

                if($scope.onsaledata.length < res.data.count){
                    $scope.isMoreOnSaleEvents = true;
                }else{
                    $scope.isMoreOnSaleEvents = false;
                }

                if($scope.onsaledata.length == 0){
                   $scope.eventEmpty = true;
                }

            }else{
                toaster.pop('error', "Error", res.data.message);
            }
        })
    }

    $scope.downloadAppBanner = function(){
        $uibModal.open({
            template: '<div class="modal-header text-center"> <h3 class="modal-title">GET UPDATES ON OUR EVENTS</h3> </div>' +
            '<div class="modal-body"> ' +
            '<div class="row">' +
            '<div class="col-md-6 text-center"> ' +
            '<a target="_blank" href="https://itunes.apple.com/us/app/waterfront-concerts/id673252714?mt=8"><img style="height: 70vh" src="images/iphone.png" /></a></div>' +
            '<div class="col-md-6 text-center"> ' +
            '<a target="_blank" href="https://play.google.com/store/apps/details?id=com.sephone.WaterfrontConcertsNew"><img style="height: 70vh" src="images/android.png" /></a></div>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer" style="text-align: center !important;"> ' +
            '<button type="button" class="btn btn-default pack-dis-btn" ng-click="cancel()">Close</button> ' +
            '</div>',
            controller: function ($scope,$uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            },
            backdrop : false,
            size :'lg'
        });
    }

    // On Sale

    // upcoming

    $scope.upcomingfilter = {
        "currentPage": 1,
        "pageSize": 12,
        "eventType": "UPCOMING"
    };
    $scope.eventdata = [];
    $scope.gridlist = "grid";

    $scope.toggleListView = function (type) {
        if(type == 'grid'){
            $scope.gridlist = "list";
        }else{
            $scope.gridlist = "grid";
        }
    }

    $scope.loadMoreUpcomingEvents = function(){
        $scope.upcomingfilter.currentPage += 1;
        loadUpcomingEvent();
    }

    $scope.filterEventsUpcoming={location:'0',venue:'0'};
    // function to change venue
    $scope.getVenues = function (filterEventsUpcoming){
        var data = {cityId : filterEventsUpcoming.location,currentPage:1,pageSize:12};
        if(filterEventsUpcoming.location !=='' && filterEventsUpcoming.location !== null){
            if (filterEventsUpcoming.location == 0){
                $scope.filterEventsUpcoming.venue = '0';
                $scope.venues = [];
            }else {
                $scope.venues = [];
                ApiService.getVenues(data).then(function(res){
                    if(res.data.status == 1){
                        // $scope.filterEventsUpcoming.venue = '0';
                        $scope.venues = res.data.data;
                    }else{
                        toaster.pop('error', "Error", res.data.message);
                    }
                })
            }


        }
    }

    if(($localStorage.cityId != undefined && $localStorage.cityId != '') || ($localStorage.venueId != undefined && $localStorage.venueId != '')){
        $scope.selectedCity = $localStorage.cityId;
        $scope.seletedVenue = $localStorage.venueId;
        $scope.filterEventsUpcoming.venue = $scope.seletedVenue;
        $scope.filterEventsUpcoming.location = $localStorage.cityId;
        $scope.upcomingfilter.cityId = $scope.selectedCity;
        $scope.upcomingfilter.venueId = $scope.seletedVenue;
        $scope.getVenues($scope.filterEventsUpcoming);
        $scope.venues = [];
        $scope.eventdata = [];
        // loadUpcomingEvent();
    }



    $scope.filterUpcomingEvent = function (filter) {

        if((filter.location !== '' && filter.location !== null)|| (filter.venue !== '' && filter.venue !== null)){
            $scope.upcomingfilter.venueId = $scope.seletedVenue;
            $scope.upcomingfilter.currentPage = 1;
            $scope.upcomingfilter.pageSize = 12;
            $scope.upcomingfilter.cityId = filter.location;
            $localStorage.cityId = filter.location;
            $scope.upcomingfilter.venueId = filter.venue;
            $localStorage.venueId = filter.venue;
            // $scope.seletedVenue = $localStorage.venueId;
            $scope.eventdata = [];
            loadUpcomingEvent();
        }
    }

    function loadUpcomingEvent(){
        ApiService.getEvents($scope.upcomingfilter).then(function(res){
            if(res.data.status == 1){
                $scope.eventdata = $scope.eventdata.concat(res.data.data);

                if($scope.eventdata.length < res.data.count){
                    $scope.isMoreUpcomingEvents = true;
                }else{
                    $scope.isMoreUpcomingEvents = false;
                }

                if($scope.eventdata.length == 0){
                   $scope.eventdataEmpty = true;
                }
            }else{
                toaster.pop('error', "Error", res.data.message);
            }
        })
    }

    loadUpcomingEvent();
    // upcoming


    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, error);
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        function showPosition(position) {
            callback(null , position.coords);
        }

        function error(err) {
            callback(true , null);
        }
    }

    getCurrentLocation(function (err , data) {
        if(data){
            $scope.onSalefilter.lat = data.latitude;
            $scope.onSalefilter.long = data.longitude;
        }

        loadOnSaleEvents();
    });


    function getLocation(){
        ApiService.getLocation().then(function(res){
            if(res.data.status == 1){
                $scope.locations = res.data.data;
            }else{
                toaster.pop('error', "Error", res.data.message);
            }
        })
    }



    getLocation();
}])
