import { ChangeEvent, useState } from 'react';

import { Form } from 'react-bootstrap';

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
    <Form.Group controlId="fileUploader">
      <Form.Label>Choose your file</Form.Label>
      <Form.Control type="file" onChange={handleFileChange} />
      <Form.Text className="text-muted">
        {
          file && 
          <span>File selected : {file.name}</span>
        }
      </Form.Text>
    </Form.Group>
  );
};

export default FileUploader;