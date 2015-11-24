import {Cache} from "../../src/js/util/cache"
var should = require("should")

export function run() {

    describe("Cache", function () {

        describe("#put", function() {

            it("should add and get entry to/from the cache", function() {
                let cache = new Cache()
                cache.put("test", "val").should.be.True()
                cache.get("test").should.be.exactly("val")
            })

            it("should override existing entry in the cache", function() {
                let cache = new Cache()
                cache.put("test", "val").should.be.True()
                cache.put("test", "overridden").should.be.False()
                cache.get("test").should.be.exactly("overridden")
            })

            it("should remove exiting entry from the cache", function() {
                let cache = new Cache()
                cache.put("test", "val").should.be.True()
                cache.remove("test").should.be.exactly("val")
                should(cache.get("test")).be.Undefined()
            })

            it("should silently pass a removal attempt of an entry that doesnt exist", function() {
                let cache = new Cache()
                cache.put("test", "val").should.be.True()
                should(cache.remove("other")).be.Undefined()
                cache.get("test").should.be.exactly("val")
            })

            it("should auto evict oldest entry when max size is reached", function() {
                let cache = new Cache(5)
                cache.put("test", "val").should.be.True()
                cache.put("test1", "val1").should.be.True()
                cache.put("test2", "val2").should.be.True()
                cache.put("test3", "val3").should.be.True()
                cache.get("test").should.be.exactly("val")
                cache.put("test4", "val4").should.be.True()
                cache.put("test5", "val5").should.be.True()
                cache.get("test").should.be.exactly("val")
                should(cache.get("test1")).be.Undefined()
            })
        })
    })
}