# BioFeedback Application

In deze repo staat ons project over Biofeedback.
Er zijn verschillende functies die onderverdeeld zijn in folders

Notable functions
- Notes
- Screen recording
- Arduino functions

Alle code is onderverdeeld bij de bijpassende mapjes.

## Installation

De code is onderverdeeld in verschillende classes waardoor alle functies makkelijk en overzichtelijk te vinden zijn.
Gebruik de package manager [BioPeeps](https://git.fhict.nl/I409919/biopeeps) om het te installeren.

```bash
Biopeeps install esm module
```

## Usage 

```python
import biopeeps

import Vibrator from "./vibrator";
import DataGenerator from "./data-generator";
import StressDetector from './stress-detector';
import ArduinoResult from './arduino-result';

```
Verander bovenaan in "script.js" de tokens voor zowel de client als de therapist. Deze zijn te generern op de website van Vidyo.io. 


## Contributing
Er mag gepulled worden. Voor grotere updates, graag eerst contact opnemen met de maintainer.

A.u.b. ook de tests updaten waar nodig is.