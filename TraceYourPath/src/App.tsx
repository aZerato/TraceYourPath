import React, { useState } from "react";
import FileUploader from "./components/FileUploader/FileUploader";
import './App.scss'

function App() {
  
  const [selectedFile, setFile] = useState<File>();

  const AppOnFileSelectSuccess = (file: File) =>
  {
    setFile(file);
  };

  return (
    <>
      <h1>Hey</h1>
      <form>
      
      <FileUploader
          onFileSelectSuccess={AppOnFileSelectSuccess}
          onFileSelectError={({ error }) => alert(error)}
        />

      </form>
    </>
  )
}

export default App
