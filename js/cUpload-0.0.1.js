(function($) {
  var $el,
      $status,
      $select,
      $drag,
      
      complete = 0,
      fn,
      upload_url,
      images_url,
      
      uploads = [];
  
  var format_bytes = function(bytes, precision) {  
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;
     
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

  var upload = function(callback) {
    fn = callback;
    
    for (var i = 0; i < uploads.length; i++) {
      upload_file(uploads[i]);
		}
  };
  
	var file_select_handler = function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    $drag.removeClass("dragover");
    
		var files = e.target.files || e.dataTransfer.files;
    
		for (var i = 0; i < files.length; i++) {
			parse_file(files[i]);
		}
	};

	var parse_file = function(file) {
    var types = ['other','pdf','image','word','zip','video','audio']
      , type;
    
    if(file.type.indexOf("pdf") >= 0) {
      type = 1;
    } else if(file.type.indexOf("image") >= 0) {
      type = 2;
    } else if(file.type.indexOf("word") >= 0) {
      type = 3;
    } else if(file.type.indexOf("zip") >= 0) {
      type = 4;
    } else if(file.type.indexOf("video") >= 0) {
      type = 5;
    } else if(file.type.indexOf("audio") >= 0) {
      type = 6;
    } else {
      type = 0;
    }
    
    file.meta = {};
    file.meta.name = file.name;
    file.meta.size = format_bytes(file.size, 2);
    file.meta.type = types[type];
    
    uploads.push(file);
    
    var $tr = $("<tr />").attr("id", window.btoa(file.name)).appendTo($status);
    
    $("<td />").html("<img src=\"" + images_url + "/" + types[type] + ".png\" />").appendTo($tr);
    $("<td />").html(file.name).appendTo($tr);
    $("<td />").html("").appendTo($tr);
    $("<td />").addClass("progress").appendTo($tr);
	};
  
  var upload_file = function(file) {
  	var xhr = new XMLHttpRequest();
    
    if (xhr.upload) {
      var $td = $status.find("tr[id='" + window.btoa(file.name) + "'] td:last");
      
			xhr.upload.addEventListener("progress", function(e) {
				var pc = parseInt(e.loaded / e.total * 100);
        $td.html(pc + "%");
			}, false);

			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
          var status = xhr.status == 200 ? "success" : "failure";
          $td.html(status);
          
          complete++;
          if(complete >= uploads.length) {
            fn(uploads);
          }
				}
			};
      
			xhr.open("POST", upload_url, true);
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(file);
		}
	};

	var init = function(options) {    
    $status = $el.find("#file-status");
    $select = $el.find("#file-select");
    $drag = $el.find("#file-drag");
    
    upload_url = options.upload_url;
    images_url = options.images_url;
    
    $select.on("change", file_select_handler);
    $drag.on("dragover", function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      $(this).addClass("dragover");
      
    }).on("dragleave", function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      $(this).removeClass("dragover");
    });

    // If XHR2 is available then we impliment file drag and drop
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {  
      //$drag.on("drop", file_select_handler);
      $drag.get(0).addEventListener("drop", file_select_handler, false);
		}
	};
  
  var destroy = function() {
    $drag.off();
    $drag.get(0).removeEventListener("drop", file_select_handler);
    uploads = [];
  };

  var methods = {
    'init': function(options) {
      init(options);
    },
    'upload': function(callback) {
      upload(callback);
    },
    'destroy': function() {
      destroy(); 
    }
  };

  $.fn.cUpload = function(method) {
    $el = this;
    
    if(window.File && window.FileList && window.FileReader) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' +  method + ' does not exist on jQuery.cUpload.');
        
        return;
      }
    } else {
      $.error('jQuery.cUpload requires your browser to support the HTML5 File API.');
      
      return;
    }
  };
})(jQuery);