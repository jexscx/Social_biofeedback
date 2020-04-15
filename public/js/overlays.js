/* Biosignals uitklapscherm
*/
window.addEventListener('DOMContentLoaded', () => {
    function SignalsButton() {

        const coll = document.getElementById("SignalsButton");
        let i;

        console.log(coll);

        coll.addEventListener("click", function () {
            $('.transform').toggleClass('signals-active');
        })
    }
    SignalsButton();


    /* Biosignals uitklapscherm
    */
    function NotesButton() {

        const coll = document.getElementById("NotesButton");
        let i;

        console.log(coll);

        coll.addEventListener("click", function () {
            $('.notes-transform').toggleClass('notes-active');
        })
    }
    NotesButton();



// Note functionality-------------------------------------------------------------------------------------------------------------------------------------
// Variables
    var heartBeat;
    var session = 1;
    var skinConductance = ['laag', 'gemiddeld', 'hoog'];


// Note class
    class Note {
        constructor(session, patient, subjective, objective, biosignals, assessment, plan) {
            this.session = session;
            this.patient = patient;
            this.subjective = subjective;
            this.objective = objective;
            this.biosignals = biosignals;
            this.assessment = assessment;
            this.plan = plan;
        }
    }

// UI class to display, delete, add to the interface
    class UI {

        static updateBiosignals() {
            const heartbeatLive = document.querySelector('#heartbeat-live');
            const skinconductanceLive = document.querySelector('#skinconductance-live');
            heartbeatLive.innerHTML = heartBeat;
            skinconductanceLive.innerHTML = getSkinConductance();

            setInterval(() => {
                if (Math.floor(Math.random() * 2) == 0) {
                    heartBeat = heartBeat + Math.floor(Math.random() * 4);
                }
                else{
                    heartBeat = heartBeat - Math.floor(Math.random() * 4);
                }
                heartbeatLive.innerHTML = heartBeat;
            }, 2000);

            setInterval(() => {
                skinconductanceLive.innerHTML = getSkinConductance();
            }, 10000);


        }
        static changeColors() {
            const heartbeatLabel = document.querySelector('#heartbeat');
            const skinconductanceLabel = document.querySelector('#skinconductance');
            heartbeatLabel.innerHTML = getHeartBeat();
            skinconductanceLabel.innerHTML = getSkinConductance();
            console.log(getSkinConductance());
            // Changes color of label depending on status
            switch (skinconductanceLabel.innerHTML) {
                case 'laag':
                    skinconductanceLabel.style.color = 'green';
                    break;
                case 'gemiddeld':
                    skinconductanceLabel.style.color = 'orange';
                    break;
                case 'hoog':
                    skinconductanceLabel.style.color = 'red';
                    break;

                default:
                    break;
            }

            if (heartbeatLabel.innerHTML >= 60 && heartbeatLabel.innerHTML < 70)
            {
                heartbeatLabel.style.color = 'green' ;
            }

            else{
                heartbeatLabel.style.color = 'red';
            }
        }

        static updateUI() {

            const notes = Store.getNotes();
            notes.forEach((note) => UI.addNoteToList(note));
            UI.changeColors();
            // UI.updateBiosignals();


        }

        static addNoteToList(note) {
            const list = document.querySelector('#note-list');
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${note.session}</td>
        <td>${note.patient}</td>
        <td>${note.subjective}</td>
        <td>${note.objective}</td>
        <td>${note.biosignals}</td>
        <td>${note.assessment}</td>
        <td>${note.plan}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

            list.appendChild(row);
        }

        static deleteNote(el) {
            if (el.classList.contains('delete')) {
                el.parentElement.parentElement.remove();
            }
        }

        static showAlert(message, color) {
            const alert = document.querySelector('#alert');
            alert.style.color = color;
            alert.innerHTML = message;

            // Dissapear in 5 seconds
            setTimeout(() => alert.innerHTML = '', 5000);
        }

        static clearFields() {
            document.querySelector('#patient').value = '';
            document.querySelector('#subjective').value = '';
            document.querySelector('#objective').value = '';
            document.querySelector('#assessment').value = '';
            document.querySelector('#plan').value = '';
        }
    }

// Store Class: Handles Storage
    class Store {
        static getNotes() {
            let notes;
            if (localStorage.getItem('notes') === null) {
                notes = [];
            } else {
                notes = JSON.parse(localStorage.getItem('notes'));
            }

            return notes;
        }

        static addNote(note) {
            const notes = Store.getNotes();
            notes.push(note);
            localStorage.setItem('notes', JSON.stringify(notes));
        }

        static removeNote(patient) {
            const notes = Store.getNotes();

            notes.forEach((note, index) => {
                if (note.patient === patient) {
                    notes.splice(index, 1);
                }
            });

            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }

// Event: Display notes
    document.addEventListener('DOMContentLoaded', UI.updateUI());

// Event: Add a note
    document.querySelector('#note-form').addEventListener('submit', (e) => {
        // Prevent actual submit
        e.preventDefault();

        // Get form values
        const patient = document.querySelector('#patient').value;
        const subjective = document.querySelector('#subjective').value;
        const objective = document.querySelector('#objective').value;
        const assessment = document.querySelector('#assessment').value;
        const biosignals = 'HB: ' + document.querySelector('#heartbeat').innerHTML + 'bpm & SC: ' + document.querySelector('#skinconductance').innerHTML;
        const plan = document.querySelector('#plan').value;

        // Validate
        if (patient === '' || subjective === '' || objective === '' || assessment === '' || plan === '') {
            UI.showAlert('Please fill in all fields!', 'red');
        } else {
            // Instatiate note
            const note = new Note(session, patient, subjective, objective, biosignals, assessment, plan);

            // Add note to UI
            session++;
            UI.addNoteToList(note);

            // Add note to storage
            Store.addNote(note);

            // Show success message
            UI.showAlert('Note added!', 'green');

            // Clear fields
            UI.clearFields();
        }


    });

// Event: Remove a Book
    document.querySelector('#note-list').addEventListener('click', (e) => {
        // Remove book from UI
        UI.deleteNote(e.target);

        // Remove note from storage
        Store.removeNote(e.target.parentElement.previousElementSibling.textContent);

        // Show success message
        UI.showAlert('Note Removed', 'success');
    });

    textarea = document.querySelector('.autoresizing');
    textarea.addEventListener('input', autoResize, false);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

// Return random heartbeat
    function getHeartBeat() {
        heartBeat = Math.floor(Math.random() * 40) + 60;
        return heartBeat;
    }

// Return random skinconductance level
    function getSkinConductance() {
        random = Math.floor(Math.random() * 3);
        console.log(random);
        return skinConductance[random];
    }

// View table
    document.querySelector('#view-btn').addEventListener('click', function changeBtn() {
        if (document.querySelector('#view-btn').innerHTML === 'View sessions'){
            document.querySelector('.table-container').style.display = 'block';
            document.querySelector('#view-btn').innerHTML = 'Hide sessions'; }

        else{
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('#view-btn').innerHTML = 'View sessions';
        }
    })
});
