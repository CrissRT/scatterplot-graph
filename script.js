
let items;

let height = 500;
let width = 1000;
let padding = 40;

let svg = d3.select("#stat-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("svg-content-responsive", true);


function drawCanvas() {
  svg.attr("width", width)
     .attr("height", height)
    //  Draw Title text 
     .append("text")
     .attr("x", (width / 2.5))
     .attr("y", 30)
     .attr("id", "title")
     .text("Doping in Professional Bicycle Racing");
}

function generateScales() {
  // heightScale = d3.scaleLinear()
  //                 .domain([0, d3.max(items, (d) => d[1])])
  //                 .range([0, height - 2 * padding]);

  // xScale = d3.scaleLinear()
  //            .domain([0, items.length - 1])
  //            .range([padding, width - padding]);                 
                
  const yearArray = items.map((d) => d["Year"]);
  const minutesArray = items.map(d =>parseFloat(d["Time"].replace(":",".")));
  // const dateObjectsArray = yearArray.map(year => new Date(year, 0, 1));

  // console.log("years",dateObjectsArray ,"minutes", minutesArray)

  xAxisScale = d3.scaleLinear()
                  .domain([d3.min(yearArray) - 1, d3.max(yearArray)])
                  .range([padding, width - padding]);
                
  yAxisScale = d3.scaleLinear()
                  .domain([d3.max(minutesArray), d3.min(minutesArray)])
                  .range([height - padding, padding]);                 
}

function generateAxes() {
  let xAxis = d3.axisBottom(xAxisScale);

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr('transform', `translate(0, ${height - padding})`);

  let yAxis = d3.axisLeft(yAxisScale);

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr('transform', `translate(${padding}, 0)`);
}

function generateDots() {
  // let tooltip = d3.select("#stat-container")
  //                 .append("div")
  //                 .attr("id", "tooltip")
  //                 .style("visibility", "hidden")

  svg.selectAll("circle")
     .data(items)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("data-xvalue", item => item["Year"])
     .attr("data-yvalue", item => item["Time"])
     .attr("cx", item => xAxisScale(item["Year"]))
     .attr("cy", item => yAxisScale(parseFloat(item["Time"].replace(":","."))))
     .attr("r", "5")
    //  .on("mouseover", function(event, d) {

    //     // const index = d3.select(this.parentNode).selectAll("rect").nodes().indexOf(this); // Get the index of the current rect
    //     // const datesArray = parseInt(d[0]);
    //     // const textarea = `$${Math.round(d[1])} Billions`
    //     // const stringText = textarea +  " Y" + datesArray;

    //     const item = d3.select(this).datum();
      
    //     tooltip.transition()
    //           .style("visibility", "visible");

      
    //     // tooltip.text(stringText);
      
    //     // document.querySelector("#tooltip").setAttribute("data-date", item[0]);
    //   })   
    //   .on("mouseout", (event, d) => {
    //       tooltip.transition()
    //              .style("visibility", "hidden");
    //   })      
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    items = data;
    console.log(items)
    drawCanvas();
    generateScales();
    generateAxes();
    generateDots();
  })