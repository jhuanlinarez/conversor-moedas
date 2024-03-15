import { useEffect, useState } from "react";
import axios from "axios";
import "./CurrencyConverter.css";

const CurrencyConverter = () => {

  // Estado das moedas
  const [rates, setRates] = useState(null);

  // Estado para armazenar a moeda de origem
  const [fromCurrency, setFromCurrency] = useState("USD");

  // Estado para armazenar a moeda de destino
  const [toCurrency, setToCurrency] = useState("EUR");

  // Estado para armazenar o valor a ser convertido
  const [amount, setAmount] = useState("1");
  
  // Estado para armazenar o valor convertido
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Efeito para buscar as taxas de câmbio de API
  useEffect(() => {
    axios
    .get("https://v6.exchangerate-api.com/v6/5ed0c8c58a697605d5160e38/latest/USD")
    .then((response) => {
      setRates(response.data.conversion_rates);

    })
    .catch((error) => {
      console.log("Deu ruim ao obter API",error);
    });
  }, []);

  //Calcular o valor convertido e corrigir os delays
  useEffect(()=>{

    //Verifica se o objeto rates não é nulo ou indefinido
      if(rates) {

        //Obtem a taxa(moeda origem) senão existir atribui 0
        const rateFrom = rates[fromCurrency] || 0;

        //Obtem a taxa(moeda destino) senão existir atribui 0
        const rateTo = rates[toCurrency] || 0;

        setConvertedAmount(((amount / rateFrom) * rateTo).toFixed(2));
      }
  },[amount, rates, fromCurrency, toCurrency]);

  if(!rates) {
    return<div>Carregando...</div>
  }


  return (
    <div className="converter">
        <h2>Conversor de moedas</h2>

        <input type="number" placeholder="Digite o valor..." value={amount} onChange={(e)=>setAmount(e.target.value)}/>
        <span>Selecione as moedas</span>

        <select value={fromCurrency} onChange={(e)=>setFromCurrency(e.target.value)}>
           {Object.keys(rates).map((currency)=>(
           <option key={currency} value={currency}>
            {currency}
           </option>))}
        </select>

        <span>para</span>

        <select value={toCurrency} onChange={(e)=>setToCurrency(e.target.value)}>
           {Object.keys(rates).map((currency)=>(
           <option key={currency} value={currency}>
            {currency}
           </option>))}
        </select>

        <h3>{convertedAmount} {toCurrency}</h3>
        <p>{amount} {fromCurrency} valem {convertedAmount} {toCurrency}</p>

    </div>
  )
}

export default CurrencyConverter