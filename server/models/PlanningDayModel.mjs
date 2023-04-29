export default class PlanningDayModel{
    constructor( start, end, summary, location, description){
        this.start = start;
        this.end = end;
        this.summary = summary;
        this.location = location;
        this.description = description;
    }

    static convertDate(date){
        const dateArray = date.day.split('/');
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        
        

    }
}