# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
window.Application ||= {}
Application.pollForProgress = (uid) ->
	$.getJSON '/submissions/' + uid, (data) ->
		if data.state == 'deployed'
			window.location.href = '/submissions/' + uid + "?new_entry=true"
		else
			if data.state == 'processing'
				$('.percent').html(data.percent)
				$('.progress').removeClass('progress-warning')
				$('.progress .bar').css('width', data.percent)
				$('.state').html('Encoding your video...')
			setTimeout((() -> Application.pollForProgress(uid)), 5000)