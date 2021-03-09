d3.csv('covid.csv', function (d) {
    return {
        date: d['Date.Year'] + '-' + d['Date.Month'] + '-' + d['Date.Day'],
        Cases: d['Data.Cases'],
        Deaths: d['Data.Deaths'],
        Population: d['Data.Population'],
        Rate: d['Data.Rate'],
        Code: d['Location.Code'],
        Continent: d['Location.Continent'],
        Country: d['Location.Country']
    }
}).then(function (data) {
    var datamap = d3.group(data, d => d.Continent)
    var datamapkeys = Array.from(datamap.keys())
    var maxdeath = 0
    var min = Infinity
    for (var ck of datamapkeys) {
        var keydata = d3.group(datamap.get(ck), d => d.date)
        var ks = Array.from(keydata.keys())
        for (var k of ks) {
            var kdata = keydata.get(k)
            var num = 0
            for (var i = 0; i < kdata.length; i++) {
                num = num + parseInt(kdata[i].Deaths)
            }
            if (num > maxdeath) maxdeath = num
            if (num < min) min = num
            keydata.set(k, num)
        }
        keydata = Array.from(keydata)
        keydata.sort(function (a, b) {
            return new Date(a[0]) > new Date(b[0]) ? 1 : -1
        })
        datamap.set(ck, keydata)
    }
    var Datemap = d3.group(data, d => d.date)
    var dateArray = Array.from(Datemap.keys())
    dateArray.sort(function (a, b) {
        return new Date(a) > new Date(b) ? 1 : -1
    })
    console.log(datamap)
    var svg = d3.select('#line-chart')
    var width = svg.attr('width')
    var height = svg.attr('height')
    var margin = {
        left: 20,
        top: 20
    }
    var xscale = d3.scaleTime()
        .domain([new Date("2019-12-31"), new Date("2020-11-5")])
        .range([margin.left, width - margin.left * 12])

    var yscale = d3
        .scaleLinear()
        .domain([min, maxdeath])
        .range([height - margin.top * 2, margin.top])
    var line = d3
        .line()
        .x(function (d) {
            return xscale(new Date(d[0]));
        }) // set the x values for the line generator
        .y(function (d) {
            if (yscale(d[1]) > height - margin.top * 2) console.log(d)
            return yscale(d[1]);
        }) // set the y values for the line generator
    var colorArray = [d3.schemeCategory10, d3.schemeAccent];
    var colorScheme = d3.scaleOrdinal(colorArray[0]);
    var formatTime = d3.timeFormat("%B%y");

    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left*4+ "," + (height - margin.top * 2) + ")")
        .call(d3.axisBottom(xscale).tickFormat(formatTime));
    svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left*5 + ",0)")
        .call(d3.axisLeft(yscale));
    var line_g = svg.append('g')
    line_g.selectAll('path').data(Array.from(datamap.keys())).enter()
        .append("path")
        .attr("class", "cline")
        .attr("transform", "translate(" + margin.left*4 + ",0)")
        .attr("d", function (d) {
            var linedata = datamap.get(d)
            return line(linedata);
        })
        .attr('stroke', function (d, i) {
            return colorScheme(i)
        });
        line_g.selectAll('text')
        .data(Array.from(datamap.keys()))
        .enter()
        .append("text").text(d=>d)
        .attr("transform", function(d,i){
            return "translate(" + (width- margin.left*5) + ","+(margin.top * 2+20*i)+")"
        })
        .attr('fill',(d,i)=>colorScheme(i))
        svg.append('text').text('Date').attr('x',width/2+margin.left).attr('y',height)
    svg.append('text').text('Deaths').attr('x',0).attr('y',height/2)
})