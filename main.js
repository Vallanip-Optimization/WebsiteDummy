let cloudClient = CloudClient.create("4b9af5db-a3dc-40f5-ab4f-15daaa246f03"); // default: e05a6efa-ea5f-4adf-b090-ae0ca7d16c20

let runButton;
let info;
let inputs;

window.onload = () => {
    runButton = document.getElementById("run-button");
    info = document.getElementById("info");
};

function runSimulation() {
    runButton.disabled = true;
    cloudClient.getLatestModelVersion( "AAirportSecurityDemo" )
        .then( version => {
            inputs = cloudClient.createDefaultInputs( version );
            // inputs.setInput( "Server capacity", 8 );
            let simulation = cloudClient.createSimulation(inputs);
            info.innerHTML = "Getting outputs, running simulation if absent...";
            return simulation.getOutputsAndRunIfAbsent();
        })
        .then( outputs => {
            let html = "done running. Output names: <br>";
            // html += "names: "+outputs.names()+"<br>";
            // html += "raw outputs: "+outputs.getRawOutputs()+"<br>";
            html += "Output scenario ID = "+outputs.value( "output_ScenarioID" ) + "<br>";
            // let html = "For default input = " + inputs.getInput( "Server capacity" ) + ":<br>";
            // html += "Mean queue size = " + outputs.value( "Mean queue size|Mean queue size" ) + "<br>";
            // html += "Server utilization = " + outputs.value( "Utilization|Server utilization" ) + "<br>";
            info.innerHTML = html;
        })
        .catch( error => {
            info.innerHTML = error.status + "<br>" + error.message;
            console.error( error );
        })
        .finally( () => {
            runButton.disabled = false;
        });
}
