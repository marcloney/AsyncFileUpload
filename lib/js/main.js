(function($) {
  'use strict';

  var language = {
    dragText : 'Drop file(s) here'
  };

  var FileUpload = function(file, url) {
    var self = this;

    this.format_bytes = function(bytes, precision) {  
      var kilobyte = 1024
        , megabyte = kilobyte * 1024
        , gigabyte = megabyte * 1024
        , terabyte = gigabyte * 1024;
     
      if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
      
      } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
      
      } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
      
      } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
   
      } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
   
      } else {
        return bytes + ' B';
      }
    };

    this.render = function() {
      var $el = $('<tr>').attr('id', window.btoa(this.file.name))

        , size = this.format_bytes(this.file.size, 2)

        , types = ['pdf', 'image', 'word', 'zip', 'video', 'audio']

        , type = 'other';

      async.each(types, function(index, fn) {
        if(self.file.type.indexOf(index) >= 0) {
          type = index;
        }
      });

      $('<td>').addClass('afu-filetype').attr('data-filetype', type).appendTo($el);
      $('<td>').addClass('afu-filename').html(this.file.name).appendTo($el);
      $('<td>').addClass('afu-filesize').html(size).appendTo($el);
      this.$progress = $('<td>').addClass('afu-progress').html('0%').appendTo($el);

      return $el;
    };

    this.upload = function(fn) {
      var XHR = new XMLHttpRequest();

      var upload_progress_handler = function(e) {
        var percentComplete = parseInt(e.loaded / e.total * 100, 10);

        self.$progress.html(percentComplete + '%');
      };

      if(XHR.upload) {
        XHR.upload.addEventListener('progress', upload_progress_handler, false);

        XHR.onreadystatechange = function(e) {
          if(XHR.readyState == 4) {
            if(XHR.status == 200) {
              self.$progress.html('success');

              return fn.bind(self);
            } else {
              self.$progress.html('failure');

              return fn(XHR.status);
            }
          }
        };

        XHR.open('POST', this.url, true);
        XHR.setRequestHeader('X_FILENAME', this.file.name);
        XHR.send(this.file);
      }
    };

    this.init = function(file, url) {
      this.file = file;

      this.url = url;
    };

    this.init(file, url);
  };

  $.AsyncFileUpload = function(el, options) {
    var self = this;

    this.init = function(el) {
      this.options = $.extend({},$.AsyncFileUpload.defaultOptions, options);

      this.$input = $(el);

      this.$input.data('AsyncFileUpload', this);

      if(!this.$input.is('input[type=file]'))
        return $.error('Cannot call on non input[type=file] DOM object.');

      //Wrap input[type=file] in container
      this.$input.wrap('<div>');

      this.$container = this.$input.parent().addClass('afu-container');

      //Create array of files to be uploaded
      this.files = [];

      //Create required DOM objects within our container
      render();

      //Attach required events to our objects
      events();
    };

    this.clear = function() {
      this.files = [];

      this.$log.html('');
      this.$input.val('');
    };

    this.destroy = function() {
      //Remove DOM objects
      $().add(this.$drag)
         .add(this.$log)
         .remove();

      //Remove base.$container
      this.$input.unwrap();
    };

    this.upload = function(callback) {
      var currentFiles = [];

      //Upload all files asynchronously
      async.each(
        self.files
      , function(file, fn) {
          file.upload(function() {
            //Add files uploaded to local var in order of upload
            currentFiles.push(this.file);

            //Run callback
            fn();
          });
        }
      , function(err) {
          self.files = [];

          if(err) {
            return $.error(err);
          }

          //Run callback to userland with an array of window.File
          return callback(currentFiles);
        }
      );
    };

    var render = function() {
      //Hide input[type=file]
      if(self.options.inputHidden)
        self.$input.hide();
      
      //Insert drag n' drop area
      if(self.options.drag) {
        self.$drag = $('<div>').addClass('afu-drag').appendTo(self.$container);

        $('<p>').html(language.dragText).appendTo(self.$drag);
      }

      //Hide drag n' drop area
      if(self.options.dragHidden)
        self.$drag.hide();

      //Insert log area
      self.$log = $('<table>').addClass('afu-log').appendTo(self.$container);
    };

    var events = function() {

      var input_change_handler = function(e) {
        var currentFiles = e.target.files || e.dataTransfer.files;

        e.stopPropagation();
        e.preventDefault();

        for(var i = 0; i < currentFiles.length; ++i) {
          var file = new FileUpload(currentFiles[i], self.options.url);
          //Add current file to global files
          
          self.files.push(file);

          //Render table row and append to log
          self.$log.append(file.render());
        }

        //Remove dragover effect
        self.$drag.removeClass('afu-dragover');

        //Clear input field
        self.$input.val('');
      };

      self.$input.on('change', input_change_handler);

      //If XHR2 is available we can impliment drop uploads
      if(self.options.drag && (new XMLHttpRequest()).upload)
        self.$drag.get(0).addEventListener('drop', input_change_handler, false);

      var drag_dragover_handler = function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(this).addClass('afu-dragover');
      };

      if(self.options.drag)
        self.$drag.on('dragover', drag_dragover_handler);

      var drag_dragleave_handler = function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(this).removeClass('afu-dragover');
      };

      if(self.options.drag)
        self.$drag.on('dragleave', drag_dragleave_handler);
    };

    // Init
    this.init(el);
  };
    
  $.AsyncFileUpload.defaultOptions = {
    'inputHidden': false //Hide the input[type=file] field
  , 'dragHidden': false //Hide the drag n' drop field
  , 'drag': true //Enable drag n' drop
  };
    
  $.fn.AsyncFileUpload = function(options) {
    if(!window.File || !window.FileList || !window.FileReader)
      return $.error('Your browser does not support the HTML5 File API.');

    var args = arguments;

    return this.each(function() {
      var asyncFileUpload = $(this).data('AsyncFileUpload');

      if('string' === typeof options && asyncFileUpload[options])
        return asyncFileUpload[options].apply(this, Array.prototype.slice.call(args, 1));

      if('object' === typeof options)
        return (new $.AsyncFileUpload(this, options));

      return $.error('Method ' + options + 'does not exist.');
    });
  };
})(jQuery);
