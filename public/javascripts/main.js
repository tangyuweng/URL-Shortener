const copyBtn = document.querySelector('#copyBtn')
const inputURL = document.querySelector('#short-url')

copyBtn.addEventListener('click', async () => {
  console.log('onclick')
  if (!inputURL.value) return
  try {
    await navigator.clipboard.writeText(inputURL.value)
    alert('複製成功')
  } catch (error) {
    alert('複製失敗')
    console.log(error)
  }
})
