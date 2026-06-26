export function computeLayout(nodes,edges){
    const outEdges={};
    const backEdgeIds=new Set();
    nodes.forEach(n => { outEdges[n.id] = []; });
    edges.forEach(e => { if (outEdges[e.from]) outEdges[e.from].push(e.to); });

    // detect backedges via dfs(cycle detection)

    const visited= new Set();
    const stack=new Set();

    function dfs(id){
        if(stack.has(id) || visited.has(id)) return;
        visited.add(id);
        stack.add(id);
        (outEdges[id] || []).forEach(to=>{
            if(stack.has(to)){
                backEdgeIds.add(`${id}->${to}`);
            }else{
                dfs(to);
            }
        });
        stack.delete(id);
    }

    nodes.forEach(n=>dfs(n.id));

    // bfs layering using only forward edges
    const fwdEdges= edges.filter(e => !backEdgeIds.has(`${e.from}->${e.to}`));
    const inDeg={};
    nodes.forEach(n=> {inDeg[n.id]=0;});

    fwdEdges.forEach(e=> {if (inDeg[e.to] !== undefined) inDeg[e.to]++; });

    const layers= [];
    let queue =nodes.filter(n=> inDeg[n.id]===0).map(n=> n.id);
    const seen = new Set(queue);

    while (queue.length) {
        layers.push([...queue]);
        const next = [];
        queue.forEach(id => {
            fwdEdges.filter(e => e.from === id).forEach(e => {
                inDeg[e.to]--;
                if (inDeg[e.to] === 0 && !seen.has(e.to)) {
                    next.push(e.to);
                    seen.add(e.to);
                }
            });
        });
        queue = next;
    }

     // catch any unvisited (disconnected) nodes
  nodes.forEach(n => {
    if (!seen.has(n.id)) {
      layers.push([n.id]);
      seen.add(n.id);
    }
  });

  // Assign positions
  const NODE_W = 180;
  const NODE_H = 60;
  const H_GAP = 60;
  const V_GAP = 100;

  const positions = {};
  layers.forEach((layer, li) => {
    const totalWidth = layer.length * NODE_W + (layer.length - 1) * H_GAP;
    const startX = -totalWidth / 2;
    layer.forEach((id, ci) => {
      positions[id] = {
        x: startX + ci * (NODE_W + H_GAP),
        y: li * (NODE_H + V_GAP),
      };
    });
  });

  return { positions, backEdgeIds };
}