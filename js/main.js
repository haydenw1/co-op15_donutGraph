var donut = {
  
  d3tools: [],
  elements: [],
  measurements: [],

  setUp: function(){
    donut.measurements.width = document.documentElement.clientWidth,
    donut.measurements.height = document.documentElement.clientHeight,
    donut.measurements.radius = Math.min(donut.measurements.width, donut.measurements.height) / 2,
    donut.measurements.outerRadius = donut.measurements.radius - 10,
    donut.measurements.innerRadius = donut.measurements.radius - (donut.measurements.radius/2.25),
    donut.measurements.textBoxHeight = 66;

    donut.elements.div = document.createElement("div");
    donut.elements.industry = document.createElement("p");
    donut.elements.count = document.createElement("p");
    donut.elements.percent = document.createElement("p");

    donut.elements.div.setAttribute("class","text-div");
    donut.elements.industry.setAttribute("class","industry-text");
    donut.elements.count.setAttribute("class","count-text");
    donut.elements.percent.setAttribute("class","percent-text");

    donut.elements.div.appendChild(donut.elements.industry);
    donut.elements.div.appendChild(donut.elements.count);
    donut.elements.div.appendChild(donut.elements.percent);

    donut.d3tools.color = d3.scale.ordinal()
      .range(["#002e6c", "#00adee", "#ff661b", "#025594", "#9fc600", "#be1e2d", "#333333"]);

    donut.d3tools.arc = d3.svg.arc()
      .outerRadius(donut.measurements.outerRadius)
      .innerRadius(donut.measurements.innerRadius);

    donut.d3tools.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { 
        return d.percent; 
      });

    donut.elements.gVis = d3.select("body")
      .append("svg")
        .attr("width", donut.measurements.width)
        .attr("height", donut.measurements.height)
      .append("g")
        .attr("transform", "translate(" + donut.measurements.width / 2 + "," + donut.measurements.height / 2 + ")");

    donut.useData();
  },

  useData: function(){
    
    donut.elements.gVis.selectAll("path")
      .data(donut.d3tools.pie(donut.ringData))
      .enter()
      .append("path")
        .attr("class", "back-ring")
        .attr("d", donut.d3tools.arc);
        //.style("fill", "#bbbbbc");


    var g = donut.elements.gVis.selectAll(".arc")
      .data(donut.d3tools.pie(donut.data))
      .enter()
      .append("g")
        .attr("class", "arc");

    g.append("path")
      .attr("d", donut.d3tools.arc)
      .style("fill", function(d,i) { return donut.d3tools.color(i); });
/*
    g.append("text")
      .attr("transform", function(d) { return "translate(" + donut.d3tools.arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .text(function(d) { return d.data.percent + "%"; });*/

    g.selectAll("path")
      .on("mouseover", function(d){
        console.log(this);
        donut.touchPath(d, this);
      })
      .on("mouseout", function(d){
        donut.leavePath(d, this);
      });

      donut.elements.div.style.top = String(donut.measurements.height/2 - donut.measurements.textBoxHeight/2) + "px";
      donut.elements.div.style.left = String(donut.measurements.radius - donut.measurements.innerRadius + 10) + "px";
      document.body.appendChild(donut.elements.div);
  },

  touchPath: function(d, touched){
    d3.select(touched.parentNode.childNodes[1])
      .transition()
        .text("");

    d3.select(touched)
      .transition()
        .style("fill", "white")
        .style("opacity", .75);

    d3.select(".industry-text")
      .text(d.data.industry);

    d3.select(".count-text")
      .text(d.data.count + " students");

    d3.select(".percent-text")
      .text("(" + d.data.percent + "% of co-op students)");

    d3.select(".color-background")
      .transition()
        .style("background", touched.style.fill);

    if(d.data.article){
      document.getElementById('p-industry').innerHTML = d.data.industry;
      document.getElementById('hidden-link').style.bottom = "0px";
    }else{
      console.log("doesn't have an article");
    }
  },

  leavePath: function(d, touched){
    d3.select(touched.parentNode.childNodes[1])
      .transition()
        .text(function(d) { 
          return d.data.percent + "%"; 
        });
    
    d3.select(touched)
      .transition()
        .style("fill",function(d) {  
          return donut.d3tools.color(donut.data.indexOf(d.data)); 
        })
        .style("opacity", 1);

    d3.select(".industry-text").text(null);
    d3.select(".count-text").text(null);
    d3.select(".percent-text").text(null);

    d3.select(".color-background")
      .transition()
        .style("background", "white");

    document.getElementById('hidden-link').style.bottom = "-95px";
  },

  ringData: [
    {
      "percent": 100
    }
  ],

  data: [  
    {
      "industry":"Print",
      "count":53,
      "percent":37,
      "article": 1
    },

    {
      "industry":"Agency",
      "count":21,
      "percent":15,
      "article": 1
    },

    {
      "industry":"Consumer Products",
      "count":22,
      "percent":15,
      "article": 0
    },

    {
      "industry":"Publishing",
      "count":13,
      "percent":9,
      "article": 1
    },

    {
      "industry":"Vender",
      "count":13,
      "percent":9,
      "article": 0
    },

    {
      "industry":"Other",
      "count":11,
      "percent":7,
      "article": 1
    },

    {
      "industry":"Mobile/Software",
      "count":8,
      "percent":6,
      "article": 0
    }
  ]
}
