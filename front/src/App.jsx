import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Papa from 'papaparse'

const baseURL = 'http://127.0.0.1:3000/products'

function App() {
  const [data, setData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleUpload = (e) => {
    setData([])
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const { data } = results 
        let aux = data[data.length - 1]
        if(Object.values(aux)== ''){
          data.pop()
        }
        setData(data)
      }
    })
  };

  const handleValidate = () => {
    console.log("handleValidate")
    setIsValid(false)
    axios.post(`${baseURL}/validate`, {
      data
    }).then((res) => {
      const {data} = res
      console.log("Voltou da validação:\n")
      console.log(data)

      const hasFalseValue = data.some(obj => Object.values(obj).includes(false));

      if (!hasFalseValue) {
        console.log('Não existem valores false na API.');
        setIsValid(true)
      } else {
        console.log('Existe pelo menos um valor false na API.');
      }

    })

    /* setErrors([])

    let error = [];

    data.forEach(e => {
      let message = '';
      let keys = Object.keys(e)

      if(keys.length != 2) {
        message += 'Não contém as informações necessárias.\n'
      }
     
      if(keys[0] !== "product_code" || keys[1] !== "new_price") {
        message += 'Um ou mais campos esperados estão ausentes.\n'
      }

      let values = Object.values(e)
      console.log("values: ", values)

      if((!Number.isInteger(parseInt(values[0])))) {
        message += 'O código de produto informado é inválido.\n'
      }

      if(!(typeof parseFloat(values[1]) === 'number')){
        message += 'Problema com o preço dos produtos.\n'
      }
      error.push(message)
    })

    setErrors([...error])
    let countErrors = 0;
    console.log(errors)
    errors.forEach((e) => {
      console.log(e);
      if(e !== ''){
        countErrors++
      }
    })

    if(countErrors == 0){
      setIsValid(true)
    } */
  }

  const handleUpdate = () => {
    console.log("handleUpdate\n", data)

    axios.post(`${baseURL}/update-prices`, {
      data
    }).then((res) => {
      const {data} = res
      console.log("Voltou:\n")
      console.log(data)
    })
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        name=""
        id=""
        onChange={handleUpload}
      />

      <br />

      <button onClick={handleValidate}>Validar</button>

      <br /> 
      
      <button onClick={handleUpdate} disabled={!isValid}>Atualizar</button>
      
    </div>
  );
}

export default App
