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
				// id: 'control',
				componentState: {id : "control" },
				isClosable: false,
				title: "Control"								
			    },								
			    {
				type: 'component',
				componentName: 'testComponent',
				componentState: {id : "info_view" },
				isClosable: false,
				title: "Node Info"
			    },								
			    // {
			    // 	type: 'component',
			    // 	componentName: 'testComponent',
			    // 	componentState: {id : "hist_view" },
			    // 	isClosable: false,
			    // 	title: "Histogram View"
			    // },
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

			// type: 'component',
			// componentName: 'testComponent',
			// // id: 'control',
			// componentState: {id : "lm_view" },
			// isClosable: false,
			// title: "LM View"		

			type: 'component',
			componentName: 'testComponent',
			componentState: {id : "hist_view" },
			isClosable: false,
			title: "Histogram View"														
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
			title: 'Graph View'
		    }
		]
		
	    }
	]
    }]			
}

function updateDivSizes(){
    ids.forEach(function(myid){
	$("#" + myid).width( $("#" + myid).parent().width() );
	$("#" + myid).height( $("#" + myid).parent().height() );
    })		

    if(sankeyVis){
	// console.log(d3.select("#procedure_view svg"));
	// d3.select("#procedure_view svg")
	// 	.attr("width", $("#procedure_view").width() )
	// 	.attr("height", $("#procedure_view").height() )

	sankeyVis.updateSize({'width' : $("#procedure_view").width(),
			      'height' : $("#procedure_view").height() })



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
