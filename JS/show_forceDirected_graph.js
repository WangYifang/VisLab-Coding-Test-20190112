show_forceDirected_graph = function (data, group, width, height){
    var dispatch = d3.dispatch(chart, "hover");
    function chart(container) {
        g = container;
    }
    var max_num_collabration, min_num_collabration;
    max_num_collabration = d3.max(data.nodes, function (d) { return d.num_collabration; });
    min_num_collabration = d3.min(data.nodes, function (d) { return d.num_collabration; });
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-80))
        .force("center", d3.forceCenter());

    var link = group.append('g')
        .attr("class", "links")
        .selectAll("line")
        .data(data.edges)
        .enter().append("line")
        .attr("class", "links")
        .attr("stroke-width", "1")
        .attr("id", function (d, i) {
            return "link-" + d.source + "-" + d.target;
        });

    var node = group.append('g')
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter().append("g")

    var circles = node.append("circle")
        .attr("r", function (d) {
            return (d.num_collabration - min_num_collabration) / (max_num_collabration - min_num_collabration) * 20;
        })
        .attr("fill", function (d, i) { return color(i); })
        .attr("id", function (d, i) {
            // console.log("d: ", d);
            return "circle-" + d.id;
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var lables = node.append("text")
        .text(function (d) {
            return d.fullname;
        })
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
        .text(function (d) { return d.fullname; });

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.edges);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.5).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Linkage
    circles.on("mouseover", function (d) {
        d3.select(this).style("stroke", "#FFC107");
        dispatch.apply("hover", this, [d]);
    })
    circles.on("mouseout", function (d) {
        d3.select(this)
            .style("stroke", "");
        dispatch.apply("hover", this, []);
    })
    
    //highlights elements being hovered elsewhere
    chart.highlight = function (data) {
        if (data == undefined) {
            // move out
            index = 0;
            d3.selectAll("circle").style("stroke", "");
            d3.selectAll("line.links")
                .style("stroke", "#999")
                .style("stroke-opacity", "0.6")
                .style("stroke-width", "1px");
        }
        else if (data.weight == 0){
            //do nothing
        }
        else{
            // move over
            var source, target, edge;
            var count;
            for (count = 0; count < data.id.length; count++) {
                if (data.id[count] == "-") {
                    break;
                }
            }
            source = data.id.substring(0, count);
            target = data.id.substring(count + 1, data.id.length);
            edge = data.id;
            var source_circle = d3.select("#circle-" + source);
            var target_circle = d3.select("#circle-" + target);
            source_circle.style("stroke", "#FFC107");
            target_circle.style("stroke", "#FFC107");
            
            // symmetric matrix, edges' id maybe different
            var edge_link_1 = d3.select("#link-" + edge);
            var edge_link_2 = d3.select("#link-" + target + "-" + source);
            edge_link_1.style("stroke-width", "3px")
                     .style("stroke", "#FFC107")
                     .style("stroke-opacity", "1.0");
            edge_link_2.style("stroke-width", "3px")
                    .style("stroke", "#FFC107")
                    .style("stroke-opacity", "1.0");
        }
    }
    return d3.rebind(chart, dispatch, "on");
}