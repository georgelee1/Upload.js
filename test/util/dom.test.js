import {SimpleDOMParser, DOMList, Matcher} from "../../src/js/util/dom"
var should = require("should")

export function run() {

    describe("Dom", function () {

        
        describe("Matcher", function() {
            
            describe("#test", function() {
                
                it("should return true if the type matcher passed", function() {
                    let m = new Matcher().type("img")
                    m.test({"tagName": "img"}).should.be.True()
                    m.test({"tagName": "IMG"}).should.be.True()
                    m.test({"tagName": "div"}).should.be.False()
                })
                
                it("should return true if the css matcher passed", function() {
                    let m = new Matcher().css("test")
                    m.test({"className": "test"}).should.be.True()
                    m.test({"className": "another test"}).should.be.True()
                    m.test({}).should.be.False()
                    m.test({"className": "another"}).should.be.False()
                })
                
                it("should return true if matcher pass when bubbling", function() {
                    let m = new Matcher(true).css("test")
                    m.test({"className": "another"}).should.be.False()
                    m.test({"className": "another", "parentNode": {"className": "test"}}).should.be.True()
                    m.test({"className": "another", "parentNode": {"className": "different"}}).should.be.False()
                    m.test({"className": "another", "parentNode": {"className": "different", "parentNode": {"className": "test"}}}).should.be.True()
                })
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
                    should(result.items[0].className).be.Undefined()
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
                    should(result.items[0].className).be.Undefined()
                    result.items[1].tagName.should.be.exactly("span")
                    result.items[1].children.should.have.length(0)
                    should(result.items[1].className).be.Undefined()
                })

                it("should parse element with children", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span)")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(1)
                    should(result.items[0].className).be.Undefined()
                    result.items[0].children[0].tagName.should.be.exactly("span")
                    result.items[0].children[0].children.should.have.length(0)
                    should(result.items[0].children[0].className).be.Undefined()
                })

                it("should parse element with children that have class", function () {
                    let parser = new SimpleDOMParser()
                    let result = parser.parse("div (span.test)")
                    result.should.be.DOMList
                    result.items.should.have.length(1)
                    result.items[0].tagName.should.be.exactly("div")
                    result.items[0].children.should.have.length(1)
                    should(result.items[0].className).be.Undefined()
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
                    should(result.items[0].className).be.Undefined()
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
                    cloned.items[0].cloned.should.be.True()
                    cloned.items[0].deep.should.be.True()
                    cloned.items[1].name.should.be.exactly("test2")
                    cloned.items[1].cloned.should.be.True()
                    cloned.items[1].deep.should.be.True()
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
            
            
            describe("#before", function() {
                
                class Ele {
                    constructor() {
                        this.children = []
                    }
                    
                    insertBefore(ele, ref) {
                        let i = this.children.indexOf(ref)
                        if (i >= 0) {
                            this.children.splice(i, 0, ele)
                        } else {
                            this.children.push(ele)
                        }
                    }
                }
                
                it("should insert all DOM elements before the parent element", function() {
                    let parent = new Ele()
                    let ref = {parentNode: parent, "name": "previous"}
                    parent.children.push(ref)
                    
                    let list = new DOMList([{"name": "test1"}, {"name": "test2"}])
                    let returned = list.before(ref)
                    returned.should.be.exactly(list)
                    parent.children.should.have.length(3)
                    parent.children[0].should.be.eql({"name": "test1"})
                    parent.children[1].should.be.eql({"name": "test2"})
                    parent.children[2].should.be.eql({"name": "previous", "parentNode": parent})
                });
            })
            
            
            describe("#addClass", function() {
                
                it("should add class to element with no class", function () {
                    let ele = new DOMList([{}])
                    ele.addClass("test")
                    ele.items[0].className.should.be.exactly("test")
                })

                it("should add class to element with class", function () {
                    let ele = new DOMList([{className: "other"}])
                    ele.addClass("test")
                    ele.items[0].className.should.be.exactly("other test")
                })
                
                it("should not add class to element if that class already exists", function () {
                    let ele = new DOMList([{className: "other test"}])
                    ele.addClass("test")
                    ele.items[0].className.should.be.exactly("other test")
                })
            })
            
            
            describe("#removeClass", function() {
                
                it("should remove class from element if only class", function () {
                    let ele = new DOMList([{className: "test"}])
                    ele.removeClass("test")
                    ele.items[0].className.should.be.exactly("")
                })
                
                it("should remove class from element with other classes", function () {
                    let ele = new DOMList([{className: "some thing test here"}])
                    ele.removeClass("test")
                    ele.items[0].className.should.be.exactly("some thing here")
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
                    let ele = new DOMList([new Ele()])
                    ele.attr("test", "val1")
                    ele.items[0]._attrs.should.be.eql({test: "val1"})
                })
                
                it("should add attributes on element", function() {
                    let ele = new DOMList([new Ele()])
                    ele.attr({"test": "val1", "test2": "val2"})
                    ele.items[0]._attrs.should.be.eql({"test": "val1", "test2": "val2"})
                })
                
                it("should add and remove attributes on element", function() {
                    let ele = new DOMList([new Ele({"test": "val1", "test2": "val1"})])
                    ele.attr({"test": undefined, "test2": "val2"})
                    ele.items[0]._attrs.should.be.eql({"test2": "val2"})
                })
                
                it("should remove attribute on element", function() {
                    let ele = new DOMList([new Ele({"test": "val1", "test2": "val1"})])
                    ele.attr("test2")
                    ele.items[0]._attrs.should.be.eql({"test": "val1"})
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
    
                    let ele = new DOMList([new Ele()]), count = 0
                    ele.on("click", new Matcher().css("another"), e => {
                        count++
                    })
                    ele.items[0].trigger("click", {className: "test"})
                    count.should.be.exactly(0)
                    ele.items[0].trigger("click", {className: "anothera"})
                    count.should.be.exactly(0)
                    ele.items[0].trigger("click", {className: "another"})
                    count.should.be.exactly(1)
                })
            })
            
            
            describe("#find", function() {
                
                class Ele {
                    constructor(children) {
                        this.children = children
                    }
                    
                    querySelectorAll(selector) {
                        let result = []
                        this.children.forEach(ele => {
                            if (ele.tagName === selector) {
                                result.push(ele)
                            }
                        })
                        return result
                    }
                }
                
                it("should find all children elements", function() {
                    let ele = new DOMList([new Ele([{tagName: "div"}, {tagName: "div"}, {tagName: "img"}]), new Ele([{tagName: "img"}, {tagName: "div"}])])
                    let result = ele.find("div").items
                    result.should.have.length(3)
                    result = ele.find("img").items
                    result.should.have.length(2)
                })
            })
            
            
            describe("#each", function() {
                
                it("should trigger the handler for each element", function() {
                    let ele = new DOMList([{},{}]).each(e => {
                        e.reached = true
                    })
                    ele.items[0].should.be.eql({reached:true})
                    ele.items[1].should.be.eql({reached:true})
                })
            })
        })
    })
}