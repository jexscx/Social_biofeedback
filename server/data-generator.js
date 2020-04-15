export default class DataGenerator {
    generateHeartbeat() {
        return Math.floor((Math.random() * (110 - 65 + 1)) + 65);
    }
    generateConduction() {
        return Math.floor((Math.random() * (3 - -3 + 1)) + -3);
    }
    
}