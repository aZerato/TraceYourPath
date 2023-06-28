import React, { useState } from "react";
import {SportsLib} from '@sports-alliance/sports-lib'; 
import {DOMParser} from '@xmldom/xmldom';

import './App.scss'
import FileUploader from "./components/FileUploader/FileUploader";

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
      
      sportFileParsing(file, reader.result);
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
  
  const sportFileParsing = (pfile: File, pfileContent: string | ArrayBuffer | null) => {
    if (pfile == null || pfileContent == null)
    {
      return;
    }
    
    let fileExtension = pfile.name.split('.').pop();
    switch(fileExtension)
    {
      case "gpx":
      {
        SportsLib.importFromGPX(pfileContent as string).then((ev) => {
          console.log(ev);
        });
        break;
      }
      case "fit":
      {
        SportsLib.importFromFit(pfileContent as ArrayBuffer).then((ev)=>{
          console.log(ev);
        });
        break;
      }
      case "tcx":
      {
        let parser = new DOMParser();
        let doc = parser.parseFromString(pfileContent as string, "application/xml");
        SportsLib.importFromTCX(doc).then((ev) => {
          console.log(ev);          
        });
        break;
      }
      default:
      {        
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
  