import {clone, merge} from "../../src/js/util/object"
var should = require("should")

export function run() {

    describe("Object", function () {
    
        describe("#clone", function () {
            
            it("should clone a deep object", function() {
                let child = {"name": "val"}
                let childArray = [{"test": 100}]
                let obj1 = {"test1": 9, "test2": child, "children": childArray}
                
                let result = clone(obj1)
                result.should.be.eql({"test1": 9, "test2": {"name": "val"}, "children": [{"test": 100}]})
                result.test2.should.not.be.exactly(child)
                result.children.should.not.be.exactly(childArray)
            })
        })
        
        
        describe("#merge", function () {
            
            it("should merge a deep object", function() {
                let obj1 = {"test1": 100, "test2": {"test3": 200, "test4": 300}}
                let obj2 = {"test2": {"test3" : 400}}
                
                merge(obj1, obj2)
                obj1.should.be.eql({"test1": 100, "test2": {"test3": 400, "test4": 300}})
            })
        })
    })
}