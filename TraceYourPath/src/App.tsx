import React, { useState } from "react";


import './App.scss'
import FileUploader from "./components/FileUploader/FileUploader";

import FileParserService from "./services/FileParser/FileParserService";

function App() {
  
  const [selectedFile, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>();
  
  const AppOnFileSelectSuccess = (file: File) =>
  {
    var reader = new FileReader();
    reader.onload = () => {
      if (file === undefined || reader.result === undefined)
      {
        return;
      }
      
      setFileContent((fileContent) => {
        return fileContent = reader.result;
      });
      
      setFile((selectedFile) => { return selectedFile = file; });
      
      FileParserService().sportFileParsing(file, reader.result);
    };

    let fileExtension = file.name.split('.').pop();
    switch(fileExtension)
    {   
      case "fit":
      {
        reader.readAsArrayBuffer(file);  
        break;
      }
      default: {
        reader.readAsText(file);  
        break;
      }  
    }
  };
  
  
  
  const AppOnError = (ex: any) => {
    alert(ex);
  };
  
  return (
    <>
    <h1>Hey</h1>
    <form>
    
    <FileUploader
    onFileSelectSuccess={AppOnFileSelectSuccess}
    onFileSelectError={AppOnError}
    />
    
    </form>
    </>
    )
  }
  
  export default App
  