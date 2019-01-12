draw = (data, id, station) =>{
    chart = () => {
        d3.select(id).append('div').append('svg')
            .attr("width", $('#wg1').width())
            .attr("height", $(id).height()/4.5);

        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        var aspectRatio = 1 / 1;
        var width = $(id).width();
        var height = width / aspectRatio;

        // const width = 300, height = 300
        const svg = d3.select(id).append('div').append('svg')
                        .attr("viewBox", [-width / 2, -height / 2, width, height])
                        // .attr("transform", "translate(0, " + height/2 + ")")
                        .attr("style","margin: 2%;");
        const simulation = forceSimulation(nodes, links).on("tick", ticked);
        const scale = d3.scaleOrdinal(d3.schemeCategory10);

        const link = svg.append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(links)
                        .enter().append("line")
                        .attr("stroke-width", d => Math.sqrt(d.value));

        const node_group = svg.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(nodes)
              .enter();

        const r = 5;
        const node = node_group.append("circle")
              .attr("r", r)
              .attr("fill", d => scale(d.group))
              .call(drag(simulation));

        const text = node_group.append("text")
              .text(d => d.id)
              .attr("dy", 10);

        function ticked() {
            node
                .attr("cx", d => d.x = Math.max(-width/2+r, Math.min(width/2-r, d.x)))
                .attr("cy", d => d.y = Math.max(-height/2+r, Math.min(height/2-r, d.y)));

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            text
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        }

        //wyf add station name
        var space = d3.select(id).append('div')
            .attr("width", $('#wg1').width())
            .attr("height", 20)
            .attr("style", "margin: 2%;")
            .attr('id', 'text_'+ id)
            .attr('style', 'text-align:center;');
        space.append('text')
            .text(station)
            .attr("fill", "#47484c")
            .attr("style", "font-size: 12px;")
            .attr("transform", "translate(0, " + 30 + ")");
        space.append('svg')
            .attr("width", $('#wg1').width())
            .attr("height", $('#wg1').width()*0.4);
        //end wyf

        return svg.node();
    }

    function forceSimulation(nodes, links) {
          return d3.forceSimulation(nodes)
              .force("link", d3.forceLink(links).id(d => d.id))
              .force("charge", d3.forceManyBody().strength(-20))
              .force("center", d3.forceCenter())
    }


    drag = simulation => {
          function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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
          return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    }
    chart()
}


draw2 = (data, id) => {
    chart2 = () => {
        console.log("data: ", data);
        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        var aspectRatio = 0.8 / 1;
        var width = $(id).width();
        var height = width * aspectRatio;

        // const width = 300, height = 300
        const svg = d3.select(id).append('svg')
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            // .attr("viewBox", [-width / 2.5, -height / 2.5, width/1.5, height/1.5])
            // .attr("width", width)
            // .attr("height", height)
            .attr("style", "margin: 0%;");
        const simulation = forceSimulation(nodes, links).on("tick", ticked);
        const scale = d3.scaleOrdinal(d3.schemeCategory10);

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        const node_group = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter();

        const r = 5;
        const node = node_group.append("circle")
            .attr("r", r)
            .attr("fill", d => scale(d.group))
            .call(drag(simulation));

        const text = node_group.append("text")
            .text(d => d.id)
            .attr("dy", 10);

        function ticked() {
            node
                .attr("cx", d => d.x = Math.max(-width / 2 + r, Math.min(width / 2 - r, d.x)))
                .attr("cy", d => d.y = Math.max(-height / 2 + r, Math.min(height / 2 - r, d.y)));           

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            text
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        }

        return svg.node();
    }

    function forceSimulation(nodes, links) {
        return d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-20))
            .force("center", d3.forceCenter())
    }


    drag = simulation => {
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    chart2()
}