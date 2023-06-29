import {SportsLib} from '@sports-alliance/sports-lib'; 
import {DOMParser} from '@xmldom/xmldom';

import FileUtilities from "./../../utils/FileUtilities/FileUtilities";

function FileParserService()
{
  const SPORT_FILE_EXT = {
    fit: "fit",
    gpx: "gpx",
    tcx: "tcx"
  };

  const fileUtilities = FileUtilities();

  const MIME_TYPE_XML = "application/xml";

  const sportFileParsing = (pfile: File, pfileContent: string | ArrayBuffer | null) => {
    if (pfile == null || pfileContent == null)
    {
      return;
    }
    
    let fileExtension = fileUtilities.getExtension(pfile);
    switch(fileExtension)
    {
      case SPORT_FILE_EXT.gpx:
      {
        SportsLib.importFromGPX(pfileContent as string).then((ev) => {
          console.log(ev);
        });
        break;
      }
      case SPORT_FILE_EXT.fit:
      {
        SportsLib.importFromFit(pfileContent as ArrayBuffer).then((ev)=>{
          console.log(ev);
        });
        break;
      }
      case SPORT_FILE_EXT.tcx:
      {
        let parser = new DOMParser();
        let doc = parser.parseFromString(pfileContent as string, MIME_TYPE_XML);
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
    SPORT_FILE_EXT,
    sportFileParsing
  };

};

export default FileParserService;