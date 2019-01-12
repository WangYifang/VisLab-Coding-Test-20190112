// paint all the views
function paintChart(){
	// Level 1 & 2
	d3.csv("data/temperature_daily.csv", function(error, data) {
		if (error) throw error;
		// console.log(data);
		var year, month;
		var thisYear = new Date(data[0].date.replace(/-/, "/")).getFullYear();
		var thisMonth = new Date(data[0].date.replace(/-/, "/")).getMonth() + 1;

		var max_temperature, min_temperature;
		max_temperature = data[0].max_temperature;
		min_temperature = data[0].min_temperature;

		var filterData = {max_temp: [], min_temp: []};

		var max_temp_array = [];
		var min_temp_array = [];

		var sum_max = 0;
		var sum_min = 0;
		var num_of_days_in_month = 0;

		// Array for Level 2
		// Level 2: prepare data - add everyday temperature as an array to Level_1's filterData
		var max_temperature_array = [];
		var min_temperature_array = [];
		var max_temperature_per_month = [];
		var min_temperature_per_month = [];

		// Level 1: prepare data (compute average)
		data.forEach(today => {
			var date = new Date(today.date.replace(/-/, "/"));
			year = date.getFullYear();
			month = date.getMonth() + 1;

			var parseTime = d3.timeFormat("%x");
			date = parseTime(date);

			//compare tempature and update
			if (year == thisYear){
				if (month == thisMonth){
					sum_max += parseFloat(today.max_temperature);
					sum_min += parseFloat(today.min_temperature);
					num_of_days_in_month ++;

					// Level 2
					max_temperature_per_month.push({ "x": date, "y": today.max_temperature});
					min_temperature_per_month.push({ "x": date, "y": today.min_temperature});
				}
				else{ //update month
					max_temp_array.push(sum_max / num_of_days_in_month);
					min_temp_array.push(sum_min / num_of_days_in_month);
					thisMonth = month;
					num_of_days_in_month = 1;
					sum_max = parseFloat(today.max_temperature);
					sum_min = parseFloat(today.min_temperature);

					// Level 2 
					max_temperature_array.push(max_temperature_per_month);
					min_temperature_array.push(min_temperature_per_month);
					max_temperature_per_month = [];
					min_temperature_per_month = [];
					max_temperature_per_month.push({ "x": date, "y": today.max_temperature });
					min_temperature_per_month.push({ "x": date, "y": today.min_temperature });
				}
			}
			else{    //update year
				max_temp_array.push(sum_max / num_of_days_in_month);
				min_temp_array.push(sum_min / num_of_days_in_month);
				var max_temp_new_record = [{year: thisYear, month: max_temp_array}];
				var min_temp_new_record = [{year: thisYear, month: min_temp_array}];
				// console.log("max_temp_new_record: ", max_temp_new_record);

				filterData.max_temp.push(max_temp_new_record);
				filterData.min_temp.push(min_temp_new_record);

				thisYear = year;
				thisMonth = 1;
				num_of_days_in_month = 1;
				sum_max = parseFloat(today.max_temperature);
				sum_min = parseFloat(today.min_temperature);
				max_temp_array = [];
				min_temp_array = [];

				// Level 2
				max_temperature_array.push(max_temperature_per_month);
				min_temperature_array.push(min_temperature_per_month);
				max_temperature_per_month = [];
				min_temperature_per_month = [];
				max_temperature_per_month.push({ "x": date, "y": today.max_temperature });
				min_temperature_per_month.push({ "x": date, "y": today.min_temperature });
			}
		});
		// last element
		max_temp_array.push(sum_max / num_of_days_in_month);
		min_temp_array.push(sum_min / num_of_days_in_month);
		var max_temp_new_record = [{ year: thisYear, month: max_temp_array }];
		var min_temp_new_record = [{ year: thisYear, month: min_temp_array }];
		filterData.max_temp.push(max_temp_new_record);
		filterData.min_temp.push(min_temp_new_record);
		// Level 2
		max_temperature_array.push(max_temperature_per_month);
		min_temperature_array.push(min_temperature_per_month);

		// console.log("min_temperature_array: ", min_temperature_array);
		// console.log("filterData: ", filterData);

		// Level 1 + Level 2
		// Draw map
		d3.select('#LEVEL1').select("svg").remove();
		d3.select('#LEVEL2').select("svg").remove();
		show_temperature2(filterData, "#LEVEL1","max");
		// Level 2: prepare data - add everyday temperature as an array to Level_1's filterData
		show_temperature_linechart(filterData, "#LEVEL2", "max", max_temperature_array, min_temperature_array);

		d3.select('#min_temperature')
			.on("click", function (event) {
				// Level 1
				d3.select('#LEVEL1').selectAll("svg").remove();
				show_temperature2(filterData, "#LEVEL1", "min");
				// Level 2
				d3.select('#LEVEL2').selectAll("svg").remove();
				show_temperature_linechart(filterData, "#LEVEL2", "min", max_temperature_array, min_temperature_array);
			});

		d3.select('#max_temperature')
			.on("click", function (event) {
				// Level 1
				d3.select('#LEVEL1').selectAll("svg").remove();
				show_temperature2(filterData, "#LEVEL1", "max");
				// Level 2		
				d3.select('#LEVEL2').selectAll("svg").remove();
				show_temperature_linechart(filterData, "#LEVEL2", "max", max_temperature_array, min_temperature_array);
			});
	});

	// Level 3
	d3.json("data/HKUST_coauthor_graph.json", function (error, data) {
		var cseData = { "nodes": [], "edges": []};
		var cseID = [];

		data.nodes.forEach(professor => {
			if (professor.dept == "CSE") {
				cseData.nodes.push(professor);
				cseID.push(professor.id);
			}
		});
		data.edges.forEach(collaboration => {
			var sourceFlag = cseID.find(function (x) {
				return x == collaboration.source;
			})
			var targetFlag = cseID.find(function (x) {
				return x == collaboration.target;
			})
			if (sourceFlag != undefined && targetFlag != undefined) {
				cseData.edges.push(collaboration);
			}
		});
		
		// Add the num of collaborators of each professor
		cseData.nodes.forEach(professor => {
			var count = 0;
			cseData.edges.forEach(collaboration => {
				if (professor.id == collaboration.source || professor.id == collaboration.target){
					count++;
				}
			});
			professor.num_collabration = count;
		})

		// Add the num of collaborations among two professors. (in the edges)
		cseData.edges.forEach(collaboration => {
			collaboration.num_collabration = collaboration.publications.length;
		})
		console.log("cseData: ", cseData);

		// draw
		d3.select('#LEVEL3').select("svg").remove();
		show_coordinated_views(cseData, "#LEVEL3");

		// //test
		// var source_circle = d3.select("#circle-210");
		// console.log("source_circle: ", source_circle);
	});
}



