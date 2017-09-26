import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
// import { AxisService } from '../services/axis.service';
import { RealtimeDataService } from '../services/realtime-data.service';
import { Axis } from './axis';
import { AxisConfig } from '../models/model-interfaces';

@Component({
    selector: 'axis',
    templateUrl: './axis.component.html',
})
export class AxisComponent implements OnInit {
    @Input() axis: Axis;
	DEBUG = true;

    constructor(private realtimeDataService: RealtimeDataService) {      
    }
    
    ngOnInit(): void {
		//Get realtime data from mcu by subscribing to realtimeDataService
		//TODO: rearrange axis data -> each axis gets its own JSON data array
        this.realtimeDataService.addListener((data) => {
            let dataobj = JSON.parse(data);
            this.axis.pos = dataobj.axis1.pos;
            console.log(data);
        }, 'position');

        //Setup message channel to server
        this.realtimeDataService.addListener((data) => {
            console.log(data);
        }, 'message');
    }

    //Execute command by sending event to realtimeDataService
    execute(command: string): void {
	    console.log(command);
	    this.realtimeDataService.send('command', command);
    }

    // Home button
	home(): void {
        //Normal mode
	    if(this.axis.programmingState == "OFF") {
	        let command = this.axis.index + "/gohome";
	        this.execute(command);
	        this.axis.commandedPos = 0;
	    } //Programming mode
        else if (this.axis.programmingState == "REC") {
	        let command = this.axis.index + "/sethome";
	        this.execute(command);
	    }
	}

    // Mark button
	mark(): void {
        //TODO
	}

    //Command mode
	commandmode(mode) {
		console.log(mode + " mode");
		if (mode == "run") {
			this.axis.commandmode = "run";
		} else if(mode == "go") {
		    this.axis.commandmode = "go";
		    this.axis.commandedPos = this.axis.pos;
		}		
	}

    //Stop command
    stop(): void {
		this.axis.speed = 0;
        let command = this.axis.index + "/stop";
        this.execute(command);
    }

    //Run @speed
	run(speed: number) {
		let command = this.axis.index + "/run/" + speed;
		this.execute(command);
	}

    //Move number of steps
	move(dir,steps) {
		let command = this.axis.index + "/move/" + dir + "/" + steps;
		this.execute(command);
	}

    //Go to position
    go(): void {
	    let command = this.axis.index + "/go/" + this.axis.commandedPos;
	    this.execute(command);
	}

    //Start Soft Stop
	startSoftStopClicked(): void {
	    if (this.axis.programmingState == "OFF") {
	        let command = this.axis.index + "/gostartsoftstop";
	        this.execute(command);
	        this.axis.commandedPos = this.axis.startSoftStop;
	    } else if (this.axis.programmingState == "REC") {
	        let command = this.axis.index + "/markstartsoftstop";
	        this.execute(command);
	        //axis.startSoftStop = axis.pos;
	    } else if (this.axis.programmingState == "DEL") {
	        let command = this.axis.index + "/deletestartsoftstop";
	        this.execute(command);
	        this.axis.startSoftStop = 0;
	    }
	}

    //End Soft Stop
	endSoftStopClicked() {
	    if (this.axis.programmingState == "OFF") {
	        let command = this.axis.index + "/goendsoftstop";
	        this.execute(command);
	        this.axis.commandedPos = this.axis.endSoftStop;
	    } else if (this.axis.programmingState == "REC") {
	        let command = this.axis.index + "/markendsoftstop";
	        this.execute(command);
	        this.axis.endSoftStop = this.axis.pos;
	    }
	    else if (this.axis.programmingState == "DEL") {
	        let command = this.axis.index + "/deleteendsoftstop";
	        this.execute(command);
	        this.axis.endSoftStop = 0;
	    }
	}

	//Toggeling of record button
    recordToggle() {
        console.log("toggle recording!")
	    if (this.axis.programmingState == "OFF") {
	        this.axis.programmingState = "REC";
	    }
	    else {
	        this.axis.programmingState = "OFF";
        }
	}

	// Toggleing of delete button
	deleteToggle() {
	    console.log("toggle delete!")
	    if (this.axis.programmingState == "OFF") {
	        this.axis.programmingState = "DEL";
	    }
	    else {
	        this.axis.programmingState = "OFF";
	    }
	}

    

}
