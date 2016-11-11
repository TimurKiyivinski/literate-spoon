/* global $ _ */

;(function () {
  const formError = $('#formError')

  // Update goods
  const update = () => {
    _.get('good.php', data => {
      if (!data.err) {
        // Remove old items
        [...document.getElementsByClassName('item')].map(element => element.remove())

        const process = $('#tableProcess')
        data.data.map(good => {
          const tr = document.createElement('tr')
          tr.className = 'item'

          // Populate column data
          ;['id', 'name', 'price', 'available', 'hold', 'sold'].map(key => {
            const td = document.createElement('td')
            td.innerHTML = good[key]
            tr.appendChild(td)
          })
          // Append row to catalog
          process.appendChild(tr)
        })
      }
    })
  }
  update()
  setInterval(update, 10 * 1000)

  const submit = $('#formButton')

  submit.onclick = () => {
    _.post('good.php', data => {
      if (!data.err) {
        update()
      } else {
        formError.innerHTML = data.message
      }
    }, {
      method: 'process'
    })
  }
})()
