d3.csv('./covid.csv', function (d) {
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
    var svg = d3.select('#Bubble-chart')
    var width = svg.attr('width')
    var height = svg.attr('height')
    var margin = {
        left: 20,
        top: 20
    }
    var Countrymap = d3.group(data, d => d.Country)
    var Datemap = d3.group(data, d => d.date)
    var dateArray = Array.from(Datemap.keys())
    dateArray.sort(function (a, b) {
        return new Date(a) > new Date(b) ? 1 : -1
    })
    var Countrys=["United_States_of_America","India","United_Kingdom","Brazil","Russia"]
    var colors=["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"]
    
    var casemax = 0
    var deathmax=0
    for(var i=0;i<Countrys.length;i++){
        var s=d3.max(Countrymap.get(Countrys[i]),function(d){
            return parseInt(d.Cases)
        })
        var d=d3.max(Countrymap.get(Countrys[i]),function(d){
            return parseInt(d.Deaths)
        })
        if(s>casemax)casemax=s
        if(d>deathmax)deathmax=d
    }
    var xscale = d3.scaleTime()
        .domain([new Date(dateArray[0]), new Date(dateArray[dateArray.length - 1])])
        .range([margin.left, width - margin.left*12])

    var yscale = d3
        .scaleLinear()
        .domain([0, casemax])
        .range([height - margin.top*2, margin.top])
    var rscale=d3
    .scaleLinear()
    .domain([0, deathmax])
    .range([0,40])
    var formatTime = d3.timeFormat("%B%y");
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left*3+"," + (height - margin.top*2) + ")")
        .call(d3.axisBottom(xscale).tickFormat(formatTime));
    svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left*4 + ",0)")
        .call(d3.axisLeft(yscale));
    svg.append('g').selectAll('g').data(Countrys).enter().append('g').attr('fill',function(d,i){
        return colors[i]
    })
    .selectAll('circle')
    
    .data(function(d){
        return Countrymap.get(d)
    })
    .enter()
    .append('circle')
    .attr('cx',function(d){
        return xscale(new Date(d.date))
    })
    .attr('cy',function(d){
        return yscale(parseInt(d.Cases))
    })
    .attr('r',function(d){
        return rscale(parseInt(d.Deaths))
    })
    .attr('opacity',0.5)
    svg.append('text').text('Date').attr('x',width/2+margin.left).attr('y',height)
    svg.append('text').text('Case').attr('x',0).attr('y',height/2)
    svg.append('g')
    .selectAll('circle')
    .data(Countrys)
    .enter()
    .append('circle')
    .attr('cx',width-margin.left*7-20)
    .attr('cy',function(d,i){
        return margin.top+i*15
    })
    .attr('fill',(d,i)=>colors[i])
    .attr('r',5)
    svg.append('g')
    .selectAll('text')
    .data(Countrys)
    .enter()
    .append('text')
    .attr('x',width-margin.left*6-30)
    .attr('y',function(d,i){
        return margin.top+i*15+2
    })
    .attr('font-size',10)
    .text((d)=>d)
    var b_g=svg.append('g')
    b_g
    .append('circle')
    .attr('cx',width-margin.left*7-20)
    .attr('cy',margin.top*6)
    .attr('r',10)
    .attr('fill','blue')
    b_g
    .append('text')
    .attr('x',width-margin.left*6-30)
    .attr('y',margin.top*6+5)
    .text("Cirle Size is Deaths")
})