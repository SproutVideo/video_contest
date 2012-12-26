jQuery(document).ready(function($) {
    var extensions_regex = /(\.|\/)(3g2|3gp|3gp2|3gpp|asf|avi|divx|dv|dvx|flv|gvi|m1pg|m1v|m21|m2t|m2ts|m2v|m4e|m4u|m4v|mjp|mod|moov|mov|movie|mp21|mp4|mpe|mpeg|mpg|mpv2|mts|qt|qtch|qtz|rm|rmvb|rv|svi|swi|tivo|tod|tp|ts|vfw|vid|vob|vp6|vp7|wm|wmv|xvid|yuv|webm|mxf)$/i
    function validate(files) {
        var valid = !!files.length;
        $.each(files, function (index, file) {
            file.error = hasFileError(file);
            if (file.error) {
                valid = false;
            }
        });
        return valid;
    }
    function formatTime (seconds) {
        var date = new Date(seconds * 1000),
        days = parseInt(seconds / 86400, 10);
        days = days ? days + 'd ' : '';
        return days +
        ('0' + date.getUTCHours()).slice(-2) + ':' +
        ('0' + date.getUTCMinutes()).slice(-2) + ':' +
        ('0' + date.getUTCSeconds()).slice(-2);
    }
    function formatBitRate (bits) {
        if (typeof bits !== 'number') {
            return '';
        }
        if (bits >= 1000000000) {
            return (bits / 1000000000).toFixed(2) + ' Gbit/s';
        }
        if (bits >= 1000000) {
            return (bits / 1000000).toFixed(2) + ' Mbit/s';
        }
        if (bits >= 1000) {
            return (bits / 1000).toFixed(2) + ' kbit/s';
        }
        return bits + ' bit/s';
    }
    function hasFileError(f) {
        if(f.error) return f.error;
        var extensions = f.name.split('.')
        if (!extensions_regex.test("." + extensions[extensions.length-1].toLowerCase())) {
            return 'We do not currently accept this type of file for upload.';
        }
        if (f.size > 5368709120) {
            return 'This file is ' + bytesToSize(f.size) + ' but the maximum file size we currently support is 5GB.';
        }

        return false
    }
    function bytesToSize(bytes, precision) { 
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
    }
    var files = [];
    $('#new_submission').fileupload({
		url: '/submissions',
        fileInput: $('#submission_video'),
        form: $('#new_submission'),
        type: 'POST',
        paramName: 'submission[video]',
        dropZone: $(document),
        sequentialUploads: true,
        dataType: 'json',
        add: false,
    }).bind('fileuploadadd', function (e, data) {
        data.files.valid = data.isValidated = validate(data.files);
        files.push(data);
        var file = data.files[0];
        var error = hasFileError(file);
        if (error) {
            alert(error + " Please pick a different file.");
            files = [];
            return;
        } else {
            $('.file-info .data').html('<p>File Name: <strong>' + file.name + '</strong><br/>File Size: <strong>' + bytesToSize(file.size, 2) + '<strong></p>');
            $('.drop-target').hide();
            $('.file-info').show();
        }
        
    })
    .bind('fileuploadsubmit', function (e, data) {
    })
    .bind('fileuploadsend', function (e, data) {
        return validate(data.files)
    })
    .bind('fileuploaddone', function (e, data) {
        window.location.href = data.result.submission_url
    })
    .bind('fileuploadfail', function (e, data) {
        
        alert('There was an error uploading your submission. Please check the form and try submitting again.');
        $('.form-stuff').show();
        $('.overall-progress').hide();
        $('input[type="submit"]').attr('disabled', false).removeClass('disabled').val('Upload Submission!')
        var response = JSON.parse(data.jqXHR.responseText);
        
        if(response.email) {
            $('#submission_email').parent().parent().addClass('error');
            $('#submission_email').next().html('This email address ' + response.email)
        }

        if(response.title) {
            $('#submission_title').parent().parent().addClass('error');
            $('#submission_title').next().html('Title ' + response.title);
        }

        if(response.description) {
            $('#submission_description').parent().parent().addClass('error');
            $('#submission_description').next().html('Description ' + response.description)
        }

    })
    .bind('fileuploadalways', function (e, data) {
    })
    .bind('fileuploadprogress', function (e, data) {
    })
    .bind('fileuploadprogressall', function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('.overall-progress .progress .bar').css('width', progress + "%")
        $('.overall-progress .info .speed h3').text(formatBitRate(data.bitrate));
        var timeLeft = (data.total-data.loaded)/data.bitrate;
        $('.overall-progress .info .time-left h3').text(formatTime(timeLeft));
        $('.overall-progress .info .percent-complete h3').text(((data.loaded/data.total)*100).toFixed(2) + "%");
    })
    .bind('fileuploadstart', function (e) {
    })
    .bind('fileuploadstop', function (e) {
     })
    .bind('fileuploadchange', function (e, data) {
    })
    .bind('fileuploadpaste', function (e, data) {
    })
    .bind('fileuploaddrop', function (e, data) {
    })
    .bind('fileuploaddragover', function (e) {
    });
    $(document).bind('drop dragover', function (e) {
    	e.preventDefault();
	});
    $(document).bind('drop dragleave', function(e) {
        $('.drop-text').removeClass('drag-over')
    });
    $(document).bind('dragover', function(e) {
       $('.drop-text').addClass('drag-over') 
    });
    $(window).bind('beforeunload', function(){
        if($('#new_submission').data('fileupload')._active) {
            return 'You are currently uploading to SproutVideo.com. Are you sure you want to leave the page?'
        }
    });
    $("#new_submission").submit(function(){
        // VALIDATIONS!
        valid = true;
        if (files.length < 1) {
            alert('Please select a video to upload before submitting your entry.');
            valid = false;
        }
        
        //email address
         var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test($('#submission_email').val())) {
            $('#submission_email').parent().parent().addClass('error');
            $('#submission_email').next().html('Please enter a valid email address.')
            valid = false;
        } else {
            $('#submission_email').parent().parent().removeClass('error');
            $('#submission_email').next().html('So we know who to contact if you win!')
        }

        //title
        if($.trim($('#submission_title').val()) == "") {
            $('#submission_title').parent().parent().addClass('error');
            $('#submission_title').next().html('Please enter a title.')
            valid = false;
        } else {
            $('#submission_title').parent().parent().removeClass('error');
            $('#submission_title').next().html('Give your submission a short title.')
        }
        //description
        if($.trim($('#submission_description').val()) == "") {
            $('#submission_description').parent().parent().addClass('error');
            $('#submission_description').next().html('Please enter a description.')
            valid = false;
        } else {
            $('#submission_description').parent().parent().removeClass('error');
            $('#submission_description').next().html('Tell us a little bit more about your submission.')
        }
        if (valid == false) {
            return;
        }

        $('.form-stuff').hide();
        $('.overall-progress').show();

        for(var i = 0; i < files.length; i++) {
            files[i].submit();
        }
        $('input[type="submit"]').attr('disabled', true).addClass('disabled').val('Uploading....')
    });
    $('a.clear-video').click(function(){
        files = [];
        $('.drop-target').show();
        $('.file-info').hide();
    });
});