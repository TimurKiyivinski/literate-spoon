/* global $ _ */

;(function () {
  // Update goods
  const update = () => {
    _.get('goods.php', data => {
      console.log('Server responded with the following:', data)
    })
  }
  update()
  setInterval(update, 10 * 1000)

  const submit = $('#formButton')

  submit.onclick = () => {
    _.post('goods.php', data => {
      console.log('Server responded with the following:', data)
    }, {})
  }
})
