import {Options} from "../../src/js/util/options"
var should = require("should")

export function run() {

    describe("Options", function() {

        var opts = {
            key1: "val1",
            key2: function () {
                return "val2"
            },
            key3: function (done) {
                setTimeout(() => {
                    done("val3")
                }, 200)
            },
            key4: {
                key5: "val5"
            }
        }

        var o = new Options(opts)

        describe("#get", function() {

            it("should return value for plain value", function() {
                o.get("key1").should.be.exactly("val1")
            })
            
            it("should return undefined for non existing property", function() {
                should(o.get("key5.key6")).be.Undefined()
            })

            it("callback should be called with value for plain value", function() {
                let result, callback = v => {
                    result = v
                }
                should(o.get("key1", callback)).be.Undefined()
                should(result).be.exactly("val1")
            })

            it("should return value for function value", function() {
                o.get("key2").should.be.equal("val2")
            })

            it("callback should be called with value for function value", function() {
                let result, callback = v => {
                    result = v
                }
                should(o.get("key2", callback)).be.Undefined()
                should(result).be.exactly("val2")
            })

            it("should return undefined for function value with done", function() {
                should(o.get("key3")).be.Undefined()
            })

            it("callback should be called with value for function value with done", function(done) {
                this.timeout(250)
                let start = Date.now()
                should(o.get("key3", v => {
                    (Date.now() - start).should.be.approximately(200, 20)
                    should(v).be.exactly("val3")
                    done()
                })).be.Undefined()
            })

            it("should return value for nested value", function() {
                should(o.get("key4.key5")).be.exactly("val5")
            })
            
            it("should return values for multiple keys", function() {
                o.get("key1", "key2").should.be.eql(["val1", "val2"])
            })
            
            it("callback should be called with multiple values, one plain, one function", function() {
                let result, callback = (...args) => {
                    result = args
                }
                should(o.get("key1", "key2", callback)).be.Undefined()
                result.should.be.eql(["val1", "val2"])
            })
            
            it("callback should be called with multiple values, one plain, one function with done", function(done) {
                this.timeout(1100)
                let start = Date.now()
                should(o.get("key1", "key3", (...args) => {
                    (Date.now() - start).should.be.approximately(200, 20)
                    should(args).be.eql(["val1", "val3"])
                    done()
                })).be.Undefined()
            })
            
            it("should get the value from the correct options object", function() {
                let o = new Options([{
                    "test2": {
                        "test2a": 6
                    },
                    "test3": [7, 8]
                },{
                    "test": 1,
                    "test2": {
                        "test2a": 2,
                        "test2b": 3
                    },
                    "test3": [4, 5]
                }])
                o.get("test").should.be.exactly(1)
                o.get("test2.test2a").should.be.exactly(6)
                o.get("test2.test2b").should.be.exactly(3)
                o.get("test3").should.be.eql([7, 8])
            })
        })
    })
}