export enum MetricTypes {
	Status,
	Docsis,
	Users,
}

export interface MetricsBase {
    name: string;
    help: string;
    extract<T>(data: T): void;
}

export abstract class MetricBaseClass implements MetricsBase {
    public name: string;
    public help: string;

    /**
     * Base metric
     */
    constructor(name: string, help: string) {
        this.name = name
        this.help = help
    }

    extract<T>(data: T) {
        throw new Error('Method not implemented.');
    }
}