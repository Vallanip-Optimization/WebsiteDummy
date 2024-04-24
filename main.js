let cloudClient = CloudClient.create("e05a6efa-ea5f-4adf-b090-ae0ca7d16c20");

let runButton;
let info;
let inputs;

window.onload = () => {
    runButton = document.getElementById("run-button");
    info = document.getElementById("info");
};

function runSimulation() {
    runButton.disabled = true;
    cloudClient.getLatestModelVersion( "Service System Demo" )
        .then( version => {
            inputs = cloudClient.createDefaultInputs( version );
            inputs.setInput( "Server capacity", 8 );
            let simulation = cloudClient.createSimulation(inputs);
            info.innerHTML = "Getting outputs, running simulation if absent...";
            return simulation.getOutputsAndRunIfAbsent();
        })
        .then( outputs => {
            let html = "For Server Capacity = " + inputs.getInput( "Server capacity" ) + ":<br>";
            html += "Mean queue size = " + outputs.value( "Mean queue size|Mean queue size" ) + "<br>";
            html += "Server utilization = " + outputs.value( "Utilization|Server utilization" ) + "<br>";
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
