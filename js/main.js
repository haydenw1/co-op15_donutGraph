var donut = {

  d3tools: {},
  elements: {},
  measurements: {},

  setUp: function(){
    donut.measurements.width = document.documentElement.clientWidth,
    donut.measurements.height = document.documentElement.clientHeight,
    donut.measurements.radius = Math.min(donut.measurements.width, donut.measurements.height) / 2,
    donut.measurements.outerRadius = donut.measurements.radius - 10,
    donut.measurements.innerRadius = donut.measurements.radius - (donut.measurements.radius/2.25),
    donut.measurements.textBoxHeight = 66;

    donut.elements.divMiddle = document.createElement("div");
    donut.elements.industry = document.createElement("p");
    donut.elements.percentNumber = document.createElement("p");
    donut.elements.percentText = document.createElement("p");

    donut.elements.divMiddle.setAttribute("class","text-middle");
    donut.elements.industry.setAttribute("class","industry-text");
    donut.elements.percentNumber.setAttribute("class","percent-number");
    donut.elements.percentText.setAttribute("class","percent-text");

    document.body.appendChild(donut.elements.industry);
    donut.elements.divMiddle.appendChild(donut.elements.percentNumber);
    donut.elements.divMiddle.appendChild(donut.elements.percentText);

    donut.d3tools.color = d3.scale.ordinal()
      .range(["#002e6c", "#00adee", "#ff661b", "#025594", "#9fc600", "#333333", "#be1e2d"]);

    donut.d3tools.arc = d3.svg.arc()
      .outerRadius(donut.measurements.outerRadius)
      .innerRadius(donut.measurements.innerRadius);

    donut.d3tools.secondaryArc = d3.svg.arc()
      .outerRadius(donut.measurements.outerRadius + 10)
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
        .attr("transform", "translate(" + donut.measurements.width / 2 + "," + donut.measurements.height / 2.25 + ")");

    donut.useData();
    createButtons();
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

    /*g.append("text")
      .attr("transform", function(d) { return "translate(" + donut.d3tools.arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .text(function(d) { return d.data.percent + "%"; });*/

    g.selectAll("path")
      .on("mouseover", function(d){
        console.log(this);
        d3.select(this).attr("d", donut.d3tools.secondaryArc);
        donut.touchPath(d, this);
      })
      .on("mouseout", function(d){
        d3.select(this).attr("d", donut.d3tools.arc);
        donut.leavePath(d, this);
      });

      donut.elements.divMiddle.style.top = String(((donut.measurements.height/2.25 + donut.measurements.innerRadius) - 75) - (((donut.measurements.innerRadius * 2) - 75) / 2)) + "px";
      donut.elements.divMiddle.style.left = String((donut.measurements.radius - donut.measurements.innerRadius) + (((donut.measurements.innerRadius * 2) - 113) / 2)) + "px";
      document.body.appendChild(donut.elements.divMiddle);

      donut.elements.industry.style.top = String(donut.measurements.height/2.25 + donut.measurements.outerRadius + 30) + "px";
  },

  touchPath: function(d, touched){
    d3.select(touched.parentNode.childNodes[1])
      .transition()
        .text("");

    //d3.select(touched)
      //.transition()
        //.style("fill", "yellow");
        //.style("opacity", 1);

    d3.select(".industry-text")
      .text(d.data.industry);

    d3.select(".percent-number")
      .text(d.data.percent + "%")
      //.transition()
        //.style("color", touched.style.fill);

    d3.select(".percent-text")
      .text("of co-op students")
      //.transition()
        //.style("color", touched.style.fill);

    //d3.select(".color-background")
      //.transition()
        //.style("background", touched.style.fill);

    d3.select(".industry-text")
      .transition()
        .style("padding", "10px 0px")
        .style("background", touched.style.fill);
      console.log(d.data.article);
    if(d.data.article){
      //document.getElementsByClassName('p-industry')[0].innerHTML = d.data.industry;
      document.getElementById('hidden-link').style.bottom = "-110px";
      document.getElementById('hidden-link').style.background = touched.style.fill;
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
        });
        //.style("opacity", 1);

    d3.select(".industry-text").text(null);
    d3.select(".percent-number").text(null);
    d3.select(".percent-text").text(null);

    /*d3.select(".color-background")
      .transition()
        .style("background", "#e5e5e5");*/

    d3.select(".industry-text")
      .transition()
        .style("padding", "0px");

    document.getElementById('hidden-link').style.bottom = "-185px";
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
      "industry":"Vendor",
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
