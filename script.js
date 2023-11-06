document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cadastrarForm");
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const alert = document.getElementById("alertError");
  const successAlert = document.getElementById("alertSuccess");
  let request = getData();
  buildTable(request.data);

  alert.style.display ='none';
  successAlert.style.display = 'none';

  form.addEventListener("submit", function (event) {
    validateFields(event);
    request = getData();
    buildTable(request.data);
  });

  function validateFields(event) {
    successAlert.style.display = 'none';
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

});

//TABLE
function buildTable(data) {
  let tableBody = document.getElementById("tabela-jogos");
  cleanTable(tableBody);
  let tr;
  data.forEach((game) => {
    tr = buildGameTd(game);
    tableBody.appendChild(tr);
  });
}

function buildGameTd(game) {
  let tr = document.createElement("tr");
  tr.id = game.id;

  let tdNome = document.createElement("td");
  tdNome.textContent = game.nome;
  tr.appendChild(tdNome);

  let tdAno = document.createElement("td");
  tdAno.textContent = game.ano;
  tr.appendChild(tdAno);

  let tdPlataformas = document.createElement("td");
  tdPlataformas.textContent = game.plataformas;
  tr.appendChild(tdPlataformas);

  let tdCategoria = document.createElement("td");
  tdCategoria.textContent = game.categoria;
  tr.appendChild(tdCategoria);

  let tdGenero = document.createElement("td");
  tdGenero.textContent = game.genero;
  tr.appendChild(tdGenero);

  let tdAction = document.createElement("td");

  let btnEdit = document.createElement("button");
  btnEdit.className = "btnEdit";
  btnEdit.textContent = "✏️";
  btnEdit.addEventListener("click", function () {
    console.log("Botão Editar foi clicado.");
  });
  tdAction.appendChild(btnEdit);

  let btnDelete = document.createElement("button");
  btnDelete.className = "btnDelete";
  btnDelete.textContent = "❌";
  btnDelete.addEventListener("click", function () {
    deleteData(game.id);
  });
  tdAction.appendChild(btnDelete);
  tr.appendChild(tdAction);
  return tr;
}

function cleanTable(table) {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
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
