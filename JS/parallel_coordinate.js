parallel_coordinate = (data, id) => {
    chart = () => {
        const width = 900, height = 300;
        const padding = { top: 30, right: 30, bottom: 30, left: 30 };
        const svg = d3.select(id).append('svg')
            .attr("viewBox", [(-width / 2 - padding.left)*1.05, (-height / 2 - padding.bottom)*1.2,
            width + padding.left + padding.right,
            (height + padding.top + padding.bottom)*1.1]);
        var category = ['direction', 'speed', 'NO2', 'O3', 'SO2', 'PM10', 'PM2_5'];
        var gap = width / (category.length-1);
        var x_gap = Math.min(gap, height / 2) - 10
        var range = [];
        for (var i = 0; i < category.length; i++) {
            range.push(-width / 2 + gap * i)
        }
        const x = d3.scaleOrdinal().domain(category).range(range);
        const color = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o.direction))])
            .range(['#c2e59c', '#64b3f4'])
        var y = {};
        category.map(cat => y[cat] = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o[cat]))])
            .range([height / 2, height / 2 - x_gap]))
        generate_path = d => {
            return d3.line()(category.map(p => {
                if (p == 'direction') {
                    var r = x_gap / 4
                    if (y[p](d[p]) < height / 2 - x_gap / 2) {
                        var cy = height / 2 - 3 / 4 * x_gap;
                        var angle = 2 * Math.PI / x_gap * (y[p](d[p]) - height / 2 - x_gap);
                        return [x(p) - Math.sin(angle) * r, -Math.cos(angle) * r + cy];
                    }
                    else {
                        var cy = height / 2 - 1 / 4 * x_gap
                        var angle = 2 * Math.PI / x_gap * (y[p](d[p]) - height / 2 - x_gap);
                        return [x(p) - Math.sin(angle) * r, Math.cos(angle) * r + cy];
                    }
                }
                else
                    return [x(p), y[p](d[p])]
            }))
        }
        var arc = d3.arc()
            .innerRadius(x_gap / 4 - 1)
            .outerRadius(x_gap / 4 + 1);
        var path = svg.selectAll("path")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "path")
            .append("path")
            .attr("d", generate_path)
            .style("stroke", d => color(d['direction']))
        var axis = svg.selectAll("y_axis")
            .data(category)
            .enter()
            .append("g")
            .attr("class", "y_axis")
            .attr("transform", (d, i) => "translate(" + x(d) + ", 0)")
            .each(function (d) {
                if (d == "direction") {
                    d3.select(this).append("path")
                        .attr("transform", "translate(0, " + (height / 2 - 3 / 4 * x_gap) + ")")
                        .attr("d", arc.startAngle(Math.PI).endAngle(2 * Math.PI))
                    d3.select(this).append("path")
                        .attr("transform", "translate(0, " + (height / 2 - 1 / 4 * x_gap) + ")")
                        .attr("d", arc.startAngle(0).endAngle(Math.PI))
                    //wyf - pc text
                    d3.select(this).append("text")
                        .text("direction")
                        .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                        .attr("transform", "translate(" + (-15) + ", " + (height / 2 - 1 / 4 * x_gap)*1.5 + ")");
                    //end wyf
                }
                else {
                    d3.select(this).call(d3.axisLeft()
                        .scale(y[d])
                        .ticks(8))
                    //wyf - pc text
                    d3.select(this).append("text")
                        .text(d)
                        .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                        .attr("fill", "#47484c")
                        .attr("transform", "translate(" + (5) + ", " + (height / 2 - 1 / 4 * x_gap) * 1.5 + ")");
                    //end wyf
                }
            })
            

        var category_pair = [];
        for (var i = 0; i < category.length - 1; i++) {
            category_pair.push([category[i], category[i + 1]])
        }
        var coordinates = svg.selectAll("coordinates")
            .data(category_pair)
            .enter()
            .append("g")
            .attr("class", "coordinates")
            .attr("transform", (d, i) => "translate(" + x(d) + ", " + (-height / 1.7) + ")")
        var coordinate_x = {};
        category.map(cat => coordinate_x[cat] = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o[cat]))])
            .range([0, x_gap]))
        coordinates.append("g")
            .each(function (d) {
                d3.select(this).call(d3.axisLeft()
                    .scale(y[d[0]])
                    .ticks(0))
                //wyf coor y axis
                d3.select(this).append("text")
                    .text(d[0])
                    .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                    .attr("fill", "#47484c")
                    .attr("transform", "translate(" + 20 + ",0)");
                //end wyf
            })
            

        coordinates.append("g")
            .attr("transform", (d, i) => "translate(0, " + (height / 2) + ")")
            .each(function (d) {
                d3.select(this).call(d3.axisBottom()
                    .scale(coordinate_x[d[1]])
                    .ticks(0))
                //wyf coor x axis
                d3.select(this).append("text")
                    .text(d[1])
                    .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                    .attr("fill", "#47484c")
                    .attr("transform", "translate(" + (height / 2)*0.82 + ",20)");
                //end wyf
            })


        coordinates.append("g")
            .selectAll("points")
            .data(d => data.map(p => [y[d[0]](p[d[0]]), coordinate_x[d[1]](p[d[1]]), color(p['direction'])]))
            .enter()
            .append("circle")
            .attr("cx", d => d[1])
            .attr("cy", d => d[0])
            .attr("r", 1)
            .style("fill", d => d[2])
    }

    chart()
}

parallel_coordinate2 = (data, id) => {
    chart = () => {
        const width = 900, height = 300;
        const padding = { top: 30, right: 30, bottom: 30, left: 30 };
        const svg = d3.select(id).append('svg')
            .attr("viewBox", [(-width / 2 - padding.left) * 1.02, (-height / 2 - padding.bottom) * 1.2,
            width + padding.left + padding.right,
            (height + padding.top + padding.bottom) * 1.1]);
        var category = ['direction', 'speed', 'NO2', 'O3', 'SO2', 'PM10', 'PM2_5'];
        var gap = width / (category.length - 1);
        var x_gap = Math.min(gap, height / 2) - 10
        var range = [];
        for (var i = 0; i < category.length; i++) {
            range.push(-width / 2 + gap * i)
        }
        const x = d3.scaleOrdinal().domain(category).range(range);
        const color = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o.direction))])
            .range(['#c2e59c', '#64b3f4'])
        var y = {};
        category.map(cat => y[cat] = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o[cat]))])
            .range([height / 2, height / 2 - x_gap]))
        generate_path = d => {
            return d3.line()(category.map(p => {
                if (p == 'direction') {
                    var r = x_gap / 4
                    if (y[p](d[p]) < height / 2 - x_gap / 2) {
                        var cy = height / 2 - 3 / 4 * x_gap;
                        var angle = 2 * Math.PI / x_gap * (y[p](d[p]) - height / 2 - x_gap);
                        return [x(p) - Math.sin(angle) * r, -Math.cos(angle) * r + cy];
                    }
                    else {
                        var cy = height / 2 - 1 / 4 * x_gap
                        var angle = 2 * Math.PI / x_gap * (y[p](d[p]) - height / 2 - x_gap);
                        return [x(p) - Math.sin(angle) * r, Math.cos(angle) * r + cy];
                    }
                }
                else
                    return [x(p), y[p](d[p])]
            }))
        }
        var arc = d3.arc()
            .innerRadius(x_gap / 4 - 1)
            .outerRadius(x_gap / 4 + 1);
        var path = svg.selectAll("path")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "path")
            .append("path")
            .attr("d", generate_path)
            .style("stroke", d => color(d['direction']))
        var axis = svg.selectAll("y_axis")
            .data(category)
            .enter()
            .append("g")
            .attr("class", "y_axis")
            .attr("transform", (d, i) => "translate(" + x(d) + ", 0)")
            .each(function (d) {
                if (d == "direction") {
                    d3.select(this).append("path")
                        .attr("transform", "translate(0, " + (height / 2 - 3 / 4 * x_gap) + ")")
                        .attr("d", arc.startAngle(Math.PI).endAngle(2 * Math.PI))
                    d3.select(this).append("path")
                        .attr("transform", "translate(0, " + (height / 2 - 1 / 4 * x_gap) + ")")
                        .attr("d", arc.startAngle(0).endAngle(Math.PI))
                    //wyf - pc text
                    d3.select(this).append("text")
                        .text("direction")
                        .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                        .attr("transform", "translate(" + (-15) + ", " + (height / 2 - 1 / 4 * x_gap) * 1.5 + ")");
                    //end wyf
                }
                else {
                    d3.select(this).call(d3.axisLeft()
                        .scale(y[d])
                        .ticks(8))
                    //wyf - pc text
                    d3.select(this).append("text")
                        .text(d)
                        .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                        .attr("fill", "#47484c")
                        .attr("transform", "translate(" + (5) + ", " + (height / 2 - 1 / 4 * x_gap) * 1.5 + ")");
                    //end wyf
                }
            })


        var category_pair = [];
        for (var i = 0; i < category.length - 1; i++) {
            category_pair.push([category[i], category[i + 1]])
        }
        var coordinates = svg.selectAll("coordinates")
            .data(category_pair)
            .enter()
            .append("g")
            .attr("class", "coordinates")
            .attr("transform", (d, i) => "translate(" + x(d) + ", " + (-height / 1.7) + ")")
        var coordinate_x = {};
        category.map(cat => coordinate_x[cat] = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, data.map(o => o[cat]))])
            .range([0, x_gap]))
        coordinates.append("g")
            .each(function (d) {
                d3.select(this).call(d3.axisLeft()
                    .scale(y[d[0]])
                    .ticks(0))
                //wyf coor y axis
                d3.select(this).append("text")
                    .text(d[0])
                    .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                    .attr("fill", "#47484c")
                    .attr("transform", "translate(" + 20 + ",0)");
                //end wyf
            })


        coordinates.append("g")
            .attr("transform", (d, i) => "translate(0, " + (height / 2) + ")")
            .each(function (d) {
                d3.select(this).call(d3.axisBottom()
                    .scale(coordinate_x[d[1]])
                    .ticks(0))
                //wyf coor x axis
                d3.select(this).append("text")
                    .text(d[1])
                    .attr("style", "font-size: 14px; font-family:'Trebuchet MS';")
                    .attr("fill", "#47484c")
                    .attr("transform", "translate(" + (height / 2) * 0.82 + ",20)");
                //end wyf
            })


        coordinates.append("g")
            .selectAll("points")
            .data(d => data.map(p => [y[d[0]](p[d[0]]), coordinate_x[d[1]](p[d[1]]), color(p['direction'])]))
            .enter()
            .append("circle")
            .attr("cx", d => d[1])
            .attr("cy", d => d[0])
            .attr("r", 1)
            .style("fill", d => d[2])
    }

    chart()
}



