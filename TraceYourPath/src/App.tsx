import { useState, useEffect } from "react";

import './App.scss'
import FileUploader from "./components/FileUploader/FileUploader";
import FileUtilities from "./utils/FileUtilities/FileUtilities";
import FileParserService, {PropsSportFileParsing} from "./services/FileParser/FileParserService";
import SwimSplitter from "./components/SwimSplitter/SwimSplitter";
import { EventInterface } from "@sports-alliance/sports-lib/lib/events/event.interface";

function App() {
  
  const [selectedFile, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null | undefined>();
  
  const fileParserService = FileParserService();
  const fileUtilities = FileUtilities();

  const [aEvent, setEvent] = useState<EventInterface>();

  useEffect(() => {
    const propsSportFileParsing:PropsSportFileParsing = {
      file: selectedFile as File,
      fileContent: fileContent,
      onFileReadSuccess: (ev) => {
        console.info(ev);
        setEvent((aEvent) => { 
          return aEvent = ev; 
        });
      },
      onFileReadError: (ev) => {
        console.debug(ev);
      }
    };

    fileParserService.sportFileParsing(propsSportFileParsing);
  }, [selectedFile, fileContent]);   

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
      
      <SwimSplitter 
        event={aEvent} />

        <input type="reset" />

    </form>
    </>
    )
  }
  
  export default App
  