let cloudClient = CloudClient.create("4b9af5db-a3dc-40f5-ab4f-15daaa246f03"); // default: e05a6efa-ea5f-4adf-b090-ae0ca7d16c20

let runButton;
let info;
let inputs;

window.onload = () => {
    runButton = document.getElementById("run-button");
    text_outputs = document.getElementById("text_outputs");
    text_inputs = document.getElementById("text_inputs");
};

function runSimulation() {
    runButton.disabled = true;
    cloudClient.getLatestModelVersion( "AAirportSecurityDemo" )
        .then( version => {
            inputs = cloudClient.createDefaultInputs( version );
            inputs.setInput( "Scenario ID", 123 );
            text_inputs.innerHTML = "setting inputs: Scenario ID=123 <br>";
            let simulation = cloudClient.createSimulation(inputs);
            text_outputs.innerHTML = "Getting outputs, running simulation if absent...";
            return simulation.getOutputsAndRunIfAbsent();
        })
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
            runButton.disabled = false;
        });
}
