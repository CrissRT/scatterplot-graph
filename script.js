
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
  // X Axis constants
  const minYear = d3.min(items, item => item["Year"]) - 1;//yearValues
  const maxYear = d3.max(items, item => item["Year"]) + 1;//yearValues
  
  // Y Axis Constants
  const minMinuteSecond = d3.min(items, item => new Date(item["Seconds"] * 1000));
  const maxMinuteSecond = d3.max(items, item => new Date(item["Seconds"] * 1000));

  xAxisScale = d3.scaleLinear()
                  .domain([minYear, maxYear])
                  .range([padding, width - padding]);
                
  yAxisScale = d3.scaleTime()
                  .domain([maxMinuteSecond, minMinuteSecond])
                  .range([height - padding, padding]); 
                  
}

function generateAxes() {
  const customTimeFormat = d3.timeFormat("%M:%S");;
  
  let yAxis = d3.axisLeft(yAxisScale).tickFormat(customTimeFormat);
  let xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr('transform', `translate(0, ${height - padding})`);

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr('transform', `translate(${padding}, 0)`);
}

function generateDots() {
  let tooltip = d3.select("#stat-container")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("visibility", "hidden")

  svg.selectAll("circle")
     .data(items)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("data-xvalue", item => item["Year"])
     .attr("data-yvalue", item => new Date(item["Seconds"] * 1000))
     .attr("cx", item => xAxisScale(item["Year"]))
     .attr("cy", item => yAxisScale(new Date(item["Seconds"] * 1000)))
     .attr("r", "5")
     .attr("fill", item => {
        if(item["Doping"] === "")
          return "red";
        else 
          return "blue";
     })
     .on("mouseover", function(event, data) {
        console.log(event, data)      
        tooltip.style("left", (event.clientX - 80) + "px").style("top", (event.pageY - 100) + "px");
        tooltip.transition().style("visibility", "visible");

        let tooltipContent = `${data["Name"]}: ${data["Nationality"]}<br>
                              Year: ${data["Year"]}, Time: ${data["Time"]}`;

        if(data["Doping"] !== "")
          tooltipContent += `<br><br>${data["Doping"]}`;

        tooltip.html(tooltipContent)
      
        document.querySelector("#tooltip").setAttribute("data-year", data["Year"]);
      })   
      .on("mouseout", (event, d) => {
          tooltip.transition().style("visibility", "hidden");
      })      
}

function generateLegend() {
  const legendData = ['No doping allegations', 'Riders with doping allegations'];
  const colorScale = d3.scaleOrdinal().range(['red', 'blue']);

  const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - 250}, ${height / 2.5})`);

  const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  legendItems.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => colorScale(d));

  legendItems.append('text')
      .attr('x', 15)
      .attr('y', 8)
      .text(d => d);
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    items = data;
    // console.log(items)
    drawCanvas();
    generateScales();
    generateAxes();
    generateDots();
    generateLegend();
  })