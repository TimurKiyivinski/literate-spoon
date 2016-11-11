/* global $ _ */

;(function () {
  // User goods
  let carts = []
  const formError = $('#formError')
  const formMessage = $('#formMessage')

  const updateCart = () => {
    const catalog = $('#tableCart')
    // Remove items
    ;[...document.getElementsByClassName('cart')].map(element => element.remove())
    // Recreate items
    carts.map(good => {
      const cartTr = document.createElement('tr')
      cartTr.className = 'cart'

      // Populate column data
      ;['id', 'price', 'quantity'].map(key => {
        const cartTd = document.createElement('td')
        cartTd.innerHTML = good[key]
        cartTr.appendChild(cartTd)
      })

      // Create remove button
      const removeButton = document.createElement('button')
      removeButton.innerHTML = 'Remove from cart'
      removeButton.onclick = () => {
        carts = carts.filter(cart => cart.id !== good.id)
        cartTr.remove()
        // Update server goods
        _.post('good.php', data => {
          update()
        }, {
          method: 'remove',
          id: good.id,
          quantity: good.quantity
        })
      }

      // Add button
      const cartTdButton = document.createElement('td')
      cartTdButton.appendChild(removeButton)
      cartTr.appendChild(cartTdButton)

      catalog.appendChild(cartTr)
    })
  }

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
            addButton.innerHTML = 'Add to cart'
            // Button click handler
            addButton.onclick = () => {
              _.post('good.php', data => {
                // Handle returned data
                if (!data.err) {
                  // Update cart
                  if (carts.filter(cart => cart.id === data.data.id).length > 0) {
                    console.log('Increasing existing item count')
                    carts.filter(cart => cart.id === data.data.id).map(cart => cart.quantity += 1)
                  } else {
                    carts.push({
                      id: data.data.id,
                      price: data.data.price,
                      quantity: 1
                    })
                  }
                  updateCart()
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
  confirm.onclick = () => {
    carts.map(good => {
      _.post('good.php', data => {
        if (!data.err) {
          const due = carts.map(cart => cart.price * cart.quantity).reduce((a, b) => a + b)
          formMessage.innerHTML = `Your purchase has been confirmed and total amount due to pay is $ ${due}`
          carts = []
          updateCart()
        }
      }, {
        method: 'sell',
        id: good.id,
        quantity: good.quantity
      })
    })
  }

  const cancel = $('#formCancel')
  cancel.onclick = () => {
    carts.map(good => {
      _.post('good.php', data => {
        if (!data.err) {
          formMessage.innerHTML = 'Your purchase request has been cancelled, welcome to shop next time'
          carts = []
          updateCart()
          update()
        }
      }, {
        method: 'remove',
        id: good.id,
        quantity: good.quantity
      })
    })
  }
})()
