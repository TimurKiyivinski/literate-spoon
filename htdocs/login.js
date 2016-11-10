/* global $ _ re */

;(function () {
  const submit = $('#formButton')
  const formError = $('#formError')

  submit.onclick = () => {
    const email = $('#formEmail').value
    const password = $('#formPassword').value

    if (!re.email(email)) {
      formError.innerHTML = 'Invalid email provided'
      return
    }

    formError.innerHTML = ''

    _.post('customer.php', data => {
      if (data.err) {
        formError.innerHTML = data.message
      }
    }, {
      method: 'login',
      email: email,
      password: password,
      manager: false
    })
  }
})()
