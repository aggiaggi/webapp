import { Motor} from  '../motor/motor';

export class Axis {
    index: number = 1;
    name: string = 'Slider';
    type: string = 'linear';
    unit: string = 'mm';
    ratio: number = 25; //[step/unit], 8 mm per 200 steps
    accel: number = 300;
    decel: number = 500;
    speed: number = 300;
    maxSpeed: number = 600;
    numberOfSteps: number = 100;
    startSoftStopsEnabled: boolean = false;
    endSoftStopsEnabled: boolean = false;
    startSoftStop: number = 0;
    endSoftStop: number = 0;
    pos: number = 0;
    commandedPos: number = 0;
    commandmode: string = 'run';
    programmingState: string = 'OFF';
    motor: Motor;

    constructor(){
        this.motor = new Motor('Trinamic');
    }

    toString(): string {
        return `Axis ${this.index} / ${this.motor.toString()}`;
    }

}