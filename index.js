//This code is based on https://bl.ocks.org/mbostock/4063269 by Mike Bostocks

//Variable svg wich selects the svg from the DOM. Later it can be used to set attributes, styles, properties, HTML etc.
var svg = d3.select("svg"),
//Variable width width and height. The + makes from te string a number. You could use the Number() function but with rendering + is most times slightly faster. (https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls)
    width = +svg.attr("width"),
    height = +svg.attr("height")

//The format makes all data readable for humans. The ,d is used for decimal notation, rounded to integer. So it gives commas to numbers higher than 1000.
var format = d3.format(",d")

//This variable sets the color of all the circles. This can be changed with a lot of colors shown here: https://github.com/d3/d3-scale-chromatic
var color = d3.scaleOrdinal(d3.schemeCategory20)

//d3.pack is used to make the circles and add information to them.
var pack = d3.pack()
    .size([width, height])
    .padding(1.5)

//This loads the given data
d3.tsv("languages.tsv", function(d) {
//d.speaker is a string ("290000000") with the + it makes an number 290000000
  d.speakers = +d.speakers
//When there is a number it returns the number
  if (d.speakers) return d
//Error handling
}, function(error, classes) {
  if (error) throw error
//d3.hierarchy is to have a hierachal layout with bigger and smaller circles.
  var root = d3.hierarchy({children: classes})
//This sum returns the amount of data is in the array of speakers
      .sum(function(d) { return d.speakers })
//For each row in the dataset it gives some variables with information about that data.
      .each(function(d) {
//sets language to the language and makes some classes with information about the language
        if (language = d.data.language) {
          var language, i = language.lastIndexOf(".")
          d.language = language
          d.package = language.slice(0, i)
          d.class = language.slice(i + 1)
        }
      })

//Node selects all the elements with class node and appends g to it.
  var node = svg.selectAll(".node")
//Checks how many g's it has to append to the svg. (In this case 26). Give the meta data through.
    .data(pack(root).leaves())
    .enter().append("g")
//Give two attributes. One as al class and the second to determine where the circle has to go.
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
//Start an animation if a certain amount of time is over. The time is calculated with the radius of the circle divided by 100. It returns seconds.
      .style("animation-delay", function(d) {
        return d.r/100 + "s" })

//Add circle inside the svg and the g
  node.append("circle")
//Give a attribute with language, r (radius) and the color of the circle. (Defined by the color variable)
      .attr("language", function(d) { return d.language })
      .attr("r", function(d) { return d.r })
      .style("fill", function(d) { return color(d.package) })

//Append a text element to the circle and after that make a tspan with the text inside.
  node.append("text")
    .selectAll("tspan")
//Split the data so it can be used in folowing steps
    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g) })
    .enter().append("tspan")
//Give location to the text. In the middle of the circle. y is calculated with the amount of words there are. When there are two words it will go to a second line.
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10 })
//Add text to the function. The text is the class name. In this case the class name is the language.
      .text(function(d) { return d })

//Add a title. When you hover over the circles you see the exact information.
  node.append("title")
      .text(function(d) { return d.language + "\n" + format(d.value) + " people" })

})
