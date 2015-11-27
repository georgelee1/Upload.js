import {Update} from "../../src/js/ui/update"
var should = require("should")

export function run() {
    
    describe("Update", function() {
        
        it("should trigger the handler when the value is set", function(done) {
            this.timeout(100)
            
            let update = new Update(v => {
                v.should.be.exactly("test")
                done()
            })
            
            update.value = "test"
        })
        
        it("should trigger the handler with the latest value when more than more value set", function(done) {
            this.timeout(100)
            
            let update = new Update(v => {
                v.should.be.exactly("test")
                done()
            }, 50)
            
            update.value = "something"
            update.value = "test"
        })
        
        it("should trigger the handler when the value is set and then trigger again some time later with another value", function(done) {
            this.timeout(100)
            
            let first = true
            let update = new Update(v => {
                if (first) {
                    v.should.be.exactly("test")
                    first = false
                } else {
                    v.should.be.exactly("test2")
                    done()
                }
            })
            
            update.value = "test"
            setTimeout(() => {
                update.value = "test2"
            }, 50)
        })
    })
}