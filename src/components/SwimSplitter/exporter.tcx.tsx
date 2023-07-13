import {DOMParser, XMLSerializer} from '@xmldom/xmldom';

import { EventInterface } from '@sports-alliance/sports-lib/lib/events/event.interface'; 
import { ActivityInterface } from '@sports-alliance/sports-lib/lib/activities/activity.interface';
import { LapInterface } from '@sports-alliance/sports-lib/lib/laps/lap.interface';
import { DataInterface } from '@sports-alliance/sports-lib/lib/data/data.interface';

import { DataEnergy } from '@sports-alliance/sports-lib/lib/data/data.energy';
import { DataDuration } from '@sports-alliance/sports-lib/lib/data/data.duration';
import { DataPause } from '@sports-alliance/sports-lib/lib/data/data.pause';
import { DataDistance } from '@sports-alliance/sports-lib/lib/data/data.distance';
import { DataHeartRateAvg } from '@sports-alliance/sports-lib/lib/data/data.heart-rate-avg';
import { DataHeartRateMax } from '@sports-alliance/sports-lib/lib/data/data.heart-rate-max';
import { DataSpeedAvg } from '@sports-alliance/sports-lib/lib/data/data.speed-avg';
import { DataSpeedMax } from '@sports-alliance/sports-lib/lib/data/data.speed-max';

export class EventExporterTcx {
	fileType = 'application/tcx+xml';
	fileExtension = 'tcx';
	
	source = `<?xml version="1.0" encoding="UTF-8"?>
	<TrainingCenterDatabase
	xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd"
	xmlns:ns5="http://www.garmin.com/xmlschemas/ActivityGoals/v1"
	xmlns:ns3="http://www.garmin.com/xmlschemas/ActivityExtension/v2"
	xmlns:ns2="http://www.garmin.com/xmlschemas/UserProfile/v2"
	xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns4="http://www.garmin.com/xmlschemas/ProfileExtension/v1">
	<Author xsi:type="Application_t">
	<Name>TraceYourPath</Name>
	<Build>
	<Version>
	<VersionMajor>1</VersionMajor>
	<VersionMinor>0</VersionMinor>
	<BuildMajor>0</BuildMajor>
	<BuildMinor>0</BuildMinor>
	</Version>
	</Build>
	<LangID>en</LangID>
	<PartNumber>001</PartNumber>
	</Author>
	</TrainingCenterDatabase>`;
	
	getAsString(event: EventInterface): Promise<string> {
		return new Promise((resolve, reject) => {
			
			let tcdbTcx = new DOMParser().parseFromString(this.source, 'text/xml');
			
			let activitiesNode = tcdbTcx.createElement("Activities");
			
			const activities:ActivityInterface[] = event.getActivities();
			
			activities.forEach((activity) => {const laps:LapInterface[] = activity.getLaps();
				
				let activityNode = tcdbTcx.createElement("Activity");				
				activityNode.setAttribute('Sport', activity.type);
				
				let idNode = tcdbTcx.createElement("Id");
				idNode.textContent = activity.startDate.toISOString();
				activityNode.appendChild(idNode);

				laps.forEach((lap) => {

					// Main stats
					let lapNode = tcdbTcx.createElement("Lap");
					lapNode.setAttribute('StartTime', lap.startDate.toISOString());

					let durationNode = tcdbTcx.createElement("TotalTimeSeconds");
					durationNode.textContent = lap.getDuration().getValue().toString();
					lapNode.appendChild(durationNode);

					let distanceNode = tcdbTcx.createElement("DistanceMeters");
					distanceNode.textContent = lap.getDistance().getValue().toString();
					lapNode.appendChild(distanceNode);

					let calories = lap.getStat(DataEnergy.type)?.getValue()?.toString();
					if (calories)
					{
						let calNode = tcdbTcx.createElement("Calories");
						calNode.textContent = calories;
						lapNode.appendChild(calNode);
					}	
					
					let hravg = lap.getStat(DataHeartRateAvg.type)?.getValue()?.toString();
					if (hravg)
					{
						let hravgNode = tcdbTcx.createElement("AverageHeartRateBpm");
						let valueNode = tcdbTcx.createElement("Value");
						valueNode.textContent = hravg;
						hravgNode.appendChild(valueNode);
						lapNode.appendChild(hravgNode);
					}	

					let hrmax = lap.getStat(DataHeartRateMax.type)?.getValue()?.toString();
					if (hrmax)
					{
						let hrmaxNode = tcdbTcx.createElement("MaximumHeartRateBpm");
						let valueNode = tcdbTcx.createElement("Value");
						valueNode.textContent = hrmax;
						hrmaxNode.appendChild(valueNode);
						lapNode.appendChild(hrmaxNode);
					}

					let intensityNode = tcdbTcx.createElement("Intensity");
					intensityNode.textContent = "Active";
					lapNode.appendChild(intensityNode);

					let triggerMethodNode = tcdbTcx.createElement("TriggerMethod");
					triggerMethodNode.textContent = "Manual";
					lapNode.appendChild(triggerMethodNode);

					/* TRACK */
					let trackNode = tcdbTcx.createElement("Track");
					
					let trackPointNode = tcdbTcx.createElement("Trackpoint");
					
					let timeNode = tcdbTcx.createElement("Time");
					timeNode.textContent = lap.startDate.toISOString();
					trackPointNode.appendChild(timeNode);

					trackNode.appendChild(trackPointNode);

					let trackPointNode1 = tcdbTcx.createElement("Trackpoint");
					
					let timeNode1 = tcdbTcx.createElement("Time");
					timeNode1.textContent = lap.endDate.toISOString();
					trackPointNode1.appendChild(timeNode1);

					trackNode.appendChild(trackPointNode1);

					lapNode.appendChild(trackNode);					
					/* TRACK */			

					activityNode.appendChild(lapNode);					
				});
				
				activitiesNode.appendChild(activityNode);				
			});
			
			tcdbTcx.getElementsByTagName('TrainingCenterDatabase')[0]
					.appendChild(activitiesNode);
			
			let serialized = new XMLSerializer().serializeToString(tcdbTcx);
			
			resolve(serialized);
		});
	}
}