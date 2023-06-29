import { ChangeEvent, useState } from 'react';

interface FileUploaderProps
{
    onFileSelectSuccess: (file: File) => void,
    onFileSelectError: (ex: any) => void
}

function FileUploader(Props: FileUploaderProps) 
{
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try 
    {
        if (e.target.files) 
        {
            setFile(e.target.files[0]);
            Props.onFileSelectSuccess(e.target.files[0]);
        }
    }
    catch(e: any)
    {
        Props.onFileSelectError(e);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <div>{file && file.name}</div>
    </div>
  );
};

export default FileUploader;