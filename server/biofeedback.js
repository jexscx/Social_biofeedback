import * as five from "johnny-five";
import { Subject } from "rxjs";
import Vibrator from "./vibrator";
import DataGenerator from "./data-generator";
import StressDetector from './stress-detector';
import ArduinoResult from './arduino-results';

export default class BioFeedback {
    constructor() {
        this.board;
        this.isBoardReady = false;
    }

    init() {
        const result = new Subject();
        this.board = new five.Board();
        this.board.on("ready", () => {
            this.button = new five.Button({
                pin: 11,
                invert: true
            });

            const rgbLed = new five.Led.RGB({
                pins: {
                    red: 3,
                    green: 5,
                    blue: 6
                }
            });
            const vibratorPin = new five.Pin(9);

            const vibrator = new Vibrator(vibratorPin);
            const stressDetector = new StressDetector();
            const dataGenerator = new DataGenerator();

            this.button.on("down", () => {
                const conduction = dataGenerator.generateConduction();
                let heartrate = dataGenerator.generateHeartbeat();
                let heartrateStress = 0;

                const stress = stressDetector.detectStress(conduction, heartrate);

                rgbLed.on();
                if (stress <= 0) {
                    rgbLed.color("#15ff00");
                } else if (stress <= 1) {
                    rgbLed.color("#ff6f00");

                    const duration = 250;

                    this.setIntervalX(() => {
                        vibrator.vibrate(conduction, duration);
                    }, 1000, 1);

                    vibrator.vibrate(conduction, duration);
                } else {
                    rgbLed.color("#FF0000");

                    heartrateStress = Math.floor((Math.random() * 39) + 1);
                    heartrate = heartrate + heartrateStress;

                    const duration = 1500;
                    vibrator.vibrate(conduction, duration);
                }

                console.log("Heartrate = " + heartrate);
                console.log("Conduction = " + conduction);
                console.log("Stress = " + heartrateStress);

                result.next(new ArduinoResult(heartrate, conduction, heartrateStress));
            });

        });

        return result.asObservable();
    }

    setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = setInterval(function () {

            callback();

            if (++x === repetitions) {
                clearInterval(intervalID);
            }
        }, delay);
    }
}
