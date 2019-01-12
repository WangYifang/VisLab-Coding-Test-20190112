if(!d3.chart) d3.chart = {};

d3.chart.scatter = function() {
  var g;
  var data;
  var width = 400;
  var height = 400;
  var cx = 10; //margin
  var dispatch = d3.dispatch(chart, "hover");

  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    g.append("g")
    .classed("yaxis", true)

    update();
  }
  chart.update = update;
    
  function update() {
      
    //x axis
      var maxCreated = d3.max(data, function(d) { return d.created });
      var minCreated = d3.min(data, function(d) { return d.created });
      
      var createdScale = d3.time.scale()
      .domain([minCreated, maxCreated])
      .range([cx, width])

      var xAxis = d3.svg.axis()
      .scale(createdScale)
      .ticks(3)
      .tickFormat(d3.time.format("%x %H:%M"))
      
      var xg = g.select(".xaxis")
      .classed("axis", true)
      .attr("transform", "translate(" + [0,height] + ")")
      .transition()
      .call(xAxis)


      //y axis
      var maxScore = d3.max(data, function(d) { return d.score })

      var yScale = d3.scale.linear()
      .domain([0, maxScore])
      .range([height, cx])
      
      var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(3)
      .orient("left")

      var yg = g.select(".yaxis")
      .classed("axis", true)
      .classed("yaxis", true)
      .attr("transform", "translate(" + [cx - 5,0] + ")")
      .transition()
      .call(yAxis)

      //size
      var commentScale = d3.scale.linear()
      .domain(d3.extent(data, function(d) { return d.num_comments }))
      .range([3, 15])

      
    var circles = g.selectAll("circle")
    .data(data.sort(function(a, b) { return b.num_comments - a.num_comments; }), function(d) { return d.id })

    circles.enter()
    .append("circle")

    circles
    .transition()
    .attr({
          cx: function(d,i) { return createdScale(d.created) },
          cy: function(d,i) { return yScale(d.score) },
          r: function(d) { return commentScale(d.num_comments)},
          title: function(d) { return "Number of comments for " + d.id + ": " + d.num_comments}
    })
      .style("fill", function(d) {  return d.color })
      .style("opacity", 0.75)

    circles.exit().remove()

    circles.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      dispatch.hover([d])
    })
    circles.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.hover([])
    })

  }

  //highlights elements being hovered elsewhere
    chart.highlight = function(data) {
    var circles = g.selectAll("circle")
    .style("stroke", "")
    .style("stroke-width", "")

        circles.data(data, function(d) { return d.id })
    .style("stroke", "black")
    .style("stroke-width", 3)
  }

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
    
  //combination getter and setter for the width attribute of the global chart variable
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
    
  //combination getter and setter for the height attribute of the global chart variable
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");
}