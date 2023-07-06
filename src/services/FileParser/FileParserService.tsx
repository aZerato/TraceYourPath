import { SportsLib } from '@sports-alliance/sports-lib'; 
import { DOMParser } from '@xmldom/xmldom';
import { EventInterface } from '@sports-alliance/sports-lib/lib/events/event.interface'; 

import FileUtilities from "./../../utils/FileUtilities/FileUtilities";

export interface PropsSportFileParsing {
  file: File, 
  fileContent: string | ArrayBuffer | null | undefined, 
  onFileReadSuccess: (ev: EventInterface) => void,
  onFileReadError: (ev: EventInterface) => void
}

function FileParserService()
{
  const SPORT_FILE_EXT = {
    fit: "fit",
    gpx: "gpx",
    tcx: "tcx"
  };

  const fileUtilities = FileUtilities();

  const MIME_TYPE_XML = "application/xml";

  const sportFileParsing = (Props: PropsSportFileParsing) => {
    try
    {
      if (Props.file == null || Props.fileContent == null)
      {
        return;
      }
      
      let fileExtension = fileUtilities.getExtension(Props.file);
      switch(fileExtension)
      {
        case SPORT_FILE_EXT.gpx:
        {
          SportsLib.importFromGPX(Props.fileContent as string).then((ev) => {
            console.log(ev);
            Props.onFileReadSuccess(ev);
          });
          break;
        }
        case SPORT_FILE_EXT.fit:
        {
          SportsLib.importFromFit(Props.fileContent as ArrayBuffer).then((ev)=>{
            console.log(ev);
            Props.onFileReadSuccess(ev);
          });
          break;
        }
        case SPORT_FILE_EXT.tcx:
        {
          let parser = new DOMParser();
          let doc = parser.parseFromString(Props.fileContent as string, MIME_TYPE_XML);
          SportsLib.importFromTCX(doc).then((ev) => {
            console.log(ev);
            Props.onFileReadSuccess(ev);
          });
          break;
        }
        default:
        {
          break;
        }
      }
    }
    catch(e: any)
    {
      Props.onFileReadError(e);
    }    
  };

  return {
    SPORT_FILE_EXT,
    sportFileParsing
  };

};

export default FileParserService;