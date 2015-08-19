var donut = {

  d3tools: {},
  elem: {},
  meas: {},

  helpDescription: {
    "1" : "Touch a colored section of the 'donut' graph",
    "2" : "View industry name and percentage of SMS students that have had a co-op in that industry within the last 5 years",
    "3" : "If there is an industry related student co-op story, click the link that appears at the bottom of the screen to view the story"
  },

  setUp: function(){
    $( document ).ready(function(){
      var dM = donut.meas;

      dM.width = document.documentElement.clientWidth,
      dM.height = document.documentElement.clientHeight,

      dM.textBoxHeight = 66;
      dM.circleCY = dM.height / 2.6;
      dM.circleCX = dM.width / 2;

      dM.outerRadius = donut.calculateRadii("outerRadius", this);
      dM.innerRadius = donut.calculateRadii("innerRadius", this);

      dM.circleOutsideEdge = dM.circleCY + dM.outerRadius;

      dM.industryEndLocation = Math.round(dM.circleOutsideEdge + dM.height * (1 / 11));

      donut.makeElements();
      donut.makeTools();
      donut.makeGVis();
      donut.useData();
      buttons.createButtons();
    });
  },



  calculateRadii: function(radius, thi){
    var ratio = donut.meas.width / donut.meas.height;
    console.log(donut.meas.width);
    if(donut.meas.width < 600){
      if(radius == "outerRadius"){
        return donut.meas.width / 2 - (donut.meas.width / 25);
      }else{
        return (donut.meas.width/2 - (donut.meas.width / 25)) - (donut.meas.width * .2);
      }
    }else{
      if(radius == "outerRadius"){
        return 280;
      }else{
        return 160;
      }
    }
  },



  makeElements: function(){
    var dE = donut.elem;
    var dM = donut.meas;

    dE.divMiddle = document.getElementsByClassName("text-middle")[0]; //document.createElement("div");
    dE.hiddenLink = document.getElementById("hidden-link");
    dE.industry = document.getElementsByClassName("industry-text")[0];//document.createElement("p");
    dE.industryLabelBack = document.getElementById("label-back");
    dE.industryLabelDown = document.getElementsByClassName("label down")[0];//document.createElement("p");
    dE.industryLabelUp = document.getElementsByClassName("label up")[0];//document.createElement("p");
    dE.percentNumber = document.getElementsByClassName("percent-number")[0];//document.createElement("p");
    dE.percentText = document.getElementsByClassName("percent-text")[0];//document.createElement("p");

    document.body.appendChild(dE.industry);
    dE.divMiddle.appendChild(dE.percentNumber);
    dE.divMiddle.appendChild(dE.percentText);

    dM.divMiddleHeight = dE.divMiddle.clientHeight;
    dM.divMiddleWidth = dE.divMiddle.clientWidth;
    dM.industryHeight = dE.industry.clientHeight;
    dM.industryLabelUpHeight = dE.industryLabelUp.clientHeight;
    dM.industryLabelDownHeight = dE.industryLabelDown.clientHeight;

    console.log(dM.industryHeight);
    dE.industryLabelBack.style.height = dM.industryHeight + "px";
    dE.industryLabelBack.style.top = dM.industryEndLocation + "px";
    console.log(dM.industryLabelDownHeight);

    dM.industryStartLocation = dM.circleCY - (dM.divMiddleHeight/2) - dM.industryHeight;  //define industry start location after finding industryHeight and divMiddleHeight

    dE.divMiddle.style.top = dM.circleCY - dM.divMiddleHeight/2 + "px";
    dE.divMiddle.style.left = dM.circleCX - dM.divMiddleWidth/2 + "px";

    dM.industryLabelUpStartLocation = dM.industryEndLocation;
    dM.industryLabelDownStartLocation = dM.industryEndLocation + dM.industryHeight - dM.industryLabelDownHeight;

    dE.industryLabelUp.style.top = dM.industryLabelUpStartLocation + "px";
    dE.industryLabelDown.style.top = dM.industryLabelDownStartLocation + "px";

    dM.industryLabelUpEndLocation = dM.industryEndLocation - dM.industryLabelUpHeight + 1;  //plus 1 for weird pixel problem...fix later?
    dM.industryLabelDownEndLocation = donut.meas.industryEndLocation + donut.meas.industryHeight;
  },



  makeTools: function(){
    donut.d3tools.color = d3.scale.ordinal()
      .range(["#002e6c", "#00adee", "#ff661b", "#025594", "#9fc600", "#333333", "#be1e2d"]);

    donut.d3tools.arc = d3.svg.arc()
      .outerRadius(donut.meas.outerRadius)
      .innerRadius(donut.meas.innerRadius);

    donut.d3tools.secondaryArc = d3.svg.arc()
      .outerRadius(donut.meas.outerRadius + (donut.meas.width / 35))
      .innerRadius(donut.meas.innerRadius);

    donut.d3tools.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.percent;
      });
  },



  makeGVis: function(){
    donut.elem.gVis = d3.select("body")
      .append("svg")
        .attr("width", donut.meas.width)
        .attr("height", donut.meas.height)
      .append("g")
        .attr("transform", "translate(" + donut.meas.width / 2 + "," + donut.meas.circleCY + ")");
  },



  useData: function(){
    var g = donut.elem.gVis.selectAll(".arc")
      .data(donut.d3tools.pie(donut.data))
      .enter()
      .append("g")
        .attr("class", "arc");

    g.append("path")
      .attr("d", donut.d3tools.arc)
      .style("fill", function(d,i) { return donut.d3tools.color(i); });

    g.selectAll("path")
      .on("mouseover", function(d){
        d3.select(this)
          .transition("linear")
            .attr("d", donut.d3tools.secondaryArc);

        donut.touchPath(d, this);
      })
      .on("mouseout", function(d){
        d3.select(this).attr("d", donut.d3tools.arc);
        donut.leavePath(d, this);
      });
  },



  touchPath: function(d, touched){
    if(!description.hidden){
      description.hide();
    }

    d3.select(donut.elem.industry)
      .text(d.data.industry);

    d3.select(donut.elem.percentNumber)
      .text(d.data.percent + "%");

    donut.elem.divMiddle.style.opacity = 1;

    d3.select(donut.elem.industry)
      .style("background", "#e5e5e5")
      .style("opacity", 1)
      .style("text-shadow", "0px 2px 2px rgba(0, 0, 0, 0.5)")
      .style("top", donut.meas.industryStartLocation + "px")
      .transition().duration(750)
        .style("background", touched.style.fill)
        .style("top", donut.meas.industryEndLocation + "px")
        .each("end", function(){
          console.log(this);
          d3.select(donut.elem.industryLabelBack)
            .transition()
              .style("top", donut.meas.industryLabelUpEndLocation + "px")
              .style("height", donut.meas.industryHeight + donut.meas.industryLabelUpHeight + donut.meas.industryLabelDownHeight + "px")
              .style("opacity", 1);
          d3.select(donut.elem.industryLabelUp)
            .transition()
              .style("top", donut.meas.industryLabelUpEndLocation + "px")
              .style("opacity", 1);
          d3.select(donut.elem.industryLabelDown)
            .transition()
              .style("top", donut.meas.industryLabelDownEndLocation + "px")
              .style("opacity", 1);
        });

    if(d.data.article){
      var dehL = donut.elem.hiddenLink;  //holder var to make repeated element reference more readable

      dehL.setAttribute("href", d.data.article);
      dehL.style.opacity = 1;
      dehL.style.background = touched.style.fill;
      dehL.removeEventListener("click", donut.stopDefAction);
    }else{
      donut.elem.hiddenLink.addEventListener("click", donut.stopDefAction, false);
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

    donut.elem.divMiddle.style.opacity = 0;

    d3.select(".industry-text")
      .transition().duration(750)
        .style("top", donut.meas.industryStartLocation + "px")
        .style("background","#e5e5e5")
        .style("text-shadow","none")
        .style("color","#e5e5e5");

    d3.select(donut.elem.industryLabelBack)
      .transition()
        .style("top", donut.meas.industryEndLocation + "px")
        .style("height", donut.meas.industryHeight + "px")
        .style("opacity", 0);

    d3.select(donut.elem.industryLabelUp)
      .transition()
        .style("top", donut.meas.industryLabelUpStartLocation + "px")
        .style("opacity", 0);

    d3.select(donut.elem.industryLabelDown)
      .transition()
        .style("top", donut.meas.industryLabelDownStartLocation + "px")
        .style("opacity", 0);

    donut.elem.hiddenLink.style.opacity = 0;
    donut.elem.hiddenLink.style.background = "#666";
  },



  stopDefAction: function(evt){
    evt.preventDefault();
  },



  //main data object that holds industry names, percentage, and if we have article of not (also unused count property as of right now)
  data: [
    {
      "industry":"Print",
      "count":53,
      "percent":37,
      "article": "http://google.com"
    },

    {
      "industry":"Advertising",
      "count":21,
      "percent":15,
      "article": "http://yahoo.com"
    },

    {
      "industry":"Consumer Products",
      "count":22,
      "percent":15,
      "article": false
    },

    {
      "industry":"Publishing",
      "count":13,
      "percent":9,
      "article": "http://cnn.com"
    },

    {
      "industry":"Vendor",
      "count":13,
      "percent":9,
      "article": false
    },

    {
      "industry":"Other",
      "count":11,
      "percent":7,
      "article": "http://trello.com"
    },

    {
      "industry":"Software",
      "count":8,
      "percent":6,
      "article": false
    }
  ]
}
