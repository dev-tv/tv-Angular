angular.module('controllers')
    .controller('ManageEventCtrl' , function($scope , $http, $state, ApiService, toaster, $modal, $filter, $localStorage, $stateParams, $window, autoSearchAjax, utils){

        setEventData();
	// Method to check in edit mode
        if ($stateParams.tab == "package") {
          $scope.package = true;
        }

        // Method to show selected seating chart
        $scope.toggleImagesSelection = function(image){
        $scope.event.venueSittingChartImage = image;
        }

        // Method for setting variable
        function setEventData() {
            if($stateParams.eventId){
                ApiService.getEventDetail({_id : $stateParams.eventId}).then(function(res){
                    if(res.data.status == 1){
                        $scope.event = res.data.data;
                        $scope.eventTitle = ($scope.event.title == '') ? 'UNTITLED' : angular.copy($scope.event.title);
                        $scope.event.startDate = moment($scope.event.startDate);
                        $scope.event.startTime = moment($scope.event.startTime);
                        $scope.event.endDate = moment($scope.event.endDate);
                        $scope.event.endTime = moment($scope.event.endTime);

                        $scope.event.onSaleDate = $scope.event.onSaleDate ? moment($scope.event.onSaleDate) : "";
                        $scope.event.onSaleTime = $scope.event.onSaleTime ? moment($scope.event.onSaleTime) : "";
                        $scope.event.cutOffDate = $scope.event.cutOffDate ? moment($scope.event.cutOffDate) : "";
                        $scope.event.cutOffTime = $scope.event.cutOffTime ? moment($scope.event.cutOffTime) : "";
                        $scope.event.doorTime = $scope.event.doorTime ? moment($scope.event.doorTime) : "";
                        $scope.settingCharts = $scope.event.sittingChartImage;
                        $scope.typeOfPayments = $scope.event.typeOfPayments;

                        if($scope.event.tickets.length == 0){
                            $scope.event.tickets.push({ name : "", link : "", price : null, reducePrice : null, reducePriceDate : null, reducePriceTime : null, startPresaleDate : null, startPresaleTime : null, endPresaleDate : 0, endPresaleTime : 0, sponsor : null, promoCode : null, type : "GA", reducePriceTicketLink : "" });
                        }else{
                            for (var i = 0 ; i < $scope.event.tickets.length ; i ++){
                                $scope.event.tickets[i].reducePriceDate = $scope.event.tickets[i].reducePriceDate ? moment($scope.event.tickets[i].reducePriceDate) : "";
                                $scope.event.tickets[i].reducePriceTime = $scope.event.tickets[i].reducePriceTime ? moment($scope.event.tickets[i].reducePriceTime) : "";
                                $scope.event.tickets[i].startPresaleDate = $scope.event.tickets[i].startPresaleDate ? moment($scope.event.tickets[i].startPresaleDate) : "";
                                $scope.event.tickets[i].startPresaleTime = $scope.event.tickets[i].startPresaleTime ? moment($scope.event.tickets[i].startPresaleTime) : "";
                                $scope.event.tickets[i].endPresaleDate = $scope.event.tickets[i].endPresaleDate ? moment($scope.event.tickets[i].endPresaleDate) : "";
                                $scope.event.tickets[i].endPresaleTime = $scope.event.tickets[i].endPresaleTime ? moment($scope.event.tickets[i].endPresaleTime) : "";
                            }
                        }

                        if($scope.event.media.length == 0){
                            $scope.event.media.push({ title : "", type : "", link : "" });
                        }
                        if($scope.event.packages.length == 0){
                            $scope.event.packages.push({ title : "", description : "", ticketLink : "", price : "" , isParking : false});
                        }
                    }else{
                        toaster.pop('error', "Error", res.data.message);
                    }
                })
            }else{
                var event = {
                    title : "",
                    subTitle : "",
                    termsAndRules : "",
                    startDate : 0,
                    startTime : 0,
                    endDate : 0,
                    endTime : 0,
                    seoTitle : "",
                    seoDescription : "",
                    venue : "",
                    description : "",
                    isFeatured : 0,
                    isPublished : 0,
                    onSaleDate : 0,
                    onSaleTime : 0,
                    cutOffDate : 0,
                    cutOffTime : 0,
                    doorTime : 0,
                    generalTicketLink : "",
                    venueSittingChartImage : "",
                    images : [],
                    tickets : [
                        {
                            name : "",
                            link : "",
                            price : null,
                            reducePrice : null,
                            reducePriceDate : 0,
                            reducePriceTime : 0,
                            startPresaleDate : 0,
                            startPresaleTime : 0,
                            endPresaleDate : 0,
                            endPresaleTime : 0,
                            sponsor : null,
                            promoCode : null,
                            type : "GA",
                            reducePriceTicketLink : ""
                        }
                    ],
                    packages : [
                        {
                            title : "",
                            description : "",
                            ticketLink : "",
                            price : "",
                            isParking : false
                        }
                    ],
                    media : [
                        {
                            title : "",
                            type : "",
                            link : ""
                        }
                    ]
                };
                if($localStorage.event){
                    $scope.event = $localStorage.event;
                }else{
                    $scope.event = angular.copy(event);
                }
            }
        }

        //Method for isFeatured
        $scope.toggleFeatured = function(){
          if ($scope.event.isFeatured == 0) {
            $scope.event.isFeatured = 1;
          }else {
            $scope.event.isFeatured = 0;
          }
        }

        // Method for add ticket section
        $scope.addTicket = function () {
            $scope.event.tickets.unshift(
                {
                    name : "",
                    link : "",
                    priceStart : "",
                    priceEnd : ""
                }
            );
        }

        // Method for add presale section
        $scope.addPresale = function (ticketIndex) {
            $scope.event.tickets[ticketIndex].presales.unshift(
                {
                    name : "",
                    startPresaleDate : 0,
                    startPresaleTime : 0,
                    endPresaleDate : 0,
                    endPresaleTime : 0
                }
            );
            setTimeout(function(){ $scope.$apply();},0)
        }

        // Method to delete added tickets
        $scope.deleteTicket = function (index) {
            if(window.confirm('Are you sure?')) {
                $scope.event.tickets.splice(index, 1);
            }
        }

        // Method to add packages
        $scope.addPackage = function () {
            $scope.event.packages.unshift(
                {
                    title : "",
                    description : "",
                    ticketLink : "",
                    price : "",
                    isParking : false
                }
            );
        }

        // Method to delete package
        $scope.deletePackage = function (index) {
            if(window.confirm('Are you sure?')) {
                $scope.event.packages.splice(index, 1);
            }
        }

        // Method to get templates from API
        function getTemplatesList(){
          ApiService.getTemplatesList().then(function(res){
              if(res.data.status == 1){
                  $scope.templates = res.data.data;
              }else{
                  toaster.pop('error', "Error", res.data.message);
              }
          })
        }

        // Method to convert html tag to plain text
        $scope.htmlToPlaintext = function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }

        // Method to create templates
        $scope.saveAsTemplate = function (template) {
            // Validation for templates
            function validatePackage() {
              if (template.title == undefined || template.title == "") {
                  toaster.pop('error', "Error", "Please enter package title");
                  return false;
              }
              if (template.ticketLink == undefined || template.ticketLink == "") {
                  toaster.pop('error', "Error", "Please enter package link");
                  return false;
              }
              if (template.price == undefined || template.price == "") {
                  toaster.pop('error', "Error", "Please enter package price");
                  return false;
              }
              if (!$scope.isNumber(template.price)) {
                  toaster.pop("error", "Error", "Please enter valid price for package");
                  return false;
              }
              if (template.description == undefined || template.description == "") {
                  toaster.pop('error', "Error", "Please enter package description");
                  return false;
              }
              return true;
            }
            var isValid = validatePackage()
            if (isValid) {
              // API calling to add templates
              ApiService.saveAsTemplate(template).then(function(res){
                  if(res.data.status == 1){
                      toaster.pop('success', "Alert", res.data.message);
                      getTemplatesList();
                  }else{
                      toaster.pop('error', "Error", res.data.message);
                  }
              })
            }

        }

        // Method to add templates to package
        $scope.addTemplateToPackage = function (template) {
           var template = JSON.parse(template);
            $scope.event.packages.unshift(
                {
                    title : template.title,
                    description : template.description,
                    ticketLink : template.ticketLink,
                    price : template.price,
		    isParking : template.isParking
                }
            );
        }

        //Method for rule list
        function getTemplatesRulesList(){
          ApiService.getTemplatesRulesList().then(function(res){
              if(res.data.status == 1){
                  $scope.rulesList = res.data.data;
              }else{
                  toaster.pop('error', "Error", res.data.message);
              }
          })
        }

        //Method for Save as template for Rules
        $scope.saveAsTemplateRules = function(rule){
          function validateRules() {
            if (rule == undefined || rule == "") {
                toaster.pop('error', "Error", "Please provide contains for rules");
                return false;
            }
            return true;
          }
          var isValid = validateRules()
          if (isValid) {
            ApiService.saveAsTemplateRules({termsAndRules:rule}).then(function(res){
                if(res.data.status == 1){
                    toaster.pop('success', "Alert", res.data.message);
                    getTemplatesRulesList();
                }else{
                    toaster.pop('error', "Error", res.data.message);
                }
            })
          }
        }

        // Selected rules from list
        $scope.addTemplateToRule = function (rule) {
            // $scope.ruleSelected = true;
            $scope.event.termsAndRules = rule;
        }

        // Method to add new media
        $scope.addMedia = function () {
            $scope.event.media.unshift(
                {
                    title : "",
                    type : "",
                    link : ""
                }
            );
        }

        // Method to delete media
        $scope.deleteMedia = function (index) {
            if(window.confirm('Are you sure?')) {
                $scope.event.media.splice(index, 1);
            }
        }

        // Method to create event
        $scope.createEvent = function (event) {
            var isValid = validateAddEvent();
            if (isValid) {
                    event.startDate = new Date(event.startDate).getTime();
                    event.startTime = new Date(event.startTime).getTime();
                    event.endDate = new Date(event.endDate).getTime();
                    event.endTime = new Date(event.endTime).getTime();
                    event.onSaleDate = new Date(event.onSaleDate).getTime();
                    event.onSaleTime = new Date(event.onSaleTime).getTime();
                    event.cutOffDate = new Date(event.cutOffDate).getTime();
                    event.cutOffTime = new Date(event.cutOffTime).getTime();
                    event.doorTime = new Date(event.doorTime).getTime();

                    //new
                    event.onSaleDateTime = utils.formatDateTime(event.onSaleDate, event.onSaleTime);
                    event.cutOffDateTime = utils.formatDateTime(event.cutOffDate, event.cutOffTime);
                    //new

                    if($localStorage.images){
                        event.bannerImage = $localStorage.images.bannerImage;
                        event.featureImage = $localStorage.images.featureImage;
                        event.galleryImages = $localStorage.images.galleryImages;
                    }

                    // var tickets = [];
                    for (var i = 0 ; i < event.tickets.length ; i ++){
                        //if(event.tickets[i].name != "" && event.tickets[i].link != "" && event.tickets[i].price != "") {
                        event.tickets[i].reducePriceDate = new Date(event.tickets[i].reducePriceDate).getTime();
                        event.tickets[i].reducePriceTime = new Date(event.tickets[i].reducePriceTime).getTime();
                        event.tickets[i].startPresaleDate = new Date(event.tickets[i].startPresaleDate).getTime();
                        event.tickets[i].startPresaleTime = new Date(event.tickets[i].startPresaleTime).getTime();
                        event.tickets[i].endPresaleDate = new Date(event.tickets[i].endPresaleDate).getTime();
                        event.tickets[i].endPresaleTime = new Date(event.tickets[i].endPresaleTime).getTime();
                        //event.tickets[i].price = parseInt(event.tickets[i].price);

                        if (!event.tickets[i].sponsor)
                            delete event.tickets[i].sponsor;
                    }

                if(event._id){ // update event
                    ApiService.updateEvent(event).then(function(res){
                        if(res.data.status == 1){
                            toaster.pop('success', "Alert", res.data.message);
                            clearCache();
                            $state.go('app.events');
                        }else{
                            toaster.pop('error', "Error", res.data.message);
                        }
                    })
                }else{ // create event
                    ApiService.createEvent(event).then(function(res){
                        if(res.data.status == 1){
                            toaster.pop('success', "Alert", res.data.message);
                            clearCache();
                            $state.go('app.events');
                        }else{
                            toaster.pop('error', "Error", res.data.message);
                        }
                    })
                }

            }
        }

        // Method to clear localstorage
        function clearCache(){
            delete $localStorage.event;
            delete $localStorage.eventFeedPhotos;
            delete $localStorage.images;
            $localStorage.images = undefined;
            $localStorage.eventFeedPhotos = undefined;
            $localStorage.event = undefined;

        }

        //Funtion to delete Event
        $scope.deleteEvent=function(Id){
          if ($window.confirm("Are you sure, you want to delete it?" )) {
            ApiService.deleteEvent({_id:Id}).then(function(res){
                if(res.data.status == 1){
                    toaster.pop('success', "Alert", res.data.message);
                    $state.go("app.events");
                }else{
                    toaster.pop('error', "Error", res.data.error);
                }
            })
          }
        }

        $scope.venueId=false;
        $scope.sponsorId = false;

        //Auto search service for venues
        $scope.search = {'venueDetailsList': [],'sponsorDetailsList': []};
        $scope.showSearchUserResult = false;
        $scope.$watch('event.venue', function (val) {

            var payload = {'search': val,'limit':10};
            autoSearchAjax.getVenue(payload, function (data) {
                $scope.search.venueDetailsList = data.data;
            });
        });

        //Auto search change function for venues
        function nameToValueVenue(obj) {
            if (angular.isObject(obj) && angular.isUndefined(obj.value)) {
                var obj1 = obj.item;
                $scope.venueId = true;
                $scope.settingCharts = obj1.sittingChartImage;
                $scope.typeOfPayments = obj1.typeOfPayments;
                $scope.event.venueId = obj1._id;
            }
            return obj;
        }

        //Auto search change function for venues
        function searchVenue() {
            var that = this;
            this.options = {
                html: true,
                minLength: 1,
                focusOpen: true,
                outHeight: 100,
                maxWidth: 300,
                source: function (request, response) {
                    // you can $http or $resource service to get data frome server.
                    var list = angular.copy($scope.search.venueDetailsList);
                    var group = {}, data = [];
                    angular.forEach(list, function (user) {
                        user.label =  user.title;
                    });
                    // filter data, methods will be added after uiAutocomplete initialized.
                    list = that.methods.filter(list, request.term);
                    angular.forEach(list, function (user) {
                        group[user.group] = group[user.group] || [];
                        group[user.group].push(user);
                    });
                    angular.forEach(group, function (value, key) {
                        // groupLabel
                        data.push({
                            groupLabel: 'Venues list according to search'
                        });
                        data = data.concat(value);
                    });
                    // response data to suggestion menu.
                    response(data);
                }
            };
            this.events = {
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    nameToValueVenue(ui);
                }
            };
        }

        //Auto search change function for venues
        $scope.venues = [];
        $scope.changeClass = function (options) {
            var widget = options.methods.widget();
            widget.removeClass('ui-menu ui-corner-all ui-widget-content').addClass('dropdown-menu');
        };

        //Auto search for venues
        $scope.searchVenue = function () {
            this.searchVenue = new searchVenue();
            return this.searchVenue;
        };

        $scope.venueChange = function () {
            if($scope.venueId == false){
                $scope.settingChart = "";
                $scope.typeOfPayments = "";
                $scope.event.venueId = "";
                $scope.event.venueSittingChartImage = "";
            }
        }

        //Auto search service for sponsors
        //$scope.search = {};
        $scope.showSearchUserResult = false;
        $scope.sponsorChange = function(sponsorSearch , index){
          $scope.inDex = index;
          if($scope.sponsorId == false){
              $scope.event.tickets[$scope.inDex].sponsorId="";
          }
          //var val = $scope.event.tickets[index].sponsor;
          var payload = {'search': sponsorSearch,'limit':10};
                  autoSearchAjax.getSponsor(payload, function (data) {
                      $scope.search.sponsorDetailsList = data.data;
                  });
        }
        // }

        //Auto search change function for sponsor
        function nameToValue(obj) {
            if (angular.isObject(obj) && angular.isUndefined(obj.value)) {
                var obj1 = obj.item;
                $scope.sponsorId = true;
                $scope.event.tickets[$scope.inDex].sponsorId = obj1._id;
                // obj.value = obj.title;
            }
            return obj;
        }

        //Auto search change function for sponsor
        function SearchSponsor() {
            var that = this;
            this.options = {
                html: true,
                minLength: 1,
                focusOpen: true,
                outHeight: 100,
                maxWidth: 300,
                source: function (request, response) {
                    // you can $http or $resource service to get data frome server.
                    // var list = angular.copy(users);
                    var list = angular.copy($scope.search.sponsorDetailsList);
                    var group = {}, data = [];
                    angular.forEach(list, function (user) {
                        user.label =  user.name;
                    });
                    // filter data, methods will be added after uiAutocomplete initialized.
                    list = that.methods.filter(list, request.term);
                    angular.forEach(list, function (user) {
                        group[user.group] = group[user.group] || [];
                        group[user.group].push(user);
                    });
                    angular.forEach(group, function (value, key) {
                        // groupLabel
                        data.push({
                            groupLabel: 'Sponsor list according to search'
                        });
                        data = data.concat(value);
                    });
                    // response data to suggestion menu.
                    response(data);
                }
            };
            this.events = {
                change: function (event, ui) {

                },
                select: function (event, ui) {

                    nameToValue(ui);
                }
            };
        }

        //Auto search change function for sponsor
        $scope.sponsors = [];
        $scope.changeClassSponsor = function (options) {
            var widget = options.methods.widget();
            // remove default class, use bootstrap style
            widget.removeClass('ui-menu ui-corner-all ui-widget-content').addClass('dropdown-menu');
        };

        //Auto search for sponsor
        $scope.searchSponsor = function () {
            this.searchSponsor = new SearchSponsor();
            return this.searchSponsor;
        };

        // Method to checking link
        $scope.isLink = function (value) {
            var re = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");
            if (re.test(value))
            {
                return true;
            } else
            {
                return false;
            }
        }

        // Method for checking number
        $scope.isNumber = function (value) {
            var re = new RegExp("^[+-]?(?:[0-9]{0,9}\.[0-9]{1,9}|[0-9])$");
            if (re.test(value))
            {
                return true;
            } else
            {
                return false;
            }
        }

        // Method for validation for events
        function validateAddEvent() {
            if ($scope.event.isPublished == 1) {
                // Validation for general-info Tab
                if ($scope.event.title == undefined || $scope.event.title == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter title");
                    return false;
                }
                if ($scope.event.subTitle == undefined || $scope.event.subTitle == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter subtitle");
                    return false;
                }
                if ($scope.event.startDate == undefined || $scope.event.startDate == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter event start date");
                    return false;
                }
                if ($scope.event.startTime == undefined || $scope.event.startTime == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter event start time");
                    return false;
                }
                if ($scope.event.endDate == undefined || $scope.event.endDate == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter event end date");
                    return false;
                }
                if ($scope.event.startDate > $scope.event.endDate) {
                    toaster.pop('error', "Error", "Tab(General-info):- Event end date cannot be less than event start date");
                    return false;
                }
                if ($scope.event.endTime == undefined || $scope.event.endTime == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter event end time");
                    return false;
                }
                if ($scope.event.doorTime == undefined || $scope.event.doorTime == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter door time");
                    return false;
                }
                if ($scope.event.venue == undefined || $scope.event.venue == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please select venue");
                    return false;
                }
                if ($scope.event.venueId == undefined || $scope.event.venueId == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please select venue from dropdown");
                    return false;
                }
                if ($scope.event.description == undefined || $scope.event.description == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please enter description");
                    return false;
                }
                if ($scope.event.venueSittingChartImage == undefined || $scope.event.venueSittingChartImage == "") {
                    toaster.pop('error', "Error", "Tab(General-info):- Please select one seating chart");
                    return false;
                }

                if($scope.event.bannerImage == undefined || $scope.event.bannerImage == ""){
                    toaster.pop('error', "Error", "Tab(General-info):- Please add banner image.");
                    return false;
                }

                if($scope.event.featureImage == undefined || $scope.event.featureImage == ""){
                    toaster.pop('error', "Error", "Tab(General-info):- Please add feature image.");
                    return false;
                }

                // Validation for tickets Tab
                if ($scope.event.onSaleDate != undefined && $scope.event.onSaleDate != "" ||
                    $scope.event.onSaleTime != undefined && $scope.event.onSaleTime != "" ||
                    $scope.event.cutOffDate != undefined && $scope.event.cutOffDate != "" ||
                    $scope.event.cutOffTime != undefined && $scope.event.cutOffTime != "" ||
                    $scope.event.generalTicketLink != undefined && $scope.event.generalTicketLink != "") {
                    if ($scope.event.onSaleDate == undefined || $scope.event.onSaleDate == "") {
                        toaster.pop('error', "Error", "Tab(Tickets):- Please select sale date");
                        return false;
                    }
                    if ($scope.event.onSaleTime == undefined || $scope.event.onSaleTime == "") {
                        toaster.pop('error', "Error", "Tab(Tickets):- Please enter sale time");
                        return false;
                    }
                    if ($scope.event.cutOffDate == undefined || $scope.event.cutOffDate == "") {
                        toaster.pop('error', "Error", "Tab(Tickets):- Please enter cutoff date");
                        return false;
                    }

                    if ($scope.event.cutOffTime == undefined || $scope.event.cutOffTime == "") {
                        toaster.pop('error', "Error", "Tab(Tickets):- Please enter cutoff time");
                        return false;
                    }
                    if ($scope.event.onSaleDate > $scope.event.cutOffDate) {
                        toaster.pop('error', "Error", "tab(Tickets):- Ticket cutoff date should be greater than on sale date");
                        return false;
                    }
                    if ($scope.event.generalTicketLink == undefined || $scope.event.generalTicketLink == "") {
                        toaster.pop('error', "Error", "Tab(Tickets):- Please enter general ticket link");
                        return false;
                    }
                    if (!$scope.isLink($scope.event.generalTicketLink)) {
                      toaster.pop("error", "Error", "Tab(Tickets):- Please enter valid general ticket link");
                      return false;
                    }

                    for (var i = 0; i < $scope.event.tickets.length; i++) {
                        if ($scope.event.tickets[i].name == undefined || $scope.event.tickets[i].name =="") {
                            toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket name");
                            return false;
                        }
                        if ($scope.event.tickets[i].link == undefined || $scope.event.tickets[i].link =="") {
                            toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket link");
                            return false;
                        }
                        if (!$scope.isLink($scope.event.tickets[i].link)) {
                          toaster.pop("error", "Error", "Tab(Tickets):- Please enter valid link for ticket");
                          return false;
                        }
                        if ($scope.event.tickets[i].price == undefined || $scope.event.tickets[i].price =="") {
                            toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket price");
                            return false;
                        }


                        if ($scope.event.tickets[i].isReducedPrice == false) {

                            if ($scope.event.tickets[i].reducePrice == undefined || $scope.event.tickets[i].reducePrice == "") {
                                toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket reduce price");
                                return false;
                            }

                            if ($scope.event.tickets[i].reducePriceDate == undefined || $scope.event.tickets[i].reducePriceDate == "") {
                                toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket reduce date");
                                return false;
                            }
                            if ($scope.event.tickets[i].reducePriceTime == undefined || $scope.event.tickets[i].reducePriceTime == "") {
                                toaster.pop('error', "Error", "Tab(Tickets):- Please enter ticket reduce time");
                                return false;
                            }

                            if ($scope.event.tickets[0].isPresale == true) {
                                if ($scope.event.tickets[i].startPresaleDate == undefined || $scope.event.tickets[i].startPresaleDate == "" ) {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select start presale date");
                                    return false;
                                }
                                if ($scope.event.tickets[i].startPresaleTime == undefined || $scope.event.tickets[i].startPresaleTime == "" ) {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select start presale time");
                                    return false;
                                }
                                if ($scope.event.tickets[i].endPresaleDate == undefined || $scope.event.tickets[i].endPresaleDate == "" ) {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select end presale date");
                                    return false;
                                }
                                if ($scope.event.tickets[i].endPresaleTime == undefined || $scope.event.tickets[i].endPresaleTime == "" ) {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select end presale time");
                                    return false;
                                }
                                if ($scope.event.tickets[i].sponsor == undefined || $scope.event.tickets[i].sponsor == "") {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select sponsor");
                                    return false;
                                }
                                if ($scope.event.tickets[i].sponsorId == undefined || $scope.event.tickets[i].sponsorId == "") {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please select sponsor from dropdown");
                                    return false;
                                }
                                if ($scope.event.tickets[i].promoCode == undefined || $scope.event.tickets[i].promoCode == "") {
                                    toaster.pop('error', "Error", "Tab(Tickets):- Please enter promo code");
                                    return false;
                                }
                            }

                        }
                    }
                }


                if ($scope.event.generalTicketLink != undefined && $scope.event.generalTicketLink != "" && !$scope.isLink($scope.event.generalTicketLink)) {
                    toaster.pop("error", "Error", "Tab(Tickets):- Please enter valid link for general ticket link");
                    return false;
                }

                // Validation for package Tab
                for (var i = 0; i < $scope.event.packages.length; i++) {
                    if ( $scope.event.packages[i].title !== undefined && $scope.event.packages[i].title !== "" ||
                        $scope.event.packages[i].ticketLink !== undefined && $scope.event.packages[i].ticketLink !== "" ||
                        $scope.event.packages[i].price !== undefined && $scope.event.packages[i].price !== "" ||
                        $scope.event.packages[i].description !== undefined && $scope.event.packages[i].description !== "") {

                        if ($scope.event.packages[i].title == undefined || $scope.event.packages[i].title == "") {
                            toaster.pop('error', "Error", "Tab(Package):- Please enter package title");
                            return false;
                        }
                        if ($scope.event.packages[i].ticketLink == undefined || $scope.event.packages[i].ticketLink == "") {
                            toaster.pop('error', "Error", "Tab(Package):- Please enter package link");
                            return false;
                        }
                        if (!$scope.isLink($scope.event.packages[i].ticketLink)) {
                          toaster.pop("error", "Error", "Tab(Package):- Please enter valid link for package");
                          return false;
                        }
                        if ($scope.event.packages[i].price == undefined || $scope.event.packages[i].price == "") {
                            toaster.pop('error', "Error", "Tab(Package):- Please enter package price");
                            return false;
                        }
                        if (!$scope.isNumber($scope.event.packages[i].price)) {
                            toaster.pop("error", "Error", "Tab(Package):- Please enter valid price for package");
                            return false;
                        }
                        if ($scope.event.packages[i].description == undefined || $scope.event.packages[i].description == "") {
                            toaster.pop('error', "Error", "Tab(Package):- Please enter package description");
                            return false;
                        }
                    }
                }

                // Validation for media Tab
                for (var i = 0; i < $scope.event.media.length; i++) {
                    if ($scope.event.media[i].type == 'Radio' || $scope.event.media[i].type == 'Spotify' || $scope.event.media[i].type == 'Attach') {
                        if ($scope.event.media[i].title == undefined || $scope.event.media[i].title == "") {
                            toaster.pop('error', "Error", "Tab(Media):- Please enter title");
                            return false;
                        }
                        if ($scope.event.media[i].link == undefined || $scope.event.media[i].link == "") {
                            toaster.pop('error', "Error", "Tab(Media):- Please enter link");
                            return false;
                        }
                        if (!$scope.isLink($scope.event.media[i].link)) {
                          toaster.pop("error", "Error", "Tab(Media):- Please enter valid link for media");
                          return false;
                        }
                    }
                    if ($scope.event.media[i].title !== undefined && $scope.event.media[i].title !== "" || $scope.event.media[i].link !== undefined && $scope.event.media[i].link !== "") {
                        if ($scope.event.media[i].type == undefined || $scope.event.media[i].type == "") {
                            toaster.pop('error', "Error", "Tab(Media):- Please select media type");
                            return false;
                        }
                        if ($scope.event.media[i].title == undefined || $scope.event.media[i].title == "") {
                            toaster.pop('error', "Error", "Tab(Media):- Please enter title");
                            return false;
                        }
                        if ($scope.event.media[i].link == undefined || $scope.event.media[i].link == "") {
                            toaster.pop('error', "Error", "Tab(Media):- Please enter link");
                            return false;
                        }
                        if (!$scope.isLink($scope.event.media[i].link)) {
                          toaster.pop("error", "Error", "Tab(Tickets):- Please enter valid link for media");
                          return false;
                        }
                    }
                }
                return true;
            }else {
                return true;
            }

        }

        // Method for model 
        $scope.addImages = function(){
            var modalInstance = $modal.open({
                templateUrl: 'views/modals/eventImageUpload.html',
                controller: "CropperCtrl",
                controllerAs: "cropperCtrl",
                backdrop : false,
                size : 'lg',
                resolve : {
                    images : function() {
                        return {
                            action : "event",
                            bannerImage : $scope.event.bannerImage,
                            featureImage : $scope.event.featureImage,
                            galleryImages : $scope.event.galleryImages || []
                        };
                    }
                }
            });

            modalInstance.result.then(function () {
                if($localStorage.images){
                    $scope.event.bannerImage = $localStorage.images.bannerImage;
                    $scope.event.featureImage = $localStorage.images.featureImage;
                    $scope.event.galleryImages = $localStorage.images.galleryImages;
                }
            });
        }

        $scope.$watch('event', function(newVal, oldVal){
            $localStorage.event = newVal;
        }, true);

        // Method called when view is loaded
        getTemplatesList();
        getTemplatesRulesList();
    });

