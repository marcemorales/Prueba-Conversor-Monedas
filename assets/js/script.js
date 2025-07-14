const btnBuscar = document.getElementById('buscar');
const inputMonto = document.getElementById('monto');
const selectMoneda = document.getElementById('moneda');
const resultado = document.getElementById('resultado');
const graficoCanvas = document.getElementById('grafico');

let chartInstance;

btnBuscar.addEventListener('click', async () => {
  const monto = parseFloat(inputMonto.value);
  const tipoMoneda = selectMoneda.value;

  if (!monto || !tipoMoneda) {
    resultado.textContent = 'Por favor, complete todos los campos.';
    return;
  }

  try {
    const res = await fetch(`https://mindicador.cl/api/${tipoMoneda}`);
    const data = await res.json();

    const valorHoy = data.serie[0].valor;
    const convertido = (monto / valorHoy).toFixed(2);
    resultado.textContent = `Resultado: $${convertido}`;

    const ultimos10 = data.serie.slice(0, 10).reverse();
    const labels = ultimos10.map(item => item.fecha.slice(0, 10));
    const valores = ultimos10.map(item => item.valor);

    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Moneda últimos 10 días`,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          data: valores,
          tension: 0.3
        }]
      }
    };

    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(graficoCanvas, config);
  } catch (error) {
    resultado.textContent = `¡Error al consultar la API! ${error.message}`;
  }
});
