// show_temperature = function(rawdata, id, tag){
//     console.log("data: ", rawdata);

//     if(tag == "max")
//         data = rawdata.max_temp;
//     else if(tag == "min")
//         data = rawdata.min_temp;

//     else
//         console.log("Error!");
    
//     var month = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];
//     var year = [];
//     data.forEach(thisyear => {
//         year.push(thisyear[0].year);
//     });

//     //deal with data
//     var processedData = [];
//     data.forEach(element => {
//         var thisyear = element[0].year;
//         var count = 0;
//         element[0].month.forEach(tempature => {
//             tuple = [thisyear, month[count], tempature];
//             processedData.push(tuple);
//             count++;
//         });
//     });
//     // console.log("processedData: ", processedData);

//     d3.select(id).append('div').append('svg')
//         .attr("width", $('#wg1').width())
//         .attr("height", $(id).height() / 4.5);
//     var aspectRatio = 1 / 1;
//     var width = $(id).width();
//     var height = width / aspectRatio;
//     var margin = width * 0.01;
//     const svg = d3.select(id).append('div').append('svg')
//         .attr("viewBox", [0, 0, width, height])
//         .attr("style", "margin: 2%;");

//     // x axis
//     var x = d3.scaleBand().range([0, width/2]);
//     var xScale = x.domain(year);
//     var xAxis = svg.append('g')
//                     .attr('class', 'xAxis')
//                     .attr('transform', `translate(${margin*10},${margin*5})`)
//                     .call(d3.axisTop(xScale));

//     // y axis
//     var y = d3.scaleBand().range([0, width / 2]);
//     var yScale = y.domain(month);
//     var yAxis = svg.append('g')
//         .attr('class', 'yAxis')
//         .attr('transform', `translate(${margin*10},${margin*5})`)
//         .call(d3.axisLeft(yScale));
    
//     // map
//     var gridSize = Math.floor(width / 2.7 / year.length);
//     var legendElementWidth = gridSize * 2;

//     // find max & min tempatures
//     var maxTemperature = Number.NEGATIVE_INFINITY;
//     var minTemperature = Number.POSITIVE_INFINITY;
//     data.forEach(element => {
//         if (d3.max(element[0].month) > maxTemperature) {
//             maxTemperature = d3.max(element[0].month);
//         }
//         if (d3.min(element[0].month) < minTemperature) {
//             minTemperature = d3.min(element[0].month);
//         }
//     });
//     // console.log("maxTemperature: ", maxTemperature);
//     // console.log("minTemperature: ", minTemperature);

//     //draw map
//     var bucket = 7;
//     var colors = ["#ffffbc", "#ffe185", "#ffaf59", "#f66c3b", "#d83c4c", "#a00041"];
//     var colorScale = d3.scaleQuantile()
//         .domain([minTemperature, maxTemperature])
//         .range(colors);
//     // Define the div for the tooltip
//     var div = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);
//     var formatTime = d3.timeFormat("%Y-%m");
//     var cells = svg.selectAll('rect')
//         .data(processedData)
//         .enter().append('g').append('rect')
//         // .attr('class', 'cell')
//         .attr('width', gridSize)
//         .attr('height', gridSize)
//         .attr('y', function (d) { return yScale(d[1]); })
//         .attr('x', function (d) { return xScale(d[0]); })
//         .attr('fill', function (d) { return colorScale(d[2]); })
//         .attr('transform', `translate(${margin * 10 + gridSize / 3.5},${margin * 5 + gridSize / 3.5})`)
//         .on("mouseover", function (d, i) {
//             div.transition()
//                 .duration(200)
//                 .style("opacity", .9);
//             if ((i + 1) % 12 != 0) {
//                 var date = new Date(d[0] + "/" + ((i + 1) % 12));
//             }
//             else{
//                 var date = new Date(d[0] + "/12");
//             }   
//             div.html("Date: " + formatTime(date) + "; " + tag + ": " + d[2].toFixed(2))
//                 .style("left", (d3.event.pageX) + "px")
//                 .style("top", (d3.event.pageY - 28) + "px");
//         })
//         .on("mouseout", function (d) {
//             div.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });

//     //draw legend
//     var legend = svg.append("g")
//         // .attr("class", "legendQuant")
//         .attr("transform", `translate(${margin * 12 + gridSize / 3 + width / 2}, ${margin * 7})`);
//     legend.append("text")
//         .text(minTemperature.toFixed(2) + " Celsius")
//         .attr("transform", `translate(0, -5)`);
//     legend.selectAll('rect')
//         .data(colors)
//         .enter()
//         .append('rect')
//         // .attr('class', 'cell')
//         .attr('width', legendElementWidth/2)
//         .attr('height', legendElementWidth/4)
//         .attr('fill', function (d, i) { return colors[i]; })
//         .attr("transform", function (d, i) {
//             return "translate(0," + i * gridSize / 2 + ")";});
//     legend.append("text")
//         .text(maxTemperature.toFixed(2) + " Celsius")
//         .attr("transform", `translate(0, ${7 * gridSize / 2})`);
// }