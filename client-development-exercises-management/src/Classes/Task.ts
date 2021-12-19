export default class Task {

    id: number;
    label: string;
    score: number;
    importance: number;
    weeklyOccurences: number;

    constructor(id: number, label: string, score: number, importance: number, weeklyOccurences: number) {
        this.id = id;
        this.label = label;
        this.score = score;
        this.importance = importance;
        this.weeklyOccurences = weeklyOccurences;
    }

    getId(): number {
        return this.id;
    }

    getLabel(): string {
        return this.label;
    }

    getScore(): number {
        return this.score;
    }

    getImportance(): number {
        return this.importance;
    }

    getWeeklyOccurences(): number {
        return this.weeklyOccurences;
    }
}