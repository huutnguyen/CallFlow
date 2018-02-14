function initializeControlView(){
    var label = document.createElement("label");
    var description = document.createTextNode('Show Name: ');
    var checkbox = document.createElement("input");
    
    checkbox.type = "checkbox";
    // checkbox.name = dat["name"];
    // checkbox.value = dat["procID"];
    checkbox.setAttribute('id', "showLabelBox");

    label.appendChild(description);
    label.appendChild(checkbox);

    document.getElementById('control').appendChild(label);

    $('#showLabelBox').attr('checked',false);
    
    //create a dropdown to select color option
    var dropDownData = {
	'0': 'Name',
	'1': 'Inclusive Runtime',
	'2': 'Exclusive Runtime',
	'3': 'Range/Avg',
	'4': 'Difference'
    }

    var $label = $("<label>").text('Color By: ');

    var s = $('<select name="colorDropDown"  id = "colorDropDown" onchange = "colorDropDownChange()" />');
    for(var val in dropDownData) {
	$('<option />', {value: val, text: dropDownData[val]}).appendTo(s);
    }

    var temp = document.createElement('div');
    temp.setAttribute("id", "dropDown");
    $('#control').append(temp);
    s.appendTo($label);
    $('#dropDown').append($label);

    var $metricLabel = $("<label>").text('Metric Color:');
    $('#control').append($metricLabel);

    temp = document.createElement('div');
    temp.setAttribute("id", "metricColorScale");
    // $("#metricColorScale").css({left: 200});
    $('#control').append(temp);

    // var w = 200, h = 70;
    // var colorScaleHeight = 30
    // var nodeRunTimeColorScale = 'OrRd';

    // var spanColor = chroma.scale(nodeRunTimeColorScale).padding([0.2, 0]).domain([0,99]);

    // // console.log(spanColor(1));

    // var timeScaleDiv = document.getElementById('metricColorScale');
    // $("#metricColorScale").width(200);
    // $("#metricColorScale").height(h);
    // for(var i = 0 ; i < 100; i++){
    // 	// nodeRunData.push(i);
    // 	var newSpan = document.createElement('span');
    // 	newSpan.style.backgroundColor = spanColor(i);
    // 	newSpan.style.display = 'inline-block';
    // 	newSpan.style.height = colorScaleHeight + 'px';
    // 	newSpan.style.width = '1%';
    // 	timeScaleDiv.appendChild(newSpan);
    // }

    // var fastSpan = document.createElement('span');
    // fastSpan.style.position = "relative";
    // fastSpan.style.left = "0";
    // fastSpan.style.fontSize = "15px";
    // fastSpan.style.fontFamily = "sans-serif";
    // fastSpan.style.top = "5px";
    // fastSpan.innerHTML = "low";
    // fastSpan.setAttribute("id", "slowAttr");
    // timeScaleDiv.appendChild(fastSpan);

    // var slowSpan = document.createElement('span');
    // slowSpan.style.position = "absolute";
    // // slowSpan.style.left = "140";
    // slowSpan.style.left = "190";
    // slowSpan.style.fontSize = "15px";
    // slowSpan.style.fontFamily = "sans-serif";
    // slowSpan.style.top = $("#metricColorScale").position().top + colorScaleHeight + 10;// + 5;
    // slowSpan.innerHTML = "high";
    // slowSpan.setAttribute("id", "fastAttr");


    // timeScaleDiv.appendChild(slowSpan);

    colorScaleLegend(0);

    var $rangeLable = $("<label>").text('Set Range:');
    $('#control').append($rangeLable);
    temp = document.createElement('div');
    temp.setAttribute("id", "setRange");
    $('#control').append(temp);
    $('<p><label for="minVal"> Min Value:  <input type="text" id="minVal" size="12" name="minVal" value="" placeholder="Input Value" /></label></p>').appendTo(temp);
    $('<p><label for="maxVal"> Max Value: <input type="text" id="maxVal" size="12" name="maxVal" value="" placeholder="Input Value" /></label></p>').appendTo(temp);

    var tButton=$('<input/>').attr({
	type: "button",
	id: "setRangeBtr",
	value: 'Set Range'
    });
    tButton.appendTo(temp);

    var $nodeSizeLabel = $('<label>').text('Set NodeSize;');
    $('#control').append($nodeSizeLabel);
    temp = document.createElement('div');
    temp.setAttribute('id', 'setNodeSize');
    $('#control').append(temp);
    $('<p><label for="maxVal"> Max Value: <input type="text" id="nodeSize" size="12" name="maxVal" value="" placeholder="Input Value" /></label></p>').appendTo(temp);

    var tButton=$('<input/>').attr({
	type: "button",
	id: "setNodeSizeBtr",
	value: 'Set node size'
    });
    tButton.appendTo(temp);    
}
