/* global $ _ */

;(function () {
  // Add item to cart
  const add = () => {
    console.log('Add')
  }

  // Update goods
  const update = () => {
    _.get('good.php', data => {
      if (!data.err) {
        // Remove old items
        [...document.getElementsByClassName('item')].map(element => element.remove())

        // Refresh items
        const catalog = $('#tableCatalog')
        data.data.map(good => {
          const tr = document.createElement('tr')
          tr.className = 'item'

          // Populate column data
          ;['id', 'name', 'description', 'price', 'available'].map(key => {
            const td = document.createElement('td')
            td.innerHTML = good[key]
            tr.append(td)
          })

          // Create add button
          const addButton = document.createElement('button')
          addButton.onclick = add
          addButton.innerHTML = 'Add'
          const tdButton = document.createElement('td')
          tdButton.append(addButton)
          tr.append(tdButton)

          // Append row to catalog
          catalog.append(tr)
        })
      }
    })
  }
  update()
  setInterval(update, 10 * 1000)

  const confirm = $('#formConfirm')
  const cancel = $('#formCancel')

  confirm.onclick = () => {
    _.post('good.php', data => {
      console.log('Server responded with the following:', data)
    }, {})
  }
})()
