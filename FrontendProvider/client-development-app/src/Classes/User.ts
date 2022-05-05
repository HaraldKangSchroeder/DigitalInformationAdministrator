export default class User {

    id: number;
    name: string;
    scoreOfWeek : number;
    scoreOfYear : number;
    avatarColor : string;

    constructor(id: number, name: string, scoreOfWeek : number, scoreOfYear : number, avatarColor : string) {
        this.id = id;
        this.name = name;
        this.scoreOfWeek = scoreOfWeek;
        this.scoreOfYear = scoreOfYear;
        this.avatarColor = avatarColor;
    }

    getName(): string {
        return this.name;
    }

    getId(): number {
        return this.id;
    }

    getScoreOfWeek() : number {
        return this.scoreOfWeek;
    }

    getScoreOfYear() : number {
        return this.scoreOfYear;
    }

    getAvatarColor() : string {
        return this.avatarColor;
    }

    getNameCode() : string {
        if(this.name.length < 2){
            return this.name;
        }
        return this.name.substring(0,2);
    }
}