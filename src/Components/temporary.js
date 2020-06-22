import * as d3 from 'd3'
import data2 from './data2.csv'

let svg

const salaryHistogram = data => {
  data = data.map(d => d/1000).filter(d => d<500)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const hist = d3.histogram()
  const bins = hist(data)

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left},${margin.top})`)

  const plot = chart.append('g')
                    .attr('width', width + margin.left+20+margin.right)
                    .attr('height', height + margin.top+20+margin.bottom+20)
                   .attr('transform',`translate(${margin.left+10},${margin.top+20})`)

  const x = d3.scaleLinear()
                  .domain([0, d3.max(data)])
                  .range([0, width])

  const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, d => d.length)])
  
  plot.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x))

  plot.append('g')
        .call(d3.axisLeft(y))

  plot.selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
          .attr('x', 1)
          .attr('transform', d => `translate(${x(d.x0)},${0})`)
          .attr('width', d => x(d.x1)-x(d.x0)-1)
          .style('fill', '#69b3a2')
          .attr('y', height)
          .transition()
          .duration(2000)
          .attr('y', d => y(d.length))
          .attr('height', d => height - y(d.length))

  chart.append('text')
       .text('Annual total compensation (<$500k USD)')
       .attr('transform', `translate(100, 20)`)

  chart.append('text')
       .text('Salary (USD, in thousands)')
       .attr('transform', `translate(${width/2-50}, ${height+margin.top+margin.bottom+30})`)

  chart.append('text')
       .text('Counts')
       .attr('transform', `translate(0, ${height/2})rotate(-90)`)

  const div = d3.select('#tooltip')
  chart.selectAll('rect')
       .on('mouseover', (d, i) => {   
          div.transition()   
            .duration(200)   
            .style('opacity', 1)
              const htmlStr = `$${d.x0}-$${d.x1}K`
              div.html(htmlStr)  
                 .style('left', x(d.x0)+85+'px')    
                 .style('top', y(d.length)+margin.top+'px')
                 .style('background', '#f50057') 
            })         
       .on('mouseout', d => {   
           div.transition()   
             .duration(200)   
             .style('opacity', 0)
        })

}

const ethnicityChart = d => {
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left+500},${margin.top})`)

  const counts = {}
  d.forEach(el => {
    el= el.trim().split(', ')
    el.forEach(eth => {
      if(eth.length>3)
        counts[eth] = counts[eth] ? counts[eth]+1 : 1
    })
  })

  const freq = []
  for( const [key, value] of Object.entries(counts) ){
    freq.push({ethnicity: key, count: value})
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
      .text(d => d.data.ethnicity + ': ' + d.data.count)
      .style('font-size', d => d.data.count>10 ? '18 px' : '8px')
      .style('text-anchor', 'middle')

  chart.append('text')
       .text('Ethnicity Distribution')
       .attr('transform', `translate(${width/3}, 20)`)

}

const experienceChart = data => {
  data.forEach(d => d.y = d.y/1000)
  data = data.filter(d => d.y<500)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left},${margin.top+350})`)

  const x = d3.scaleLinear()
                  .domain([-1, d3.max(data, d => d.x)])
                  .range([0, width])

  const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(data, d => d.y)])

  const plot = chart.append('g')
                    .attr('width', width + margin.left+20+margin.right)
                    .attr('height', height + margin.top+20+margin.bottom+20)
                   .attr('transform',`translate(${margin.left+10},${margin.top+20})`)

  plot.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x))

  plot.append('g')
        .call(d3.axisLeft(y))

  plot.selectAll('.point')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')

  chart.append('text')
       .text('Annual total compensation vs. Experience in CS')
       .attr('transform', `translate(50, 20)`)

  chart.append('text')
       .text('Months of experience in CS-related field')
       .attr('transform', `translate(${width/2-50}, ${height+margin.top+margin.bottom+30})`)

  chart.append('text')
       .text('Salary (USD, in thousands)')
       .attr('transform', `translate(0, ${height})rotate(-90)`)

  chart.style('opacity', 0)
       .transition()
       .duration(2000)
       .style('opacity', 1)
}

const currentEmployerChart = data => {
  data.forEach(d => d.y = d.y/1000)
  data = data.filter(d => d.y<500)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left},${margin.top+700})`)

  const x = d3.scaleLinear()
                  .domain([-1, d3.max(data, d => d.x)])
                  .range([0, width])

  const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(data, d => d.y)])

  const plot = chart.append('g')
                    .attr('width', width + margin.left+20+margin.right)
                    .attr('height', height + margin.top+20+margin.bottom+20)
                   .attr('transform',`translate(${margin.left+10},${margin.top+20})`)

  plot.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x))

  plot.append('g')
        .call(d3.axisLeft(y))


  plot.selectAll('.point')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 3)
        .attr('fill', 'rgb(214, 39, 40)')
        .attr('stroke', 'black')

  chart.append('text')
       .text('Annual total compensation vs. Time at current employer')
       .attr('transform', `translate(50, 20)`)

  chart.append('text')
       .text('Months working with current employer')
       .attr('transform', `translate(50, ${height+margin.top+margin.bottom+30})`)

  chart.append('text')
       .text('Salary (USD, in thousands)')
       .attr('transform', `translate(0, ${height})rotate(-90)`)

  chart.style('opacity', 0)
       .transition()
       .duration(2000)
       .style('opacity', 1)
}

const ageChart = data => {
  data.forEach(d => d.y = d.y/1000)
  data = data.filter(d => d.y<500).filter(d => d.x>0)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left},${margin.top+1050})`)

  const x = d3.scaleLinear()
                  .domain([-1, d3.max(data, d => d.x)])
                  .range([0, width])

  const y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(data, d => d.y)])

  const plot = chart.append('g')
                    .attr('width', width + margin.left+20+margin.right)
                    .attr('height', height + margin.top+20+margin.bottom+20)
                   .attr('transform',`translate(${margin.left+10},${margin.top+20})`)

  plot.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(x))

  plot.append('g')
        .call(d3.axisLeft(y))


  plot.selectAll('.point')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 3)
        .attr('fill', 'gold')
        .attr('stroke', 'black')

  chart.append('text')
       .text('Annual total compensation vs. Age')
       .attr('transform', `translate(50, 20)`)

  chart.append('text')
       .text('Age')
       .attr('transform', `translate(${width/2}, ${height+margin.top+margin.bottom+30})`)

  chart.append('text')
       .text('Salary (USD, in thousands)')
       .attr('transform', `translate(0, ${height})rotate(-90)`)
}

const educationChart = data => {
  data.forEach(d => d.y = d.y/1000)
  data = data.filter(d => d.y<500)
  const margin = {top: 10, right: 30, bottom: 100, left: 40},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

  const chart = svg.append('g')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
                   .attr('transform',`translate(${margin.left+550},${margin.top+550})`)
  

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
  const y = d3.scaleLinear()
      .domain([d3.min(dataset, d=>d.value.min),d3.max(data, d=>d.y)])
      .range([height, 0])

  const x = d3.scaleBand()
    .domain(dataset.map(d => d.key))
    .range([0,width])
    .paddingInner(1)
    .paddingOuter(.5)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(45)translate(0, 0)')
    .style('text-anchor', 'start');

  chart.append('g').call(d3.axisLeft(y))

  chart.selectAll('lines')
      .data(dataset)
      .enter()
      .append('line')
      .attr('x1', d => x(d.key))
      .attr('x2', d => x(d.key))
      .attr('y1', d => y(d.value.min))
      .attr('y2', d => y(d.value.max))
      .attr('stroke', 'black')
      .style('width', 40)

  const boxWidth = 20
  chart.selectAll('.box')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => (x(d.key)-boxWidth/2))
        .attr('y', d => y(d.value.q3))
        .attr('height', d => (y(d.value.q1)-y(d.value.q3)))
        .attr('width', boxWidth )
        .attr('stroke', 'black')
        .style('fill', '#69b3a2')

  chart.selectAll('.median')
      .data(dataset)
      .enter()
      .append('line')
      .attr('x1', d => (x(d.key)-boxWidth/2))
      .attr('x2', d => (x(d.key)+boxWidth/2))
      .attr('y1', d => y(d.value.median))
      .attr('y2', d => y(d.value.median))
      .attr('stroke', 'black')
      .style('width', 80)

  const jitterWidth = 10
  chart.selectAll('indPoints')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x) - jitterWidth/2 + Math.random()*jitterWidth)
      .attr('cy', d => y(d.y))
      .attr('r', 2)
      .style('fill', 'white')
      .attr('stroke', 'black')

  chart.append('text')
       .text('Annual total compensation vs. Education Level')
       .attr('transform', `translate(50, -10)`)

  chart.append('text')
       .text('Education Level')
       .attr('transform', `translate(${width/2}, ${height+margin.top+margin.bottom+10})`)

  chart.append('text')
       .text('Salary (USD, in thousands)')
       .attr('transform', `translate(-50, ${height/2})rotate(-90)`)

  chart.style('opacity', 0)
       .transition()
       .duration(2000)
       .style('opacity', 1)

}

const parseData = () => {
  /*
  d3.csv(data2)
    .then(data => {
      const totalCompensation = []
      const ethnicities = []
      const experienceInCS = []
      const currentEmployerExp = []
      const education = []
      const age = []
      data.forEach(d => {
        if(d['The currency your compensation will be represented in is the...']==='US Dollar (USD)'){
          totalCompensation.push(+d['What is your approximate annual total compensation?'])

          const expStr = d['How much cumulative work experience do you have in computer science or related fields?']
          const empStr = d['How long have you worked for your current employer?']
          const regex = /(\d)*yr (\d)*mo/
          const exp = expStr.match(regex)
          const emp = empStr.match(regex)

          experienceInCS.push({x: (+exp[1])*12+(+exp[2]), y: +d['What is your approximate annual total compensation?']})
          currentEmployerExp.push({x: (+emp[1])*12+(+emp[2]), y: +d['What is your approximate annual total compensation?']})
          ethnicities.push(d['What is your ethnicity (check all that apply)'])
          education.push({x: d['What is your highest level of educational attainment? '], y: +d['What is your approximate annual total compensation?']})
          age.push({x: +d['What is your age?'], y: +d['What is your approximate annual total compensation?']})
        }
      })
      salaryHistogram(totalCompensation)
      ethnicityChart(ethnicities)
      experienceChart(experienceInCS)
      currentEmployerChart(currentEmployerExp)
      educationChart(education)
      ageChart(age)
    })
    */
}

export const renderChart = (independent, dependent) => { 
  svg = d3.select('#chart')
                      .append('svg')
                      .attr('width', '1200')
                      .attr('height', '2000')


}

