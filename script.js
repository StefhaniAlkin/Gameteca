document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cadastrarForm");
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const alert = document.getElementById("alertError");
  const successAlert = document.getElementById("alertSuccess");
  const alertEdit = document.getElementById("alertErrorEdit");
  const successAlertEdit = document.getElementById("alertSuccessEdit");
  const buttonRegister = document.getElementById("btnModalCadastro")
  let request = getData();
  buildTable(request.data);
  hideAlerts();


  form.addEventListener("submit", function (event) {
    validateFields(event);
    request = getData();
    buildTable(request.data);
  });

  document.getElementById('editarForm').addEventListener("submit", function (event) {
    event.preventDefault();
    validateEditFields(event);
  });

  buttonRegister.addEventListener("click", (e) => hideAlerts())

  function validateFields(event) {
    successAlert.style.display = "none";
    alert.style.display = "none";
    event.preventDefault();
    var selectCategoria = document.getElementById("categoria");
    var selectGenero = document.getElementById("genero");
    var selectedValueCategoria = selectCategoria.value;
    var selectedValueGenero = selectGenero.value;

    let checked = false;
    for (let checkbox of checkboxes) {
      if (checkbox.checked) {
        checked = true;
        break;
      }
    }

    if (!checked) {
      alert.innerText = "Selecione pelo menos uma opção de Plataforma.";
      alert.style.display = "block";
      return;
    } else if (
      selectedValueCategoria === "" ||
      selectedValueCategoria === null
    ) {
      alert.innerText = "Selecione uma opção de Categoria.";
      alert.style.display = "block";
      return;
    } else if (selectedValueGenero === "" || selectedValueGenero === null) {
      alert.innerText = "Selecione uma opção de Genero.";
      alert.style.display = "block";
      return;
    } else {
      let response = saveData();
      successAlert.style.display = 'block';
      successAlert.innerText = response.message;
    }
  } 

function validateEditFields(event) {
  var editCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  successAlert.style.display = 'none';
  alert.style.display = "none";
  event.preventDefault();
  var selectCategoria = document.getElementById("categoriaEdit");
  var selectGenero = document.getElementById("generoEdit");
  var selectedValueCategoria = selectCategoria.value;
  var selectedValueGenero = selectGenero.value;

  let checked = false;
  for (let checkbox of editCheckboxes) {
    if (checkbox.checked) {
      checked = true;
      break;
    }
  }

  if (!checked) {
    alertEdit.innerText = "Selecione pelo menos uma opção de Plataforma.";
    alertEdit.style.display = "block";
    return;
  } else if (
    selectedValueCategoria === "" ||
    selectedValueCategoria === null
  ) {
    alertEdit.innerText = "Selecione uma opção de Categoria.";
    alertEdit.style.display = "block";
    return;
  } else if (selectedValueGenero === "" || selectedValueGenero === null) {
    alertEdit.innerText = "Selecione uma opção de Genero.";
    alertEdit.style.display = "block";
    return;
  } else {
    let response = updateData();
    successAlertEdit.style.display = 'block';
    successAlertEdit.innerText = response.message;
  }
}   
});

function hideAlerts() {
  const alert = document.getElementById("alertError");
  const successAlert = document.getElementById("alertSuccess");
  const alertEdit = document.getElementById("alertErrorEdit");
  const successAlertEdit = document.getElementById("alertSuccessEdit");
  alert.style.display ='none';
  successAlert.style.display = 'none';
  alertEdit.style.display ='none';
  successAlertEdit.style.display ='none';      
}


//TABLE
function buildTable(data) {
  const tabelaJogos = document.getElementById("tabela-jogos");
  while (tabelaJogos.firstChild) {
    tabelaJogos.removeChild(tabelaJogos.firstChild);
  }

  data.forEach((game) => {
    const tr = buildGameRow(game);
    tabelaJogos.appendChild(tr);
  });
}

function buildGameRow(game) {  
  const tr = document.createElement("tr");
  tr.id = game.id;

  tr.appendChild(createTableCell(game.nome));
  tr.appendChild(createTableCell(game.ano));
  tr.appendChild(createTableCell(game.plataformas.join(", ")));
  tr.appendChild(createTableCell(game.categoria));
  tr.appendChild(createTableCell(game.genero));

  const tdActions = document.createElement("td");
  tdActions.appendChild(createEditButton(game));
  tdActions.appendChild(createDeleteButton(game.id));
  tr.appendChild(tdActions);

  return tr;
}

function createTableCell(value) {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
}

function createEditButton(game) {
  const btnEdit = document.createElement("button");
  btnEdit.className = "btnEdit";
  btnEdit.setAttribute("role", "button");
  btnEdit.setAttribute("data-bs-toggle", "modal");
  btnEdit.setAttribute("data-bs-target", "#editarModal");
  btnEdit.textContent = "✏️";

  btnEdit.addEventListener("click", function () {
    hideAlerts();
    setEditForm(game)
  });

  return btnEdit;
}

function createDeleteButton(gameId) {
  const btnDelete = document.createElement("button");
  btnDelete.className = "btnDelete";
  btnDelete.textContent = "❌";

  btnDelete.addEventListener("click", function () {
    deleteData(gameId);
  });

  return btnDelete;
}

function cleanTable(table) {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function cleanCheckboxes(checkboxes) {
  checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
  });
}

function setEditForm(game){
  let hiddenInput = document.getElementById("gameId");
  let nome = document.getElementById('nomeEdit');
  let anoLancamento = document.getElementById('anoLancamentoEdit');
  let plataformaCheckboxes = document.querySelectorAll('#editarForm input[type="checkbox"]');
  cleanCheckboxes(plataformaCheckboxes);
  plataformaCheckboxes.forEach(function (checkbox) {
    if(game.plataformas.includes(checkbox.value))
      checkbox.checked = true;
  });
  let categoria = document.getElementById('categoriaEdit');
  let genero = document.getElementById('generoEdit');
  hiddenInput.value = game.id;
  nome.value = game.nome;
  anoLancamento.value = game.ano;
  categoria.value = "Single Player";
  genero.value = game.genero;


}

// CRUD API
function getData() {
  let response = { data: localStorage.getItem("data") };
  if (response.data != null) {
    response.status = 200;
    response.error = false;
    response.data = JSON.parse(response.data);
    console.log(response);
    return response;
  }
  response.status = 404;
  response.error = true;
  response.message = "Dados não encontrados!";
  response.data = [];
  console.log(response);
  return response;
}

function saveData() {
  let response = {};
  let idGame;

  let request = getData();
  if (request.data != null) {
    idGame = request.data.length;
  } else {
    idGame = 0;
  }

  game = {
    id: idGame,
    nome: document.getElementById("nome").value,
    ano: document.getElementById("ano-lancamento").value,
    plataformas: getCheckboxes(),
    categoria: document.getElementById("categoria").value,
    genero: document.getElementById("genero").value,
  };

  request.data.push(game);
  try {
    localStorage.setItem("data", JSON.stringify(request.data));
  } catch (e) {
    response.status = 423;
    response.message = "Não foi possível efetuar o cadastro!";
    response.errorStack = e;
  }

  response.status = 201;
  response.message = "Cadastro criado com sucesso!";
  response.data = idGame;
  console.log(response);
  return response;
}

function getCheckboxes() {
  var arraySelecionados = [];
  var checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  for (var i = 0; i < checkboxes.length; i++) {
    arraySelecionados.push(checkboxes[i].value);
  }

  return arraySelecionados;
}

function updateData() {
  var gameId = document.getElementById('gameId').value;
  var nome = document.getElementById('nomeEdit').value;
  var anoLancamento = document.getElementById('anoLancamentoEdit').value;
  var plataformaCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  var plataformas = [];
  plataformaCheckboxes.forEach(function (checkbox) {
      plataformas.push(checkbox.value);
  });
  var categoria = document.getElementById('categoriaEdit').value;
  var genero = document.getElementById('generoEdit').value;

  var game = {
      id: gameId,
      nome: nome,
      ano: anoLancamento,
      plataformas: plataformas,
      categoria: categoria,
      genero: genero
  };

  let response = getData();
  if(response.data.length != 0){
    response.data[gameId] = game;
  }
  try {
    localStorage.setItem("data", JSON.stringify(response.data));
  } catch (e) {
    response.status = 423;
    response.error = true;
    response.message = "Não foi possível efetuar o cadastro!";
    response.errorStack = e;
  }

  response.status = 204 ;
  response.error = false;
  response.message = "Jogo editado com sucesso!";
  buildTable(response.data);
  console.log(response);
  return response;
  

}

function deleteData(id) {
  let response = getData();
  if (response.status == 200) {
    if (id >= 0 && id < response.data.length) {
      response.data.splice(id, 1);
      for (let i = id; i < response.data.length; i++) {
        response.data[i].id = i;
      }
    }
  }
  try {
    localStorage.setItem("data", JSON.stringify(response.data));
    response.status = 204;
    response.error = false;
  } catch (e) {
    response.error = true;
    response.status = 423;
    response.message = "Não foi possível efetuar o cadastro!";
    response.errorStack = e;
  }
  console.log(response);
  buildTable(response.data);
}
