import {Item} from "../../src/js/ui/item"
var should = require("should")

export function run() {
    
    describe("Item", function() {
        
        describe("#_trigger", function() {
            
            it("should trigger the appropriate listeners", function() {
                let result = {}
                let handler = e => result[e.type] = (result[e.type] || 0) + 1
                let listeners = {
                        "test" : [handler],
                        "test2" : [handler]
                }
                let item = new Item(listeners);
                item._trigger({type: "test"})
                item._trigger({type: "test"})
                item._trigger({type: "another"})
                item._trigger({type: "test2"})
                
                result.should.be.eql({"test": 2, "test2": 1})
            })
        })
    })
}