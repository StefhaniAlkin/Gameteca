document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cadastrarForm')
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  const alert = document.getElementById('alertError')
  let request = getData()
  buildTable(request.data)

  alert.style.display = 'none'

  form.addEventListener('submit', function (event) {
    validateFields(event)
    saveData()
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
    event.preventDefault()
  }
})

//TABLE
function buildTable(data) {
  let tableBody = document.getElementById('tabela-jogos')
  let tr
  data.forEach(game => {
    tr = buildGameTd(game)
    tableBody.appendChild(tr)
  })
}

function buildGameTd(game) {
  let tr = document.createElement('tr')
  tr.id = game.id

  let tdNome = document.createElement('td')
  tdNome.textContent = game.nome
  tr.appendChild(tdNome)

  let tdAno = document.createElement('td')
  tdAno.textContent = game.ano
  tr.appendChild(tdAno)

  let tdPlataformas = document.createElement('td')
  tdPlataformas.textContent = game.plataformas
  tr.appendChild(tdPlataformas)

  let tdCategoria = document.createElement('td')
  tdCategoria.textContent = game.categoria
  tr.appendChild(tdCategoria)

  let tdGenero = document.createElement('td')
  tdGenero.textContent = game.genero
  tr.appendChild(tdGenero)

  let tdAction = document.createElement('td')

  let btnEdit = document.createElement('button')
  btnEdit.className = 'btnEdit'
  btnEdit.textContent = '✏️'
  btnEdit.addEventListener('click', function () {
    console.log('Botão Editar foi clicado.')
  })
  tdAction.appendChild(btnEdit)

  let btnDelete = document.createElement('button')
  btnDelete.className = 'btnDelete'
  btnDelete.textContent = '❌'
  btnDelete.addEventListener('click', function () {
    console.log('Botão Excluir foi clicado.')
  })
  tdAction.appendChild(btnDelete)
  tr.appendChild(tdAction)
  return tr
}

// CRUD API
function getData() {
  let request = { data: localStorage.getItem('data') }
  if (request.data != null) {
    request.status = 200
    request.error = false
    console.log(request.data)
    request.data = JSON.parse(request.data)
    return request
  }
  request.status = 404
  request.error = true
  request.message = 'Dados não encontrados!'
  request.data = []
  return request
}

function saveData() {
  let response = {}
  let idGame

  let request = getData()
  if (request.data != null) {
    idGame = request.data.length
  } else {
    idGame = 0
  }

  game = {
    id: idGame,
    nome: document.getElementById('nome').value,
    ano: document.getElementById('ano-lancamento').value,
    plataformas: getCheckboxes(),
    categoria: document.getElementById('categoria').value,
    genero: document.getElementById('genero').value
  }

  request.data.push(game)
  try {
    localStorage.setItem('data', JSON.stringify(request.data))
  } catch (e) {
    response.status = 423
    response.error = true
    response.message = 'Não foi possível efetuar o cadastro!'
    response.errorStack = e
  }

  response.status = 201
  response.message = 'Cadastro criado com sucesso!'
  response.data = idGame
  return response
}

function getCheckboxes() {
  var arraySelecionados = []
  var checkboxes = document.querySelectorAll("input[type='checkbox']:checked")
  for (var i = 0; i < checkboxes.length; i++) {
    arraySelecionados.push(checkboxes[i].value)
  }

  return arraySelecionados
}
