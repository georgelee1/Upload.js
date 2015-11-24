import {Queue} from "../../src/js/util/queue"
var should = require("should")

export function run() {

    describe("Queue", function () {

        describe("#offer", function () {

            it("should process all with default options", function (done) {
                this.timeout(1100)
                let start = Date.now()
                let q = new Queue((item, fin) => {
                    setTimeout(() => {
                        fin()
                        if (item === 9) {
                            (Date.now() - start).should.be.approximately(1000, 20)
                            done()
                        }
                    }, 100)
                })
                for (let x = 0; x < 10; x++) {
                    q.offer(x).should.be.True()
                }
            })

            it("should process more than one at a time", function (done) {
                this.timeout(600)
                let opts = {
                    concurrency: 2
                }
                let start = Date.now()
                let q = new Queue((item, fin) => {
                    setTimeout(() => {
                        fin()
                        if (item === 9) {
                            (Date.now() - start).should.be.approximately(500, 20)
                            done()
                        }
                    }, 100)
                }, opts)
                for (let x = 0; x < 10; x++) {
                    q.offer(x).should.be.True()
                }
            })

            it("should reject when offering more than the max size", function () {
                let opts = {
                    size: 1
                }
                let q = new Queue((item, fin) => {
                    setTimeout(() => {
                        fin()
                    }, 100)
                }, opts)
                q.offer(0).should.be.True()
                q.offer(1).should.be.True()
                q.offer(2).should.be.False()
            })

            it("should delay the start of the item execution", function(done) {
                this.timeout(300)
                let opts = {
                    delay: 200
                }
                let start = Date.now()
                let q = new Queue((item, fin) => {
                    (Date.now() - start).should.be.approximately(200, 20)
                    fin()
                    done()
                }, opts)
                q.offer(0).should.be.True()
            })
        })
    })
}