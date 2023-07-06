import { useState } from "react";

import { EventInterface } from '@sports-alliance/sports-lib/lib/events/event.interface'; 
import { ActivityInterface } from '@sports-alliance/sports-lib/lib/activities/activity.interface';
import { LapInterface } from '@sports-alliance/sports-lib/lib/laps/lap.interface';
import { DataInterface } from '@sports-alliance/sports-lib/lib/data/data.interface';
import { DataDistance } from '@sports-alliance/sports-lib/lib/data/data.distance';
import { EventExporterTcx } from './../SwimSplitter/exporter.tcx';

export interface PropsSwimSplitter {
  event: EventInterface | undefined
}

function SwimSplitter(Props: PropsSwimSplitter) 
{
  const [sEvent, setEvent] = useState<EventInterface>()

  const swimRecalculate = async() => {
    if (Props === undefined ||
        Props.event === undefined)
    {
      return; 
    }
    
    try 
    {
        const wrongPoolSize: number = 25;
        const correctPoolSize: number = 50;
        const diffPoolSize: number = correctPoolSize / wrongPoolSize;

        const activities:ActivityInterface[] = Props.event.getActivities();

        activities.forEach((activity) => {
        
          const laps:LapInterface[] = activity.getLaps();

          laps.forEach((lap) => {

            const stats:Map<string, DataInterface> = lap.getStats() as Map<string, DataInterface>;

            stats.forEach((stat) => {
              
              const type = stat.getType();
              if (type == DataDistance.type) // type = 'Distance'
              {
                let value:number = Number.parseInt(stat.getValue(DataDistance.type).toString());
                let nvalue:number = diffPoolSize * value;
                stat.setValue(nvalue);
              }
            });

          });
        
        });

        setEvent((sEvent) => { return sEvent = Props.event});
    }
    catch(e: any)
    {
        
    }
  };

  const exportTcxFile = async () =>
  {
    if (sEvent === undefined)
    {
      return;
    }

    const exporter = new EventExporterTcx();
    
    const exportStr = await exporter.getAsString(sEvent);
    
    const blob = new Blob([ exportStr ], { type: exporter.fileType, });
    
    downloadBlob(blob, `export.${exporter.fileExtension}`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
  
    a.href = url;
    a.download = filename || 'download';
  
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        removeEventListener('click', clickHandler);
      }, 150);
    };
  
    a.addEventListener('click', clickHandler, false);
  
    a.click();
  };

  return (
    <div>
      <button type="button" onClick={swimRecalculate}>Recalculation</button>
      <button type="button" onClick={exportTcxFile}>Export to Tcx</button>
    </div>
  );
};

export default SwimSplitter;