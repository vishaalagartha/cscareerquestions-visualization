import * as d3 from 'd3'
import data from './data.csv'

let svg
const margin = {top: 100, right: 10, bottom: 50, left: 60},
      width = 1300 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom

const barplot = (data, independent) => {
  const chart = svg.append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('transform',`translate(${margin.left},${margin.top})`)

  const counts = {}
  data.forEach(el => {
    el = el.trim().split(', ')
    el.forEach(x => {
      if(x.length>3)
        counts[x] = counts[x] ? counts[x]+1 : 1
    })
  })

  const freq = []
  for( const [key, value] of Object.entries(counts) ){
    freq.push({x: key, count: value})
  }

  const x = d3.scaleBand()
      .range([0, width])
      .domain(freq.map(f => f.x))
      .padding(0.2)

  const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(freq, d => d.count)])

  chart.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x).ticks(20))

  chart.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')

  chart.selectAll('bar')
       .data(freq)
       .enter()
       .append('rect')
      .attr('x', d => x(d.x))
      .attr('width', x.bandwidth())
      .attr('fill', '#69b3a2')
      .attr('height', d => height - y(0))
      .attr('y', y(0))
      .transition()
      .duration(2000)
      .attr('height', d => height - y(d.count))
      .attr('y', d => y(d.count))
      
  chart.selectAll('barText')
      .data(freq)
      .enter()
      .append('text')
      .text(d => d.count)
      .attr('x', d => x(d.x)+x.bandwidth()/2-10)
      .attr('y', d => y(d.count)-10)

  svg.append('text')
       .text(`Frequency of different ${independent}`)
       .attr('transform', `translate(${width/2-50}, 20)`)

  svg.append('text')
       .text(`${independent}`)
       .attr('transform', `translate(${width/2-50}, ${height+margin.top+margin.bottom-5})`)

  svg.append('text')
       .text('Counts')
       .attr('transform', `translate(${margin.left-30}, ${height/2+margin.top})rotate(-90)`)

}


const bubble = (data, independent) => {
  const chart = svg.append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('transform',`translate(${margin.left},${margin.top})`)

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const counts = {}
  data.forEach(el => {
    el = el.trim().split(', ')
    el.forEach(x => {
      if(x.length>3)
        counts[x] = counts[x] ? counts[x]+1 : 1
    })
  })

  const freq = []
  for( const [key, value] of Object.entries(counts) ){
    freq.push({x: key, count: value})
  }

  const dataset = {children: freq}

  const bubble = d3.pack(dataset)
              .size([width, height])
              .padding(10)

  const nodes = d3.hierarchy(dataset)
            .sum(d => d.count)


  const node = chart.selectAll('.node') 
                    .data(bubble(nodes).descendants().slice(1))
                    .enter()
                    .append('g')
                    .attr('class', 'node')
                    .attr('transform', d => `translate(${d.x}, ${d.y})`)


  node.append('circle')
    .attr('r', 0)
    .style('fill', (d, i) => color(i)) 
    .style('stroke', 'black') 
    .transition()
    .duration(2000)
    .attr('r', d => d.r)

  node.append('text')
      .text(d => d.data.x+ ': ' + d.data.count)
      .style('font-size', d => d.data.count>10 ? '18 px' : '8px')
      .style('text-anchor', 'middle')

  svg.append('text')
       .text(`${independent} Counts`)
       .attr('transform', `translate(${width/2-50}, ${margin.top})`)


}

const histogram = (x, y, independent, type) => {
  const chart = svg.append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('transform',`translate(${margin.left},${margin.top})`)

  const hist = d3.histogram()
  const bins = hist(x)

  const xScale = d3.scaleLinear()
                  .domain([0, d3.max(x)])
                  .range([0, width])

  const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, d => d.length)])
  
  chart.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale).ticks(20))

  chart.append('g')
        .call(d3.axisLeft(yScale))

  chart.selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
          .attr('x', 1)
          .attr('transform', d => `translate(${xScale(d.x0)},${0})`)
          .attr('width', d => xScale(d.x1)-xScale(d.x0)-1)
          .style('fill', 'steelblue')
          .attr('y', height)
          .transition()
          .duration(2000)
          .attr('y', d => yScale(d.length))
          .attr('height', d => height - yScale(d.length))
  chart.selectAll('rectText')
      .data(bins)
      .enter()
      .append('text')
      .text(d => d.length)
      .attr('x', d => xScale(d.x0)+(xScale(d.x1)-xScale(d.x0))/2-10)
      .attr('y', d => yScale(d.length)-10)

  svg.append('text')
       .text(`Distribution of different ${independent}'s`)
       .attr('transform', `translate(${width/2-50}, 20)`)

  svg.append('text')
       .text(independent==='Age' ? `${independent} (yrs)` : `${independent} (months)`)
       .attr('transform', `translate(${width/2-50}, ${height+margin.top+margin.bottom-5})`)

  svg.append('text')
       .text('Frequency')
       .attr('transform', `translate(${margin.left-30}, ${height/2+margin.top})rotate(-90)`)

}

const boxplot = (x, y, independent, dependent) => {
  const chart = svg.append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('transform',`translate(${margin.left},${margin.top})`)
  const data = []
  for(let i=0; i<x.length; i++)
    data.push({x: x[i], y: y[i]})
  const dataset = d3.nest()
                    .key(d => d.x)
                    .rollup(d => {
                      const q1 = d3.quantile(d.map(d => d.y).sort(d3.ascending),.25)
                      const median = d3.quantile(d.map(d => d.y).sort(d3.ascending),.5)
                      const q3 = d3.quantile(d.map(d => d.y).sort(d3.ascending),.75)
                      const iqr = q3 - q1
                      const min = q1 - 1.5 * iqr
                      const max = q3 + 1.5 * iqr
                      return {q1, median, q3, iqr, min, max}
                    })
                    .entries(data)
  const yScale = d3.scaleLinear()
      .domain([d3.min(dataset, d=>d.value.min),d3.max(data, d=>d.y)])
      .range([height, 0])

  const xScale = d3.scaleBand()
    .domain(dataset.map(d => d.key))
    .range([0,width])
    .paddingInner(1)
    .paddingOuter(.5)

  chart.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale))
       .selectAll('text')
       .text(function(d, i){
          if(i%2===0)
            return d
          return ''
       })

  chart.append('g')
        .call(d3.axisLeft(yScale))

  chart.selectAll('lines')
      .data(dataset)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.key))
      .attr('x2', d => xScale(d.key))
      .attr('y1', d => yScale(d.value.min))
      .attr('y2', d => yScale(d.value.max))
      .attr('stroke', 'black')
      .style('width', 40)
      .style('opacity', 0)
      .transition()
      .duration(2000)
      .style('opacity', 1)

  const boxWidth = 20
  chart.selectAll('.box')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => (xScale(d.key)-boxWidth/2))
        .attr('y', d => yScale(d.value.q3))
        .attr('height', d => (yScale(d.value.q1)-yScale(d.value.q3)))
        .attr('width', boxWidth )
        .attr('stroke', 'black')
        .style('fill', '#69b3a2')
        .style('opacity', 0)
        .transition()
        .duration(2000)
        .style('opacity', 1)

  chart.selectAll('.median')
      .data(dataset)
      .enter()
      .append('line')
      .attr('x1', d => (xScale(d.key)-boxWidth/2))
      .attr('x2', d => (xScale(d.key)+boxWidth/2))
      .attr('y1', d => yScale(d.value.median))
      .attr('y2', d => yScale(d.value.median))
      .attr('stroke', 'black')
      .style('width', 80)
      .style('opacity', 0)
      .transition()
      .duration(2000)
      .style('opacity', 1)

  const jitterWidth = 10
  chart.selectAll('indPoints')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x) - jitterWidth/2 + Math.random()*jitterWidth)
      .attr('cy', d => yScale(d.y))
      .attr('r', 2)
      .style('fill', 'white')
      .attr('stroke', 'black')
      .style('opacity', 0)
      .transition()
      .duration(2000)
      .style('opacity', 1)

  svg.append('text')
       .text(`${dependent} for different ${independent}`)
       .attr('transform', `translate(${width/2-50}, 20)`)

  svg.append('text')
       .text(independent==='Age' ? `${independent} (yrs)` : `${independent} (months)`)
       .attr('transform', `translate(${width/2-50}, ${height+margin.top+margin.bottom-5})`)

  svg.append('text')
       .text(dependent+' (thousands, USD)')
       .attr('transform', `translate(${margin.left-40}, ${height/3})rotate(-90)`)
        .style('text-anchor', 'end')
}

const scatter = (x, y, independent, dependent) => {
  const data = []
  for(let i=0; i<x.length; i++)
    data.push({x: x[i], y: y[i]})
  const chart = svg.append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('transform',`translate(${margin.left},${margin.top})`)

  const xScale = d3.scaleLinear()
                  .domain([-1, d3.max(data, d => d.x)])
                  .range([0, width])

  const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.y)])

  chart.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale).ticks(20))

  chart.append('g')
        .call(d3.axisLeft(yScale))


  chart.selectAll('.point')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .style('opacity', 0)
        .transition()
        .duration(2000)
        .style('opacity', 1)

  svg.append('text')
       .text(`${dependent} for different ${independent}`)
       .attr('transform', `translate(${width/2-100}, 20)`)

  svg.append('text')
       .text(independent==='Age' ? `${independent} (yrs)` : `${independent} (months)`)
       .attr('transform', `translate(${width/2-40}, ${height+margin.top+margin.bottom-5})`)
        .style('text-anchor', 'middle')

  svg.append('text')
       .text(dependent+' (thousands, USD)')
       .attr('transform', `translate(${margin.left-40}, ${height/3})rotate(-90)`)
        .style('text-anchor', 'end')
}


export const renderChart = (independent, dependent, type, chartType) => { 
  d3.select('svg')
    .remove()

  svg = d3.select('#chart')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)

  d3.csv(data)
    .then(data => {
      let x
      if(type==='categorical')
        x = data.map(d => d[independent]).map(x => x.length===0 ? 'Unspecified' : x).map(x => x.length>12 ? x.substring(0, 12)+'...' : x)
      else{
        x = data.map(d => parseInt(d[independent])).sort((a, b) => a-b)
      }
      const y = data.map(d => parseFloat(d[dependent]))//.map(y => isNaN(y) ? 0 : y)
      switch(chartType){
        case 'Barplot':
          barplot(x, independent, type)
          break
        case 'Bubble':
          bubble(x, independent, type)
          break
        case 'Histogram':
          histogram(x, y, independent, type)
          break
        case 'Boxplot':
          boxplot(x, y, independent, dependent, type)
          break
        case 'Scatter':
          scatter(x, y, independent, dependent, type)
          break
        default:
          break
      }
    })
}
