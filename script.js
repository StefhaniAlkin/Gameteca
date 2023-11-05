document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cadastrarForm')
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  const alert = document.getElementById('alertError')

  alert.style.display = 'none'

  form.addEventListener('submit', function (event) {
    validateFields(event)
  })



  

  function validateFields(event) {
    var selectCategoria = document.getElementById('categoria')
    var selectGenero = document.getElementById('genero')
    var selectedValueCategoria = selectCategoria.value
    var selectedValueGenero = selectGenero.value

    let checked = false
    for (let checkbox of checkboxes) {
      if (checkbox.checked) {
        checked = true
        break
      }
    }

    if (!checked) {
      alert.innerText = 'Selecione pelo menos uma opção de Plataforma.'
      alert.style.display = 'block'
      event.preventDefault()
    } else if (
      selectedValueCategoria === '' ||
      selectedValueCategoria === null
    ) {
      alert.innerText = 'Selecione uma opção de Categoria.'
      alert.style.display = 'block'
      event.preventDefault()
    } else if (selectedValueGenero === '' || selectedValueGenero === null) {
      alert.innerText = 'Selecione uma opção de Genero.'
      alert.style.display = 'block'
      event.preventDefault()
    }
  }
})
