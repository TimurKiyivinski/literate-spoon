/* global XMLHttpRequest */

// Query selector alias
const $ = document.querySelector.bind(document)

// AJAX Library
const _ = {
  request: (method, url, callback, data) => {
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          console.log(xmlhttp.responseText)
          callback(JSON.parse(xmlhttp.responseText))
        }
      }
    }
    xmlhttp.open(method, url)
    // Send data if added
    if (data === false) {
      xmlhttp.send()
    } else {
      xmlhttp.send(data)
    }
  },
  post: (url, callback, data) => _.request('POST', url, callback, data),
  get: (url, callback) => _.request('GET', url, callback, false),
  put: (url, callback) => _.request('PUT', url, callback, false),
  delete: (url, callback) => _.request('DELETE', url, callback, false)
}

const re = {
  emailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  nameRegex: /^[a-zA-Z\s]*$/,
  phoneRegex: /(\(0[\d]\)|0[\d] )\d{8}$/,
  len: input => input.length > 0,
  email: input => re.emailRegex.test(input),
  name: input => re.len(input) && re.nameRegex.test(input),
  phone: input => re.phoneRegex.test(input),
  passwords: (a, b) => a === b && a.length > 0
}

;(function () {
  const script = document.createElement('script')
  script.src = `${window.location.pathname.split('/').pop().replace('.htm', '')}.js`
  document.head.appendChild(script)
})()
