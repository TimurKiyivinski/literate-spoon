/* global XMLHttpRequest */

// Query selector alias
const $ = document.querySelector.bind(document)

// AJAX Library
const _ = {
  get: (url, callback) => {
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          const data = JSON.parse(xmlhttp.responseText)
          if (data.redirect) {
            window.location = data.redirect
          } else {
            callback(data)
          }
        }
      }
    }
    xmlhttp.open('GET', url)
    xmlhttp.send()
  },
  post: (url, callback, data) => {
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          const data = JSON.parse(xmlhttp.responseText)
          if (data.redirect) {
            window.location = data.redirect
          } else {
            callback(data)
          }
        }
      }
    }
    xmlhttp.open('POST', url, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xmlhttp.send(JSON.stringify(data))
  }
}

const re = {
  emailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  nameRegex: /^[a-zA-Z0-9\s]*$/,
  phoneRegex: /(\(0[\d]\)|0[\d] )\d{8}$/,
  numberRegex: /^\d+$/,
  len: input => input.length > 0,
  email: input => re.emailRegex.test(input),
  name: input => re.len(input) && re.nameRegex.test(input),
  phone: input => re.phoneRegex.test(input),
  number: input => re.numberRegex.test(input),
  passwords: (a, b) => a === b && a.length > 0
}

;(function () {
  const script = document.createElement('script')
  script.src = `${window.location.pathname.split('/').pop().replace('.htm', '')}.js`
  document.head.appendChild(script)
})()
