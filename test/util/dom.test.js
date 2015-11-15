import {type, css, matches, children, on, addClass, SimpleDOMParser} from "../../src/js/util/dom"
var should = require("should")

export function run() {

    describe("Dom", function () {

        describe("#type", function () {

            it("should return true if the correct type", function () {
                should(type("div")({tagName: "div"})).be.true
            })

            it("should return false if not the correct type", function () {
                should(type("div")({tagName: "span"})).be.false
            })
        })

        describe("#css", function () {

            it("should return true if the class equal", function () {
                should(css("test")({className: "test"})).be.true
            })

            it("should return true if the class exists", function () {
                should(css("test")({className: "some test other"})).be.true
            })

            it("should return false if the class does not exists", function () {
                should(css("test")({className: "some other"})).be.false
            })

            it("should return false if element has no class", function () {
                should(css("test")({})).be.false
            })
        })

        describe("#matches", function () {

            it("should return true if matcher matches", function () {
                let e = {tagName: "div", className: "test"}
                should(matches(css("test"))(e)).be.true
            })

            it("should return true if all matchers matches", function () {
                let e = {tagName: "div", className: "test"}
                should(matches(css("test"), type("div"))(e)).be.true
            })

            it("should return false if one matcher does not matches", function () {
                let e = {tagName: "div", className: "test"}
                should(matches(css("test"), type("span"))(e)).be.false
                should(matches(css("testo"), type("div"))(e)).be.false
            })
        })

        describe("#children", function () {

            it("should return a list of filtered children", function () {
                let parent = {
                    childNodes: [{
                        nodeType: 1,
                        tagName: "div",
                        className: "another test"
                    }, {
                        nodeType: 3
                    }, {
                        nodeType: 1,
                        tagName: "div",
                        className: "another"
                    }, {
                        nodeType: 1,
                        tagName: "span",
                        className: "another test"
                    }, {
                        nodeType: 1,
                        tagName: "span"
                    }]
                }

                let result = children(css("test"), type("span"))(parent)
                result.should.be.Array
                result.should.have.length(1)
                result[0].tagName.should.be.exactly("span")
                result[0].className.should.be.exactly("another test")
            })
        })

        describe("#on", function () {

            it("should fire the event for the matched target", function () {
                class Ele {
                    addEventListener(event, funct) {
                        let events = this._events = this._events || {}
                        let functs = events[event] = events[event] || []
                        functs.push(funct)
                    }

                    trigger(event, target) {
                        let events = (this._events || {})[event] || []
                        events.forEach(e => e({target}))
                    }
                }

                let ele = new Ele(), count = 0
                on(ele, "click", css("another"), e => {
                    count++
                })
                ele.trigger("click", {className: "test"})
                count.should.be.exactly(0)
                ele.trigger("click", {className: "anothera"})
                count.should.be.exactly(0)
                ele.trigger("click", {className: "another"})
                count.should.be.exactly(1)
            })
        })

        describe("#addClass", function () {

            it("should add class to element with no class", function () {
                let ele = {}
                addClass("test")(ele)
                ele.className.should.be.exactly("test")
            })

            it("should add class to element with class", function () {
                let ele = {
                    className: "other"
                }
                addClass("test")(ele)
                ele.className.should.be.exactly("other test")
            })
        })

        describe("SimpleDOMParser", function () {

            describe("#parse", function () {

                GLOBAL.document = {
                    createElement(tagName) {
                        return {
                            children: [],
                            tagName,
                            appendChild(child) {
                                this.children.push(child)
                            },
                            cloneNode() {
                                return this
                            }
                        }
                    }
                }

                it("should parse element", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div")
                    result.should.be.Array
                    result.should.have.length(1)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(0)
                    should(result[0].className).be.undefined
                })

                it("should parse element with class", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div.test")
                    result.should.be.Array
                    result.should.have.length(1)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(0)
                    result[0].className.should.be.exactly("test")
                })

                it("should parse element with multiple classes", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div.test.another")
                    result.should.be.Array
                    result.should.have.length(1)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(0)
                    result[0].className.should.be.exactly("test another")
                })

                it("should parse element with sibling", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div span")
                    result.should.be.Array
                    result.should.have.length(2)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(0)
                    should(result[0].className).be.undefined
                    result[1].tagName.should.be.exactly("span")
                    result[1].children.should.have.length(0)
                    should(result[1].className).be.undefined
                })

                it("should parse element with children", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span)")
                    result.should.be.Array
                    result.should.have.length(1)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(1)
                    should(result[0].className).should.be.undefined
                    result[0].children[0].tagName.should.be.exactly("span")
                    result[0].children[0].children.should.have.length(0)
                    should(result[0].children[0].className).be.undefined
                })

                it("should parse element with children that have class", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span.test)")
                    result.should.be.Array
                    result.should.have.length(1)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(1)
                    should(result[0].className).be.undefined
                    result[0].children[0].tagName.should.be.exactly("span")
                    result[0].children[0].children.should.have.length(0)
                    result[0].children[0].className.should.be.exactly("test")
                })

                it("should parse element with children and sibling", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span.test) div.sibling")
                    result.should.be.Array
                    result.should.have.length(2)
                    result[0].tagName.should.be.exactly("div")
                    result[0].children.should.have.length(1)
                    should(result[0].className).be.undefined
                    result[0].children[0].tagName.should.be.exactly("span")
                    result[0].children[0].children.should.have.length(0)
                    result[0].children[0].className.should.be.exactly("test")
                    result[1].tagName.should.be.exactly("div")
                    result[1].children.should.have.length(0)
                    result[1].className.should.be.exactly("sibling")
                })
            })
        })
    })
}