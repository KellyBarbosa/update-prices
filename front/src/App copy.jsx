import { useState } from 'react'
import './App.css'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:3000/'

function App() {
  const [file, setFile] = useState([]);
  const [data, setData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);

  const fileReader = new FileReader();

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {

      fileReader.onload = function (event) {
        const text = event.target.result;
        csvToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  const csvToArray = (string) => {
    setData([])
    const rows = string.trim().split("\n");
    const header = rows[0].split(",");   
    const csvData = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");
      const item = {};
      
      for (let col = 0; col < header.length; col++) {
        item[header[col]] = row[col];
      }

      csvData.push(item);
    }

    setData([...csvData]);
    console.log("data:\n", data)
  };

  const handleValidate = () => {
    setIsValid(false)
    setErrors([])
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
    errors.forEach((e, index) => {
      console.log(e);
      if(e !== ''){
        console.log("+1")
        countErrors++
      }
    })

    if(countErrors == 0){
      setIsValid(true)
    }
  }

  const handleUpdate = () => {
    console.log("Atualiza dados no banco")

    axios.get(baseURL).then((res) => {
      console.log(res.data)
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
      <button
        onClick={(e) => {
          handleOnSubmit(e);
        }}
      >
        Importar dados
      </button>

      <br />

      <button onClick={handleValidate}>Validar</button>

      <br /> 
      <button onClick={handleUpdate} disabled={!isValid}>Atualizar</button>
      
    </div>
  );
}

export default App
