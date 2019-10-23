let currentGen = [];
let randomizer;
let allGenerations = [];
let allFrequencyOfR = [];
let allFrequencyOfr = [];
let allGenPhenotypeFrequency = [];


//clean form handling - prevents non 0-9 characters entered
// Select your input element.
let popInput = document.getElementById('populationSize');
let genInput = document.getElementById('NumberOfGenerations');
let domInput = document.getElementById('domChance');
let recInput = document.getElementById('recChance');
let freqRInput = document.getElementById('frequencyOfR');

// Listen for input event on numInput.
popInput.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9)) {
        return false;
    }
}
genInput.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9)) {
        return false;
    }
}
domInput.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 190)) {
        return false;
    }
}
recInput.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 190)) {
        return false;
    }
}
freqRInput.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 190)) {
        return false;
    }
}

//more details table
// Get the modal
let details = document.getElementById('details');
let overview = document.getElementById('chartContainer')


// Get the button that opens the modal
let resultsButton = document.getElementById("resultsButton");
let graphButton = document.getElementById("graphButton");

// When the user clicks on the button, open the modal & change color to indicate active
resultsButton.onclick = function () {
    details.style.display = "block";
    details.style.width = "60%";
    resultsButton.style.backgroundColor = "#A9A9A9";
    graphButton.style.backgroundColor = "#DCDCDC";
    overview.style.display = "none";
}

graphButton.onclick = function () {
    details.style.display = "none";
    graphButton.style.backgroundColor = "#A9A9A9";
    resultsButton.style.backgroundColor = "#DCDCDC"
    overview.style.display = "block";
    overview.style.width = "60%";
}

var btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
    model();
});

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore();
}

function model() {

    //reads population size input and Number of Generations
    let populationSize = document.getElementById("populationSize").value;
    let NumberOfGenerations = document.getElementById("NumberOfGenerations").value;
    let domSurvivalChance = (document.getElementById("domChance").value / 100);
    let recSurvivalChance = (document.getElementById("recChance").value / 100);

    //resets frequency of r to 0.5 for gen0
    let frequencyOfR = document.getElementById("frequencyOfR").value;
    //clears table in case it's already populated
    let myNode = document.getElementById("results");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    let initialFrequencyofR = parseFloat(frequencyOfR, 10);

    let initialPhenotypeFrequency = 1 - Math.pow((1 - initialFrequencyofR), 2);


    for (l = 0; l < NumberOfGenerations; l++) {

        //reset phenotype for each new generation
        let domPhenotypeNumber = 0;
        let subPhenotypeNumber = 0;

        for (i = 0; i < populationSize; i++) {

            //reset the phenotype
            let currentPhenotype = "";
            for (f = 0; f < 2; f++) {
                randomizer = Math.random();
                if (randomizer < frequencyOfR) {
                    currentPhenotype += "R";
                } else {
                    currentPhenotype += "r";
                }

            }

            //check whether phenotype survives
            if (currentPhenotype.includes("R")) {

                let domRandomizer = Math.random();
                if (domRandomizer < domSurvivalChance) {
                    //phenotype survives - add 1 to dominant phenotype count
                    ++domPhenotypeNumber;
                } else {
                    //phenotype dies - not pushed to full gen list
                    continue
                }
            } else {

                let recRandomizer = Math.random();
                if (recRandomizer < recSurvivalChance) {
                    //phenotype survives - add 1 to sub phenotype count
                    ++subPhenotypeNumber;
                } else {
                    //phenotype dies - not pushed to full gen list
                    continue
                }

            }

            //phenotype survives - pushes to the full generation list
            currentGen.push(currentPhenotype);
        }
        stringGen = currentGen.toString();
        allGenerations[l] = "(" + currentGen.join(") (") + ")";
        frequencyOfR = frequency(stringGen);
        //rounding to nearest 1/100th place
        frequencyOfR = Math.round(frequencyOfR * 100) / 100;
        //frequency of r will be the inverse
        let frequencyOfr = (1 - frequencyOfR);
        frequencyOfr = Math.round(frequencyOfr * 100) / 100;

        //phenotype frequency chart setup
        let allPhenotypeCount = domPhenotypeNumber + subPhenotypeNumber;
        let domPhenotypeFrequency = domPhenotypeNumber / allPhenotypeCount;
        domPhenotypeFrequency = Math.round(domPhenotypeFrequency * 100) / 100;
        allGenPhenotypeFrequency[l] = domPhenotypeFrequency;

        allFrequencyOfR[l] = frequencyOfR;
        allFrequencyOfr[l] = frequencyOfr;

        //reset current generation at the end before moving onto next gen
        currentGen = [];
    }


    function frequency(allele) {
        let frequencyR = 0;
        allele = allele.replace(/,/g, "");


        for (i = 0; i < allele.length; i++) {
            if (allele.charAt(i) == "R") {
                ++frequencyR;
            }
        }

        return frequencyR / allele.length;
    }

    const container = document.querySelector('#results');

    //creates master graphs at the top of the screen
    function masterForm() {

        let dataPoints1 = [];
        let dataPoints2 = [];

        let chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: ""
            },
            axisY: {
                title: "Frequency",
                maximum: 1,
                minimum: 0,
            },
            axisX: {
                title: "Generations",
                interval: 1,
                minimum: 0,
            },
            data: [
                {
                    type: "line",
                    name: "Dominant Phenotype Frequency",
                    showInLegend: true,
                    dataPoints: dataPoints1,
                    color: "#03DAC6"
                },
                {
                    type: "line",
                    name: "Frequency of R Allele",
                    showInLegend: true,
                    dataPoints: dataPoints2,
                    color: "#6200EE"
                }
            ]
        });

        //populate arrays for graph - includes initial values
        for (let i = -1; i < allGenPhenotypeFrequency.length; i++) {
            if (i == -1) {
                dataPoints1.push({y: initialPhenotypeFrequency});
            } else {
                dataPoints1.push({y: allGenPhenotypeFrequency[i]});
            }
        }

        for (let i = -1; i < allFrequencyOfR.length; i++) {
            if (i == -1) {
                dataPoints2.push({y: initialFrequencyofR});
            } else {
                dataPoints2.push({y: allFrequencyOfR[i]});
            }

        }
        chart.render()
    }

//need to convert into object that reads label: "as;ldkj", y: 00
    masterForm();

//More details
//makes details button appear
    let graphButton = document.getElementById("graphButton");
    let resultsButton = document.getElementById("resultsButton");
    resultsButton.style.visibility = "visible";
    graphButton.style.visibility = "visible";
    //creates a new row for each generation
    for (i = 0; i < NumberOfGenerations; i++) {
        //new header
        let header = document.createElement('div');
        header.id = results[i];
        header.className = "header";
        header.textContent = "Generation " + (i + 1);
        //new bar for current generation
        let allGen = document.createElement('div');
        allGen.id = results[i];
        allGen.className = "results";
        allGen.textContent = allGenerations[i];
        //new line for frequency of R
        let newFreqR = document.createElement('div');
        newFreqR.id = results[i];
        newFreqR.className = "results";
        newFreqR.textContent = "Frequency of R Allele:  " + allFrequencyOfR[i];
        //new line for phenotype frequency
        let newPhenotypeFreq = document.createElement('div');
        newPhenotypeFreq.id = results[i];
        newPhenotypeFreq.className = "results";
        newPhenotypeFreq.textContent = "Dominant Phenotype Frequency:  " + allGenPhenotypeFrequency[i];


        //setup frequency of allele table
        let newChart = document.createElement('div');
        newChart.className = "chart";
        let newCanvas = document.createElement('canvas');

        //frequency of allele table formatting goes here
        let windowWidth = (0.8 * document.documentElement.clientWidth - 18);
        //newCanvas.style.border = '1px solid black';
        newCanvas.style.backgroundColor = '#DCDCDC';
        newCanvas.className = "canvas";
        newCanvas.height = 40;
        newCanvas.width = windowWidth;
        newCanvas.maxWidth = "-webkit-fill-available";

        let ctx = newCanvas.getContext("2d");

        // Create gradient
        let grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "#6200EE");

        // Fill with gradient
        let fillAmount = ((allFrequencyOfR[i]) * newCanvas.width);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, fillAmount, 40);


        //all members of generation section formatting goes here
        allGen.style.backgroundColor = "white";
        allGen.style.border = '1px solid black';
        allGen.style.maxWidth = windowWidth + 'px';
        //allGen.style.marginTop = "30px";
        //allGen.style.marginBottom = "5px";


        //setup frequency of phenotype table
        let newChart2 = document.createElement('div');
        newChart2.className = "chart";
        let newCanvas2 = document.createElement('canvas');

        //frequency of phenotype table formatting goes here
        let windowWidth2 = (0.8 * document.documentElement.clientWidth - 18);
        //newCanvas2.style.border = '1px solid black';
        newCanvas2.style.backgroundColor = '#DCDCDC';
        newCanvas2.className = "canvas";
        newCanvas2.height = 40;
        newCanvas2.width = windowWidth;

        let ctx2 = newCanvas2.getContext("2d");

        // Create gradient for phenotype table
        let grd2 = ctx2.createLinearGradient(0, 0, 200, 0);
        grd2.addColorStop(0, "#03DAC6");

        // Fill with gradient
        let fillAmount2 = ((allGenPhenotypeFrequency[i]) * newCanvas2.width);
        ctx2.fillStyle = grd2;
        ctx2.fillRect(0, 0, fillAmount2, 40);


        container.appendChild(header);
        container.appendChild(allGen);
        container.appendChild(newFreqR);
        container.appendChild(newChart);
        newChart.appendChild(newCanvas);
        container.appendChild(newPhenotypeFreq);
        container.appendChild(newChart2);
        newChart2.appendChild(newCanvas2);

        if (allGenerations[i] == "()"){
            //extinct tag
            let extinct = document.createElement('div');
            extinct.id = "extinct";
            extinct.className = "header";
            extinct.textContent = "Extinct!";
            container.appendChild(extinct);
            break
        }

    }
}
