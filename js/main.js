var width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight,
  radius = Math.min(width, height) / 2,
  outerRadius = radius - 10,
  innerRadius = radius - (radius/2.25),
  textBoxHeight = 66;

var textDiv = document.createElement("div"),
    industryText = document.createElement("p"),
    countText = document.createElement("p"),
    percentText = document.createElement("p");

    textDiv.setAttribute("class","text-div");
    industryText.setAttribute("class","industry-text");
    countText.setAttribute("class","count-text");
    percentText.setAttribute("class","percent-text");

    textDiv.appendChild(industryText);
    textDiv.appendChild(countText);
    textDiv.appendChild(percentText);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.percent; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//start json import and elements that need data
d3.json("data/data.json", function(error, data){
  if(error) return console.log(error);

  var g = svg.selectAll(".arc")
    .data(pie(data))
  .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.count); });

  g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .text(function(d) { return d.data.percent + "%"; });

  g.selectAll("path")
    .on("mouseover", function(d){
      d3.select(this.parentNode.childNodes[1]).transition().text("");
      d3.select(this).transition().style("opacity",".3");
      d3.select(".industry-text").text(d.data.industry);
      d3.select(".count-text").text(d.data.count + " students");
      d3.select(".percent-text").text("(" + d.data.percent + "% of co-op students)");
      if(d.data.article){
        document.getElementById('p-industry').innerHTML = d.data.industry;
        document.getElementById('hidden-link').style.bottom = "0px";
      }else{
        console.log("doesn't have an article");
      }
    })
    .on("mouseout", function(d){
      d3.select(this.parentNode.childNodes[1]).transition().text(function(d) { return d.data.percent + "%"; });
      d3.select(this).transition().style("opacity","1");
      d3.select(".industry-text").text(null);
      d3.select(".count-text").text(null);
      d3.select(".percent-text").text(null);
      document.getElementById('hidden-link').style.bottom = "-95px";
    });

    textDiv.style.top = String(height/2 - textBoxHeight/2) + "px";
    textDiv.style.left = String(radius - innerRadius + 10) + "px";
  document.body.appendChild(textDiv);
});
//end json function
