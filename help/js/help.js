//Main object that holds functions that deal with positioning sizing of inititial
//help and title of a visualizations. Default state is visibile when the user
//first views the visualization.
var help = {


  //object to hold elements of the help.
  elem: {},


  //object to hold meaurements
  meas: {},


  //property to keep track of if the help is hidden or not
  hidden: true,


  //property that records if user has interacted yet (help is hidden after 5 sec if user does not interact)
  //interaction: false,



  /**
   * setUp
   *   Initial function that uses jquery to wait until the page is ready before
   *   defining element properties as well as establishing a timeout function to
   *   draw attention to the button after a certain amount of time, and attach
   *   other event listeners to the elements
   *
   * @param {object} vis - The object that the help description is being applied to
   */
  setUp: function(vis){

      console.log(vis);

      help.vis = vis;


      help.meas.height = document.documentElement.clientHeight;  //stores document height

      help.addElements();

      //help.elem.helpDiv = document.getElementsByClassName("help-text")[0];  //store help ('help') div reference
      //help.elem.helpDiv = "red";
      help.elem.button = document.getElementsByClassName("button help")[0];  //store hide/show button reference

      help.fillText();



      //Touch ANYWHERE within help will close it
      d3.select(help.elem.helpDiv)  //D3, select help ('top') div
        .on("touchstart", function(){  //bind touch event
          d3.event.stopPropagation();
          //if( !help.hidden ){  //if help is showing
          //  help.hide();  //hide the help
          //}
        });

      //Touch ANYWHERE within help will close it
      d3.select(help.elem.close)  //D3, select help ('top') div
        .on("touchstart", function(){  //bind touch event
          //d3.event.stopPropagation();
          if( !help.hidden ){  //if help is showing
            help.hide();  //hide the help
          }
        });


      d3.select(help.elem.button)  //D3, select hide/show button
        .on("touchstart", function(){  //bind touch event
          console.log("touched");
          if(help.hidden){  //if help is currently hidden
            help.show();  //show the help
          }else{  //if the help is currently showing
            help.hide();  //hide the help
          }

          d3.select(this).attr("id", "active");
        })
        .on("touchstart.cancel", function() { d3.event.stopPropagation(); })
        .on("touchend",   function(){d3.select(this).attr("id", null);});
  },


  /**
   * addElements
   *   Creates div to hold all help explanations ('help-text') and a close button.
   *   Creating here and adding to the DOM allows 'help.js' to be properly applied
   *   to many different visualization without editing the 'index.html' of each vis.
   */
  addElements: function(){
    var div = document.createElement("div");
    var p = document.createElement("p");
    help.elem.helpDiv = div; //save reference to main div to be used later
    help.elem.close = p; //save reference to 'help-close' <p> element to be used later

    div.className = "help-text";
    p.className = "help-close";

    p.innerHTML = "&#215;";
    div.appendChild(p);
    document.body.appendChild(div);
  },



  /**
   * checkInteraction
   *   called after a delay when the document is ready, checks the help.interaction
   *   property to see if the user has interacted with the help yet. If they
   *   HAVE interacted then this function does nothing, if they HAVE NOT interacted
   *   then this function calls 'help.hide()'
   */

  /*

  checkInteraction: function(){
    if(!help.interaction){  //if user has not interacted with help
      help.hide();  //hide the help
    }
  },

  */


  /**
   * fillText
   *   Function to get information from the main visualization object that was passed
   *   in and saved as help.vis
   */
  fillText: function() {
    var vis = help.vis;
    console.log(vis.helpDescription);
    var title = document.createElement("h2");
    title.className = "help-title";
    title.innerHTML = "Help";

    var description = document.createElement("p")
    description.className = "help-description";

    var list = document.createElement("ol");

    //for( var i = 0; i < vis.helpDescription.length; i++ ) {
    for (var i in vis.helpDescription) {
      console.log(vis.helpDescription[i].text);
      console.log(vis.helpDescription[i].image);

      var text = document.createElement("li");
      text.innerHTML = vis.helpDescription[i].text;

      var image = document.createElement("img");
      image.setAttribute("src",vis.helpDescription[i].image);

      list.appendChild(text);
      list.appendChild(image);
    }

    description.appendChild(list);

    console.log(help);
    console.log(help.elem.helpDiv);

    help.elem.helpDiv.appendChild(title);
    help.elem.helpDiv.appendChild(description);
  },



  /**
   * hide
   *   Function to hide the help after the user interacts with the div or
   *   the button. Shrinks the div, changes the opacity of the directions so they
   *   are no longer visible, and moves the button to the top right area of the screen
   */
  hide: function() {
    help.elem.helpDiv.style.height = "0%";

    if (typeof jQuery == 'undefined') {
      help.elem.helpDiv.scrollTop = 0;
    } else {
      $( ".help-text" ).animate({scrollTop: 0}, 500);
    }

    help.hidden = true;
  },



  /**
   * show
   *   Function to show the descriptions after the user hits the button when the
   *   help is hidden. Expands the div, changes the opacity of the directions
   *   so they are visible, and moves the button to the lower middle area of the div
   */
  show: function() {
    //help.fillText();

    if (help.vis.current.active) {
      help.vis.leavePath(help.vis.current.d, help.vis.current.touched);
    }

    if (!description.hidden) {
      description.hide();
    }

    help.elem.helpDiv.style.height = "75%";

    help.hidden = false;
  }
}
