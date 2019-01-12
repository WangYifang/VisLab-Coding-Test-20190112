show_coordinated_views = function (data, id){
    var aspectRatio = 2 / 1.5;
    var width = $(id).width();
    var height = width / aspectRatio;
    const svg1 = d3.select(id)
      .append("svg")
        .attr("viewBox", [- width / 2, - height / 2, width, height])
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("style", "margin: 2%;");
    var forceDirected_group = svg1.append("g");
    var forceDirected_dispatch = show_forceDirected_graph(data, forceDirected_group, width, height);

    const svg2 = d3.select(id)
        .append("svg")
        .attr("viewBox", [0, 0, width, height * aspectRatio])
        .attr("style", "margin: 2%;");
    var matrix_group = svg2;
    var matrix_dispatch = show_matrix(data, matrix_group, width, height);
    // matrixView.data(Vis.data);
    // matrixView(matrix_group);

    forceDirected_dispatch.on("hover", function(hovered) {
        matrix_dispatch.highlight(hovered);
    });
    matrix_dispatch.on("hover", function (hovered) {
        forceDirected_dispatch.highlight(hovered);
    })

}