export default class Vibrator {
    constructor(vibratorPin) {
        this.vibratorPin = vibratorPin;
    }

    vibrate(conduction, duration) {
        if (conduction >= 1) {
            this.vibratorPin.high();
            setTimeout(() => {
                this.vibratorPin.low();
            }, duration);
        }
    }
}
