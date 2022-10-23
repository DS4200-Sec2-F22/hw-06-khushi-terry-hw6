const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450; 
const MARGINS = {left: 60, right: 60, top: 60, bottom: 60};

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
    const MAX_X = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });

    // find max Y
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

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
    let circles = FRAME1.selectAll("points")  
            .data(data) // passed from .then  
            .enter()       
            .append("circle")  
                .attr("cx", (d) => { return (X_SCALE(d.Sepal_Length) );}) 
                .attr("cy", (d) => { return (Y_SCALE(d.Petal_Length));}) 
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
    const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });

    // find max Y
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

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
    FRAME2.selectAll("points")  
            .data(data) // passed from .then  
            .enter()       
            .append("circle")  
                .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) +MARGINS.left);}) 
                .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width)) + MARGINS.bottom;}) 
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
        var bars = FRAME3.selectAll(".bar")
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
