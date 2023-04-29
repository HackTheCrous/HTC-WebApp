const link = "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac603ab589f4bd73caa3aaf22c4ddebdb494015a26d2e73ef50189ac6c4e1aa8c9e2f,1";

const uid = "ADE60414e4e4545454e434f555253323032322d323032332d35353434352d302d30:";

import ical from 'node-ical';

import fs from 'fs';

export default class PlanningScrappingService{
    constructor(link) {
        this.link = link;

    }


    async getEvents(){
        const events = await ical.async.fromURL(this.link);
        this.events = events;

        return events;
    }

    async save(){
        return fs.writeFile('planning.json', JSON.stringify(this.events), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    async getEventsByDate(date){
        this.getEvents().then((events) => {
            const dayIds = Object.keys(events);
            for(const id of dayIds){
                if(events[id].start === date){
                    console.log(events[id])
                    return events[id];
                }
            }
        });
    }

}

const planning = new PlanningScrappingService(link);

planning.getEvents().then((events) => {
   console.log(events['ADE60414e4e4545454e434f555253323032322d323032332d3130303831362d302d30'])
});