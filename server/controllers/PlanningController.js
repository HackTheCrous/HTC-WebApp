const uid = "ADE60414e4e4545454e434f555253323032322d323032332d35353434352d302d30:";

import pkg from 'lz-string';

const {compressToBase64, decompressFromBase64} = pkg;

import ical from 'node-ical';

import fs from 'fs';
import PlanningDayModel from '../models/PlanningDayModel.mjs';

import RedisManager from '../RedisManager.mjs';

const EXPIRATION_DELAY = 3600; //one hour

export default class PlanningScrappingService {
    constructor(link) {
        this.link = link;
        this.events = null;
    }

    /**
     * TODO : when redis database fixed in prod -> decomment to use the redis cache
     * @returns {Promise<null>}
     */
    async getEvents() {

        /*const cachedEvents = await this.getEventsFromCache();

        if (cachedEvents != null) {
            this.events = cachedEvents;
            return this.events;
        }*/

        if (this.events === null) {
            const events = await ical.async.fromURL(this.link);

            //this.saveInCache(events)

            this.events = events;
        }

        return this.events;
    }

    async save() {
        return fs.writeFile('planning.json', JSON.stringify(this.events), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    /**
     * Get a list of events from Redis cache
     * @returns {Promise<any>}
     */
    async getEventsFromCache() {
        const redisClient = RedisManager.getClient();
        await redisClient.connect((err) => {
            return null;
        });


        const cachedEvents = await redisClient.get(this.link);

        if(cachedEvents != null){
            const events = JSON.parse(decompressFromBase64(cachedEvents));
            await redisClient.disconnect();

            return events;
        }
        return null;

    }

    saveInCache(events) {
        const redisClient = RedisManager.getClient();
        redisClient.connect().then(() => {
            redisClient.set(this.link, compressToBase64(JSON.stringify(events)), {
                EX: EXPIRATION_DELAY,
                NX: true
            }).then(() => {
                console.log("saved")

                redisClient.disconnect();
            })
        });

    }

    async getEventsByDate(date) {
        const eventsThatDay = [];
        const events = await this.getEvents();
        let event;

        for (let k in events) {
            event = events[k];
            if (event.type === 'VEVENT') {
                if (event.start.toLocaleDateString() === date) {
                    eventsThatDay.push(event);
                }
            }
        }

        return eventsThatDay.map(event => new PlanningDayModel(Date.parse(event.start.toISOString()), Date.parse(event.end.toISOString()), event.summary, event.location, event.description));
    }

    async getEventsByPeriod(start, end) {
        const eventsThatPeriod = [];
        const events = await this.getEvents();

        let event;


        for (let k in events) {

            event = events[k];

            if (event.type === 'VEVENT') {
                if (typeof event.start === "string") {
                    event.start = new Date(event.start);
                    event.end = new Date(event.end)
                }
                if (event.start >= new Date(start) && event.end <= new Date(end)) {
                    eventsThatPeriod.push(event);
                }
            }
        }
        return eventsThatPeriod.map(event => new PlanningDayModel(Date.parse(event.start.toISOString()), Date.parse(event.end.toISOString()), event.summary, event.location, event.description));
    }

}
