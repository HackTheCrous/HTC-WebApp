
const uid = "ADE60414e4e4545454e434f555253323032322d323032332d35353434352d302d30:";

import ical from 'node-ical';

import fs from 'fs';
import PlanningDayModel from '../models/PlanningDayModel.mjs';

export default class PlanningScrappingService{
    constructor(link) {
        this.link = link;
        this.events= null;
    }
    
    
    async getEvents(){
        if(this.events === null){
            const events = await ical.async.fromURL(this.link);
            this.events = events;
        }
        
        
        return this.events;
    }
    
    async save(){
        return fs.writeFile('planning.json', JSON.stringify(this.events), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
    
    async getEventsByDate(date){
        const eventsThatDay = [];
        const events = await this.getEvents();
        let event;

        for(let k in events){
            event = events[k];
            if(event.type === 'VEVENT'){
                if(event.start.toLocaleDateString() === date){
                    eventsThatDay.push(event);

                }
            }
        }

        return eventsThatDay.map(event=> new PlanningDayModel(Date.parse(event.start.toISOString()), Date.parse(event.end.toISOString()) , event.summary, event.location, event.description));
    }

    async getEventsByPeriod(start, end){
        const eventsThatPeriod = [];
        const events = await this.getEvents();
        let event;

        for(let k in events){
            event = events[k];

            if(event.type === 'VEVENT'){
                if(event.start >= new Date(start) && event.end <= new Date(end)){
                    eventsThatPeriod.push(event);
                }
            }
        }

        return eventsThatPeriod.map(event=> new PlanningDayModel(Date.parse(event.start.toISOString()), Date.parse(event.end.toISOString()) , event.summary, event.location, event.description));
    }
    
}
