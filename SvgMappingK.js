/**
 * SvgMappingK
 * 
 * @note
 * Data mapping into SVG format map.
 * Mapping data is displayed as a point on the map.
 * When in edit mode, you can change the position by click.
 * Change the point is reflected in the data.And you can get the data.
 *
 * ## jp
 * データをSVG形式の地図にマッピングします。
 * マッピングしたデータは地図上に地点として表示されます。
 * 編集モードにすると、地図をクリックして地点の位置を変更できます。
 * 変更した地点はデータに反映されます。そしてデータを取得できます。
 * 
 * 
 * @version 0.5
 * @date 2016-9-9
 * @auther kenji uehara
 */


var SvgMappingK = function(){
	
	
	this.data;
	this.xid; // Svg element id.
	this.option;
	this.moveFlg; // Flag of the point movement.
	this.moveIndex; // Index of the  point movement.
	
	var myself=this;// An instance of this class
	
	/**
	 * Initialization
	 * @param string xid selector
	 * @param array data 
	 * @throw Error
	 */
	this.init = function(xid,svg_src,data,option){
		
		// To Set value to empty value for option.
		this.option = setOptionButEmpty(xid,svg_src,option);
		
		// Inlining outside svg
		$('#' + xid).load(svg_src, function(){
			
			data = setDataButEmpty(data);// To Set value to empty value
			
			refreshMap(xid,data,0);// svg map refresh 
			
			myself.data = data;
			myself.xid = xid;
		});
		

	};
	
	/**
	 * Switching the mode
	 * 
	 * @param mode   0:public mode  1:edit mode
	 * 
	 */
	this.modeSwitching = function(mode){

		refreshMap(this.xid,this.data,mode);// svg map refresh 
	}
	
	
	// svg map refresh
	function refreshMap(xid,data,mode){

		var slt = '#' + xid;
		var svg = $(slt + ' svg');

		// create map points
		for(var i=0 in data){
			
			var ent = data[i];
			var id = xid + '_' + ent['id'];

			var caption = '';
			if(mode == 1){
				caption = ent['name'];
			}else{
				if(ent['url']==null){
					caption = ent['name'];
				}else{
					caption = "<a href='" + ent['url'] + "' fill='" + ent['color'] + "'>" + ent['name'] + "</a>";
				}
				
			}
			
			var ptHtml = "<text id='" + id + "' x='" + ent['x'] + "' y='" + ent['y'] + "' fill='" + ent['color'] + "' index='" + i + "' >" + caption + "</text>";
			
			var pointSlt = '#' + id;
			if($(pointSlt)[0]){
				$(pointSlt).remove();
			}
			svg.append(ptHtml);
			
			
		}
		
		$(slt).html($(slt).html());// svg redraw
		
		// To view the operation board.
		if(mode == 1){
			showOperationBoard();
			addClickAndMove();
		}

	};
	
	
	// Add a point moving event by click.
	function addClickAndMove(){
		
		// If it is not a moving Mode, return.
		if(this.moveFlg==1){
			return;
		}

		for(var i=0 in myself.data){
			var ent = myself.data[i];
			var id = ent['id'];
			var slt = '#' + myself.xid + '_' + id;
			

			$(slt).click(function(){
				moveByClick(this);
				
			});
			
		}
		
	}
	
	// ■■■□□□■■■□□□■■■□□□続き
	function moveByClick(e){
		var index = $(e).attr('index');
		
		var ent = myself.data[index];
		
		console.log(ent);//■■■□□□■■■□□□■■■□□□)
		//option['move_color']
	}

	
	// To view the operation board.
	function showOperationBoard(){
		
		var obSlt = '#' + myself.option.ope_board;
		var slt = '#' + myself.option.xid;
		
		if($(obSlt)[0]==undefined){
			
			$(slt).after("<div id= '" + myself.option.ope_board + "' >いろは</div>");
		}
	};
	
	
	// To Set value to empty value
	function setDataButEmpty(data){
		for(var i=0 in data){
			var ent = data[i];
			
			if(_isEmpty(ent['id']) == true){
				throw new Error("id is empty : data[" + i + "]['id'] = empty");
			}
			
			if (_isEmpty(ent['name'])){
				ent['name'] = ent['id'];
			}
			
			if (_isEmpty(ent['url'])){
				ent['url'] = null;
			}
			
			if (_isEmpty(ent['x'])){
				ent['x'] = i * 20;
			}
			
			if (_isEmpty(ent['y'])){
				ent['y'] = i * 20;
			}
			
			if (_isEmpty(ent['color'])){
				ent['color'] = '#164185';
			}

		}
		
		return data;
	}
	
	
	// To Set value to empty value for option.
	function setOptionButEmpty(xid,svg_src,option){
		if(option == null){
			option = {};
		}
		
		if (_isEmpty(option['xid'])){
			option['xid'] = xid;
		}
		
		// element of operation board
		if (_isEmpty(option['ope_board'])){
			option['ope_board'] = xid + '_ope_board';
		}
		
		// A moving selection color.
		if (_isEmpty(option['move_color'])){
			option['move_color'] = '#de5246';
		}
		

		return option;
		
		
	}
	
	// Check the value is empty
	function _isEmpty(v){
		if(v =='' || v==null){
			return true;
		}else{
			return false;
		}
	};
	
	
};