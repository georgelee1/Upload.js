# Upload.js
A simple and clean HTML5, dependency free, image uploader and remover

---
## Contents
* [Demo](#demo)
* [Install](#install)
* [Dependencies](#dependencies)
* [Browser Support](#browser-support)
* [Usage](#usage)
* [Initial Images](#initial-images)
* [Options](#options)
    * [Available Options](#options-available)
    * [Callback](#options-callback)
    * [Http Additional Parameters and Headers](#options-additional-params) 
* [Methods](#methods)
* [Styling](#styling)
* [Contributing](#contributing)

---
<a href="#demo" name="demo"></a>
## <a href="#demo" name="demo"></a>[Demo](http://www.georgelee.me/project/uploadjs)
See Upload.js in action

---
<a href="#install" name="install"></a>
## Install

[Download](https://github.com/georgelee1/Upload.js/releases) The latest release of Upload.js and add it to your project
```html
<head>
   <link rel="stylesheet" href="path/to/css/uploadjs.css" />
</head>
<body>
   ...
   <script src="path/to/js/uploadjs.js"></script>
</body>
```

**or**

Install via the [Bower](http://bower.io/) package manager and add it to your project
```bash
bower install uploadjs
```
```html
<head>
   <link rel="stylesheet" href="bower_components/uploadjs/dist/uploadjs.css" />
</head>
<body>
   ...
   <script src="bower_components/uploadjs/dist/uploadjs.js"></script>
</body>
```

---
<a href="#dependencies" name="dependencies"></a>
### Dependencies
**None, zero, zilch, zip, nadda**

This project is designed to be standalone. We don't force your project to have to include any other third party libraries.

---
<a href="#browser-support" name="browser-support"></a>
### Browser Support
Any browser that supports HTML5, XMLHttpRequest advanced features and File/FileReader API.

* Chrome (28+)
* Firefox (38+)
* IE (10+)
* Safari (6.0.2+)

---
<a href="#usage" name="usage"></a>
## Usage
Pretty simple really add a `div` to your page, find it in your script and call the `UploadJs` plugin.

**html**
```html
<div id="my-uploadjs"></div>
```
**javascript**
```javascript
var myDiv = document.getElementById("my-uploadjs")
new UploadJs(myDiv)
```

---
<a href="#initial-images" name="initial-images"></a>
## Initial Images
It is possible to show initial images in the widget that may previously exist. Simply include them as `img` tags within the `div`. If you are enabling [deletable](#option-deletable) each `img` tag must include the HTML data attribute `data-upload-image-id=<id>` where `<id>` is a unique identifier for the file that will be set as the [deletion parameter](#option-deletion-parameter) to the [deletion URL](#option-deletion-url).
```html
<div id="my-uploadjs"></div>
   <img src="my-img-1.jpg" data-upload-image-id="1" />
   <img src="my-img-2.jpg" data-upload-image-id="2" />
</div>
```

---
<a href="#options" name="options"></a>
## Options
`UploadJs` is configurable in it's behaviour. All options are configurable via the javascript options, and many others as HTML data attributes. You can use a combination of the two where applicable.

**Via javascipt**
```javascript
var options = {
   upload: {
      url: "/upload"
   },
   delete: {
      url: "/delete"
   }
}
new UploadJs(myDiv, options)
```

**Via html data attributes**
```html
<div id="my-uploadjs" data-upload-url="/upload" data-upload-delete-url="/delete" />
```

<a href="#options-available" name="options-available"></a>
#### Available Options

|Name|Option|Description|
:--- | :--- | :--- 
|<a href="#option-upload-url" name="option-upload-url"></a>Upload Url|<div>`upload: { url: <string> }`<div>or<div>`data-upload-url="<string>"`<div>|The URL that is called when uploading a file. The url must return `JSON` with `success: true` if the upload was successful and with `uploadImageId: <id>` where `<id>` is a unique identifier for the file that will then get called to the deletion URL. If `uploadImageId` is not returned the uploaded file will not be deletable from the widget.|
|<a href="#option-upload-parameter" name="option-upload-parameter"></a>Upload Parameter|<div>`upload: { param: <string> }`<div>or<div>`data-upload-param="<string>"`<div>|*Default:*`'file'`<br/><br/>The name of the parameter that each file is set as in the upload request.|`<string>`|
|<a href="#option-deletion-url" name="option-deletion-url"></a>Deletion Url|<div>`delete: { url: <string> }`<div>or<div>`data-upload-delete-url="<string>"`<div>|The URL that is called when deleting a file. The url must return `JSON` with `success: true` if the deletion was successful.|
|<a href="#option-deletion-parameter" name="option-deletion-parameter"></a>Deletion Parameter|<div>`delete: { param: <string> }`<div>or<div>`data-upload-delete-param="<string>"`<div>|*Default:*`'file'`<br/><br/>The name of the parameter set with the file id that is set on the deletion request.|
|<a href="#option-max" name="option-max"></a>Max|<div>`max: <int>`</div>**or**<div>`data-upload-max="<int>"`</div>|*Default:*`infinite`<br/><br/>The maximum number of files that are allowed to exist in the widget.|
|<a href="#option-deletable" name="option-deletable"></a>Deletable|<div>`deletable: <boolean>`</div>**or**<div>`data-upload-deletable="<boolean>"`</div>|*Default*:`true`<br/><br/>Indicates whether or not files are deletable. If `true` the delete button will appear for each file, when clicked the [deletion url](#option-deletion-url) is called.|
|<a href="#option-allowed-types" name="option-allowed-types"></a>Allowed Types|<div>`allowed_types: []`</div>**or**<div>`data-upload-allowed-types="<string>[,<string>[,...]]"`</div>|*Default:*`["images"]`<br/><br/>`<array>` or commor (`,`) separated `<string>` of allowed file MIME content types e.g. `image/png`, `image/jpg`. You can use the predefined type key `images` which includes `["image/jpg", "image/jpeg", "image/png", "image/gif"]` e.g. `allowed_types: ["images"]`.|

<a href="#options-callback" name="options-callback"></a>
#### Callback

When defining the options via the javascript API, option values can be defined using a `function`. There is an optional `done` callback that can be passed to the options function that should be called, passing the option value, when the option value has been loaded. If the `done` callback is not defined as a function parameter then the option value should be returned.

**Option defined as function without callback**
```javascript
var uploadUrl = ...
var options = {
    upload: {
       url: function() {
          return uploadUrl;
       }
    }
}
```
**Option defined as function with callback**
```javascript
var uploadUrl = ...
var options = {
    upload: {
       url: function(done) {
          done(uploadUrl);
       }
    }
}
```

<a href="#options-additional-params" name="options-additional-params"></a>
#### Http Additional Parameters and Headers

It is possible to define additional parameters and headers to be included in the upload and delete http calls. These parameters/headers can be defined statically or can be dynamic. Static definition is done using html `data-upload-additional-param-<key>` or `data-upload-delete-additional-param-<key>` or `data-upload-header-<key>` or `data-upload-delete-header-<key>` attributes or via the javascript options, note that when using a combination of the two javascript values with take presendence of the html attributes.

**Html definition**
```html
<div id="my-uploadjs" 
     data-upload-additional-param-my-param="myValue"
     data-upload-additional-param-other-param="anotherValue" 
     data-upload-delete-additional-param-del-param="deleting" 
     data-upload-header-testheader="headerValue" 
     data-upload-delete-header-delheader="delHeaderValue" />
```

**Javascript definition**
```javascript
var options = {
    upload: {
        additionalParams: {
            myParam: "myValue",
            otherParam: "anotherValue"
        },
        headers: {
            testheader: "headerValue"
        }
    },
    delete: {
        additionalParams: {
            delParam: "deleting"
        },
        headers: {
            delheader: "delHeaderValue"
        }
    }
}
```

You can take advantage of the [callback](#options-callback) functionality for options to create the additional parameters dynamically. An object of the parameters must be returned from the function or passed to the `done` callback if defined (see [callback](#options-callback) functionality).

```javascript
var options = {
    upload: {
        additionalParams: function() {
            var my = "my";
            var value = "Value";
            
            return {
                myParam: my + value,
                otherParam: "anotherValue"
            }
        }
    },
    delete: {
        additionalParams: function(done) {
            done({
                delParam: "deleting"
            });
        }
    }
}
```

These examples will add `myParam=myValue` and `otherParam=anotherValue` to the upload http request and `delParam=deleting` to the delete http request in addition to the standard `file` parameters.
In additional the http header of `testheader: headerValue` will be added to the upload and `delheader: delHeaderValue` to the delete http request.

**HTML Data Attributes and Case**

When using HTML `data-*` attributes be aware of how browsers will parse the attribute value, see [HTMLElement.dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) for full details. If you define an attribute `data-upload-header-X-MYHEADER="test"` the header will come out as `XMyheader: test`.

If case is important in your parameters or headers then you should define them using the JS options.
```html
var options = {
    upload: {
        headers: {
            "X-MYHEADER": "test"
        }
    }
}
```

---
<a href="#methods" name="methods"></a>
## Methods
Methods available on `UploadJs` and what they are good for

|Method|Description|Usage|
:---|:---|:---
|`on(<string>, <function>)`|Adds a listener to `UploadJs` that will trigger the passed function for the event. Available events are: <br/><br/><ul><li>`upload.added` - A new file upload has been added to the queue for upload</li><li>`upload.started` - The file upload has been taken from the queue and actual upload has stared</li><li>`upload.progress` - Fired with with the progress of the upload</li><li>`upload.done` - The upload has successfully completed with success from the server</li><li>`upload.fail` - The upload of the file failed</li><li>`delete.added` - An existing file has been added to the queue for deletion</li><li>`delete.started` - The file deletion has been taken from the queue and the request to server is being made</li><li>`delete.done` - The file was successfully deleted</li><li>`delete.failed` - The file deletion failed</li></ul><br/></br>The event object is passed to the handler function. It contains the following field:<ul><li>`type` - the event type</li><li>`file` - field present for `upload.*` events, a reference to the file object.</li><li>`id` - field present for `delete.*` events, the file id</li><li>`progress` - `int` field `0-100` present for `upload.progress` event</li></ul>|`var uploadJs = new UploadJs(...);`<br/>`uploadJs.on("upload.done", function(e) { ... });`|
|`destroy()`|Destroys the `UploadJs` widget, cleaning up all resources and removes all DOM elements. Note that any uploading files will continue to upload until they are complete, but any queued uploads/deletions will be cancelled immediately.|`var uploadJs = new UploadJs(...);`<br/>`uploadJs.destroy();`|

---
<a href="#styling" name="styling"></a>
## Styling
By default the icons used in `UploadJs` are unicode symbol characters

**&#x2713; &#x21E1; &#x2718; !**

These can be changed to make the widget look a little nicer by using icons from either [font-awesome](http://fortawesome.github.io/Font-Awesome/) or [glyphicons](http://glyphicons.com/). Simply add the appropriate css class to the `div` element. Checkout the [demo](#demo) to see these in action.

**font awesome**
```html
<div id="my-uploadjs" class="up-fa"></div>
```
**glyphicons**
```html
<div id="my-uploadjs" class="up-glyphicons"></div>
```

---
<a href="#contributing" name="contributing"></a>
## Issues and Contributing
If you have found a bug or would like a new feature added to `UploadJs` or you would just like to contribute then please read the [Contributing](CONTRIBUTING.md) read me before anything else.
