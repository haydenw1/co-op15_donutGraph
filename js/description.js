var description = {
  setUp: function(){
    $( document ).ready(function(){
      var topDiv = description.topDiv = document.getElementsByClassName("top")[0];
      var button = description.button = $(".button.description");

      topDiv.style.height = donut.measurements.height / 2 + "px";
      description.button.delay(5000).fadeTo(100, 0).fadeTo(100, 1.0);

      d3.select("body")
        .on("touchstart", description.hide);

      d3.select(".button.description")
        .on("touchstart", description.show)
        .on("touchstart.prop", function(){ d3.event.stopPropagation(); });
    });
  },

  hide: function(){
    description.topDiv.style.height = "5%";
    console.log("hide");
  },

  show: function(){
    description.topDiv.style.height = donut.measurements.height / 2 + "px";
    console.log("show");
  }


}
