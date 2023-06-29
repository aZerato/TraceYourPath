function FileUtilities()
{
  const getExtension = (file: File) => {
    return file.name.split('.').pop()
  };

  return {
    getExtension
  };

};

export default FileUtilities;