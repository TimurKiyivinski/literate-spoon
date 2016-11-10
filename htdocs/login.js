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

    _.post('login.php', data => {
      console.log('Server responded with the following:', data)
    }, {
      email: email,
      password: password,
      manager: false
    })
  }
})()
