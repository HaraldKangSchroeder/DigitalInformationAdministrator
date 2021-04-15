export default class Task {
    constructor(id,label,score,importance,weeklyOccurences,active){
        this.id = id;
        this.label = label;
        this.score = score;
        this.importance = importance;
        this.weeklyOccurences = weeklyOccurences;
        this.active = active;
    }

    getId(){
        return this.id;
    }

    getLabel(){
        return this.label;
    }

    getScore(){
        return this.score;
    }

    getImportance(){
        return this.importance;
    }

    getWeeklyOccurences(){
        return this.weeklyOccurences;
    }

    isActive(){
        return this.active;
    }
}