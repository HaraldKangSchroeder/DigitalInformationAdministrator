export default class Task {

    id: number;
    label: string;

    constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
    }

    getId(): number {
        return this.id;
    }

    getLabel(): string {
        return this.label;
    }
}