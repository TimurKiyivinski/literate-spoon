/* global $ _ */

;(function () {
  const formMessage = $('#formMessage')
  _.get('logout.php', data => {
    if (!data.err) {
      formMessage.innerHTML = `Thanks, ${data.id}`
    } else {
      console.log(data.message)
    }
  })
})()
