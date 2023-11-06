const copyBtn = document.querySelector('#copyBtn')
const inputURL = document.querySelector('#short-url')

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(inputURL.value)
  alert('複製成功')
})
