const graph = {
 "name": "smart contract",
 "children": [
  {
   "name": "blockchain",
    size: 200000,
    className: 'hey',
   "children": [
    {
     "name": "ethereum",
      size: 100000,
     "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 60714},
      {"name": "MergeEdge", "size": 743}
     ]
    },
    {
     "name": "ICO",
     "children": [
      {"name": "BetweennessCentrality", "size": 3534},
      {"name": "LinkDistance", "size": 5731},
      {"name": "MaxFlowMinCut", "size": 7840},
      {"name": "ShortestPaths", "size": 5914},
      {"name": "SpanningTree", "size": 3416}
     ]
    },
    {
     "name": "Crypto currency",
     "children": [
      {"name": "AspectRatioBanker", "size": 7074}
     ]
    }
   ]
  }
 ]
}

var width = 900,
    height = 500,
    root;

var force = d3.layout.force()
    .linkDistance(80)
    .charge(-120)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", "90em")
    .attr("height", "50em")
    .attr('viewbox', '0 0 900 500');

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

root = graph
  update();

function rect(node) {
  const text = node.name
  console.log(node)
  node
    .attr("class", function(d) {
      const st =  d._children ?  'collapsed'
        : d.children ? 'expanded' : 'leaf'
      return 'node ' + st
    })
  node
    .append("rect")
    .attr("height", "20")
    // .attr("width", "200")
    .attr("width", function(d) {
      return '' + (d.name.length*6+10)
    })
    .attr("y", "-10")
    .attr("x", function(d) {
      return '' + Math.floor(- (d.name.length*6+10)/2)
    })
    .attr("class", "rect");
  node
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .text(function(d) { return d.name; })
}

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update links.
  link = link.data(links, function(d) { return d.target.id; });

  link.exit().remove();

  link.enter().insert("line", ".node")
      .attr("class", "link");

  // Update nodes.
  node = node.data(nodes, function(d) { return d.id; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("class", function(d){return 'node ' + d.className})
      .on("click", click)
      .call(force.drag);

  rect(nodeEnter)
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function color(d) {
  return d._children ? "#3182bd" // collapsed package
      : d.children ? "#c6dbef" // expanded package
      : "#fd8d3c"; // leaf node
}

// Toggle children on click.
function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag
  if (d.children) {
    d._children = d.children;
    d.children = null;
    /*
    const n = d3.select(this)
      .attr("class", "node collapsed")
    */
  } else {
    d.children = d._children;
    d._children = null;
    /*
    d3.select(this)
      .attr("class", "node expanded")
    */
  }
  update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}
