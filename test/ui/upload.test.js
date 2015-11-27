import {UploadItem} from "../../src/js/ui/upload"
var should = require("should")

export function run() {
    
    describe("UploadItem", function() {
        
        describe("#constructor", function() {
            
            it("should trigger added listener", function() {
                let result = {}
                let handler = e => result[e.type] = (result[e.type] || 0) + 1
                let item = new UploadItem({}, {}, {}, {"upload.added": [handler]});
                result.should.be.eql({"upload.added": 1})
            })
        })
        
        
        describe("#run", function() {
            
            it("should trigger started listener", function() {
                let ele = {find() {return true}}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let result = {}
                let handler = e => result[e.type] = (result[e.type] || 0) + 1
                let item = new UploadItem(ele, {}, widget, {"upload.started": [handler]})
                item.run()
                result.should.be.eql({"upload.started": 1})
            })
            
            it("should find and set progress DOM", function() {
                let progress = {"name": "progress"}
                let ele = {find(name) {
                    if (name === ".progress") {
                        return progress
                    }
                }}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let item = new UploadItem(ele, {}, widget, {})
                item.run()
                item._dom_progress.should.be.eql(progress)
            })
        })
        
        
        describe("#_progress", function() {
            
            it("should update progress value and trigger progress listener", function() {
                let ele = {find() {return true}}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let result = {}
                let handler = e => result[e.type] = (result[e.type] || 0) + 1
                let item = new UploadItem(ele, {}, widget, {"upload.progress": [handler]})
                item._progress(44)
                item._progress(46)
                result.should.be.eql({"upload.progress": 2})
                item._up._val.should.be.exactly(46) 
            })
            
            it("should do nothing and not and trigger progress listener if finished", function() {
                let ele = {find() {return true}}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let result = {}
                let handler = e => result[e.type] = (result[e.type] || 0) + 1
                let item = new UploadItem(ele, {}, widget, {"upload.progress": [handler]})
                item._fin = true
                item._progress(46)
                result.should.be.eql({})
                should(item._up._val).be.Undefined() 
            })
        })
        
        
        describe("#_update", function() {
            
            it("should set the correct css value on the progress", function() {
                let ele = {find() {return undefined}}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let item = new UploadItem(ele, {}, widget, {})
                let style = {}
                item._dom_progress = {
                    css(name, val) {
                        style[name] = val
                    }
                }
                item._update(33)
                style.should.be.eql({"transform": "translateX(-67%)"})
                item._update(75)
                style.should.be.eql({"transform": "translateX(-25%)"})
            })
            
            it("should not set the css value on the progress if finished", function() {
                let ele = {find() {return undefined}}
                let widget = {_opts: {get() {return () => {
                    return {
                        progress(){return this},
                        done(){return this},
                        fail(){return this}
                    }
                }}}}
                let item = new UploadItem(ele, {}, widget, {})
                item._fin = true
                let style = {}
                item._dom_progress = {
                    css(name, val) {
                        style[name] = val
                    }
                }
                item._update(33)
                style.should.be.eql({})
                item._update(75)
                style.should.be.eql({})
            })
        })
    })
}