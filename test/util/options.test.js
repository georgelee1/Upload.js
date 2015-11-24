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
                }, 1000)
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
                this.timeout(1100)
                let start = Date.now()
                o.get("key3", v => {
                    (Date.now() - start).should.be.approximately(1000, 20)
                    should(v).be.exactly("val3")
                    done()
                })
            })

            it("should return value for nested value", function() {
                should(o.get("key4.key5")).be.exactly("val5")
            })
        })
    })
}