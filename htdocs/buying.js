/* global $ _ */

;(function () {
  const formError = $('#formError')
  // User goods
  const carts = []
  // Update goods
  const update = () => {
    _.get('good.php', data => {
      if (!data.err) {
        // Remove old items
        [...document.getElementsByClassName('item')].map(element => element.remove())

        // Refresh items
        const catalog = $('#tableCatalog')
        data.data
          .filter(good => good.available > 0)
          .map(good => {
            const tr = document.createElement('tr')
            tr.className = 'item'

            // Populate column data
            ;['id', 'name', 'description', 'price', 'available'].map(key => {
              const td = document.createElement('td')
              td.innerHTML = good[key]
              tr.appendChild(td)
            })

            // Create add button
            const addButton = document.createElement('button')
            // Button click handler
            addButton.onclick = () => {
              _.post('good.php', data => {
                // Handle returned data
                if (!data.err) {
                  carts.push(data.data)
                  const catalog = $('#tableCart')
                  carts.map(good => {
                    const cartTr = document.createElement('tr')
                    cartTr.className = 'cart'

                    // Populate column data
                    ;['id', 'price', 'available'].map(key => {
                      const cartTd = document.createElement('td')
                      cartTd.innerHTML = good[key]
                      cartTr.appendChild(cartTd)
                    })
                    catalog.appendChild(cartTr)
                  })
                } else {
                  formError.innerHTML = data.message
                }
                update()
              }, {
                method: 'cart',
                id: good.id
              })
            }

            // Add button
            addButton.innerHTML = 'Add'
            const tdButton = document.createElement('td')
            tdButton.appendChild(addButton)
            tr.appendChild(tdButton)

            // Append row to catalog
            catalog.appendChild(tr)
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
