var i = 0,
    duration = 350,
    root

if (window.innerWidth < 640) {
    var margin = [20, 120, 20, 140],
        width = 1280,
        height = window.innerHeight / 1.6
} else {
    var margin = [20, 120, 20, 140],
        width = 1100,
        height = window.innerHeight / 1.7
}

console.log(document.querySelector("svg").width)

var tree = d3.layout.tree().size([height, width])

var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.y, d.x]
})

var vis = d3
    .select('.graph-container')
    .append('svg:svg')
    .attr('width', width + margin[1] + margin[3])
    .attr('height', height + margin[0] + margin[2])
    .append('svg:g')
    .attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')

d3.json('/static/misc/tree.json', function (json) {
    root = json
    root.x0 = height / 2
    root.y0 = 0

    function collapse(d) {
        if (d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null
        }
    }

    root.children.forEach(collapse)
    update(root)
})

function update(source) {
    var nodes = tree.nodes(root).reverse()

    // Normalize for fixed-depth.
    if (window.innerWidth < 640) {
        nodes.forEach(function (d) {
            d.y = d.depth * 120
        })
    } else {
        nodes.forEach(function (d) {
            d.y = d.depth * 180
        })
    }

    // Update the nodes…
    var node = vis.selectAll('g.node').data(nodes, function (d) {
        return d.id || (d.id = ++i)
    })

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .attr('transform', function (d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')'
        })
        .on('click', function (d) {
            toggle(d)
            update(d)
        })

    nodeEnter
        .append('svg:circle')
        .attr('r', 1e-6)
        .style('fill', function (d) {
            return d._children ? 'lightsteelblue' : '#fff'
        })

    nodeEnter
        .append('a')
        .attr('target', '_blank')
        .attr('xlink:href', function (d) {
            return d.url
        })
        .append('svg:text')
        .attr('x', function (d) {
            return d.children || d._children ? -15 : 15
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function (d) {
            return d.children || d._children ? 'end' : 'start'
        })
        .attr('class', function (d) {
            return d.children || d._children ? 'clickable' : ''
        })
        .text(function (d) {
            if (d.score) {
                return d.name + " " + skillEmojis[d.score - 1]
            } else {
                return d.name
            }
        })
        .style('fill: #9A4582', function (d) {
            return d.free ? 'black' : '#999'
        })
        .style('fill-opacity', 1e-6)

    // Transition nodes to their new position.
    var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
            return 'translate(' + d.y + ',' + d.x + ')'
        })

    nodeUpdate
        .select('circle')
        .attr('r', 6)
        .style('fill', function (d) {
            return d._children ? '#111' : '#fff'
        })

    nodeUpdate.select('text').style('fill-opacity', 1)

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
            return 'translate(' + source.y + ',' + source.x + ')'
        })
        .remove()

    nodeExit.select('circle').attr('r', 1e-6)

    nodeExit.select('text').style('fill-opacity', 1e-6)

    // Update the links…
    var link = vis.selectAll('path.link').data(tree.links(nodes), function (d) {
        return d.target.id
    })

    // Enter any new links at the parent's previous position.
    link.enter()
        .insert('svg:path', 'g')
        .attr('class', 'link')
        .attr('d', function (d) {
            var o = {
                x: source.x0,
                y: source.y0
            }
            return diagonal({
                source: o,
                target: o
            })
        })
        .transition()
        .duration(duration)
        .attr('d', diagonal)

    // Transition links to their new position.
    link.transition().duration(duration).attr('d', diagonal)

    // Transition exiting nodes to the parent's new position.
    link.exit()
        .transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = {
                x: source.x,
                y: source.y
            }
            return diagonal({
                source: o,
                target: o
            })
        })
        .remove()

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x
        d.y0 = d.y
    })
    // updateClickables()
}

// Toggle children.
function toggle(d) {
    if (d.children) {
        d._children = d.children
        d.children = null
    } else {
        d.children = d._children
        d._children = null
    }
}

const target = document.querySelector('.graph-container');

function handleIntersection(entries) {
    entries.map((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        } else {
            entry.target.classList.remove('visible')
        }
    });
}

const observer = new IntersectionObserver(handleIntersection);
observer.observe(target);
