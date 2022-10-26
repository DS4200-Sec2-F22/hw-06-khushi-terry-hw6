const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450; 
const MARGINS = {left: 60, right: 60, top: 60, bottom: 60};
let bar_chart;
let xCoord1 ='Sepal_Length';
let yCoord1 = 'Petal_Length';
let xCoord2 = "Sepal_Width";
let yCoord2 = 'Petal_Width';

// vis dimensions
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame")
                    .append('g')
		.attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");                     

const FRAME3 = d3.select("#vis3")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");      


// Open scatter-data and pass data into function
d3.csv("data/iris.csv").then((data) => { 

// building plot for Sepal_Length vs Petal_Length
    console.log(data);
    // find max X
    const MAX_X = d3.max(data, (d) => { return parseInt(d[xCoord1]); });

    // find max Y
    const MAX_Y = d3.max(data, (d) => { return parseInt(d[yCoord1]); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_X+3)]) // add some padding  
            .range([0, VIS_WIDTH]); 

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const Y_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_Y+1)]) // add some padding  
            .range([VIS_HEIGHT,0]); 

    
    // Use X_SCALE to plot our points
    let first_scatter = FRAME1.selectAll("points")  
            .data(data) // passed from .then  
            .enter()       
            .append("circle")  
                .attr("cx", (d) => { return (X_SCALE(d[xCoord1]) );}) 
                .attr("cy", (d) => { return (Y_SCALE(d[yCoord1]));}) 
                .attr("r", 5)
                .attr("class", (d) =>{ return d.Species; });

    FRAME1.append("g") 
    .attr("transform", "translate("  + 0+ 
        "," + (VIS_HEIGHT) + ")") 
    .call(d3.axisBottom(X_SCALE).ticks(12)) 
    .attr("font-size", '10px'); 

    // Add an y-axis to the vis  
    FRAME1.append('g')  // g is a general SVG
    .attr('transform', "translate(" + 0+
        "," + (MARGINS.bottom-MARGINS.bottom) +")") 
    .call(d3.axisLeft(Y_SCALE))
            .attr('font-size', '10px');

// building plot for Sepal_Width vs Petal_Width

    // find max X
    const MAX_X2 = d3.max(data, (d) => { return parseInt(d[xCoord2]); });

    // find max Y
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d[yCoord2]); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE2 = d3.scaleLinear() 
            .domain([0, (MAX_X2+1)]) // add some padding  
            .range([0, VIS_WIDTH]); 

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const Y_SCALE2 = d3.scaleLinear() 
            .domain([0, (MAX_Y2+1)]) // add some padding  
            .range([VIS_HEIGHT,0]); 

    
    // Use X_SCALE to plot our points
    let second_scatter = FRAME2.selectAll("points")  
            .data(data) // passed from .then  
            .enter()       
            .append("circle")  
                .attr("cx", (d) => { return (X_SCALE2(d[xCoord2]) +MARGINS.left);}) 
                .attr("cy", (d) => { return (Y_SCALE2(d[yCoord2])) + MARGINS.top;}) 
                .attr("r", 5)
                .attr("class", (d) =>{ return d.Species; });

    FRAME2.append("g") 
    .attr("transform", "translate("  + (MARGINS.left)+ 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE2).ticks(12)) 
    .attr("font-size", '10px'); 

    // Add an y-axis to the vis  
    FRAME2.append('g')  // g is a general SVG
    .attr('transform', "translate(" + (MARGINS.left)+
        "," + (MARGINS.bottom) +")") 
    .call(d3.axisLeft(Y_SCALE2))
            .attr('font-size', '10px');

    
// initialize brush and event handler
    const brush = d3.brush()
                        .extent([[MARGINS.left,MARGINS.top], [FRAME_WIDTH,(FRAME_HEIGHT - MARGINS.bottom)]])
                        .on("brush", brush_charts);
    FRAME2.call(brush);

    //implement brushing funcitonality
    function brush_charts(e) {

        // set to track highlighting in bar chart
        let selected = new Set();

        second_scatter.classed('brush', (d) => {
        let brushed = isBrushed(e.selection, (MARGINS.left + X_SCALE2(d[xCoord2])), (MARGINS.top + Y_SCALE2(d[yCoord2])));

        // if points in the second scatter are brushed, add to selected to reflect in bar chart
        if (brushed) {
                selected.add(d.Species);
        }
        return brushed});

        // highlights left plot
        first_scatter.classed("brush", (d) => isBrushed(e.selection, (MARGINS.left + X_SCALE2(d[xCoord2])), (MARGINS.top + Y_SCALE2(d[yCoord2]))));

        // highlights bars if the corresponding points are selected
        bar_chart.classed("brush", (d) => {
                return selected.has(d.species);})

        };
// };

    // function to determine points within brushed region
    function isBrushed(brush_coords, cx, cy) {
        if(brush_coords == null) 
                return;
        const x0 = brush_coords[0][0];
        const x1 = brush_coords[1][0];
        const y0 = brush_coords[0][1];
        const y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    
    };

});

// Open bar-data and pass data into function
d3.csv("data/species.csv").then((data) => { 

        // find max Y
        const MAX_Y = d3.max(data, (d) => { return parseInt(d.count); });
    
        // Define categorical scale function for x-axis that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE = d3.scaleBand()
                .domain(data.map(d => d.species))
                .range([0, VIS_WIDTH]);
    
        // Define scale function for y-axis that maps our data values 
        // (domain) to pixel values (range)
        const Y_SCALE = d3.scaleLinear() 
                .domain([0, (MAX_Y)+20]) // add some padding  
                .range([VIS_HEIGHT,0]); 
    
    
        // plot bars using x and y scale
        bar_chart = FRAME3.selectAll(".bar")
             .data(data)
             .enter()
             .append("rect")
                .attr("class", (d) =>{ return d.species; })
                .attr("x", (d) => { return X_SCALE(d.species) + 1.35*MARGINS.left; })
                .attr("y", (d) => { return Y_SCALE(d.count) + MARGINS.top;})
                .attr("width", VIS_WIDTH/data.length - 40)
                .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.count); });

        // Add an x-axis to the vis  
        FRAME3.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE)) 
        .attr("font-size", '10px'); 

        // Add an y-axis to the vis  
        FRAME3.append('g')
        .attr('transform', "translate(" + MARGINS.left +
                "," + (MARGINS.bottom) +")") 
        .call(d3.axisLeft(Y_SCALE).ticks(5))
                .attr('font-size', '10px'); 
        });
