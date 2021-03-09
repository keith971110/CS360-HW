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
    var mindeath = Infinity
    var maxcase = 0, mincase = Infinity
    var maxrate = 0, minrate = Infinity
    for (var ck of datamapkeys) {
        var keydata = d3.group(datamap.get(ck), d => d.date)
        var ks = Array.from(keydata.keys())
        for (var k of ks) {
            var kdata = keydata.get(k)
            var deathnum = 0
            var casenum = 0
            var ratenum = 0
            for (var i = 0; i < kdata.length; i++) {
                deathnum = deathnum + parseInt(kdata[i].Deaths)
                casenum = casenum + parseInt(kdata[i].Cases)
                ratenum = ratenum + parseFloat(kdata[i].Rate)
            }
            if (deathnum > maxdeath) maxdeath = deathnum
            if (deathnum < mindeath) mindeath = deathnum
            if (maxcase < casenum) maxcase = casenum
            if (casenum < mincase) mincase = casenum
            if (maxrate < ratenum) maxrate = ratenum
            if (ratenum < minrate) minrate = ratenum
            keydata.set(k, { Deaths: deathnum, Cases: casenum, Rate: ratenum })
        }
        keydata = Array.from(keydata)
        datamap.set(ck, keydata)
    }
    var Datemap = d3.group(data, d => d.date)
    var dateArray = Array.from(Datemap.keys())
    dateArray.sort(function (a, b) {
        return new Date(a) > new Date(b) ? 1 : -1
    })
    var svg = d3.select('#matrix-chart')
    var width = svg.attr('width')
    var height = svg.attr('height')
    var margin = {
        left: 20,
        top: 20,
        childs_w: (width - 100) / 3,
        childs_h: (height - 100) / 3
    }
    var datescalex = d3.scaleTime()
        .domain([new Date("2019-12-31"), new Date("2020-11-5")])
    var datescaley = d3.scaleTime()
        .domain([new Date("2019-12-31"), new Date("2020-11-5")])
    var deathscalex = d3
        .scaleLinear()
        .domain([mindeath, maxdeath])
    var deathscaley = d3
        .scaleLinear()
        .domain([mindeath, maxdeath])
    var casescalex = d3.scaleLinear().domain([mincase, maxcase])
    var casescaley = d3.scaleLinear().domain([mincase, maxcase])
    var colorArray = [d3.schemeCategory10, d3.schemeAccent];
    var colorScheme = d3.scaleOrdinal(colorArray[0]);
    drawAxis(datescalex, datescaley, 0, 0,'date','date')
    drawAxis(deathscalex, deathscaley, 1, 1,'Deaths','Deaths')
    drawAxis(casescalex, casescaley, 2, 2,"Cases","Cases")
    dramatrix(datescalex, deathscaley, 0, 1,'date','Deaths')
    dramatrix(deathscalex, datescaley, 1, 0,'Deaths','date')
    dramatrix(datescalex, casescaley, 0, 2,'date','Cases')
    dramatrix(casescalex, datescaley, 2, 0,'Cases','date')
    drawAxis(deathscalex, casescaley, 1, 2,'Deaths','Cases')
    drawAxis(casescalex, deathscaley, 2, 1,'Cases','Deaths')
    svg.append('g')
    .selectAll('circle')
    .data(Array.from(datamap.keys()))
    .enter()
    .append('circle')
    .attr('cx',width-margin.left*3-20)
    .attr('cy',function(d,i){
        return margin.top*5+i*20
    })
    .attr('r',5)
    .attr('fill',(d,i)=>colorScheme(i))
    svg.append('g')
    .selectAll('text')
    .data(Array.from(datamap.keys()))
    .enter()
    .append('text')
    .attr('x',width-margin.left*3-10)
    .attr('y',function(d,i){
        return margin.top*5+i*20+5
    })
    .text((d)=>d)
    function drawAxis(xscale, yscale, xi, yi,xs,ys) {
        xscale.range([margin.left, margin.childs_w - margin.left])
        yscale.range([margin.childs_h - margin.top, margin.top])
        svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + (margin.left*4 + margin.childs_w * xi) + "," + (margin.childs_h - margin.top + margin.childs_h * 2) + ")")
            .call(d3.axisBottom(xscale));
        svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (margin.left * 5) + "," + margin.childs_h * yi + ")")
            .call(d3.axisLeft(yscale));
        svg.append('text').text(xs).attr("transform", "translate(" + (margin.childs_w/ 2 + margin.childs_w * xi) + "," + (margin.childs_h+margin.top + margin.childs_h * 2) + ")")
        svg.append('text').text(ys)
        .attr("transform", "translate(" + 0 + "," +(margin.childs_h * yi+margin.childs_h/2)+ ")")
        dramatrix(xscale, yscale, xi, yi,xs,ys)
    }
    function dramatrix(xscale, yscale, xi, yi,xs,ys){
        xscale.range([margin.left, margin.childs_w - margin.left])
        yscale.range([margin.childs_h - margin.top, margin.top])
        svg.append('g').selectAll('g')
        .data(Array.from(datamap.keys()))
        .enter()
        .append('g')
        .attr('fill',function(d,i){
            return colorScheme(i)
        })
        .selectAll('circle')
        .data(function(d){
            return datamap.get(d)
        })
        .enter()
        .append('circle')
        .attr("transform", "translate(" + (margin.left*4 + margin.childs_w * xi) + "," +margin.childs_h * yi+ ")")
        .attr('cx',function(d){
            if(xs=='date')
            return xscale(new Date(d[0]))
            else return xscale(d[1][xs])
        })
        .attr('cy',function(d){
            if(ys=='date')
            return yscale(new Date(d[0]))
            else return yscale(d[1][ys])
        })
        .attr('r',2)
    }
})