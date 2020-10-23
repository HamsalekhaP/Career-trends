const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const { stack } = require('d3');

class StackBar extends D3Component {
    
    update(node, props){

    }

    initialize(node, props){
        const csvData = 
`Justice,Majority,Concurrence,Dissent
Thomas,8,14,6
Gorsuch,8,3,11
Breyer,8,2,10
Alito,7,6,7
Sotomayor,7,3,9
Ginsburg,6,2,6
Kavanaugh,7,4,3
Kagan,8,1,3
Roberts,7,2,3`;
                
        var csv = d3.csvParse(csvData, d3.autoType);

        var subgroups = csv.columns.slice(1);
        
        const colors = ["pink", "green", "orange"];
        
        var color = (i) => {
            return colors[i];
        };
        
        console.log(d3.range(subgroups.length));

        const legendBoxSize = 15;
        const legendPadding = 5;
        
        const margin = ({
            top: 20 + colors.length * (legendBoxSize + legendPadding), 
            right: 20, 
            bottom: 30, 
            left: 50
        });
        

        var width = 1200;
        var height = 500;
        
        // const url = "http://localhost:3000/data/region-mean.csv";
        const url = "http://localhost:3000/data/stackbar.csv";

        const groupName = "Justice";

        var svg = d3.select(node).append("svg")
                .attr("width", width*2)
                .attr("height", height*2);
        
        var data = d3.stack()
                .keys(subgroups)(csv)
                .map((data, i) => data.map(([y0, y1]) => [y0, y1, i])) // add an extra array element for the subgroup index
        
        const stackedMax = d3.max(data, y => d3.max(y, d => d[1]));
        const groupedMax = d3.max(data, row => d3.max(subgroups.map(col => row[col])));

        var groups = csv.map(d => d[groupName]);

        const x = d3.scaleBand()
                    .domain(d3.range(groups.length))
                    .rangeRound([margin.left, width - margin.right])
                    .padding(0.15);

        console.log([0, stackedMax], [height - margin.bottom, margin.top]);
        var y = d3.scaleLinear()
                    .domain([0, stackedMax])
                    .range([height - margin.bottom, margin.top]);

        const subgroup = svg.selectAll(".subgroup")
                            .data(data)
                            .enter().append("g")
                                .attr("class", "subgroup")
                                .attr("fill", (d, i) => {
                                    return color(i);
                                });

        const xAxis = d3.axisBottom(x)
                .tickSize(0)
                .tickPadding(8)
                .tickFormat((d, i) => groups[i]);

        const yAxis = d3.axisLeft(y).tickPadding(8);        

        const rect = subgroup.selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                    .attr("x", (d, i) => x(i))
                    .attr("y", d => y(d[1]))
                    .attr("width", x.bandwidth())
                    .attr("height", d => y(d[0]) - y(d[1]));

        subgroup.on("mouseenter", function() {
            svg
                .selectAll(".subgroup")
                .transition()
                .style("fill-opacity", 0.15);
            
            d3.select(this)
                .transition()
                .style("fill-opacity", 1);
        });

        subgroup.on("mouseleave", function() {
            svg.selectAll(".subgroup")
                .transition()
                .style("fill-opacity", 1);
        });

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .style("font-size", "13px")
            .call(xAxis);

        const yAxisContainer = svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .style("font-size", "13px")
            .call(yAxis);

        const legend = svg => {
            const entry = svg
                .append("g")
                .selectAll(".entry")
                .data(subgroups)
                // Might not always be true
                .enter().append("g")
                .attr(
                    "transform",
                    (d, i) => `translate(0,${(legendBoxSize + legendPadding) * i})`
                )
                .attr("class", "entry");
            
            entry.append("rect")
                .attr("width", legendBoxSize)
                .attr("height", legendBoxSize)
                .attr("fill", (d, i) => color(i));
            
            entry
                .append("text")
                .text(d => d)
                .attr("x", legendBoxSize + legendPadding)
                .attr("y", legendBoxSize / 2)
                .attr("dy", "0.35em")
                .style("font", "13px sans-serif");
        }

        svg.append("g")
            .attr("transform", `translate(${width + margin.left - 175},0)`)
            .call(legend);

        function transitionGrouped() {
            y.domain([0, groupedMax]);
            yAxisContainer
                .transition()
                .duration(500)
                .delay(500)
                .call(yAxis);

            rect
                .transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("x", (d, i) => x(i) + (x.bandwidth() / subgroups.length) * d[2])
                .attr("width", x.bandwidth() / subgroups.length)
                .transition()
                .attr("y", d => y(d[1] - d[0]))
                .attr("height", d => y(0) - y(d[1] - d[0]));
        }

        function transitionStacked() {
            y.domain([0, stackedMax]);
            yAxisContainer
                .transition()
                .duration(500)
                .call(yAxis);

            rect
                .transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .transition()
                .attr("x", (d, i) => x(i))
                .attr("width", x.bandwidth());
        }

        function update(layout) {
            if (layout === "stacked") transitionStacked();
            else transitionGrouped();
        }

        // transitionStacked();
        

    }


}

module.exports = StackBar;