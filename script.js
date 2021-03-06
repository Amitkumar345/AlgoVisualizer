const R = 22,C=64;
var st_r = 10,st_c=15,en_r=6,en_c=40;
var startNode,endNode,clickedEle="";
let algoTypeTitle,selectedAlgo,algoMenu,clrBoard,clrPath,makeNodeTitle,aboutAlgo;
// algos
let selectionSort,insertionSort;
let dijkstraAlgo,bfsAlgo,dfsAlgo;
let grid_c,pfaFooter;

let visualizeBtn;

function setUp(){
    algoTypeTitle = document.getElementById('algo_type_title')
    selectedAlgo = document.getElementById('selected_algo')
    algoMenu = document.getElementById('algo_menu')
    clrBoard = document.getElementById('clr_board')
    clrPath = document.getElementById('clr_path')
    makeNodeTitle = document.getElementById('make_node_type')
    
    visualizeBtn = document.getElementById('visualize_btn')
    // sorting algos
    selectionSort = document.getElementById('selection_sort')
    insertionSort = document.getElementById('insertion_sort')
    // pathfinding algos
    dijkstraAlgo = document.getElementById('dijkstra_algo')
    bfsAlgo = document.getElementById('bfs_algo')
    dfsAlgo = document.getElementById('dfs_algo')

    grid_c = document.getElementById('grid_container');
    pfaFooter = document.getElementById('pfa_footer');
    aboutAlgo = document.getElementById('about_algo');

    createGrid()
    setTypeAsPFA()
}
function setTypeAsSA(){
    algoTypeTitle.textContent = 'Sorting'
    selectedAlgo.textContent = 'Sorting Algorithms'
    selectedAlgo.classList.remove('disabled')
    clrBoard.classList.remove('disabled')
    clrPath.classList.add('d-none')
    showMakeNodeTitle(false)
    showSortingAlgos()
    hidPathFindingAlgos()
    show_PFA_Footer(false)
    alert("NOT READY, TRY OTHER ONE");
}
function setTypeAsPFA(){
    algoTypeTitle.textContent = 'Path Finding'
    selectedAlgo.textContent = 'Path Finding Algorithms'
    selectedAlgo.classList.remove('disabled')
    clrBoard.classList.remove('disabled')
    clrPath.classList.remove('d-none')
    showMakeNodeTitle(true)
    showPathFindingAlgos()
    hidSortingAlgos()
    show_PFA_Footer(true)
}
function showSortingAlgos(){
    selectionSort.classList.remove('d-none')
    insertionSort.classList.remove('d-none')
}
function hidSortingAlgos(){
    selectionSort.classList.add('d-none')
    insertionSort.classList.add('d-none')
}
function showPathFindingAlgos(){
    dijkstraAlgo.classList.remove('d-none')
    bfsAlgo.classList.remove('d-none')
    dfsAlgo.classList.remove('d-none')
}
function hidPathFindingAlgos(){
    dijkstraAlgo.classList.add('d-none')
    bfsAlgo.classList.add('d-none')
    dfsAlgo.classList.add('d-none')
}
function showMakeNodeTitle(show){
    if(show) makeNodeTitle.classList.remove('d-none')
    else makeNodeTitle.classList.add('d-none')
}
function show_PFA_Footer(show){
    if(show)pfaFooter.classList.remove('d-none')
    else pfaFooter.classList.add('d-none')
}
function getNodeId(i,j){
    return i+'-'+j;
}
function getRowFromNodeId(id){
    var x = 2;
    if(id.charAt(1) == '-')x=1;
    return id.substring(0,x);
}
function getColFromNodeId(id){
    var x = id.length - 2;
    if(id.charAt(x) == '-')x=x+1;
    return id.substring(x);
}
function createGrid(){
    for(var i=0;i<R;i++){
        var row = document.createElement('tr')
        row.className='c_row row'+i
        row.id = 'row'+i
        for(var j=0;j<C;j++){
            var node = document.createElement('td')
            node.className = 'c_node unvisited'
            node.id = ''+i+"-"+j
            row.appendChild(node)
            if(isStartIndex(i,j)){
                addStartNodeProperties(node)
                continue;
            }else if(isEndIndex(i,j)){
                addEndNodeProperties(node)
                continue;
            }
            addUnvisitedNodeListener(node)
        }
        grid_c.appendChild(row)
    }
}
function clearBoard(){
    if(algoTypeTitle.textContent == 'Sorting')return;
    for(var i=0;i<R;i++){
        for(var j=0;j<C;j++){
            if(isStartIndex(i,j) || isEndIndex(i,j))continue;
            var id = ''+i+"-"+j
            var node = document.getElementById(id)
            node.className = 'c_node unvisited'
        }
    }
    setAsNothingClicked()
}
function clearPath(){
    if(algoTypeTitle.textContent == 'Sorting')return;
    for(var i=0;i<R;i++){
        for(var j=0;j<C;j++){
            if(isStartIndex(i,j) || isEndIndex(i,j) || isWallIndex(i,j))continue;
            if(isWeightedIndex(i,j)){
                if(isPathIndex(i,j))makePathIndexAsWeighted(i,j);
                continue;
            }
            var id = ''+i+"-"+j
            var node = document.getElementById(id)
            node.className = 'c_node unvisited'
        }
    }
    setAsNothingClicked()
}
function makeIndexVisited(i,j){
    if(isStartIndex(i,j) || isEndIndex(i,j))return;
    var id = ''+i+"-"+j
    makeNodeVisited(document.getElementById(id))
}
function makeNodeVisited(el){
    if(el === startNode || el === endNode)return;
    if(isWallNode(el))return;
    el.className = 'c_node visited'
}
function makeIndexVisiting(i,j){
    var id = ''+i+"-"+j
    makeNodeVisiting(document.getElementById(id))
}
function makeNodeVisiting(el){
    el.className = 'c_node visiting'
}
function makeIndexUnVisited(i,j){
    var id = ''+i+"-"+j
    makeNodeUnVisited(document.getElementById(id))
}
function makeNodeUnVisited(el){
    el.className = 'c_node unvisited'
    removeStartOrEndNodeListener(el)
    addUnvisitedNodeListener(el)
}
function isPathIndex(i,j){
    var id = ''+i+"-"+j
    return isPathNode(document.getElementById(id));
}
function isPathNode(el){
    return el.classList.contains('pathnode');
}
function makeIndexAsPathNode(i,j){
    var id = ''+i+"-"+j
    makeNodeAsPathNode(document.getElementById(id))
}
function makeNodeAsPathNode(el){
    if(isWeightedNode(el))
        el.className = 'c_node pathnode weightednode'
    else
        el.className = 'c_node pathnode'
}
// function cloneNodeForRemovingListeners(old_el){
//     var new_el = old_el.cloneNode(true);
//     old_el.parentNode.replaceChild(new_el,old_el)
// }
function addUnvisitedNodeListener(el){
    el.addEventListener('mousemove',function(el){makeNode(this)})
    el.addEventListener('click',function(el){setAsStartOrEndNode(this)})
}
function removeUnvisitedNodeListener(el){
    el.removeEventListener('mousemove',function(el){makeNode(this)})
    el.removeEventListener('click',function(el){setAsStartOrEndNode(this)})
}
/////------ START and END NODE -----------/////
function makeIndexAsStartNode(i,j){
    st_r =i;st_c=j;
    var id = ''+i+"-"+j
    var node = document.getElementById(id)
    makeNodeAsStartNode(node)
}
function makeNodeAsStartNode(el){
    if(startNode == el || endNode == el)return;
    removeUnvisitedNodeListener(el)
    makeNodeUnVisited(startNode)
    st_r = getRowFromNodeId(el.id);
    st_c = getColFromNodeId(el.id);
    addStartNodeProperties(el)
}
function addStartNodeProperties(el){
    startNode = el
    startNode.className ='c_node startnode'
    addStartOrEndNodeListener(el,0)
    clickedEle=""
}
function makeIndexAsEndNode(i,j){
    en_r=i;en_c=j;
    var id = ''+i+"-"+j
    var node = document.getElementById(id)
    makeNodeAsEndNode(node)
}
function makeNodeAsEndNode(el){
    if(startNode == el || endNode == el)return;
    removeUnvisitedNodeListener(el)
    makeNodeUnVisited(endNode)
    en_r = getRowFromNodeId(el.id);
    en_c = getColFromNodeId(el.id);
    addEndNodeProperties(el)
}
function addEndNodeProperties(el){
    endNode = el
    endNode.className ='c_node endnode'
    addStartOrEndNodeListener(el,1)
    clickedEle=""
}
function addStartOrEndNodeListener(el,i){
    el.addEventListener('click',function(){
        makeStartOrEndNodeClicked(i,this)
    })
}
function removeStartOrEndNodeListener(el,i){
    el.removeEventListener('click',function(){
        makeStartOrEndNodeClicked(i,this)
    })
}
function isStartIndex(i,j){
    return (i==st_r && j==st_c);
}
function isEndIndex(i,j){
    return (i==en_r && j==en_c);
}
function makeStartOrEndNodeClicked(x,ele){
    if(clickedEle == ""){
        if(x == 0){
            startNode.classList.add('startOrEndNodeClicked')
            clickedEle = "START_NODE"
        }else if(x == 1){
            endNode.classList.add('startOrEndNodeClicked')
            clickedEle = "END_NODE"
        }
    }else{
        setAsNothingClicked();
    }
    setMakeNodeTitle(3)
}
function setAsStartOrEndNode(el){
    if(clickedEle == '')return;
    if(clickedEle == 'START_NODE'){
        makeNodeAsStartNode(el)
    }else if(clickedEle == 'END_NODE'){
        makeNodeAsEndNode(el)
    }
    setAsNothingClicked()
    console.log("start: "+st_r+"-"+st_c+"\nend: "+en_r+"-"+en_c);
}
function setAsNothingClicked(){
    startNode.classList.remove('startOrEndNodeClicked')
    endNode.classList.remove('startOrEndNodeClicked')
    clickedEle=""
}
//////
/////------ wall and weight node --------////
function setMakeNodeTitle(opt){
    var s; 
    switch(opt){
        case 1:
             s = 'Wall Node';
             setAsNothingClicked();
            break;
        case 2:
             s = 'Weighted Node';
             setAsNothingClicked();
            break;
        case 3:
             s = 'Make Node as';
            break;
    }
    makeNodeTitle.textContent = s;
}
function makeNode(el){
    if(el.classList.contains('startnode') 
        || el.classList.contains('endnode')) return;
    var s = makeNodeTitle.textContent
    if(s == 'Weighted Node'){
        makeNodeAsWeighted(el)
    }else if(s == 'Wall Node'){
        makeNodeAsWall(el)
    }
}
function makeNodeAsWall(el){
    if(el.classList.contains('wallnode'))
        el.className = 'c_node unvisited'
    else
        el.className ='c_node wallnode'
}
function isWallNode(el){
    if(!el){
        console.log("isWall: ");return false;
    }
    return el.classList.contains('wallnode')
}
function isWallIndex(i,j){
    var id = ''+i+"-"+j
    var el = document.getElementById(id)
    return isWallNode(el)
}
function makeNodeAsWeighted(el){
    if(el.classList.contains('weightednode'))
        el.className = 'c_node unvisited'
    else
        el.className ='c_node weightednode'
}
function makePathIndexAsWeighted(i,j){
    var id = ''+i+"-"+j;
    makePathNodeAsWeighted(document.getElementById(id));
}
function makePathNodeAsWeighted(el){
    el.className = 'c_node weightednode'
}
function isWeightedNode(el){
    if(!el)return false;
    return el.classList.contains('weightednode')
}
function isWeightedIndex(i,j){
    var id = ''+i+"-"+j
    var el = document.getElementById(id)
    return isWeightedNode(el)
}
///
/////--------- Visualize Button ----------------//////
function enableVisualizeBtn(enable){
    if(enable)visualizeBtn.classList.remove('disabled')
    else visualizeBtn.classList.add('disabled')
}
function visualizeAlgo(){
    var algo = selectedAlgo.textContent;
    var s="sdf";
    if(algo.includes('Selection Sort')){

    }else if(algo.includes('Insertion Sort')){

    }else if(algo.includes("Dijkstra's algo")){
        DIJKSTRA();
    }else if(algo.includes("Breadth First Search")){
        BFS();
    }else if(algo.includes("Depth First Search")){
        DFS();
    }else{
        
    }
}
///
/////--------- ALGORITHMS ----------------//////
function selectAlgo(sect,num){
    var s,txt;
    if(sect == 1){
        switch(num){
            case 1:
                s = 'Selection Sort';
                txt = '';
                break;
                case 2:
                txt = '';
                s = 'Insertion Sort';
                break;
        }
    }else if(sect == 2){
        switch(num){
            case 1:
                s = "Dijkstra's algo";
                txt = ' (Weighted): Guarantees shortest Path.';
                break;
            case 2:
                s = "Breadth First Search"
                txt = ' (Unweighted): Guarantees shortest Path.';
                break;
            case 3:
                s="Depth First Search";
                txt = ' (Unweighted): Does not guarantees shortest path';
                break;
        }
    }
    aboutAlgo.textContent = s+txt;
    selectedAlgo.textContent = s;
    enableVisualizeBtn(true);
}
///--------- SORTING ALGORITHMS ----------/////
///--------- PATH FINDING ALGORITHMS ---------/////
var visArr = new Array(R);
var time;
const parent = new Map();
const visitedNodes = [];
const moveRow = [0,1,0,-1];
const moveCol = [1,0,-1,0];
for(var i=0;i<R;i++){
    visArr[i] = new Array(C);
}
function resetHelpingVariables(){
    time =0;
    for(var i=0;i<R;i++){
        for(var j=0;j<C;j++){
            visArr[i][j] = false;
        }
    }
    parent.clear();
    clearPath();
}
function isValidIndex(i,j){
    if(i<0 || j<0 || i>=R || j>=C)return false;
    if(visArr[i][j] == true){
        return false;
    }
    if(isWallIndex(i,j)){
        console.log("isWallIndex: "+i+'-'+j);
        return false;
    }
    return true;
}
function DIJKSTRA(){
    resetHelpingVariables();
    var dist = new Array(R);
    for(var i=0;i<R;i++){
        dist[i] = new Array(C);
        for(var j=0;j<C;j++){
            dist[i][j] = Number.MAX_VALUE;
        }
    }
    dist[st_r][st_c] = 0;
    var found = false;
    // visArr for a cell is true if the cell is included in shortest path or shortest distance from src to the cell is finalized
    for(var i=1;i<R*C;i++){
        var mnIdx = minDistForDijkstra(dist);
        if(mnIdx[0] == -1 || mnIdx[1] == -1){
            console.log("no any unprocessed shortest path left");
            break;
        }
        if(isEndIndex(mnIdx[0],mnIdx[1])){
            visualizeNodes(getNodeId(en_r,en_c));
            found = true;
        }
        visArr[mnIdx[0]][mnIdx[1]] = true;
        for(var k=0;k<4;k++){
            var adjR = parseInt(mnIdx[0]) + moveRow[k];
            var adjC = parseInt(mnIdx[1]) + moveCol[k];
            if(!isValidIndex(adjR,adjC))continue;
            var w = (isWeightedIndex(adjR,adjC)?10:1);
            if(dist[mnIdx[0]][mnIdx[1]] != Number.MAX_VALUE && dist[mnIdx[0]][mnIdx[1]] + w < dist[adjR][adjC]){
                dist[adjR][adjC] = dist[mnIdx[0]][mnIdx[1]] + w;
                var childId = adjR+'-'+adjC;
                var parentId = mnIdx[0]+'-'+mnIdx[1];
                parent.set(childId,parentId);
                if(!found && w==1)addVisitedIndex(adjR,adjC);
            }
        }
    }
    // visualizeNodes(getNodeId(en_r,en_c));
}
function minDistForDijkstra(dist){
    var mn = Number.MAX_VALUE;
    var mnIdx = new Array(2);
    mnIdx[0]=-1;mnIdx[1]=-1;
    for(var i=0;i<R;i++){
        for(var j=0;j<C;j++){
            if(isValidIndex(i,j) && dist[i][j] < mn){
                mn = dist[i][j];
                mnIdx[0] = i;
                mnIdx[1] = j; 
            }
        }
    }
    return mnIdx;
}
function BFS(){
    resetHelpingVariables();
    var q = [];
    q.push([st_r,st_c]);
    visArr[st_r][st_c] = true;

    while(q.length != 0){
        var i = parseInt(q[0][0]),j = parseInt(q[0][1]);
        q.shift();
        if(isEndIndex(i,j)){
            // alert("found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
            console.log("found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
            var id = i+'-'+j;
            visualizeNodes(id);
            return;
        }
        for(var k=0;k<4;k++){
            var adjR = parseInt(i) + moveRow[k];
            var adjC = parseInt(j) + moveCol[k];
            if(!isValidIndex(adjR,adjC))continue;
            var childId = adjR+'-'+adjC;
            var parentId = i+'-'+j;
            parent.set(childId,parentId);
            q.push([adjR,adjC]);
            addVisitedIndex(adjR,adjC);
            visArr[adjR][adjC]= true;
        }
    }
    // alert("not found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
    console.log("not found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
    visualizeNodes();
}
function DFS(){
    resetHelpingVariables();
    __dfs(st_r,st_c);
    visualizeNodes();
}
function __dfs(i,j){
    if(isEndIndex(i,j)){
        // alert("found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
        console.log("found\n" + st_r+"-"+st_c+"->"+en_r+"-"+en_c);
        var id = i+'-'+j;
        visualizeNodes(id);
        return true;
    }
    visArr[i][j]= true;
    for(var k=0;k<4;k++){
        var adjR = parseInt(i) + moveRow[k];
        var adjC = parseInt(j) + moveCol[k];
        if(!isValidIndex(adjR,adjC))continue;
        var childId = adjR+'-'+adjC;
        var parentId = i+'-'+j;
        parent.set(childId,parentId);
        addVisitedIndex(adjR,adjC);
        if(__dfs(adjR,adjC))return true;
    }
    return false;
}
function addVisitedIndex(i,j){
    if(isStartIndex(i,j) || isEndIndex(i,j))return;
    visitedNodes.push([i,j]);
}
function showVisitedIndex(){
    var n = visitedNodes.length;
    time = 0;
    var i,j;
    for(var k=0;k<n;k++){
        i = visitedNodes[0][0];
        j = visitedNodes[0][1];
        visitedNodes.shift();
        var el = document.getElementById(getNodeId(i,j))
        el.style.animationDelay = time+'ms';
        time = +time + 7;
        makeIndexVisited(i,j);
    }
    time = +time + 200;
}
function visualizeNodes(cId){
    showVisitedIndex();
    if(!cId)return;
    setTimeout(function(){
        showPath(cId);
      }, time);
}
function showPath(cId){
    var ar = [];
    var pId = parent.get(cId);
    while(pId){
        ar.push(pId);
        pId = parent.get(pId);
    }
    time = 0;
    ar.reverse();
    for(var i=1;i<ar.length;i++){
        var el = document.getElementById(ar[i]);
        time = +time + 10;
        el.style.animationDelay = time +"ms";
        makeNodeAsPathNode(el);
    }
}
