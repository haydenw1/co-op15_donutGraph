//Main object that holds functions that deal with positioning sizing of inititial
//help and title of a visualizations. Default state is visibile when the user
//first views the visualization.
var help = {


  //object to hold elements of the help.
  elem: {},


  //object to hold meaurements
  meas: {},


  //property to keep track of if the help is hidden or not
  hidden: false,


  //property that records if user has interacted yet (help is hidden after 5 sec if user does not interact)
  interaction: false,



  /**
   * setUp
   *   Initial function that uses jquery to wait until the page is ready before
   *   defining element properties as well as establishing a timeout function to
   *   draw attention to the button after a certain amount of time, and attach
   *   other event listeners to the elements
   */
  setUp: function(){
    $( document ).ready(function(){  //jquery, makes sure the document is ready.

      help.meas.height = document.documentElement.clientHeight;  //stores document height

      help.elem.helpDiv = document.getElementsByClassName("help")[0];  //store help ('top') div reference
      help.elem.button = document.getElementsByClassName("button help")[0];  //store hide/show button reference

      //help.elem.buttonArrow = help.elem.button.childNodes[4];

      //window.setTimeout(help.checkInteraction, 10000);  //timeout to call hide function after a specified time.

      help.elem.helpDiv.style.height = help.meas.height * .75 + "px";  //sets initial height of top div to half the screen size.

      //Touch ANYWHERE within help will close it
      d3.select(help.elem.helpDiv)  //D3, select help ('top') div
        .on("touchstart", function(){  //bind touch event
          if( !help.hidden ){  //if help is showing
            help.hide();  //hide the help
          }
        });

      d3.select(help.elem.button)  //D3, select hide/show button
        .on("touchstart", function(){  //bind touch event
          if(help.hidden){  //if help is currently hidden
            help.show();  //show the help
          }else{  //if the help is currently showing
            help.hide();  //hide the help
          }
        });
    });
  },



  /**
   * checkInteraction
   *   called after a delay when the document is ready, checks the help.interaction
   *   property to see if the user has interacted with the help yet. If they
   *   HAVE interacted then this function does nothing, if they HAVE NOT interacted
   *   then this function calls 'help.hide()'
   */
  checkInteraction: function(){
    if(!help.interaction){  //if user has not interacted with help
      help.hide();  //hide the help
    }
  },



  /**
   * hide
   *   Function to hide the help after the user interacts with the div or
   *   the button. Shrinks the div, changes the opacity of the directions so they
   *   are no longer visible, and moves the button to the top right area of the screen
   */
  hide: function(){
    var directions = help.elem.helpDiv.children[1];
    directions.style.transition = "opacity .5s";

    help.elem.helpDiv.style.height = "5%";
    help.elem.helpDiv.setAttribute("class", "hidden top");

    help.elem.button.setAttribute("class", "hidden button help");
    help.elem.button.style.height = "25px";

    help.elem.buttonArrow.style.transform = "rotate(" + 90 + "deg )";

    help.hidden = true;
    help.interaction = true;
  },



  /**
   * show
   *   Function to show the descriptions after the user hits the button when the
   *   help is hidden. Expands the div, changes the opacity of the directions
   *   so they are visible, and moves the button to the lower middle area of the div
   */
  show: function(){
    //var button = help.elem.button;
    //var helpDiv = help.elem.helpDiv;

    var directions = help.elem.helpDiv.children[1];
    directions.style.transition = "opacity 2.5s";
    //var title = helpDiv.children[0];

    help.elem.helpDiv.style.height = help.meas.height / 2 + "px";
    help.elem.helpDiv.setAttribute("class", "top");

    help.elem.button.setAttribute("class", "button help");
    help.elem.button.style.height = buttons.measurements.buttonWidth;

    help.elem.buttonArrow.style.transform = "rotate(" + 270 + "deg )";

    //directions.style.transition = "opacity 1s";

    help.hidden = false;
  }
}
