let cloudClient = CloudClient.create("4b9af5db-a3dc-40f5-ab4f-15daaa246f03"); // default: e05a6efa-ea5f-4adf-b090-ae0ca7d16c20

let runButton;
let info;
let inputs;
let progress;
let simulation;

window.onload = () => {
    runButton = document.getElementById("run-button");
    text_outputs = document.getElementById("text_outputs");
    text_inputs = document.getElementById("text_inputs");
    progress = document.getElementById( "progress" );
};

function runSimulation() {
    runButton.disabled = true;
    cloudClient.getLatestModelVersion( "AAirportSecurityDemo" )
        .then( version => {
            inputs = cloudClient.createDefaultInputs( version );
            inputs.setInput( "Scenario ID", 123 );
            inputs.setInput( "{STOP_TIME}", 5256000 ); // 10 years in mins
            text_inputs.innerHTML = "setting inputs: Scenario ID=123 <br>";
            simulation = cloudClient.createSimulation(inputs);
            startPolling();
            text_outputs.innerHTML = "Getting outputs, running simulation if absent...";
            // return simulation.getOutputsAndRunIfAbsent();
            return simulation.run(); // run now, do not wait for results
        })
        .then( simulation => simulation.waitForCompletion() ) // wait for results before querying outputs
        .then( simulation => simulation.getOutputs() )
        .then( outputs => {
            let html = "done running. Output names: <br>";
            html += "names: "+outputs.names()+"<br>";
            html += "Output scenario ID = "+outputs.value( "Output scenario ID" ) + "<br>";
            html += "raw outputs: "+outputs.getRawOutputs()+"<br>";
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

