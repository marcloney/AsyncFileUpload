# AsyncFileUpload

AsyncFileUpload is a drag-and-drop, jQuery plug-in for asynchronous file uploads.

  - HTML5 Drag-and-drop file uploads
  - Parallel, asynchronous file uploads
  - Utilising the [ECMAScript 5 File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
  
## Download

    $ bower install AsyncFileUpload

Alternatively, if you don't like building you can download the prebuilt development and production (minified) version through [Releases](https://github.com/marcloney/AsyncFileUpload/releases)

## Build

AsyncFileUploads requires [NPM](http://npmjs.org), [Bower](http://bower.io) and [Grunt](http://gruntjs.com) to build.

    $ git clone https://github.com/marcloney/AsyncFileUpload
    $ npm install
    $ bower install
    $ grunt

The output will be present in the dest/ folder.

## Example

    <form enctype="multipart/form-data">
      <input type="file" name="file[]" multiple>
      <input type="button" value="Upload">
    </form>

    <script src="../bower_components/jquery/jquery.min.js"></script
    <script src="../asyncFileUpload-0.0.2.min.js"></script>
    <script>
      $(function() {
        $('input[type=file]').asyncFileUploader({
          url: 'php/upload.php'

          /***/

        });  
        
        $("input[type=button]").on("click", function() {
          $("input[type=file]").AsyncFileUpload("upload", function(files) {

            /***/

          });
        });
      });
    </script>

See example/ for further information.

## Options

`url: null`

The URL of the server-side script to handle file uploads.

`inputHidden: false`

Hide `input[type=file]` field (recommended to have drag on otherwise no user input is possible).

`dragHidden: false`

Hide drag-and-drop section until a file is dragged into the browser.

`drag: true`

Enable drag-and-drop.

## Methods

`$.fn.AsyncFileUpload.init( options )`

Initialise plug-in with options.

`$.fn.AsyncFileUpload.destroy()`

Destroy plug-in.

`$.fn.AsyncFileUpload.upload ( callback )`

Upload selected files to the URL specified in `init( options )`. This method takes a callback function as it's argument which is called when all files have been uploaded.

## License
(The MIT License)

Copyright (c) 2013 Marc Loney &lt;marc@marcloney.com&gt;

Permission is hereby granted, free of charge, to any person obtaininga copy of 
this software and associated documentation files (the 'Software'), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:z

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
