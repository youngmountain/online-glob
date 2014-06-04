'use strict';

angular.module('globApp')
  .controller('MainCtrl', function ($scope, $http) {

    var that = this;

    function $(id) {
      /*global document*/
      return document.getElementById(id);
    }
    /*global plupload*/
    var uploader = new plupload.Uploader({
      /* jshint camelcase: false */
      runtimes: 'html5',
      drop_element: 'drop-target',
      browse_button: 'drop-target',
      max_file_size: '10mb',
      upload: 'upload.php'
    });

    uploader.bind('Init', function () {
      if (uploader.features.dragdrop) {
        angular.element('#debug').hide();

        var target = $('drop-target');

        target.ondragover = function (event) {
          event.dataTransfer.dropEffect = 'copy';
        };

        target.ondragenter = function () {
          this.className = 'dragover';
        };

        target.ondragleave = function () {
          this.className = '';
        };

        target.ondrop = function () {
          this.className = '';
        };
      }
    });

    /**
     * example input:
     * [
     * 'test/image.jpg',
     * 'test/main.js',
     * 'test/deeper/app.js',
     * 'test/deeper/bla.js'
     * ]
     *
     * example output:
     * [
     * 'test'
     * 'test/image.jpg',
     * 'test/main.js',
     * 'test/deeper'
     * 'test/deeper/app.js',
     * 'test/deeper/bla.js'
     * ]
     */
    this.createFolderList = function createFolderList(files) {
      var result = [];
      _.each(files, function (file) {
        // check if parent folder path is already in the result list
        var folders = file.split('/');
        if (folders.length > 1) {
          // remove file from path
          folders.splice(folders.length - 1, 1);
          var tmpPath = '';
          for (var i = 0; i < folders.length; i++) {
            if (tmpPath) {
              tmpPath += '/';
            }
            tmpPath += folders[i];

            // check if we need to add the new path
            if (result.indexOf(tmpPath) === -1) {
              result.push(tmpPath);
            }
          }
        }
        result.push(file);
      });
      return result;
    };

    uploader.bind('FilesAdded', function (up, files) {
      var pathList = _.pluck(files, 'relativePath');
      data = that.createFolderList(pathList);
      $scope.treeData = createTree(data);
      $scope.loadingTree = false;
      $scope.$apply();
    });

    // yes, i know...
    // this is a very dirty hack.
    // i'll change it as soon as i can.
    // it's for quick demonstration.
    // i promise... ;-)
    setTimeout(function () {
      uploader.init();
    }, 100);

    var data = [
      'README.md',
      '.hiddenfile',
      'index.html',
      'src',
      'src/app.js',
      'src/data.js',
      'src/.hiddenfile',
      'src/lib',
      'src/lib/angular.js',
      'img',
      'img/logo.png'
    ];

    function createTree(files) {
      var result = [];
      var lookupHelper = {};
      var fileList = createFileObject(files);

      fileList.forEach(function (file) {
        var item = {};
        item.label = file.name;
        item.data = file;

        if (file.parentPath) {
          var parentItem = lookupHelper[file.parentPath] || {};
          if (!parentItem.children) {
            parentItem.children = [];
          }
          parentItem.children.push(item);
        } else {
          result.push(item);
        }
        lookupHelper[file.path] = item;
      });

      return result;
    }

    function createFileObject(files) {
      var result = [];
      files.forEach(function (file) {
        var item = {};
        var path = file.replace(/[^\/]*$/, '');
        if (path) {
          item.parentPath = path.slice(0, -1);
        }
        item.path = file;
        item.name = file.replace(/^.*[\\\/]/, '');
        result.push(item);
      });
      return result;
    }

    $scope.treeData = createTree(data);
    $scope.glob = {
      pattern: '**/*.js',
      options: {
        dot: true
      }
    };

    $scope.submitGlob = function ($event) {
      if (!$scope.glob.pattern.length) {
        $event.preventDefault();
        return;
      }
      console.log(JSON.stringify($scope.glob.pattern));

      $scope.globResult = minimatch.match(data, $scope.glob.pattern, $scope.glob.options);
    };

    $scope.githubImport = function () {
      if(!$scope.glob.repo) {
        $scope.importError = 'Please enter a valid GitHub URL';
        return;
      }

      var regex = /(https?:\/\/|git\@)?github.com[:|\/](\w*\/\w*)(.+)?/g;
      var repoName = $scope.glob.repo.replace(regex, '$2');

      var serviceUrl = 'https://api.github.com/repos/' + repoName + '/git/trees/master?recursive=1';
      $scope.importError = '';
      $scope.loadingTree = true;
      $scope.treeData = [];

      $http({
        method: 'GET',
        url: serviceUrl
      }).success(function (response) {
        data = _.pluck(response.tree, 'path');
        $scope.treeData = createTree(data);
        $scope.loadingTree = false;
      }).error(function() {
        $scope.importError = 'No reposotiry found at ' + $scope.glob.repo;
        $scope.treeData = createTree(data);
        $scope.loadingTree = false;
      });
    };

  });
