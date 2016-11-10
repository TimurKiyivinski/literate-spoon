/* global $ _ re */

;(function () {
  const submit = $('#formButton')
  const formError = $('#formError')

  submit.onclick = () => {
    const username = $('#formUsername').value // To keep things simple, alias as email
    const password = $('#formPassword').value

    if (!re.name(username)) {
      formError.innerHTML = 'Invalid username provided'
      return
    }

    formError.innerHTML = ''

    _.post('customer.php', data => {
      if (data.err) {
        formError.innerHTML = data.message
      }
    }, {
      method: 'login',
      email: username,
      password: password,
      manager: true
    })
  }
})()
