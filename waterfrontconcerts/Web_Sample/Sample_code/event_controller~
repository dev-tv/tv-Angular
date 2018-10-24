.controller('event',['$scope','$rootScope','$log','$routeParams','ApiService','Lightbox','$uibModal','toaster','$location','ngMeta', function ($scope,$rootScope,$log,$routeParams,ApiService,Lightbox,$uibModal, toaster, $location, ngMeta) {
    function eventDetail() {
        ApiService.getEventDetail({ 'slug': getSlug()}).then(function(res){
            if(res.data.status == 1){
                $scope.EventDetails = res.data.data;

                setMetaTags($scope.EventDetails);
            }else{
                toaster.pop('error', "Error", res.data.message);
            }
        })
    }

    function setMetaTags(event) {
        if(event.seoTitle){
            ngMeta.setTitle(event.seoTitle);
        }else{
            ngMeta.setTitle(event.title);
        }

        if(event.seoDescription){
            ngMeta.setTag('description', event.seoDescription);
        }else{
            ngMeta.setTag('description', event.description);
        }

        ngMeta.setTag('image', event.featureImage);
    }

    $scope.viewImage = function (images , index) {
        Lightbox.openModal(images, index);
    };

    $scope.htmlToPlaintext = function(val) {
        var div = document.createElement("div");
        div.innerHTML = val;
        var text = div.textContent || div.innerText || "";
        return text;
    }

    $scope.packageDetail = function (package) {
        $uibModal.open({
            template: '<div class="modal-body" style="padding: 50px"> ' +
                '<div class="row">' +
                    '<div class="text-center text-uppercase"> ' +
                        '<a href><img src="images/ic-package-popup@2x.png"  width="120"/></a>' +
                        '<h1>{{package.title}}</h1>' +
                    '</div>' +
                    '<div class="txt-desc" ng-bind-html="package.description" style="padding: 20px;">' +
                    '</div>' +
                    '<div class="text-center"> ' +
                        '<button type="button" class="btn btn-default pack-dis-btn" ng-click="cancel()">Close</button> ' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '',
            controller: function ($scope,$uibModalInstance, package) {
                $scope.package = package;
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            },
            backdrop : false,
            size :'lg',
            resolve: {
                package: function () {
                    return package;
                }
            }
        });
    }

    function getSlug() {
        var slug = $location.path().split('/');
        slug.splice(0, 1);
        slug.splice(0, 1);
        return slug.join('/');
    }

    eventDetail();
}])
