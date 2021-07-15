$(function () {
  const urlParams = new URLSearchParams(window.location.search)
  if (!urlParams.get('token') && !urlParams.get('id')) return alert('Error.')
  $('.acceptJoin').click(function () {
    $.ajax({
      url: `/api/discord/confirmJoin?token=${urlParams.get('token')}&id=${urlParams.get('id')}`,
      type: 'POST',
      dataType: 'text',
      success: function (response, status, http) {
        if (response) {
          const json = $.parseJSON(response)
          status = json.responseCode
          if (status === 1) {
            window.location.href = window.location.href.replace('askToJoin', 'process')
          } else {
            return alert(`Error. Please try manually joining our server or contact us in Discord for support. Error code: ${status}`)
          }
        }
      }
    })
  })
})
