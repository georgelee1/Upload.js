import {Http} from "../../src/js/util/http"
var should = require("should")

export function run() {

    let data = undefined
    let request = {
        headers: {}
    }

    GLOBAL.FormData = class FormData {
        constructor() {
            this.params = {}
        }

        append(key, val, name) {
            let p = this.params[key] || []
            p.push({
                val,
                name
            })
            this.params[key] = p
        }
    }

    GLOBAL.XMLHttpRequest = class XMLHttpRequest {
        constructor() {
            this.upload = {
                addEventListener: function (name, func) {
                    if (name == "progress") {
                        GLOBAL._XMLHttpRequest_event = func
                    }
                }
            }
            GLOBAL._current_XMLHttpRequest = this
        }

        open(method, url, async) {
            request.method = method
            request.url = url
            request.async = async
        }

        setRequestHeader(name, val) {
            request.headers[name] = val
        }

        send(formData) {
            data = formData
        }
    }

    describe("Http", function () {

        beforeEach(function () {
            data = undefined
            request = {
                headers: {}
            }
        })

        it("parameters are set correctly for object map", function () {
            new Http("/test", {
                param1: "val1",
                param2: "val2",
                param3: ["val3", "val4"]
            })
            should(data.params.param1[0].val).be.exactly("val1")
            should(data.params.param2[0].val).be.exactly("val2")
            should(data.params.param3[0].val).be.exactly("val3")
            should(data.params.param3[1].val).be.exactly("val4")

            should(request.method).be.exactly("POST")
            should(request.url).be.exactly("/test")
            should(request.async).be.True()
            should(request.headers["Content-Type"]).be.Undefined();
        })

        it("parameters are set correctly for file map", function() {
            new Http("/test", {
                param1: {
                    type: "image/jpg",
                    name: "file1.jpg"
                },
                param2: [{
                    type: "image/png",
                    name : "file2.png"
                }, {
                    type: "image/gif",
                    name: "file3.gif"
                }]
            })
            should(data.params.param1[0].val).be.eql({type: "image/jpg", name: "file1.jpg"})
            should(data.params.param2[0].val).be.eql({type: "image/png", name: "file2.png"})
            should(data.params.param2[1].val).be.eql({type: "image/gif", name: "file3.gif"})

            should(request.method).be.exactly("POST")
            should(request.url).be.exactly("/test")
            should(request.async).be.True()
            should(request.headers["Content-Type"]).be.Undefined();
        })

        it("should trigger done handler on success", function() {
            let called = false, times = 0
            new Http("/text").done(() => {called = "done"; times++}).fail(() => {called = "fail"; times++})
            should(GLOBAL._current_XMLHttpRequest.onreadystatechange).be.a.function
            GLOBAL._current_XMLHttpRequest.readyState = 4
            GLOBAL._current_XMLHttpRequest.status = 200
            GLOBAL._current_XMLHttpRequest.response = "{\"success\":true}"
            GLOBAL._current_XMLHttpRequest.onreadystatechange()
            called.should.be.exactly("done")
            times.should.be.exactly(1)
        })

        it("should trigger fail handler on success but response parse error", function() {
            let called = false, times = 0
            new Http("/text").done(() => {called = "done"; times++}).fail(() => {called = "fail"; times++})
            should(GLOBAL._current_XMLHttpRequest.onreadystatechange).be.a.function
            GLOBAL._current_XMLHttpRequest.readyState = 4
            GLOBAL._current_XMLHttpRequest.status = 200
            GLOBAL._current_XMLHttpRequest.response = "{success:true"
            GLOBAL._current_XMLHttpRequest.onreadystatechange()
            called.should.be.exactly("fail")
            times.should.be.exactly(1)
        })

        it("should trigger fail handler on unsuccessful response", function() {
            let called = false, times = 0
            new Http("/text").done(() => {called = "done"; times++}).fail(() => {called = "fail"; times++})
            should(GLOBAL._current_XMLHttpRequest.onreadystatechange).be.a.Function()
            GLOBAL._current_XMLHttpRequest.readyState = 4
            GLOBAL._current_XMLHttpRequest.status = 404
            GLOBAL._current_XMLHttpRequest.onreadystatechange()
            called.should.be.exactly("fail")
            times.should.be.exactly(1)
        })

        it("should trigger progress handler on upload progress update", function() {
            let called = false, times = 0, progress = 0
            new Http("/text").done(() => {called = "done"; times++}).fail(() => {called = "fail"; times++}).progress(e => progress = e)
            should(GLOBAL._XMLHttpRequest_event).be.a.Function()
            called.should.be.False()
            times.should.be.exactly(0)

            GLOBAL._XMLHttpRequest_event({loaded:40,total:200})
            progress.should.be.exactly(20)

            GLOBAL._XMLHttpRequest_event({loaded:1145,total:6678})
            progress.should.be.exactly(18)

            GLOBAL._XMLHttpRequest_event({loaded:3512,total:3973})
            progress.should.be.exactly(89)
        })
    })
}