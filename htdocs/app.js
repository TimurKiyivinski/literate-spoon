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
