import {Options} from "../../src/js/util/options"
var should = require("should")

export function run() {
    describe("options", () => {

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

        describe("#get", () => {
            it("should return value for plain key value option", () => {
                o.get("key1").should.be.exactly("val1")
            })
            it("callback should be called with value for plain key value option", () => {
                let result, callback = v => {
                    result = v
                }
                should(o.get("key1", callback)).be.undefined
                should(result).be.exactly("val1")
            })
            it("should return value for function key value option", () => {
                o.get("key2").should.be.equal("val2")
            })
            it("callback should be called with value for function key value option", () => {
                let result, callback = v => {
                    result = v
                }
                should(o.get("key2", callback)).be.undefined
                should(result).be.exactly("val2")
            })
            it("should return undefined for function with done key value option", () => {
                should(o.get("key3")).be.undefined
            })
            it("callback should be called with value for function with done key value option", done => {
                o.get("key3", v => {
                    (v).should.be.exactly("val3")
                    done()
                })
            })
            it("should return value for nested key value option", () => {
                should(o.get("key4.key5")).be.exactly("val5")
            })
        })
    })
}