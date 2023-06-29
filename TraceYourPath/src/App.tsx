import React, { useState } from "react";


import './App.scss'
import FileUploader from "./components/FileUploader/FileUploader";
import FileUtilities from "./utils/FileUtilities/FileUtilities";
import FileParserService from "./services/FileParser/FileParserService";

function App() {
  
  const [selectedFile, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>();
  
  const fileParserService = FileParserService();
  const fileUtilities = FileUtilities();

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
      
      fileParserService.sportFileParsing(file, reader.result);
    };

    let fileExtension = fileUtilities.getExtension(file);
    switch(fileExtension)
    {   
      case fileParserService.SPORT_FILE_EXT.fit:
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
  