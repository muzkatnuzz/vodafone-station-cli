export enum MetricTypes {
	Status,
	Docsis,
	Overview,
}

export interface MetricsBase<T> {
    name: string;
    help: string;
    extract(data: T): void;
}

export abstract class MetricBaseClass<T> implements MetricsBase<T> {
    public name: string;
    public help: string;

    /**
     * Base metric
     */
    constructor(name: string, help: string) {
        this.name = name
        this.help = help
    }

    abstract extract(data: T): void
}