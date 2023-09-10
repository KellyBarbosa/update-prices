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
        setData([])
      }

    })
  }

  const handleUpdate = () => {
    console.log("handleUpdate\n", data)

    axios.post(`${baseURL}/update`, {
      data
    }).then((res) => {
      const {data} = res
      console.log("Voltou:\n")
      console.log(data)
    }).finally(() =>{
      setData([])
    })
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
      />

      <br />

      <button onClick={handleValidate} disabled={data.length == 0 }>Validar</button>

      <br /> 
      
      <button onClick={handleUpdate} disabled={!isValid}>Atualizar</button>
      
    </div>
  );
}

export default App
