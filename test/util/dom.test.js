import {type, css, matches, children, on, cls, attr, SimpleDOMParser, DOMList} from "../../src/js/util/dom"
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

        describe("#cls", function () {

            it("should add class to element with no class", function () {
                let ele = {}
                cls("test")(ele)
                ele.className.should.be.exactly("test")
            })

            it("should add class to element with class", function () {
                let ele = {
                    className: "other"
                }
                cls("test")(ele)
                ele.className.should.be.exactly("other test")
            })
            
            it("should remove class from element if only class", function () {
                let ele = {
                    className: "test"
                }
                cls("test", false)(ele)
                ele.className.should.be.exactly("")
            })
            
            it("should remove class from element with other classes", function () {
                let ele = {
                    className: "some thing test here"
                }
                cls("test", false)(ele)
                ele.className.should.be.exactly("some thing here")
            })
        })
        
        describe("#attr", function() {
            
            class Ele {
                constructor(attrs={}) {
                    this._attrs = attrs
                }
                
                setAttribute(key, val) {
                    this._attrs[key] = val
                }
                
                removeAttribute(key) {
                    delete this._attrs[key]
                }
            }
            
            it("should add attribute on element", function() {
                let ele = new Ele()
                attr("test", "val1")(ele)
                ele._attrs.should.be.eql({test: "val1"})
            })
            
            it("should add attributes on element", function() {
                let ele = new Ele()
                attr({"test": "val1", "test2": "val2"})(ele)
                ele._attrs.should.be.eql({"test": "val1", "test2": "val2"})
            })
            
            it("should add and remove attributes on element", function() {
                let ele = new Ele({"test": "val1", "test2": "val1"})
                attr({"test": undefined, "test2": "val2"})(ele)
                ele._attrs.should.be.eql({"test2": "val2"})
            })
            
            it("should remove attribute on element", function() {
                let ele = new Ele({"test": "val1", "test2": "val1"})
                attr("test2")(ele)
                ele._attrs.should.be.eql({"test": "val1"})
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
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(0)
                    should(result.items[0].className).be.undefined
                })

                it("should parse element with class", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div.test")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(0)
                    result.items[0].className.should.be.exactly("test")
                })

                it("should parse element with multiple classes", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div.test.another")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(0)
                    result.items[0].className.should.be.exactly("test another")
                })

                it("should parse element with sibling", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div span")
                    result.should.be.DOMList
                    result.items.should.have.length(2)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(0)
                    should(result.items[0].className).be.undefined
                    result.items[1].tagName.should.be.exactly("span")
                    result.items[1].children.should.have.length(0)
                    should(result.items[1].className).be.undefined
                })

                it("should parse element with children", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span)")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(1)
                    should(result.items[0].className).should.be.undefined
                    result.items[0].children[0].tagName.should.be.exactly("span")
                    result.items[0].children[0].children.should.have.length(0)
                    should(result.items[0].children[0].className).be.undefined
                })

                it("should parse element with children that have class", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span.test)")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(1)
                    should(result.items[0].className).be.undefined
                    result.items[0].children[0].tagName.should.be.exactly("span")
                    result.items[0].children[0].children.should.have.length(0)
                    result.items[0].children[0].className.should.be.exactly("test")
                })

                it("should parse element with children and sibling", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span.test) div.sibling")
                    result.should.be.DOMList
                    result.items.should.have.length(2)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(1)
                    should(result.items[0].className).be.undefined
                    result.items[0].children[0].tagName.should.be.exactly("span")
                    result.items[0].children[0].children.should.have.length(0)
                    result.items[0].children[0].className.should.be.exactly("test")
                    result.items[1].tagName.should.be.exactly("div")
                    result.items[1].children.should.have.length(0)
                    result.items[1].className.should.be.exactly("sibling")
                })
            })
        })
        
        describe("DOMList", function() {
            
            describe("#clone", function() {
                
                class Ele {
                    constructor(name="") {
                        this.name = name
                    }
                    
                    cloneNode(deep=false) {
                        let cloned = new Ele(this.name)
                        cloned.cloned = true
                        cloned.deep = deep
                        return cloned
                    }
                }
                
                it("should deeply clone all DOM elements", function() {
                    let eles = [new Ele("test1"), new Ele("test2")]
                    let list = new DOMList(eles)
                    let cloned = list.clone()
                    cloned.items.should.not.be.exactly(eles)
                    cloned.items.should.have.length(2)
                    cloned.items[0].name.should.be.exactly("test1")
                    cloned.items[0].cloned.should.be.true
                    cloned.items[0].deep.should.be.true
                    cloned.items[1].name.should.be.exactly("test2")
                    cloned.items[1].cloned.should.be.true
                    cloned.items[1].deep.should.be.true
                })
            })
            
            describe("#apply", function() {
                
                it("should apply transformation to all DOM elements", function() {
                    let eles = [{"name": "test1"}, {"name": "test2"}]
                    let list = new DOMList(eles)
                    let returned = list.apply(cls("test"))
                    returned.should.be.exactly(list)
                    list.items.should.have.length(2)
                    list.items.should.be.exactly(eles)
                    eles[0].should.be.eql({name: "test1", className: "test"})
                    eles[1].should.be.eql({name: "test2", className: "test"})
                })
            })
            
            describe("#appendTo", function() {
                
                class Ele {
                    constructor() {
                        this.children = []
                    }
                    
                    appendChild(ele) {
                        this.children.push(ele)
                    }
                }
                
                it("should append all DOM elements to parent element", function() {
                    let parent = new Ele()
                    let list = new DOMList([{"name": "test1"}, {"name": "test2"}])
                    let returned = list.appendTo(parent)
                    returned.should.be.exactly(list)
                    parent.children.should.have.length(2)
                    parent.children[0].should.be.eql({"name": "test1"})
                    parent.children[1].should.be.eql({"name": "test2"})
                });
            })
        })
    })
}