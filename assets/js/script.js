function addItem() {
  const itemsList = document.getElementById('itemsList');
  const newItem = document.createElement('div');
  newItem.className = 'item-row';
  newItem.innerHTML = `
    <input type="text" placeholder="Descrição do item" required>
    <input type="number" placeholder="Quantidade" required min="1">
    <input type="number" placeholder="Valor unitário" required step="0.01">
    <button type="button" class="delete-btn" onclick="deleteItem(this)">X</button>
  `;
  itemsList.appendChild(newItem);
}

function deleteItem(button) {
  const itemRow = button.parentElement;
  if (document.querySelectorAll('.item-row').length > 1) {
    itemRow.remove();
  }
}

function calculateTax(value, percentage) {
  return (value * percentage) / 100;
}

document.getElementById('nfseForm').addEventListener('submit', function (e) {
  e.preventDefault();
  // Facilitando o uso dos valores monetários
  const valorVenda = parseFloat(document.getElementById('valorVenda').value);
  const irpf = parseFloat(document.getElementById('irpf').value);
  const pis = parseFloat(document.getElementById('pis').value);
  const cofins = parseFloat(document.getElementById('cofins').value);
  const inss = parseFloat(document.getElementById('inss').value);
  const issqn = parseFloat(document.getElementById('issqn').value);

  // Calcula os impostos
  const valorIRPF = calculateTax(valorVenda, irpf);
  const valorPIS = calculateTax(valorVenda, pis);
  const valorCOFINS = calculateTax(valorVenda, cofins);
  const valorINSS = calculateTax(valorVenda, inss);
  const valorISSQN = calculateTax(valorVenda, issqn);
  const totalImpostos = valorIRPF + valorPIS + valorCOFINS + valorINSS + valorISSQN;
  const valorLiquido = valorVenda - totalImpostos;

  // Facilitando o uso dos valores dos itens
  const itemRows = document.querySelectorAll('.item-row');
  let itensHTML = '';
  itemRows.forEach((row, index) => {
    const inputs = row.querySelectorAll('input');
    const descricao = inputs[0].value;
    const quantidade = inputs[1].value;
    const valorUnitario = inputs[2].value;
    const valorTotal = quantidade * valorUnitario;

    itensHTML += `
        <tr>
          <td>${quantidade}</td>
          <td>${descricao}</td>
          <td>R$ ${valorUnitario}</td>
          <td>R$ ${valorTotal.toFixed(2)}</td>
        </tr>
        `;
  });

  // Gera a nota fiscal
  const notaFiscalHTML = `
        <table>
          <tr>
            <th>Quantidade</th>
            <th>Descrição</th>
            <th>Valor Unitário</th>
            <th>Valor Total</th>
          </tr>
          ${itensHTML}
        </table>

        <h3>Resumo dos Impostos</h3>
        <table>
          <tr>
            <td>IRPF (${irpf}%)</td>
            <td>R$ ${valorIRPF.toFixed(2)}</td>
          </tr>
          <tr>
            <td>PIS (${pis}%)</td>
            <td>R$ ${valorPIS.toFixed(2)}</td>
          </tr>
          <tr>
            <td>COFINS (${cofins}%)</td>
            <td>R$ ${valorCOFINS.toFixed(2)}</td>
          </tr>
          <tr>
            <td>INSS (${inss}%)</td>
            <td>R$ ${valorINSS.toFixed(2)}</td>
          </tr>
          <tr>
            <td>ISSQN (${issqn}%)</td>
            <td>R$ ${valorISSQN.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Total Impostos</th>
            <th>R$ ${totalImpostos.toFixed(2)}</th>
          </tr>
        </table>

        <h3>Valores Totais</h3>
        <table>
          <tr>
            <td>Valor Bruto</td>
            <td>R$ ${valorVenda.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Total Impostos</td>
            <td>R$ ${totalImpostos.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Valor Líquido</th>
            <th>R$ ${valorLiquido.toFixed(2)}</th>
          </tr>
        </table>
        `;

  document.getElementById('notaFiscalContent').innerHTML = notaFiscalHTML;
  document.getElementById('notaFiscal').style.display = 'block';
});