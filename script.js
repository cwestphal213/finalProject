
var deaths = d3.csv("journalistsKilled.csv")
var govType = d3.csv("govType.csv")
var countryPop = d3.csv("countryPop.csv")
var geoJson = d3.json("custom.geo.json")


Promise.all([deaths, govType, countryPop, geoJson]).then(function(values)
{
  var deathData = values[0]
  var govData = values[1]
  var popData = values[2]
  var geoJson = values[3]

var countriesDeath = makeCountryData(deathData)
var countriesGov = makeCountryData(govData)
var countriesPop = makeCountryData(popData)





geoJson.features.forEach(function(feature){

  Object.keys(countriesDeath).forEach(function(country){
    if (feature.properties.name = country){
    feature.properties.deaths = countriesDeath[country][country]
    }
    else{
      console.log('not found', feature.properties.name)
    }
  })
  })

  geoJson.features.forEach(function(feature){

    Object.keys(countriesGov).forEach(function(country){
      if (feature.properties.name = country){
      feature.properties.gov = countriesGov[country][country]
      }
      else{
        console.log('not found', feature.properties.name)
      }
    })
    })

    geoJson.features.forEach(function(feature){

      Object.keys(countriesPop).forEach(function(country){
        if (feature.properties.name = country){
        feature.properties.pop = countriesPop[country][country]
        }
        else{
          console.log('not found', feature.properties.name)
        }
      })
      })
      console.log('made it')
      drawMap(geoJson, '1996')
      console.log('made it end')
  })


var drawMap = function(geoData, year){
  var screen = {width:1500,height:1000}
    //create Projection
    //var projection = d3.geoAlbersUsa()
    //                  .translate([screen.width/2,screen.height/2]);
console.log('made it 2')
    var geoPath = d3.geoPath()
    .projection( d3.albersProjection );


    var svg = d3.select("svg")
                .attr("width",screen.width)
                .attr("height",screen.height);

      console.log('made it 3')

    var nations = svg.append("g")
      .selectAll("g")
      .data(geoData.features)
      .enter()
      .append("g")

      nations.append("path")
      .attr("d",geoPath)
      .attr("stroke","black")
      .attr("fill","none");

console.log('made it 4')
};



//create a dictionary for the data of every country given the year
var parseData = function(data, country){

      var dataDict = {}
      data.forEach(function(state){
        if (state['Country'] == country){
          dataDict[country] = state
        }
      })
      console.log('made it parse')
  return dataDict
}

var makeCountryData = function(data){
      var countriesData = {}
      data.forEach(function(state){
          countriesData[state["Country"]] = parseData(data, state['Country'])
      })
      console.log('made it countryData')
      return countriesData
}
