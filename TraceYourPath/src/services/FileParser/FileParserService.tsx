import {SportsLib} from '@sports-alliance/sports-lib'; 
import {DOMParser} from '@xmldom/xmldom';

function FileParserService()
{

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
  }

  return {
    sportFileParsing
  };
  
};

export default FileParserService;