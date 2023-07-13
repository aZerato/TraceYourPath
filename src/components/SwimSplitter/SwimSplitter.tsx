import { useState } from "react";

import { Form, Button, Col, Row } from 'react-bootstrap';

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
  const [sEvent, setEvent] = useState<EventInterface>();
  const [wrongPoolSize, setWrongPoolSize] = useState<number>();
  const [rightPoolSize, setRightPoolSize] = useState<number>();

  const swimRecalculate = async() => {
    if (Props === undefined ||
        Props.event === undefined)
    {
      return; 
    }

    if (wrongPoolSize === undefined || wrongPoolSize === 0)
    {
      return;
    }

    if (rightPoolSize === undefined || rightPoolSize === 0)
    {
      return;
    }
    
    try 
    {
        const diffPoolSize: number = rightPoolSize / wrongPoolSize;

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

  const updateValue = (defaultVal: number) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
          let functSet = undefined;
          if (e.target.name === "wrongPoolSize")
          {
            functSet = setWrongPoolSize;
          }
          else
          {
            functSet = setRightPoolSize;
          }
          
          if (e.target.value === "") 
          {
            functSet((oldValue) => defaultVal);
          } 
          else 
          {
            functSet((oldValue) => {
                  const newValue = parseInt(e.target.value);
                  return isNaN(newValue) ? oldValue : newValue;
              });
          }
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <h2>Swim split recalculation</h2>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" 
                      controlId="SwimSplitWrongPoolSize">
            <Form.Label>Wrong pool size</Form.Label>
            <Form.Control type="number" 
                          name="wrongPoolSize"
                          placeholder="Enter the incorrect pool size" 
                          value={wrongPoolSize || 25}
                          onChange={updateValue(25)}/>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" 
                      controlId="SwimSplitRightPoolSize">
            <Form.Label>Right pool size</Form.Label>
            <Form.Control type="number" 
                          name="rightPoolSize"
                          placeholder="Enter the correct pool size" 
                          value={rightPoolSize || 50}
                          onChange={updateValue(50)}/>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Button variant="primary" 
                  type="button"
                  onClick={swimRecalculate}>
            Recalculation
          </Button>
        </Col>
        <Col md={6}>
          <Button variant="secondary" 
                  type="button"
                  onClick={exportTcxFile}>
            Export to Tcx
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SwimSplitter;