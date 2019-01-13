show_matrix = function (data, group, width, height){
    var dispatch = d3.dispatch(chart, "hover");
    function chart(container) {
      g = container;
    }
    var edgeHash = {};
    data.edges.forEach(edge => {
      var id = edge.source.id + "-" + edge.target.id;
      edgeHash[id] = edge;
    });

    var matrix = []
    data.nodes.forEach((source, a) => {
      data.nodes.forEach((target, b) => {
        var grid = { id: source.id + "-" + target.id, x: b, y: a, weight: 0 };
        var inverseGrid = { id: target.id + "-" + source.id, x: a, y: b, weight: grid.weight };

        if (edgeHash[grid.id]) {
            grid.weight = edgeHash[grid.id].num_collabration;
            inverseGrid.weight = edgeHash[grid.id].num_collabration;
        } 
        else if (edgeHash[inverseGrid.id]){
            grid.weight = edgeHash[inverseGrid.id].num_collabration;
            inverseGrid.weight = edgeHash[inverseGrid.id].num_collabration;
        }
        else{
            // do nothing
        }
        // for symmetric matrix
        matrix.push(grid);
        // matrix.push(inverseGrid);
      });
    });

    // draw
    var gridLength = (width/1.5) / data.nodes.length;
    var grid = group.append("g")
            .attr("transform", "translate(60,40)")
            .attr("id", "adjacencyG")
            .selectAll("rect")
            .data(matrix)
            .enter()
            .append("rect")
                .attr("class", "grid")
                .attr("width", gridLength)
                .attr("height", gridLength)
                .attr("x", d => d.x * gridLength)
                .attr("y", d => d.y * gridLength)
                .style("fill-opacity", d => d.weight * .2);
    // xAxas text
    group.append("g")
        .attr("transform", "translate(58,40)")
        .attr("class", "column")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
            .attr("transform", function (d, i) { 
                return `translate(${(i * gridLength + gridLength / 2)}, -2) rotate(315)`; 
            })
            .attr("id", function (d, i) { return i; })
            .text(d => d.fullname)
            .style("text-anchor", "start")
            .style("font-size", "4px");
    // yAxas text
    group.append("g")
        .attr("transform", "translate(58,40)")
        .attr("class", "row")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
            .attr("y", (d, i) => i * gridLength + gridLength/1.5)
            .attr("id", function (d, i) { return i; })
            .text(d => d.fullname)
            .style("text-anchor", "end")
            .style("font-size", "4px");
            
    // Linkage
    grid.on("mouseover", function (p) {
        if(p.weight != 0){
            d3.selectAll(".row text").classed("active", function (d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function (d, i) { return i == p.x; });
            dispatch.apply("hover", this, [p]);
            d3.select(this)
                .style("fill", "orange")
                .style("stroke-width", "0.5px")
                .style("stroke", "#db8540");
            var domain_node = [];
            var count = 0;
            data.nodes.forEach(node => {
                domain_node.push(count);
                count++;
            });

            var x = d3.scaleBand()
                .domain(domain_node)
                .range([0, width / 1.5]);
            group.append("g")
                .attr("transform", "translate(60,40)")
                .attr("class", "highlight-bar")
                .append("rect")
                .attr("x", 0)
                .attr("y", x(p.y))
                .attr("width", x(p.x))
                .attr("height", x.bandwidth());
            group.append("rect")
                .attr("x", x(p.x))
                .attr("y", 0)
                .attr("transform", "translate(60,40)")
                .attr("class", "highlight-bar")
                .attr("width", x.bandwidth())
                .attr("height", x(p.y));
        }
        else{
            // do nothing
        }
    })
    grid.on("mouseout", function (d) {
        dispatch.apply("hover", this, []);
        d3.select(this)
          .style("fill", "#66a9c9")
          .style("stroke-width", "0.1px")
          .style("stroke", "#999");
        d3.selectAll(".highlight-bar").remove();
        d3.selectAll("text").classed("active", false);
    })

    //highlights elements being hovered elsewhere
    chart.highlight = function (data) {
        var index;
        if (data == undefined){
            // move out
            index = 0;
            d3.selectAll(".highlight-bar-filter").remove();
        }
        else{
            // move over
            index = data.index;
            var domain_node = [];
            for (var i = 0; i < 46; i++) { domain_node.push(i); }
            var x = d3.scaleBand()
                .domain(domain_node)
                .range([0, width / 1.5]);
            // highlight row
            group.append("g")
                .attr("transform", "translate(60,40)")
                .attr("class", "highlight-bar-filter")
                .append("rect")
                .attr("x", 0)
                .attr("y", index * gridLength)
                .attr("width", width / 1.5)
                .attr("height", x.bandwidth());
            // highlight column
            group.append("g")
                .attr("transform", "translate(60,40)")
                .attr("class", "highlight-bar-filter")
                .append("rect")
                .attr("x", index * gridLength)
                .attr("y", 0)
                .attr("width", x.bandwidth())
                .attr("height", width / 1.5);
        }
    }
    return d3.rebind(chart, dispatch, "on");
}