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
                addEventListener: function () {
                }
            }
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
            should(request.async).be.true
            should(request.headers["Content-Type"]).be.exactly("application/x-www-form-urlencoded")
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
            should(request.async).be.true
            should(request.headers["Content-Type"]).be.exactly("multipart/form-data")
        })
    })
}