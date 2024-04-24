let cloudClient = CloudClient.create("4b9af5db-a3dc-40f5-ab4f-15daaa246f03");

let runButton;
let info;
let inputs;
let progress;
let simulation;
let input_ScenarioID;
let val_ScenarioID=1; // use default value of 1
let val_DurationMins = 525600; // 1 years in mins

window.onload = () => {
    // connect html elements to JS-variables
    runButton = document.getElementById("run-button");
    text_outputs = document.getElementById("text_outputs");
    text_inputs = document.getElementById("text_inputs");
    progress = document.getElementById( "progress" );
    input_ScenarioID = document.getElementById( "input_ScenarioID" );
};

function runSimulation() {
    runButton.disabled = true;
    cloudClient.getLatestModelVersion( "AAirportSecurityDemo" )
        .then( version => {
            inputs = cloudClient.createDefaultInputs( version );
            inputs.setInput( "Scenario ID", val_ScenarioID); // apply whatever user set
            inputs.setInput( "{STOP_TIME}", val_DurationMins); // How long to run, in mins
            text_inputs.innerHTML = "Input: Scenario ID="+parseInt(input_ScenarioID.value)+" <br>";
            simulation = cloudClient.createSimulation(inputs);
            startPolling();
            text_outputs.innerHTML = "Getting outputs, running simulation if absent...";
            // return simulation.getOutputsAndRunIfAbsent(); // run and wait for results before calling .then(...) below
            return simulation.run(); // run now, do not wait for results, call .then(...) below directly
        })
        .then( simulation => simulation.waitForCompletion() ) // wait for results before querying outputs
        .then( simulation => simulation.getOutputs() )
        .then( outputs => {
            let html = "done running. Outputs: <br>";
            // html += "names: "+outputs.names()+"<br>";
            html += "    Scenario ID = "+outputs.value( "Output scenario ID" ) + "<br>";
            // html += "raw outputs: "+outputs.getRawOutputs()+"<br>";
            text_outputs.innerHTML = html;
        })
        .catch( error => {
            text_outputs.innerHTML = error.status + "<br>" + error.message;
            console.error( error );
        })
        .finally( () => {
            stopPolling();
            runButton.disabled = false;
        });
}

function changeScenarioID() {
    val_ScenarioID = parseInt(input_ScenarioID.value); // store locally here so runSimulation() can pick it up when starting
}

let pollingInterval;

function startPolling() {
    pollingInterval = setInterval(
        () => {
            simulation.getProgress()
                .then( progressinfo => {
                    if( progressinfo ) { //can be undefined in the beginning
                        progress.value = progressinfo.total;
                    }
                });
        },
        1000 // poll every 1000 ms
    );
}

function stopPolling() {
    setTimeout( () => clearInterval( pollingInterval ), 2000 ); // wait 2 sec more to make sure that the final progress value has been received.
}

