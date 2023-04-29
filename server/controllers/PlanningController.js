const link = "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac603ab589f4bd73caa3aaf22c4ddebdb494015a26d2e73ef50189ac6c4e1aa8c9e2f,1";

const uid = "ADE60414e4e4545454e434f555253323032322d323032332d35353434352d302d30:";

import ical from 'node-ical';

import fs from 'fs';
import PlanningDayModel from '../models/PlanningDayModel.mjs';

export default class PlanningScrappingService{
    constructor() {
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
        
        return eventsThatDay.map(event=> new PlanningDayModel(Date.parse(event.start.toISOString()), Date.parse(event.start.toISOString()) , event.summary, event.location, event.description));
    }
    
}
