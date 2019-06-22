// HELPER FUNCTION TO CONVERT A DATAURI TO A BLOB
// function dataURItoBlob(dataURI) {
// 	// CONVERT BASE64/URLENCODED DATA COMPONENT TO RAW BINARY DATA HELD IN A STRING
// 	var byteString;
// 	if (dataURI.split(',')[0].indexOf('base64') >= 0)
// 		byteString = atob(dataURI.split(',')[1]);
// 	else
// 		byteString = unescape(dataURI.split(',')[1]);

// 	// SEPARATE OUT THE MIME COMPONENT
// 	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

// 	// WRITE THE BYTES OF THE STRING TO A TYPED ARRAY
// 	var ia = new Uint8Array(byteString.length);
// 	for (var i = 0; i < byteString.length; i++) {
// 		ia[i] = byteString.charCodeAt(i);
// 	}

// 	// RETURN THE BLOB
// 	return new Blob([ia], {type:mimeString});
// }

// HELPER FUNCTION TO DOWNLOAD AN IMAGE
function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

// WHEN THE DOCUMENT IS FULLY LOADED,
// SET UP THE CAMERA AND FILE UPLOAD CODE
$(document).ready(function(){
	// Grab elements, create settings, etc.
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		video = document.getElementById('video'),
		videoObj = { 'video': true },
		errorCallback = function(error) {
			$('#myContainer').hide();
			$('#cameraError').show();
			console.log('Video capture error: ', error.code);
		};

	// Put video listeners into place
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(videoObj).then(function(stream) {
			if ('srcObject' in video) {
				video.srcObject = stream;
			} else {
				video.src = window.URL.createObjectURL(stream);
			}
            video.play();
        }, errorCallback);
    }
	
	// Legacy video listeners
	else if (navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			if ('srcObject' in video) {
				video.srcObject = stream;
			} else {
				video.src = stream;
			}
			video.play();
		}, errorCallback);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream) {
			if ('srcObject' in video) {
				video.srcObject = stream;
			} else {
				video.src = window.webkitURL.createObjectURL(stream);
			}
			video.play();
		}, errorCallback);
	} else if (navigator.mozGetUserMedia) { // WebKit-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream) {
			if ('srcObject' in video) {
				video.srcObject = stream;
			} else {
				video.src = window.URL.createObjectURL(stream);
			}
			video.play();
		}, errorCallback);
	} else {
		errorCallback({ code: 'Unknown error. Browser doesn\'t support getUserMedia API.' });
	}

	// Trigger photo take
	$('#snap').on('click', function() {
		var theWidth = $('#video').attr('width');
		var theHeight = $('#video').attr('height');
		context.drawImage(video, 0, 0, theWidth, theHeight);

		// CONVERT CANVAS TO A DATA URL
		// var myImageDataUrl = canvas.toDataURL('image/png');
		
		// CONVERT DATA URL TO A BLOB (ONLY NEEDED FOR FILE UPLOAD TO A FORM)
		// var blob = dataURItoBlob(myImageDataUrl);
	});

	// Save snapped photo
	$('#save').on('click', function() {
		var myImageDataUrl = canvas.toDataURL('image/png');
		downloadURI(myImageDataUrl, 'snappedImage.png');
	});
});
