export default class Task {

    id: number;
    label: string;
    score: number;
    importance: number;
    weeklyOccurences: number;
    active: boolean;

    constructor(id: number, label: string, score: number, importance: number, weeklyOccurences: number, active: boolean) {
        this.id = id;
        this.label = label;
        this.score = score;
        this.importance = importance;
        this.weeklyOccurences = weeklyOccurences;
        this.active = active;
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

    isActive(): boolean {
        return this.active;
    }
}