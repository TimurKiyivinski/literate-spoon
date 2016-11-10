/* global $ _ re */

;(function () {
  const submit = $('#formButton')
  const formError = $('#formError')

  submit.onclick = () => {
    const name = $('#formName').value
    const price = $('#formPrice').value
    const quantity = $('#formQuantity').value
    const description = $('#formDescription').value

    if (!re.name(name)) {
      formError.innerHTML = 'Invalid item name'
      return
    }

    if (!re.number(price)) {
      formError.innerHTML = 'Invalid price'
      return
    }

    if (!re.number(quantity)) {
      formError.innerHTML = 'Invalid quantity'
      return
    }

    formError.innerHTML = ''

    _.post('listing.php', data => {
      console.log('Server responded with the following:', data)
    }, {
      name: name,
      price: price,
      quantity: quantity,
      description: description
    })
  }
})()
