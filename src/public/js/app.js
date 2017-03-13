		Array.prototype.SumArray = function (arr) {
		    var sum = [];
		    if (arr != null && this.length == arr.length) {
		        for (var i = 0; i < arr.length; i++) {
		            sum.push(this[i] + arr[i]);
		        }
		    }

		    return sum;
		}

		$("#main_container").width( $(window).width() - 10);
		$("#main_container").height( $(window).height() - $("#nav_bar").height() - 30);

		var ids = [];

		var opts = {
			lines: 13 // The number of lines to draw
			, length: 28 // The length of each line
			, width: 14 // The line thickness
			, radius: 42 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		}

		var spinner;
		var target;

		var config = {
			settings: {
				showCloseIcon : false,
			    showPopoutIcon : false,
			    reorderEnabled : false
			},


			content: [{
				type: 'row',
				content: [
					{
						type: 'column',
						width: $(window).width() * 25,
						content: [
							// {

							// 	type: 'component',
							// 	componentName: 'testComponent',
							// 	// id: 'control',
							// 	componentState: {id : "control" },
							// 	isClosable: false,
							// 	title: "Control"								
							// },
							// {

							// 	type: 'component',
							// 	componentName: 'testComponent',
							// 	// id: 'control',
							// 	componentState: {id : "stat_view" },
							// 	isClosable: false,
							// 	title: "Statistic View"								
							// },
							{
								type: 'stack',
								content: [
								{
									type: 'component',
									componentName: 'testComponent',
									componentState: {id : "info_view" },
									isClosable: false,
									title: "Node Info"
								},								
								{
									type: 'component',
									componentName: 'testComponent',
									componentState: {id : "hist_view" },
									isClosable: false,
									title: "Histogram View"
								},
								{
									type: 'component',
									componentName: 'testComponent',
									componentState: {id : "scat_view" },
									isClosable: false,
									title: "Scatter Plot View"
								},
								{
									type: 'component',
									componentName: 'testComponent',
									componentState: {id : "fList_view" },
									isClosable: false,
									title: "Function List"
								},								
								]
							},
							{

								type: 'component',
								componentName: 'testComponent',
								// id: 'control',
								componentState: {id : "lm_view" },
								isClosable: false,
								title: "LM View"								
							}
						]
					},
					{
						type: 'column',
						width: $(window).width() * 70,
						content: [
							{
								type: 'component',
								componentName: 'testComponent',
								componentState: { id: 'procedure_view' },
								title: 'Procedure View'
							}
						]
						
					}
				]
			}]			
		}

		var myLayout = new GoldenLayout( config , $("#main_container"));
		myLayout.registerComponent( 'testComponent', function( container, state ){
			console.log(state.id);
			container.getElement().html( "<div id = " + state.id + " > </div>" );

			// donewithlayout();
			ids.push(state.id);
		});

		myLayout.on("initialised", donewithlayout);

		myLayout.on('stateChanged', function(component){
			updateDivSizes();
		})
		myLayout.init();

		function updateDivSizes(){
			ids.forEach(function(myid){
				$("#" + myid).width( $("#" + myid).parent().width() );
				$("#" + myid).height( $("#" + myid).parent().height() );
			})		

			if(sankeyVis){
				// console.log(d3.select("#procedure_view svg"));
				d3.select("#procedure_view svg")
					.attr("width", $("#procedure_view").width() )
					.attr("height", $("#procedure_view").height() )

			}	

			if(scatterPot){
				scatterPot.setContainerWidth( $("#scat_view").width() );
				scatterPot.setContainerHeight( $("#scat_view").height() );
				scatterPot.reDraw();
			}
			if(histogram){
				histogram.setContainerWidth( $("#hist_view").width() );
				histogram.setContainerHeight( $("#hist_view").height() );
				histogram.reDraw();

			}

			$("#list_view").width( $("#fList_view").width() );
			$("#list_view").height( $("#fList_view").height() - 50 );
			if(listData){
				displayList();
			}

		}

		function donewithlayout(){
			updateDivSizes();
			// getData();

			var temp = document.createElement('div');
			temp.setAttribute("id", "list_view");

			document.getElementById('fList_view').appendChild(temp);

			$("#list_view").width( $("#fList_view").width() );
			$("#list_view").height( $("#fList_view").height() - 50 );
			$("#list_view").css("overflow", "auto");

			var button = $('<button/>',
						    {
						        text: 'Split Node',
						        click: splitNode2,
						        id: "splitNodeBtr"
						    });
			$("#fList_view").append(button);
			document.getElementById("splitNodeBtr").disabled = true;

			var button2 = $('<button/>',
						    {
						        text: 'Split By Parents',
						        click: splitNodeByParents,
						        id: "splitNodeByParentBtr"
						    });
			$("#fList_view").append(button2);
			document.getElementById("splitNodeByParentBtr").disabled = true;

			var parentOfSankeyView =  document.getElementById("procedure_view").parentElement;

			target = parentOfSankeyView;
			spinner = new Spinner(opts).spin(parentOfSankeyView);
			spinner.stop();
			startVis();
			
		}
		
		var rectWidth = 20;
		var rectHeight = 20;

		var visData;

		var minVal;
		var maxVal;

		var numbOfClusters = 16; //this is the number of clusters

		var lmView;
		var sankeyVis;

		var selectedLMID;

		var scatterPot;
		var histogram;

		var listData;

		var sankColor;

		var edges;
		var nodes;
		var edgeList;
    	var nodeList;

		var currentClickNode;
		var nodeMetrics;

		//this is the data use for the histogram and scatter plot
		var sankNodeDataHistScat = {};

		var sankeySacle;


		function startVis(){
			getNodeMetrics();
			getSankey(0);
		}

		function lmCallBack(lmID){
			selectedLMID = lmID;

		}

		function getDataStat(){
			var min = Number.MAX_SAFE_INTEGER;
			var max = 0;

			Object.keys(visData).forEach(function(rowid){
				visData[rowid].forEach(function(dat){
					min = Math.min(min, dat.value);
					max = Math.max(max, dat.value);
				})
			});

			minVal = min;
			maxVal = max;
		}

		function getNodeMetrics(){
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/getNodeMetrics',
	            success: function(metricData){
	            	nodeMetrics = metricData;
	            },
	            error: function(){
	            	console.log("There was problem with getting the metric data");
	            }	
			});				
		}

		function getSankey(lmID){
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/getSankey',
	            data: {"lmID" : lmID},
	            success: function(newData){
	                //somecoment
	            	console.log(newData);
	            	console.log('done with getting data');
	            	var data = newData;
	            	var offSet = 0;
	            	nodes = data["nodes"];
	            	edges = data["edges"];
	            	var myNodes = [];

	            	var idMap = {};

	            	var labelList = Object.keys(nodes);
	            	labelList.forEach(function(lab){
	            		var tempObj = nodes[lab];
	            		myNodes.push(tempObj);
	            		idMap[ myNodes.sankeyID ] = 0;
	            	});

	            	console.log(myNodes);
	            	// myNodes.sort(function(a,b){
	            	// 	return b["runTime"] - a["runTime"];
	            	// });
	            	console.log(myNodes);

	            	edgeList = data["edgeList"];
	            	nodeList = data["nodeList"];

					// console.log(myNodes);
					$('#procedure_view').empty();
					sankeyVis = new Sankey({
						ID: "#procedure_view",
						width: $("#procedure_view").width(),
						height: $("#procedure_view").height(),
						// width: width,
						// height: height,
						margin: {top: 10, right: 10, bottom: 10, left: 10},
						data: {"nodes": myNodes, "links": edges},
						toolTipData : {"edgeList" : edgeList, "nodeList": nodeList},
						// spinner: spinner,
						clickCallBack: nodeClickCallBack
					})	

					sankColor = sankeyVis.colorScale;				

					d3.selectAll('.node text').style('opacity', 1);
					console.log('done with layout');
	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});				
		}
		// getData();

		function showScatterPlot(){
			var width = $("#scat_view").parent().width();
			var height = $("#scat_view").parent().height();
			var runTimeLable;
			var scatDat;

			$('#scat_view').empty();
			scatterPot = new Scatter({
				ID: "#scat_view",
				width: width,
				height: height,
				margin: {top: 10, right: 10, bottom: 30, left: 40},
				data1: sankNodeDataHistScat["inc"].slice(),
				data2: sankNodeDataHistScat["exc"].slice(),
				sort: false						
			})			

		}

		function showHistogram(node){

			$("#hist_view").empty();
			var width = $("#hist_view").parent().width();
			var height = $("#hist_view").parent().height();
			histogram = new Histogram({
				ID: "#hist_view",
				width: width,
				height: height,
				margin: {top: 10, right: 10, bottom: 30, left: 40},
				data: sankNodeDataHistScat["inc"].slice(),
				numbOfBins : 20,
				brushCallBack: brushCallBack,
				clickCallBack: nodeClickCallBack						
			})	
		}

		function nodeClickCallBack(res){
			$("#info_view").empty();

			var node = res["node"];
			console.log(node);
			var fromProcToProc = res["fromProcToProc"];
			var nodeInfo = d3.select("#info_view")
				.append('p');

			nodeInfo.html(
				"Name : " + node.name +
				"<br> Inclusive Time: " + node['inTime'] + 
				"<br> Exclusive Time: " + node["exTime"] + 
				// "<br> Imbalance Percent: " + (node["imPerc"] * 100).toFixed(2) + "%"
				""
				);

			var uniqueNodeIDList = node["uniqueNodeID"];
			
			var tempInc = [];
			var tempExc = [];
			uniqueNodeIDList.forEach(function(nodeID, idx){
				var incRuntime = nodeMetrics[nodeID]["inc"];
				var excRuntime = nodeMetrics[nodeID]["exc"];
				if(idx == 0){
					tempInc = incRuntime;
					tempExc = excRuntime;
				}
				else{
					tempInc = tempInc.SumArray( incRuntime );
					tempExc = tempExc.SumArray( excRuntime );
				}
			});		
			sankNodeDataHistScat = {"exc" : tempExc, "inc" : tempInc};
			showHistogram(node);
			showScatterPlot();

			var tempList = {};
			var nameToIDMap = res["nameToIDMap"];
			fromProcToProc.forEach(function(fromTo){
				var funcName = fromTo["toProc"];
				if(tempList[funcName] == null){
					tempList[funcName] = {"name" : funcName, "value" : 0, "procID" : nameToIDMap[funcName]};
				}
				tempList[funcName]["value"] += fromTo["value"];
			});
			// console.log(nameToIDMap)
			// console.log(JSON.stringify(tempList));
			var tempList2 = [];
			Object.keys(tempList).forEach(function(func){
				// console.log(tempList[func]);
				tempList2.push(tempList[func]);
			})
			listData = tempList2;
			displayList();


			var parentProcList = {};
			
			fromProcToProc.forEach(function(fromTo){
				var parentLabel = fromTo["fromLM"];

				if(parentProcList[parentLabel] == null){
					parentProcList[parentLabel] = [];
				}
				var funcName = fromTo["toProc"];
				// console.log(funcName);
				var procID = nameToIDMap[funcName];
				if(parentProcList[parentLabel].indexOf(procID) == -1){
					parentProcList[parentLabel].push(procID);
				}
			});
			// console.log("proc ids by parent are,", parentProcList, node.name);
			// console.log(node.specialID);
			currentClickNode = {"nodeLabel" : node.name, "nodeSpecialID" : node.specialID};
			document.getElementById("splitNodeByParentBtr").disabled = false;
			// splitNodeByParents(parentProcList, node.name);
		}

		function getList(node){
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/getList',
	            data: {"nodeID" : node.myID, "specialID" : node.specialID , "nodeLevel" : node.oldLevel, "offset": (node.oldLevel - node.level), "name" : node.name},
	            success: function(newData){

	            	console.log("done with getting list of functions");
					
	            	listData = newData;
	            	displayList();
	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});				
		}

		function displayList(){
        	$('#list_view').empty();
        	// console.log(listData);
        	listData.sort(function(a,b){
        		return b["value"] - a["value"];
        	})
        	listData.forEach(function(dat){
				// create the necessary elements
				var label = document.createElement("label");
				var description = document.createTextNode(dat["name"]);
				var checkbox = document.createElement("input");

				checkbox.type = "checkbox";
				checkbox.name = dat["name"];
				checkbox.value = dat["procID"];
				checkbox.setAttribute('class', "list_checkbox");

				label.appendChild(checkbox);
				label.appendChild(description);

				document.getElementById('list_view').appendChild(label);
				document.getElementById('list_view').appendChild(document.createElement("br"));  
        	});

        	document.getElementById("splitNodeBtr").disabled = false;

		}

		function getScatter(node){
			$.ajax({
				type:'GET',
				contentType: 'application/json',
				dataType: 'json',
				url: '/getRuntimeOfNode',
				data: {"nodeID" : node.myID, "specialID" : node.specialID , "nodeLevel" : node.oldLevel, "lmID" : selectedLMID, "offset": (node.oldLevel - node.level), "name" : node.name},
				success: function(runTimes){

					scatterData = runTimes;

					showScatterPlot();
					showHistogram();


				},
				error: function(){
					console.log("There was problem with getting the data");
				}	
			});				
		}

		function splitNode(){
			var idList = $('input:checkbox:checked.list_checkbox').map(function () {
			  return parseInt(this.value);
			}).get();

			console.log(idList);
			spinner.spin(target);
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/splitNode',
	            data: {"idList" :  idList},
	            success: function(newData){

	            	console.log("done with node split");
					
	            	var data = newData;
	            	var offSet = 0;
	            	var nodes = data["nodes"];
	            	var edges = data["edges"];
	            	var myNodes = [];



	            	var levelOffSet = 0;

					// var treeLevel = Object.keys(nodes);
					// treeLevel.forEach(function(myLevel){
					// 	var myLM = Object.keys(nodes[myLevel]);

					// 	if(myLM.length == 0){
					// 		levelOffSet += 1;
					// 	}

					// 	myLM.forEach(function(loadMod){

					// 		var tempObj = nodes[myLevel][loadMod];
					// 		tempObj.oldLevel = tempObj.level;
					// 		tempObj.level = tempObj.level - levelOffSet;

					// 		myNodes.push(tempObj);
					// 	})
					// });

	            	var maxLevel = {};

	            	var tempNodes = {};

					var treeLevel = Object.keys(nodes);
					treeLevel.forEach(function(myLevel){
						var myLM = Object.keys(nodes[myLevel]);

						if(myLM.length == 0){
							levelOffSet += 1;
						}

						myLM.forEach(function(loadMod){

							var tempObj = nodes[myLevel][loadMod];
							tempObj.oldLevel = tempObj.level;
							tempObj.level = tempObj.level - levelOffSet;

							if(maxLevel[loadMod] == null){
								maxLevel[loadMod] = 0;
							}

							maxLevel[loadMod] = Math.max(maxLevel[loadMod], tempObj.level);

							tempNodes[loadMod] = tempObj;

							myNodes.push(tempObj);
						})
					});

					var lmNodes = Object.keys(tempNodes);
					//refinement
					for(var i = 0; i < 20; i++){
						lmNodes.forEach(function(lmN){
							var parents = tempNodes[lmN]["parentLMProcID"];
							if(parents){
								var lvl = 0;
								parents.forEach(function(par){
									if(maxLevel[par] != null){
										lvl = Math.max( lvl, maxLevel[par] );
									}
								});

								var newLevel = lvl + 1;
								tempNodes[lmN].level = newLevel;
								if(maxLevel[lmN]){
									maxLevel[lmN] = newLevel;
								}

								if(lmN == "LM7091"){
									console.log('this node parent lv is');
									console.log(lvl);
								}
							}

						})
					}					

					myNodes = [];
					lmNodes.forEach(function(lmN){
						// var parents = tempNodes[lmN]["parentLMProcID"];
						myNodes.push(tempNodes[lmN]);
					})			

					console.log(myNodes);
					console.log(edges);				

					// console.log(myNodes);
					$('#procedure_view').empty();
					sankeyVis = new Sankey({
						ID: "#procedure_view",
						width: $("#procedure_view").width(),
						height: $("#procedure_view").height(),
						// width: width,
						// height: height,
						margin: {top: 10, right: 10, bottom: 10, left: 10},
						data: {"nodes": myNodes, "links": edges},
						colorScale : sankColor,
						clickCallBack: nodeClickCallBack
					})					

					d3.selectAll('.node text').style('opacity', 1);

					spinner.stop();


	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});

		}

		function splitNode2(){
			var idList = $('input:checkbox:checked.list_checkbox').map(function () {
			  return parseInt(this.value);
			}).get();

			console.log(idList);
			spinner.spin(target);
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/splitNode',
	            data: {"idList" :  idList},
	            success: function(newData){

	            	console.log("done with node split");
					
	                //somecoment
	            	console.log(newData);
	            	console.log('done with getting data');
	            	var data = newData;
	            	var offSet = 0;
	            	nodes = data["nodes"];
	            	edges = data["edges"];
	            	var myNodes = [];

	            	var labelList = Object.keys(nodes);
	            	labelList.forEach(function(lab){
	            		var tempObj = nodes[lab];
	            		myNodes.push(tempObj);
	            	})

	            	edgeList = data["edgeList"];
	            	nodeList = data["nodeList"];

					// console.log(myNodes);
					$('#procedure_view').empty();
					sankeyVis = new Sankey({
						ID: "#procedure_view",
						width: $("#procedure_view").width(),
						height: $("#procedure_view").height(),
						// width: width,
						// height: height,
						margin: {top: 10, right: 10, bottom: 10, left: 10},
						data: {"nodes": myNodes, "links": edges},
						toolTipData : {"edgeList" : edgeList, "nodeList": nodeList},
						// spinner: spinner,
						clickCallBack: nodeClickCallBack
					})	

					sankColor = sankeyVis.colorScale;				

					d3.selectAll('.node text').style('opacity', 1);
					console.log('done with layout');

					spinner.stop();


	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});			
		}

		//this function split the 
		// function splitNodeByParents(parentProcList, nodeLabel, nodeSpecialID){
		function splitNodeByParents(){
			var nodeLabel = currentClickNode["nodeLabel"];
			var nodeSpecialID = currentClickNode["nodeSpecialID"];
			var parentProcList = {};
			spinner.spin(target);
			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/splitNodeByParents',
	            data: {"parentProcList" :  parentProcList, "nodeLabel" : nodeLabel, "nodeSpecialID" : nodeSpecialID},
	            success: function(newData){

	            	console.log("done with node split");
					
	            	console.log(newData);
	            	console.log('done with getting data');
	            	var data = newData;
	            	var offSet = 0;
	            	nodes = data["nodes"];
	            	edges = data["edges"];
	            	var myNodes = [];

	            	var labelList = Object.keys(nodes);
	            	labelList.forEach(function(lab){
	            		var tempObj = nodes[lab];
	            		myNodes.push(tempObj);
	            	})

	            	edgeList = data["edgeList"];
	            	nodeList = data["nodeList"];

					// console.log(myNodes);
					$('#procedure_view').empty();
					sankeyVis = new Sankey({
						ID: "#procedure_view",
						width: $("#procedure_view").width(),
						height: $("#procedure_view").height(),
						// width: width,
						// height: height,
						margin: {top: 10, right: 10, bottom: 10, left: 10},
						data: {"nodes": myNodes, "links": edges},
						toolTipData : {"edgeList" : edgeList, "nodeList": nodeList},
						// spinner: spinner,
						clickCallBack: nodeClickCallBack
					})	

					sankColor = sankeyVis.colorScale;				

					d3.selectAll('.node text').style('opacity', 1);
					console.log('done with layout');

					spinner.stop();


	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});				
		}
		//this function split the entry points of the parent nodes
		function splitParentNode(node){
			var currentNodeSankeyID = node.myID;
			var parentsSpecialID = [];

			console.log(currentNodeSankeyID);

			console.log(edges);

			//get parent special id based on the edges
			edges.forEach(function(edge){
				//this edge's target is me
				//that mean the source is my parent
				if(edge["targetID"] == currentNodeSankeyID){
					var parentSpcID = edge["sourceSpcID"];
					if(parentsSpecialID.indexOf(parentSpcID) == -1){
						parentsSpecialID.push(parentSpcID);
					}
				}
			});

			//loop through the parent spc id
			//for each, get the function id
			parentsSpecialID.forEach(function(parentSpecID){

			})


			console.log(parentsSpecialID);

			$.ajax({
	            type:'GET',
	            contentType: 'application/json',
	            dataType: 'json',
	            url: '/getLists',
	            data: {"specialIDs" : parentsSpecialID},
	            success: function(newData){

	            	console.log("done with getting lists of functions for parents");
	            	console.log(newData);
	            },
	            error: function(){
	            	console.log("There was problem with getting the data");
	            }	
			});					

			//sort them by inclusive time
			//lable each function clearly with time and lm
			//let the user select which function to split
			//this is to keep consistent with the other split method

		}

		function getEntryPoints(specID){

		}

		function brushCallBack(processIDList){
			edges.forEach(function(edge){
				var idList = edge["nodeIDList"];
				var edgeValue = 0;
				idList.forEach(function(id){
					var runTime = nodeMetrics[id]["inc"];
					processIDList.forEach(function(procid){
						edgeValue += runTime[procid];
					})
				})
				edge["value"] = edgeValue;
			});


        	var myNodes = [];

        	var labelList = Object.keys(nodes);
        	labelList.forEach(function(lab){
        		var tempObj = nodes[lab];
        		myNodes.push(tempObj);
        	})


			// console.log(myNodes);
			$('#procedure_view').empty();
			sankeyVis = new Sankey({
				ID: "#procedure_view",
				width: $("#procedure_view").width(),
				height: $("#procedure_view").height(),
				// width: width,
				// height: height,
				margin: {top: 10, right: 10, bottom: 10, left: 10},
				data: {"nodes": myNodes, "links": edges},
				toolTipData : {"edgeList" : edgeList, "nodeList": nodeList},
				// spinner: spinner,
				clickCallBack: nodeClickCallBack
			})	

			sankColor = sankeyVis.colorScale;				

			d3.selectAll('.node text').style('opacity', 1);
		}