
var deaths = d3.csv("journalistsKilled.csv")
var govType = d3.csv("govType.csv")
var countryPop = d3.csv("countryPop.csv")
var geoJson = d3.json("custom.geo.json")

var runCode = function(deaths, govType, countryPop, geoJson, year){

Promise.all([deaths, govType, countryPop, geoJson]).then(function(values)
{
  var deathData = values[0]
  var govData = values[1]
  var popData = values[2]
  var geoData = values[3]

//var years = ['1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018',]

var countriesDeath = makeCountryData(deathData)
var countriesGov = makeCountryData(govData)
var countriesPop = makeCountryData(popData)


geoData.features.forEach(function(feature){

  Object.keys(countriesDeath).forEach(function(country){
    if (feature.properties.name == country){
    feature.properties.deaths = countriesDeath[country][country]
    }
  /*  else{
      console.log('not found', feature.properties.name)
    }*/
  })
  })

  geoData.features.forEach(function(feature){

    Object.keys(countriesGov).forEach(function(country){
      if (feature.properties.name == country){
      feature.properties.gov = countriesGov[country][country]
      }
    /*  else{
        console.log('not found', feature.properties.name)
      }*/
    })
    })
    geoData.features.forEach(function(feature){
      //console.log('country', feature.properties.name)
      Object.keys(countriesPop).forEach(function(country){
        if (feature.properties.name == country){
        feature.properties.pop = countriesPop[country][country]
        }
      /*  else{
          console.log('not found', feature.properties.name)*/
      })
      })
     drawMap(geoData, year)
  })
}



var drawMap = function(geoData, year){
  var screen = {width:1500,height:1000}
    //create Projection
    //var projection = d3.geoAlbersUsa()
    //                  .translate([screen.width/2,screen.height/2]);


var proj = d3.geoConicEqualArea().translate([screen.width/2, screen.height/2]).scale([250])

    var geoPath = d3.geoPath()
    .projection( proj );


    var svg = d3.select("svg")
                .attr("width",screen.width)
                .attr("height",screen.height);

                var nations = svg.append("g")
                  .selectAll("g")
                  .data(geoData.features)
                  .enter()
                  .append("g")
//made it
console.log(geoData.features)
                  nations.append("path")
                  .attr("d",geoPath)
                  .attr("stroke","black")
                  .attr("fill", function(d){
                    console.log(d.properties.name)
                    if (d.properties.pop ){

                    var value = d.properties.pop[year]
                    if(value){
                      console.log('pop', value,  d.properties.name)
                      return color(value)
                    }
                    else {
                      return "red"
                    }}
                  });


/*    var nations = svg.append("g")
      .selectAll("g")
      .data(geoData.features)
      .enter()
      .append("g")
      nations.append("path")
      .attr("d",geoPath)
      .attr("stroke","black")
      .attr("fill", function(d){
        var value = d.properties.pop[year]
        console.log(d.properties.pop[year])
        if(value){
          return color(value)
        }
        else {
          return "#ccc"
        }
      });*/
};
var reds = ['red1','red2','red3','red4','red5',]
var color = d3.scaleQuantize().range(reds)


//create a dictionary for the data of every country given the year
var parseData = function(data, country){

      var dataDict = {}
      data.forEach(function(state){
        if (state['Country'] == country){
          dataDict[country] = state
        }
      })
  return dataDict
}

var makeCountryData = function(data){
      var countriesData = {}
      data.forEach(function(state){
          countriesData[state["Country"]] = parseData(data, state['Country'])
      })
      return countriesData
}
