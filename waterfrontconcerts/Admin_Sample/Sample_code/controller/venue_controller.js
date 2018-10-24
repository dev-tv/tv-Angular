angular.module('controllers')
    .controller('ManageVenueCtrl' , function($scope , $http, $state, ApiService, toaster, $localStorage , $modal, $stateParams, $window){
        // Variable declearation
        $scope.venue = {
            typeOfPayments : []
        };

        // Method to check number
        $scope.isNumber = function (value) {
            var re = new RegExp("^[0-9]{1,45}$");
            if (re.test(value))
            {
                return true;
            } else
            {
                return false;
            }
        }

        /*Method to validate add venue **/
        function validateAddVenue() {
          if ($scope.venue.title == undefined || $scope.venue.title == "") {
            toaster.pop("error", "Error", "Please enter title");
            return false;
          }
          if ($scope.venue.boxOfficePhone == undefined || $scope.venue.boxOfficePhone == "") {
            toaster.pop("error", "Error", "Please enter phone number of Box office");
            return false;
          }

          if ($scope.venue.boxOfficeWorkingHours == undefined || $scope.venue.boxOfficeWorkingHours == "") {
            toaster.pop("error", "Error", "Please enter working office of Box office");
            return false;
          }
          if ($scope.venue.info == undefined || $scope.venue.info == "") {
            toaster.pop("error", "Error", "Please enter info");
            return false;
          }
          if ($scope.venue.city == undefined || $scope.venue.city == "") {
            toaster.pop("error", "Error", "Please select city");
            return false;
          }

          if ($scope.venue.address == undefined || $scope.venue.address == "") {
            toaster.pop("error", "Error", "Please enter address");
            return false;
          }
          if ($scope.venue.zip == undefined || $scope.venue.zip == "") {
            toaster.pop("error", "Error", "Please enter zip");
            return false;
          }
          if (!$scope.isNumber($scope.venue.zip)) {
            toaster.pop("error", "Error", "Please enter valid zip");
            return false;
          }
          if ($scope.venue.description == undefined || $scope.venue.description == "") {
            toaster.pop("error", "Error", "Please enter description");
            return false;
          }
          if ($scope.venue.directions == undefined || $scope.venue.directions == "") {
            toaster.pop("error", "Error", "Please enter directions");
            return false;
          }
          if ($scope.venue.termsAndRules == undefined || $scope.venue.termsAndRules == "") {
            toaster.pop("error", "Error", "Please enter terms and rules");
            return false;
          }
          if ($scope.venue.typeOfPayments.length == undefined || $scope.venue.typeOfPayments.length == 0) {
            toaster.pop("error", "Error", "Please select atlest one type of payment mode");
            return false;
          }

            if($scope.venue.bannerImage == undefined || $scope.venue.bannerImage == ""){
                toaster.pop('error', "Error", "Please add banner image.");
                return false;
            }

            if($scope.venue.featureImage == undefined || $scope.venue.featureImage == ""){
                toaster.pop('error', "Error", "Please add feature image.");
                return false;
            }

            if($scope.venue.sittingChartImage == undefined || $scope.venue.sittingChartImage == ""){
                toaster.pop('error', "Error", "Please add sitting chart image.");
                return false;
            }
          return true;
        }

        // API calling to add/edit venue
        $scope.addVenue = function (venue) {
          var isValid = validateAddVenue();
          if (isValid) {
            if ($scope.venue._id == undefined) {
              ApiService.addVenue(venue).then(function(res){
                  if(res.data.status == 1){
                      toaster.pop('success', "Alert", res.data.message);
                      clearCache();
                      $state.go('app.venues');
                  }else{
                      toaster.pop('error', "Error", res.data.message);
                  }
              })
            }else {
              ApiService.UpdateVenue(venue).then(function(res){
                  if(res.data.status == 1){
                      toaster.pop('success', "Alert", res.data.message);
                      clearCache();
                      $state.go('app.venues');
                  }else{
                      toaster.pop('error', "Error", res.data.message);
                  }
              })
            }

          }
        }

        // Method to clear local storage
        function clearCache(){
            delete $localStorage.eventFeedPhotos;
            delete $localStorage.images;
            $localStorage.images = undefined;
            $localStorage.eventFeedPhotos = undefined;
        }

        // Method to add payment option
        $scope.addPaymentOption = function (opt) {
            if($scope.venue.typeOfPayments.indexOf(opt) == -1){
                $scope.venue.typeOfPayments.push(opt);
            }else{
                $scope.venue.typeOfPayments.splice($scope.venue.typeOfPayments.indexOf(opt), 1);
            }
        }

        // Method to check seleted payment option
        $scope.payment = function (value) {
          if($scope.venue.typeOfPayments.indexOf(value) == -1){
              return false;
          }else {
            return true;
          }
        }

        // Method to add image from model
        $scope.addImages = function(){
            var modalInstance = $modal.open({
                templateUrl: 'views/modals/venueImageUpload.html',
                controller: "CropperCtrl",
                controllerAs: "cropperCtrl",
                backdrop : false,
                size : 'lg',
                resolve : {
                    images : function() {
                        return {
                            action : "venue",
                            bannerImage : $scope.venue.bannerImage,
                            featureImage : $scope.venue.featureImage,
                            sittingChartImage : $scope.venue.sittingChartImage || [],
                            galleryImages : $scope.venue.galleryImages || []
                        };
                    }
                }
            });

            modalInstance.result.then(function () {
                if($localStorage.images){
                    $scope.venue.bannerImage = $localStorage.images.bannerImage;
                    $scope.venue.featureImage = $localStorage.images.featureImage;
                    $scope.venue.galleryImages = $localStorage.images.galleryImages;
                    $scope.venue.sittingChartImage = $localStorage.images.sittingChartImage;
                }
            }, function () {
            });
        }

        // Method to watch variable
        $scope.$watch(function(){
            return $localStorage.images;
        }, function(newCodes, oldCodes){
            if($localStorage.images){
                $scope.venue.bannerImage = $localStorage.images.bannerImage;
                $scope.venue.featureImage = $localStorage.images.featureImage;
                $scope.venue.galleryImages = $localStorage.images.galleryImages;
                $scope.venue.sittingChartImage = $localStorage.images.sittingChartImage;
            }
        });

        // Method to get venue details
        $scope.getVenue = function(data){
          ApiService.getVenue({_id:data}).then(function(res){
              if(res.data.status == 1){
                  $scope.venue = res.data.data;
                  $scope.venueTitle = angular.copy(res.data.data.title);
              }else{
                  toaster.pop('error', "Error", res.data.message);
              }
          })
        }

        //Funtion to delete Venue
        $scope.deleteVenue=function(Id){
          if ($window.confirm("Are you sure, you want to delete it?" )) {
            ApiService.deleteVenue({_id:Id}).then(function(res){
                if(res.data.status == 1){
                    toaster.pop('success', "Alert", res.data.message);
                    $state.go("app.venues");
                }else{
                    toaster.pop('error', "Error", res.data.error);
                }
            })
          }
        }

        // Method to get location
        function getLocation(){
            ApiService.getLocation().then(function(res){
                if(res.data.status == 1){
                    $scope.cities = res.data.data;
                }else{
                    toaster.pop('error', "Error", res.data.message);
                }
            })
        }


        // Method called when view is loaded
        getLocation();
        // Method to for edit mode
        if ($stateParams.venueId) {
          $scope.getVenue($stateParams.venueId);
        }
    })

