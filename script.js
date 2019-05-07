
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
  var screen = {width:1200,height:800}
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
var reds = ['RGB(255, 236, 25)','RGB(255, 193, 0)','RGB(255, 152, 0)','RGB(255, 86, 7)','RGB(246, 65, 45)']
var govColors = ['crimson', 'orange', 'darkturquoise', 'dodgerblue']

var govColor = d3.scaleOrdinal()
                  .domain(['Authoritarian regimes','Hybrid Regime','Flawed Democracy', 'Democracy'])
                  .range(govColors)

  var popColor = d3.scaleQuantize()
                .domain([Math.log(9256), Math.log(1386395000)])
                .range(reds);

var deathPopColor = d3.scaleQuantize()
                      .domain([0, 3])
                      .range(reds);

                  /*d3.max(geoData, function(d){

                    if (d.properties.pop){
                      if (d.properties.pop[year]){
                        console.log('in color',d.properties.pop[year])
                      return d.properties.pop[year]}
                    }

                })])*/
        /*        var tooltip = d3.select("body")
                  .selectAll('div')
                  .data(geoData.features)
                  .enter()
                	.append("div")
                	.style("position", "absolute")
                	.style("z-index", "10")
                	.style("visibility", "hidden")
                	.text(function(d){
                    return d.properties.name
                  });*/

console.log(year, geoData.features)
                  nations.append("path")
                  .attr("d",geoPath)
                  .attr("stroke","black")
                  .attr("fill", function(d){
                    console.log(d.properties.name)
                    if (d.properties.pop && d.properties.deaths ){

                    var value = d.properties.deaths[year]/ Math.log(d.properties.pop[year])
                    if(value){
                      max = d3.max(geoData.features, function(d){
                        if (d.properties.pop && d.properties.deaths){
                        return d.properties.deaths[year]/ Math.log(d.properties.pop[year])
                          }
                      })
                      console.log('max', max)
                      return deathPopColor(value)
                    }
                    else {
                      return "Gainsboro"
                    }

                  }
                    else{
                      return "DarkGrey"
                    }

                  })
                  .on("mouseover", function(d){
                    var xPosition = parseFloat(d3.select(this).attr('x'));
                    var yPosition = parseFloat(d3.select(this).attr('y'));
                    d3.select('#tooltip')
                      .style('left', xPosition + 'px')
                      .style('top', yPosition + 'px')
                    d3.select('#tooltip')
                      .select('#year')
                      .text(year)
                    d3.select('#tooltip')
                      .select('#country')
                      .text(d.properties.name)
                      if ( d.properties.pop){
                      d3.select('#tooltip')
                      .select('#pop')
                      .text( d.properties.pop[year])
                      if ( d.properties.gov){
                      d3.select('#tooltip')
                      .select('#gov')
                      .text( d.properties.gov[year])
                    }
                      if (d.properties.deaths){
                      d3.select('#tooltip')
                      .select('#death')
                      .text(d.properties.deaths[year]);
                    }
                    else{
                      d3.select('#tooltip')
                      .select('#death')
                      .text('0');
                    };
                      //must get to here to make unhidden
                      d3.select("#tooltip").classed("hidden", false);
                    }})
                      .on("mouseout", function(){
                        d3.select("#tooltip").classed("hidden", true)
                      })
                /*  .append('title')
                  .text(function(d){
                    return d.properties.name});*/

        nations.append("circle")
                    .attr("cx",function(d) {return geoPath.centroid(d)[0]})
                    .attr("cy",function(d) {return geoPath.centroid(d)[1]})
                    .attr('r', 3)
                    .attr('fill', function(d){
                      if (d.properties.gov && !(d.properties.gov[year] == 'No Data')){

                        return govColor(d.properties.gov[year])
                      }
                      else{
                        return 'black'
                      }
                    })
                    .style('stroke','white');
                    //add tool tip to this element as well

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
