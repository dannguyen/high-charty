/* global describe, it */

(function () {
    'use strict';

    describe('Give it some context', function () {
        describe('maybe a bit more context here', function () {
            it('should run here few assertions', function () {
              assert.equal(1, 1);
            });
        });


        describe('Charty.DataParser', function(){
          it('should exist', function(){
            assert.equal(_.isUndefined(Charty.DataParser), false);
          })
        })

    });
})();
