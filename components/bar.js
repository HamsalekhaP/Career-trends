const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class Bar extends D3Component {

    initialize(node, props) {
      console.log(props);
      console.log(node);

      var margin = {top: 20, right: 20, bottom: 30, left: 50};
      var width = 700/2;
      var height = 400/2;

      // set the ranges
      var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

      var y = d3.scaleLinear()
        .range([height, 0]);

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select(node)
        .append("svg")
            .attr("width", width*2)
            .attr("height", height*2)
        .append("g")
            .attr("transform", 
            "translate(" + margin.left + "," + 0 + ")");

      const url = "https://raw.githubusercontent.com/LicCheng/cs639-data/main/degree.csv";
      // Previous error if not using proper url: Error: {TypeError: Failed to execute 'fetch' on 'Window': Failed to parse URL from //localhost:80./data/region.csv: "    at module.exports.ClientRequest._onFinish (http://localhost:3000/index.js:70635:10)"}
      d3.csv(url, function(error, data) {

        if (error){
          throw error;
        }
        
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { 
          return d["Major"];
        }));
        y.domain([0, d3.max(data, function(d) { 
          return d["Starting-Salary"]; 
        })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
          .data(data).enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { 
            return x(d.Major);
          })
          .attr("width", x.bandwidth())

          .attr("y", function(d) { 
            var t = d["Starting-Salary"];
            if (isNaN(t) || t == "NaN"){
              return 0;
            }
            return y(t); 
          })
          .attr("height", function(d) { 
            var t = d["Starting-Salary"];
            if (isNaN(t) || t == "NaN"){
              t = 0;
            }
            return height - y(t); 
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
  
module.exports = Bar;
