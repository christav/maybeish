var joe = require('joe');
var expect = require('chai').expect;
var should = require('chai').should();
var sinon = require('sinon');

var maybe = require('..');

joe.describe('Maybeish', function (describe, it) {
  describe('dealing with null at root', function (describe, it) {
    it('should return null when wrapping null', function () {
      expect(maybe(null)()).to.be.null;
    });

    it('should return value when wrapping value', function () {
      expect(maybe(5)()).to.equal(5);
    });

    it('should return null when wrapping undefined', function () {
      expect(maybe(undefined)()).to.be.null;
    });

    it('should return null when accessing nested properties', function () {
      expect(maybe(null, 'no.properties.on.null')()).to.be.null;
    });

    it('should return null when accessing nested properties via calls', function () {
      expect(maybe(null)('no')('properties')()).to.be.null;
    });

    it('should not invoke value callback', function () {
      var spy = sinon.spy();
      maybe(null)(spy);
      spy.called.should.be.false;
    });

    it('should invoke null callback and return its result', function () {
      var valueSpy = sinon.stub().returns('should not be called');
      var nullSpy = sinon.stub().returns('called');

      var result = maybe(null)(valueSpy, nullSpy);

      valueSpy.called.should.be.false;
      nullSpy.callCount.should.equal(1);
      expect(result).to.equal('called');
    });
  });

  describe('dealing with an object', function () {
    // Sample object to use
    var obj = {
      one: 1,
      nested: {
        a: 2,
        b: 'three'
      },
      two: 2
    };

    it('should return obj when wrapping obj', function () {
      expect(maybe(obj)()).to.equal(obj);
    });

    it('should return property when accessing nested properties', function () {
      expect(maybe(obj, 'nested.b')()).to.equal(obj.nested.b);
    });

    it('should return property when accessing nested properties via calls', function () {
      expect(maybe(obj)('nested')('a')()).to.equal(obj.nested.a);
    });

    it('should not invoke null callback', function () {
      var valueSpy = sinon.spy();
      var nullSpy = sinon.spy();
      maybe(obj)(valueSpy, nullSpy);
      nullSpy.called.should.be.false;
    });

    it('should invoke value callback passing value and return its result', function () {
      var valueSpy = sinon.stub().returns('called');
      var nullSpy = sinon.stub().returns('not called');

      var result = maybe(obj, 'two')(valueSpy, nullSpy);

      nullSpy.called.should.be.false;
      valueSpy.callCount.should.equal(1);
      expect(result).to.equal('called');
      valueSpy.firstCall.calledWith(obj.two).should.be.true;
    });

    it('should be null if accessing property that does not exist', function () {
      expect(maybe(obj, 'notReal.b')()).to.be.null;
    });
  });
});
