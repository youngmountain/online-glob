'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('globApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('createFolderList', function() {
    it('should be defined', function() {
      expect(MainCtrl.createFolderList).toBeDefined();
    });
    it('should append the folders to a list of file paths', function() {
      var sampleInput = [
        'test/image.jpg',
        'test/main.js',
        'test/deeper/app.js',
        'test/deeper/bla.js'
      ];

      var expected = [
        'test',
        'test/image.jpg',
        'test/main.js',
        'test/deeper',
        'test/deeper/app.js',
        'test/deeper/bla.js'
      ];

      var result = MainCtrl.createFolderList(sampleInput);
      console.log('--------------------');
      console.log(result);
      console.log('--------------------');
      expect(angular.equals(result, expected)).toBe(true);

    });

    it('should append the folders to a list of file paths (more complex)', function() {
      var sampleInput = [
        'test/image.jpg',
        'test/main.js',
        'test/deeper/app.js',
        'test/deeper/even/more/deeper/bla.js',
        'test/deeper/even/more/deeper/bli.js',
        'test/deeper/even/more/deeper/blu.js'
      ];

      var expected = [
        'test',
        'test/image.jpg',
        'test/main.js',
        'test/deeper',
        'test/deeper/app.js',
        'test/deeper/even',
        'test/deeper/even/more',
        'test/deeper/even/more/deeper',
        'test/deeper/even/more/deeper/bla.js',
        'test/deeper/even/more/deeper/bli.js',
        'test/deeper/even/more/deeper/blu.js'
      ];

      var result = MainCtrl.createFolderList(sampleInput);
      console.log('--------------------');
      console.log(JSON.stringify(result, null, 2));
      console.log('--------------------');
      expect(angular.equals(result, expected)).toBe(true);

    });
  });
});
