/* global $ _ re */

;(function () {
  const submit = $('#formButton')
  const formError = $('#formError')

  submit.onclick = () => {
    const email = $('#formEmail').value
    const fname = $('#formFirstName').value
    const lname = $('#formLastName').value
    const password = $('#formPassword').value
    const repeatPassword = $('#formRepeatPassword').value
    const phone = $('#formPhone').value

    if (!re.email(email)) {
      formError.innerHTML = 'Invalid email provided'
      return
    }

    if (!re.name(fname)) {
      formError.innerHTML = 'Invalid first name'
      return
    }

    if (!re.name(lname)) {
      formError.innerHTML = 'Invalid last name'
      return
    }

    if (![password, repeatPassword].reduce(re.passwords)) {
      formError.innerHTML = 'Passwords do not match'
      return
    }

    if (phone.length > 0 && !re.phone(phone)) {
      formError.innerHTML = 'Phone must be in (0d)dddddddd or 0d dddddddd format'
      return
    }

    formError.innerHTML = ''

    _.post('customer.php', data => {
      if (data.err) {
        formError.innerHTML = data.message
      }
    }, {
      method: 'register',
      email: email,
      fname: fname,
      lname: lname,
      password: password,
      phone: phone
    })
  }
})()
