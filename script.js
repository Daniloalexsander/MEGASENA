// Variáveis globais
let numerosGerados = [];
let jogosAdicionados = [];
let contadorJogos = 1; // Contador para identificar jogos de forma única
const TOTAL_COMBINACOES = 50063860;

// Gerar números aleatórios
function gerarNumeros() {
  const numeros = new Set();
  while (numeros.size < 6) {
    const numero = Math.floor(Math.random() * 60) + 1;
    const formatado = numero.toString().padStart(2, '0');
    if (!jogosAdicionados.flat().includes(formatado)) {
      numeros.add(formatado);
    }
  }
  const jogo = { id: `Jogo ${contadorJogos.toString().padStart(2, '0')}`, numeros: [...numeros] };
  numerosGerados.push(jogo);
  contadorJogos++; // Incrementa o contador
  atualizarNumerosGerados();
  calcularJogosRestantes();

  baixarJSON();
}

function baixarJSON(){
  const dados = {
    numerosGerados,
    jogosAdicionados
  };

  const textoJSON = JSON.stringify(dados, null, 2);
  const blob = new Blob([textoJSON], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resultados-mega-sena.json';
  link.click();
}

// Atualizar exibição dos números gerados
function atualizarNumerosGerados() {
  const container = document.getElementById('numerosGerados');
  container.innerHTML = '';
  numerosGerados.forEach(jogo => {
    const div = document.createElement('div');
    div.className = 'number';
    div.textContent = `${jogo.id}: ${jogo.numeros.join(', ')}`;
    container.appendChild(div);
  });
}

// Adicionar jogo manualmente
function adicionarJogo() {
  const input = document.getElementById('jogoAdicionado');
  const jogo = input.value.split(',').map(num => num.trim());
  const mensagem = document.getElementById('adicionadosMsg');

  if (jogo.length !== 6 || jogo.some(num => isNaN(num) || num < 1 || num > 60)) {
    mensagem.textContent = 'Por favor, insira 6 números válidos entre 01 e 60.';
    mensagem.style.color = 'red';
    return;
  }

  if (jogosAdicionados.some(j => JSON.stringify(j) === JSON.stringify(jogo))) {
    mensagem.textContent = 'Este jogo já foi adicionado.';
    mensagem.style.color = 'orange';
    return;
  }

  const jogoAdicionado = { id: `Jogo ${contadorJogos.toString().padStart(2, '0')}`, numeros: jogo };
  jogosAdicionados.push(jogoAdicionado);
  contadorJogos++; // Incrementa o contador
  mensagem.textContent = 'Jogo adicionado com sucesso!';
  mensagem.style.color = 'green';

  input.value = '';
  atualizarJogosAdicionados();
  calcularJogosRestantes();
}

// Atualizar lista de jogos adicionados
function atualizarJogosAdicionados() {
  const lista = document.getElementById('jogosAdicionados');
  lista.innerHTML = '';
  jogosAdicionados.forEach(jogo => {
    const li = document.createElement('li');
    li.className = 'number';
    li.textContent = `${jogo.id}: ${jogo.numeros.join(', ')}`;
    lista.appendChild(li);
  });
}

// Calcular jogos restantes
function calcularJogosRestantes() {
  const totalJogos = numerosGerados.length + jogosAdicionados.length;
  const jogosRestantes = TOTAL_COMBINACOES - totalJogos;
  document.getElementById('jogosRestantes').textContent = 
    `Jogos restantes para cobrir todas as combinações: ${jogosRestantes.toLocaleString()}`;
}

// Conferir resultado
function conferirResultado() {
  const input = document.getElementById('resultadoMega').value.split(',').map(num => num.trim());
  const resultado = document.getElementById('resultadoConferido');
  resultado.innerHTML = '';

  if (input.length !== 6 || input.some(num => isNaN(num) || num < 1 || num > 60)) {
    resultado.textContent = 'Por favor, insira 6 números válidos entre 01 e 60.';
    return;
  }

  const todosJogos = [...numerosGerados, ...jogosAdicionados];
  let quadras = [];
  let quinas = [];
  let senas = [];

  todosJogos.forEach(({ id, numeros }) => {
    const acertos = numeros.filter(num => input.includes(num));
    const quantidadeAcertos = acertos.length;

    if (quantidadeAcertos === 4) {
      quadras.push({ id, numeros, acertos });
    } else if (quantidadeAcertos === 5) {
      quinas.push({ id, numeros, acertos });
    } else if (quantidadeAcertos === 6) {
      senas.push({ id, numeros, acertos });
    }
  });

  if (senas.length > 0) {
    const divSenas = document.createElement('div');
    divSenas.innerHTML = `<h3>Senas (6 acertos)</h3>`;
    senas.forEach(({ id, numeros, acertos }) => {
      divSenas.innerHTML += `<p>${id} - Números: ${numeros.join(', ')} | Acertos: ${acertos.join(', ')}</p>`;
    });
    resultado.appendChild(divSenas);
  }

  if (quinas.length > 0) {
    const divQuinas = document.createElement('div');
    divQuinas.innerHTML = `<h3>Quinas (5 acertos)</h3>`;
    quinas.forEach(({ id, numeros, acertos }) => {
      divQuinas.innerHTML += `<p>${id} - Números: ${numeros.join(', ')} | Acertos: ${acertos.join(', ')}</p>`;
    });
    resultado.appendChild(divQuinas);
  }

  if (quadras.length > 0) {
    const divQuadras = document.createElement('div');
    divQuadras.innerHTML = `<h3>Quadras (4 acertos)</h3>`;
    quadras.forEach(({ id, numeros, acertos }) => {
      divQuadras.innerHTML += `<p>${id} - Números: ${numeros.join(', ')} | Acertos: ${acertos.join(', ')}</p>`;
    });
    resultado.appendChild(divQuadras);
  }

  if (senas.length === 0 && quinas.length === 0 && quadras.length === 0) {
    resultado.textContent = 'Nenhum jogo acertou 4, 5 ou 6 números.';
  }
}

document.getElementById('gerarNumeros').addEventListener('click', gerarNumeros);
document.getElementById('adicionarJogo').addEventListener('click', adicionarJogo);
document.getElementById('conferirResultado').addEventListener('click', conferirResultado);

// Baixar lista de jogos
/*document.getElementById('baixarLista').addEventListener('click', () => {
  const texto = `Números Gerados:\n${numerosGerados.map(jogo => `${jogo.id}: ${jogo.numeros.join(', ')}`).join('\n')}\n\nNúmeros Adicionados:\n${jogosAdicionados.map(jogo => `${jogo.id}: ${jogo.numeros.join(', ')}`).join('\n')}`;
  const blob = new Blob([texto], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'numeros-mega-sena.txt';
  link.click();*/
});
