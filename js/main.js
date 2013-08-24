(function($) {
  "use strict";

  var FileUpload = function(file, url) {
    this.file = file;

    this.url = url;

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
      var $el = $('<tr>').attr('id', window.btoa(this.file.name));

      $('<td>').addClass('afu-filetype').attr('data-filetype', this.file.type).appendTo($el);
      $('<td>').html(this.file.name).appendTo($el); 
      this.$progress = $('<td>').addClass('afu-progress').appendTo($tr);

      return $el;
    };

    this.upload = function() {
      var self = this
        , XHR = new XMLHttpRequest();

      var upload_progress_handler = function(e) {
        var percentComplete = parseInt(e.loaded / e.total * 100, 10);

        self.$progress.html(percentComplete + '%');
      };

      if(XHR.upload) {
        XHR.upload.addEventListener('progress', upload_progress_handler, false);

        XHR.onreadystatechange = function(e) {
          if(XHR.readyState == 4) {
            var status = (XHR.status == 200) ? 'success' : 'failure';
            
            self.$progress.html(status);
          }
        };

        XHR.open('POST', this.url, true);
        XHR.setRequestHeader('X_FILENAME', this.file.name);
        XHR.send(this.file);
      }
    };

    this.init = function() {
      this.size = this.format_bytes(this.file.size, 2);   
    };

    this.init();
  };

  $.asyncFiles = function(el, options) {
    var base = this;
        
    base.$el = $(el);

    base.el = el;
        
    base.init = function(el) {
      base.options = $.extend({},$.asyncFiles.defaultOptions, options);

      base.$input = $(el);

      if(!base.$input.is('input[type=file]'))
        return $.error('Cannot call $.fn.asyncFiles() on non input[type=file] DOM object.');

      //Create container to surround the input[type=file]
      base.$container = $('<div>').addClass('afu-container');

      //Wrap input[type=file] in container
      base.$input.wrap(base.$container);

      //Create required DOM objects within our container
      render();

      //Attach required events to our objects
      events();
    };

    base.destroy = function() {
      //Remove DOM objects
      $().add(base.$drag)
         .add(base.$log)
         .remove();

      //Remove base.$container
      base.$input.unwrap();
    };

    var render = function() {
      //Hide input[type=file]
      if(base.options.inputHidden)
        base.$input.remove();
      
      //Insert drag n' drop area
      if(base.options.drag)
        base.$drag = $('<div>').addClass('afu-drag').append(base.$container);

      //Hide drag n' drop area
      if(base.options.dragHidden)
        base.$drag.hide();

      //Insert log area
      base.$log = $('<div>').addClass('afu-log').appendTo(base.$container);
    };

    var events = function() {
      var input_change_handler = function(e) {
        var currentFiles = e.target.files || e.dataTransfer.files;

        e.stopPropagation();
        e.preventDefault();

        for(var i = 0; i < currentFiles.length; ++i) {
          var file = new FileUpload(currentFiles[i], base.options.url);

          //Add current file to global files
          base.files.push(file);
          
          //Render table row and append to log
          base.$log.append(file.render());
        }

        base.$drag.removeClass('dragover');
      };

      base.$input.on('change', input_change_handler);

      //If XHR2 is available we can impliment drop uploads
      if(base.options.drag && (new XMLHttpRequest()).upload)
        base.$drag.get(0).addEventListener('drop', input_change_handler, false);

      var drag_dragover_handler = function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(this).addClass('afu-dragover');
      };

      if(base.options.drag)
        base.$drag.on('dragover', drag_dragover_handler);

      var drag_dragleave_handler = function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(this).removeClass('afu-dragover');
      };

      if(base.options.drag)
        base.$drag.on('dragleave', drag_dragleave_handler);
    };
        
    // Init
    base.init(el);
  };
    
  $.asyncFiles.defaultOptions = {
    "inputHidden": false //Hide the input[type=file] field
  , "dragHidden": false //Hide the drag n' drop field
  , "drag": true //Enable drag n' drop
  };
    
  $.fn.asyncFiles = function(options) {
    if(!window.File || !window.FileList || !window.FileReader)
      return $.error('Your browser does not support the HTML5 File API.');

    if(typeof options === 'string' && base[options])
      return base[options];

    if(typeof options === 'object' || !options) {
      return this.each(function() {
        (new $.asyncFiles(this, options));
      });
    }

    return $.error('Method' + options + ' does not exist.');
  };

})(jQuery);
