const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class hBar extends D3Component {
    initialize(node, props) {
        
        // TODO: Pass this as a argument from outside?
        const url = "https://raw.githubusercontent.com/LicCheng/cs639-data/main/degree.csv";
        var data = d3.csv(url, function(data) {
            console.log(data);
            
            var margin = {top: 20, right: 20, bottom: 30, left: 200},
            width = 960 - margin.left - margin.right,
            height = 1200 - margin.top - margin.bottom;

            // set the ranges
            var y = d3.scaleBand()
                    .range([height, 0])
                    .padding(0.2);

            var x = d3.scaleLinear()
                    .range([0, width]);
                    
            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select("body")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");

            data = data.sort(function (a, b) {
                console.log(a, b);
                return d3.ascending(a["StartingSalary"], b["StartingSalary"]);
            })

            // Scale the range of the data in the domains
            x.domain([0, d3.max(data, function(d){ 
                return +d["StartingSalary"]; 
            })])
            y.domain(data.map(function(d) {
                return d["Major"];
            }));

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("width", function(d) {
                        return x(d["StartingSalary"]); 
                    } )
                    .attr("y", function(d) { 
                        return y(d["Major"]); 
                    })
                    .attr("height", y.bandwidth())
                    .attr("fill", function(d){
                        return "#3285a8";
                    });
                    

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));



        });
        
    }

}
module.exports = hBar;

