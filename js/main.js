$(document).ready(function(){	
	var myObject = (function() {		
	//文档中定义的变量
		//加法add; 减法minus
		var choose_type = 'add'; 
		//单人游戏:single; 双人游戏:double
		var model = '';
		//单人模式下，用户选择的id，0表示喜洋洋，1表示灰太狼
		var user_id = -1;

	//自己定义的变量
		var level = 1;
		//为true的话，会alert：最后会删除
		//计算反应时间
		var start_click = 0;
		var end_click = 0;
		var now_position = [0, 0];
		//最先到达终点的用户 总得分
		var end_score = 0;
		//数字相同时，先点击的，点击结果
		var equal_first_result = 0;	

		//phase需要清空的
		//记录一次游戏内四种点击的次数
		var click_array = [0, 0, 0, 0];
		var users_step = [0, 0];
		var users_time = [0, 0];
		var step = 0;
		var end_position = 0;
		var click_target = -1;
		var sfp = {};
		var color_tr = ['#85b119', '#dc411d', '#8eb562', '#c5eed', '#2ba703', '#6f2957', '#5a07c', '#495527', '#c212e2', '#63e872']; 
		var color_p = ['#7a4ee6', '#23bee2', '#714a9d', '#f3a112', '#d458fc', '#90d6a8', '#fa5f83', '#b6aad8', '#3ded1d', '#9c178d']; 


	//需要记录的字段
		var Numset_1 = 0;
		var Timeset_1 = []; 
		var radiolist1set_1 = 0;
		var radiolist2set_1 = 0;
		var radiolist3set_1 = []; 
		var radiolist4set_1 = 0; 
		var radiolist5set_1 = 0; 
		var radiolist6set_1 = 0; 

		//这里先定义，根据用户的选择结果决定使用哪个变量
		var Numset_2 = 0;
		var Timeset_2 = []; 
		var radiolist1set_2 = 0;
		var radiolist2set_2 = 0;
		var radiolist3set_2 = []; 
		var radiolist4set_2 = 0; 
		var radiolist5set_2 = 0; 
		var radiolist6set_2 = 0;

		//把tr的动物封装为parabola对象
		var parabola = function(a, left){
			return new Parabola({
			        el: '#users_'+(a+1),
			        offset: [50, 0],
			        curvature: 0.005,
			        duration: 250,
			        callback:function(){			            
			            if(($('#users_'+(a+1)).position().left+1) < left){
			            	setTimeout(function(){
			            		parabolaJump(a, left);
			            	}, 100);			            	
			            }else{
			            	phase(a);
			            }
			        }
			       });
		}
		
		/*
		*根据level取得终点的位置
		*/
		var levelToEndpos = function(level){
			var result = 0;

			if(level == 1){
				result = 10;
			}else if(level == 2){
				result = 10;
			}else if(level == 3){
				result = 20;
			}else if(level == 4){
				result = 30;
			}else if(level == 5){
				result = 30;
			}else{
				console.log('level error, level='+level);				
			}

			return result;
		}

		/*
		*得到移动的距离
		*/
		var getStep = function(){
			var result = 0;

			if(choose_type == 'add'){
    			//加法
    			result = users_step[0]+users_step[1];
    		}else{
    			//减法
    			result = Math.abs(users_step[0]-users_step[1]);
    		}

    		return result;
		}

		/*
		*得到基本分，没有返回值
		*/
		var getBaseScore = function(a){
			if(choose_type == 'add'){
    			//加法  
    			if(a == 0){
    				radiolist1set_1 += step*3;
    				Numset_1 += step*3;
    			}else{
    				radiolist1set_2 += step*3;
    				Numset_2 += step*3;
    			}    			
    		}else{
    			//减法
    			var temp = users_step[0]+users_step[1]
    			if(a == 0){
    				radiolist1set_1 += temp*3;
    				Numset_1 += step*3;
    			}else{
    				radiolist1set_2 += temp*3;
    				Numset_2 += step*3;
    			}    			
    		}
		}

		/*
		*电脑自动移动时，需要找到它的目标地点
		*/
		var findTarget = function(a){

			var result = 0;

			var dom_array = $('#users_'+(a+1)+'_tr td');
			for(var i=0, l=dom_array.length; i<l; i++){
				if($(dom_array[i]).text() == now_position[a]){
					result = $(dom_array[i]).position().left;
				}
			}

			return result;

		}

		/*
		*需要记录的字段
		*/
		var record_6341 = function(a){
			if(a == 0){
				//记录计算总次数
				radiolist6set_1 += 1;
    			//记录准确度
    			radiolist3set_1.push(1);
    			radiolist4set_1 += 1;
    			getBaseScore(a);
			}else{
				//记录计算总次数
				radiolist6set_2 += 1;
    			//记录准确度
    			radiolist3set_2.push(1);
    			radiolist4set_2 += 1;
    			getBaseScore(a);
			}			
		}

		/*根据级数返回需要增加的跑到内容
		*输入：级数
		*输出：新增跑道内容
		*/
		var level_to_road = function(level){
			var result = '';

			result += '<td style="background-image:url(images/start.png)"><p></p></td>';
			if(level == 1 || level == 2){
				for(var i = 1; i < 11; i++){
					// var color_value = getRandomColor();
					result += '<td style="background:'+color_tr[i-1]+'; color:#'+color_p[i-1]+'"><p>'+i+'</p></td>'; 
				}
			}else if(level == 3){
				for(var i = 1; i < 21; i++){
					$('.road').css('width', '100%');
					result += '<td style="background:'+color_tr[(i-1)%10]+'; color:#'+color_p[(i-1)%10]+'"><p>'+i+'</p></td>';
				}				 
			}else if(level == 5 || level == 4){
				$('.road').css('width', '100%');
				for(var i = 1; i < 31; i++){
					result += '<td style="background:'+color_tr[(i-1)%10]+'; color:#'+color_p[(i-1)%10]+'"><p>'+i+'</p></td>';
				}
			}else{
				return;
			}
			result += '<td style="background-image:url(images/end.png)"><p></p></td>';

			return result;
		}

		/*根据级数返回随机数
		*输入：级数
		*输出：随机数
		*/
		var level_to_step = function(level){
			var result = 0;

			if(level == 1){
				result = Math.ceil(Math.random()*2);
			}else if(level == 2){
				result = Math.ceil(Math.random()*3);
			}else if(level == 3){
				result = Math.ceil(Math.random()*5);
			}else if(level == 4){
				result = Math.ceil(Math.random()*5);
			}else if(level == 5){
				result = Math.ceil(Math.random()*10);
			}else{
				console.log('level error; level='+level);
				return;
			}

			return result;
		}

		/*
		*计算速度加分，无返回值
		*/
		var speedScore = function(a){

			if(users_time[a] < 1000){
				if(a == 0){
					radiolist2set_1 += 3;
					Numset_1 += 3;
				}else{
					radiolist2set_2 += 3;
					Numset_2 += 3;
				}				
			}else if(users_time[a] < 2000){
				if(a == 0){
					radiolist2set_1 += 2;
					Numset_1 += 2;
				}else{
					radiolist2set_2 += 2;
					Numset_2 += 2;
				}
			}else if(users_time[a] < 3000){
				if(a == 0){
					radiolist2set_1 += 1;
					Numset_1 += 1;
				}else{
					radiolist2set_2 += 1;
					Numset_2 += 1;
				}
			}else{
				console.log('反应时间超过3000ms');
			}

		};

		var parabolaJump = function(a, left){
			var user = parabola(a, left);
			user.start();
		}		

		/*
		*如果移动的距离未超过终点,只是为了把startMove切分一下
		*/
		var stepInEnd = function(a){

			var pos = $(click_target).text();
			if(now_position[a]+step == pos){					
				equal_first_result = 1;	
				record_6341(a);
					
				var left_val = 0;
				if(level > 3){
					left_val = $(click_target).position().left-5;
    			}else{
    				left_val = $(click_target).position().left;
    			}
    			//达到了终点
    			if(pos == end_position){
    				if(a == 0){
						radiolist2set_1 += 20;
						Numset_1 += 20;
						end_score = Numset_1;
					}else{
						radiolist2set_2 += 20;
						Numset_2 += 20;
						end_score = Numset_2;
					}
	    			parabolaJump(a, left_val+50);
    			}else{    				
	    			parabolaJump(a, left_val);
    			}
    			now_position[a] = +pos;	    				        			
    		}else{
    			//点击了错误的位置
    			if(a == 0){
    				radiolist3set_1.push(0);
    			}else{
    				radiolist3set_2.push(0);
    			}	    			
    			//数字相同，先点，点击错误
    			if((users_step[a] == users_step[1-a]) && (users_time[1-a] == 0)){
					//不运行pahse()
				}else{
					phase(a);
				}    			
    		}
		}

		/*
		*如果移动的距离未超过终点,只是为了把startMove切分一下
		*/
		var stepInEnd_s = function(a){
			
			equal_first_result = 1;
			record_6341(a); 
			now_position[a] = +(now_position[a]+step);
			var left_val = findTarget(a);
			if(level > 3){
				left_val = left_val-5;
			}else{
				left_val = left_val;
			}			   			
			//电脑移动，到达终点
			if(now_position[a] == end_position){
				if(a == 0){
					radiolist2set_1 += 20;
					Numset_1 += 20;
					end_score = Numset_1;
				}else{
					radiolist2set_2 += 20;
					Numset_2 += 20;
					end_score = Numset_2;
				}				 
				parabolaJump(a, left_val+50);
			}else{				
				parabolaJump(a, left_val);
			}				
		}

		/*
		*如果移动的距离超过终点,
		*/
		var stepOverEnd = function(a){

			var pos = $(click_target).text();				
			if(pos == end_position){				
				equal_first_result = 1;
				if(a == 0){
					radiolist2set_1 += 20;
					Numset_1 += 20;
					end_score = Numset_1;
				}else{
					radiolist2set_2 += 20;
					Numset_2 += 20;
					end_score = Numset_2;
				}		        				
				
				record_6341(a); 

    			now_position[a] = +pos;
    			var left_val = 0;
    			if(level > 3){
    				left_val = $(click_target).position().left-5;
    			}else{
    				left_val = $(click_target).position().left;
    			}    			
    			parabolaJump(a, left_val+50);	    
			}else{
				//点击了错误的位置
    			if(a == 0){
    				radiolist3set_1.push(0);
    			}else{
    				radiolist3set_2.push(0);
    			}
    			//数字相同，先点，点击错误
    			if((users_step[a] == users_step[1-a]) && (users_time[1-a] == 0)){
					//不运行pahse()
				}else{
					phase(a);
				} 
			}			
					
		}

		/*
		*如果移动的距离超过终点,
		*/
		var stepOverEnd_s = function(a){

			equal_first_result = 1;
			//电脑移动，超过终点，不会出错，只能到达终点
			if(a == 0){
				radiolist2set_1 += 20;
				Numset_1 += 20;
				end_score = Numset_1;
			}else{
				radiolist2set_2 += 20;
				Numset_2 += 20;
				end_score = Numset_2;
			}

			record_6341(a); 	

			now_position[a] = end_position;

			var left_val = findTarget(a);
			//微调位置
			if(level > 3){
				left_val = left_val-5;
			}else{
				left_val = left_val;
			}			
			parabolaJump(a, left_val+50);					
		}

		/*
		*距离和终点的中转站
		*/
		var stepAndEnd = function(a){

			if(model == 'double'){

				//如果移动的距离超过终点						
				if(now_position[a]+step > end_position){

					stepOverEnd(a);

				}else{

					stepInEnd(a);

				}

			}else{

				//如果移动的距离超过终点						
				if(now_position[a]+step > end_position){

					stepOverEnd_s(a);

				}else{

					stepInEnd_s(a);

				}

			}			

		}

		/*
		*trClick基本操作，从之前没点过开始；电脑自己移动，没有点击e
		*/
		var startMove = function(a, e){
			
			//记录计算总次数
			if(a == 0){
				radiolist5set_1 += 1;
			}else{
				radiolist5set_2 += 1;
			}			
			click_array[a+2] = 1;
			
			e = e || window.event;
			click_target = e.target || e.srcElement;			

			stepAndEnd(a);
			
		}

		/*
		*trClick基本操作，从之前没点过开始；电脑自己移动，没有点击e
		*/
		var startMove_s = function(a, e){
			
			//记录计算总次数
			if(a == 0){
				radiolist5set_1 += 1;
			}else{
				radiolist5set_2 += 1;
			}			
			click_array[a+2] = 1;						

			stepAndEnd(a);
			
		}

		/*
		*tr的点击事件处理程序:单人模式下，给用户添加事件
		*/
		var trClick_d = function(a, e){
			sfp.choose_type = choose_type;
			sfp.model = model;
			sfp.user_id = user_id;
			sfp.level = level;
			sfp.now_position = now_position;
			sfp.equal_first_result = equal_first_result;
			sfp.click_array = click_array;
			sfp.users_step = users_step;
			sfp.users_time = users_time;
			sfp.step = step;
			sfp.end_position = end_position;
			sfp.click_target = click_target;

			console.log('sfp:'+JSON.stringify(sfp));
			
			//判断user click是否完成
			if((click_array[a] == 1) && (click_array[1-a] == 1)){
				//用户点击完成

				//跑动距离
				step = getStep();				

				if(users_step[a] < users_step[1-a]){

				}else if(users_step[a] == users_step[1-a]){
					//数字相同

					//之前没有点击过
					if(click_array[a+2] == 0){

						//计算反应时间
			    		end_click = Date.now();
						users_time[a] = end_click-start_click;
						if(a == 0){
							Timeset_1.push(users_time[a]);
						}else{
							Timeset_2.push(users_time[a]);
						}
						//另一个用户未点击
						if(users_time[1-a] == 0){

							startMove(a, e);

						}else{
							//用户点了，但是没点对
							if(equal_first_result != 1){

								startMove(a, e);

							}
							
						}

					}else{
						console.error('click already');
					}

				}else{
					//数字大
					//之前没有点击过
					if(click_array[a+2] == 0){

						startMove(a, e);

					}else{
						console.error('click already');
					}
				}
        		
			}else{
				console.error('还有用户未点击');				
			}
		};

		/*
		*a为电脑 数字变气球 负责检查数字大小 决定road点击和变化
		*/
		var singleRoad = function(){
			
			//判断user click是否完成
			if((click_array[user_id] == 1) && (click_array[1-user_id] == 1)){
				//用户点击完成

				//跑动距离
				step = getStep();

				if(users_step[user_id] < users_step[1-user_id]){
					//电脑的数字大

					//直接执行点击事件（移动），没有时间间隔
					//之前没有点击过
					if(click_array[3-user_id] == 0){

						startMove_s(1-user_id);

					}else{
						console.error('click already');
					}

				}else if(users_step[user_id] == users_step[1-user_id]){
					//数字大小相同

					//产生一个10-20s的随机数
					var ran_time = Math.random()*10000+10000;
					setTimeout(function(){						

						//之前没有点击过
						if(click_array[3-user_id] == 0){

							//计算反应时间
				    		end_click = Date.now();
							users_time[1-user_id] = end_click-start_click;
							if(user_id == 0){
								Timeset_1.push(users_time[1-user_id]);
							}else{
								Timeset_2.push(users_time[1-user_id]);
							}
							//另一个用户未点击
							if(users_time[user_id] == 0){

								startMove_s(1-user_id);

							}else{
								//用户点了，但是没点对
								if(equal_first_result != 1){

									startMove_s(1-user_id);

								}
								
							}

						}else{
							console.error('click already');
						}

					}, ran_time);

				}else{

					console.error('user_id:'+user_id+'; 用户数字大，正常');

				}

			}else{

				console.error('还有用户未点击');
				
			}						
		}

		/*
		*user click 基本操作
		*/
		var userClickOperate = function(a){

			var pos = $('#users_'+(a+1)+'_b').position();
				        
	        $('#users_'+(a+1)+'_b').animate({
	              'top':pos.top - 65 + 'px'
	          }, 150, 'swing', function(){
	            $('#users_'+(a+1)+'_bal').removeClass('balloon').addClass('broke_num');  
	            users_step[a] = level_to_step(level);    
	            $('#users_'+(a+1)+'_bal').html('<p>'+users_step[a]+'</p>');
	          });

	        setTimeout(function(){
	            $('#users_'+(a+1)+'_b').animate({
	            'top': pos.top + 'px'
	            }, 150, 'swing', function(){
	            	if(model == 'single' && a != user_id){				

						//电脑点击的话
						singleRoad();			

					}              
	            });
	        }, 150);

			click_array[a] = 1;
			start_click = Date.now();		

		};

		/*
		*user的点击事件处理程序
		*/
		var userClick_d = function(a){
			sfp.choose_type = choose_type;
			sfp.model = model;
			sfp.user_id = user_id;
			sfp.level = level;
			sfp.now_position = now_position;
			sfp.equal_first_result = equal_first_result;
			sfp.click_array = click_array;
			sfp.users_step = users_step;
			sfp.users_time = users_time;
			sfp.step = step;
			sfp.end_position = end_position;
			sfp.click_target = click_target;

			// console.log('sfp:'+JSON.stringify(sfp));

			//如果没有点击过
			if(click_array[a] == 0){

				userClickOperate(a);				
				
			}			

		};

		/*
		*user的点击事件处理程序
		*/
		var userClick_s = function(a){
			sfp.choose_type = choose_type;
			sfp.model = model;
			sfp.user_id = user_id;
			sfp.level = level;
			sfp.now_position = now_position;
			sfp.equal_first_result = equal_first_result;
			sfp.click_array = click_array;
			sfp.users_step = users_step;
			sfp.users_time = users_time;
			sfp.step = step;
			sfp.end_position = end_position;
			sfp.click_target = click_target;

			// console.log('sfp:'+JSON.stringify(sfp));

			//如果没有点击过
			if(click_array[a] == 0){

				userClickOperate(a);

				setTimeout(function(){

					userClickOperate(1-a);								
					
				}, 1000 );				
				
			}						

		};

		/*
		*为user和road（1,2）添加click事件
		*/
		var addEvent_user_d = function(a){
			//点击user的气球			
			$('#users_'+a+'_bal').on('click', function(){
				userClick_d(a-1);	
			});
			
			//为user 的tr加click事件
			$('#users_'+a+'_tr').on('click', function(e){
				//点击tr的事件处理函数
				trClick_d(a-1, e);				
			});

		};

		/*
		*为user和road（1,2）添加click事件
		*/
		var addEvent_user_s = function(a){
			//点击user的气球			
			$('#users_'+a+'_bal').on('click', function(){
				userClick_s(a-1);	
			});
			
			//为user 的tr加click事件
			$('#users_'+a+'_tr').on('click', function(e){
				//点击tr的事件处理函数
				trClick_d(a-1, e);				
			});

		};

		/*
		*dialog close之后，给气球和road添加的事件
		*
		*/
		var addEvent = function(){

			//根据级数，确定终点的位置
			end_position = levelToEndpos(level);

			if(model == 'double'){

				addEvent_user_d(1);
				addEvent_user_d(2);				

			}else{
			//单人模式

				if(user_id == 0){

					//给1添加点击事件
					addEvent_user_s(1);

				}else{

					//给2添加点击事件
					addEvent_user_s(2);
					
				}

			}

		};

		//程序开始前的准备工作:对话框--addEvent;
		var prepare = function() {

			$('#choose_1').on('click', function(){
				user_id = 0;
				$( "#select_animal" ).dialog( "close" );
	            $('#choose_1').css('display', 'none');
		        $('#choose_2').css('display', 'none');
		        addEvent();
			});

			$('#choose_2').on('click', function(){
				user_id = 1;
				$( "#select_animal" ).dialog( "close" );
	            $('#choose_1').css('display', 'none');
		        $('#choose_2').css('display', 'none');
		        addEvent();
			});

			//单人模式，双人模式对话框
			$('#select_level').dialog({
				resizable: false,
		    	height:240,
		        modal: true,
		        buttons: {
		        	"开始": function(){
		        		level = $('input[name="level"]:checked').val();
		        		// console.log('level:'+level);
		        		//改变格子
		        		var road_content = level_to_road(level)
		        		// console.log('road_content:'+road_content);
		        		$('tr').html('');
						$('tr').append(road_content);
						if(level > 3){
							$('#users_1').css('left', '-5px');
							$('#users_2').css('left', '-5px');
						}
						$( "#select_level" ).dialog( "close" );
		        		$( "#select_model" ).dialog({
					      resizable: false,
					      height:140,
					      modal: true,
					      buttons: {
					        "单人模式": function() {
					        	model = 'single';
					        	$('#choose_1').css('display', 'inline-block');
					        	$('#choose_2').css('display', 'inline-block');
					        	$( "#select_model" ).dialog( "close" );
					            $( "#select_animal" ).dialog({
							      resizable: false,
							      height:190,
							      modal: true				      
							    });
					        },
					        '双人模式': function() {
					        	model = 'double';
					        	$( this ).dialog( "close" );
					            addEvent();	
					        }
					      }
					    });
		        	}
		        }
			})
		    
		};

				

		/*
		 * 一个回合结束后的操作
		 * @param 
		 * @return 
		 */
		var phase = function(a){

		 	//判断移动完成：数组元素是否全为1
		 	if((click_array[2]+click_array[3]) == 0){
		 		//road中都没有点击

		 	}else{ 
		 				 		
		 		//触发phase的用户，点击正确，再看时间
		 		if(equal_first_result == 1){
		 			speedScore(a);
		 		}
						 		
		 		click_array = [0, 0, 0, 0];
				users_step = [0, 0];
				users_time = [0, 0];
				step = 0;
				equal_first_result = 0;	
				click_target = -1;

				//把数字变为气球
				$('#users_1_bal').html('<img src="images/click.png"><p>点这里</p>');
				$('#users_1_bal').removeClass('broke_num').addClass('balloon');
				$('#users_2_bal').html('<img src="images/click.png"><p>点这里</p>');
				$('#users_2_bal').removeClass('broke_num').addClass('balloon');		
				// out();
				//有没有到终点
				if(end_score == 0){
					//没有到终点
				}else{
					//到终点
					now_position = [0, 0];
					//判断是进行下一次游戏还是下一关游戏
			 		var normative_score = normativeScore(end_score);
			 		if(normative_score > 4){
			 			//下一关游戏			 			
			 			if(level == 5){
			 				alert('恭喜你闯关成功！');
			 				//整个游戏完全结果，可在此输出所有的指标
			 				end();
			 			}else{
			 				end_score = 0;
			 				alert('恭喜你闯关成功，请继续下一关！');
			 				//用户回到最初的位置
			 				$('#users_1').css('left', '0px');
			 				$('#users_2').css('left', '0px');

			 				level++;
			 				//根据级数，确定终点的位置
							end_position = levelToEndpos(level);			 			
				 			//改变格子			 			
							var road_content = level_to_road(level);
							$('tr').html('');
							$('tr').append(road_content);
							if(level > 3){
								$('#users_1').css('left', '-5px');
								$('#users_2').css('left', '-5px');
							}
							//还需微调road width.
			 			}			 					 			

			 		}else{
			 			//4分或4分以下
			 			alert('闯关惜败，再来一次!');
			 		}
				}		 		
		 	}

		 };

		 /*
		*根据最先到达终点的用户的总得分，计算出常模分数
		*/
		var normativeScore = function(score){

			var result = 0;

			result = 5;

			return result;
		}

		/*
		* 输出需要记录的字段
		*/
		var out = function(){
			console.error('喜洋洋');
			console.log('Numset_1:'+Numset_1);
			console.log('Timeset_1:'+Timeset_1);
			console.log('radiolist1set_1:'+radiolist1set_1);
			console.log('radiolist2set_1:'+radiolist2set_1);
			console.log('radiolist3set_1:'+radiolist3set_1);
			console.log('radiolist4set_1:'+radiolist4set_1);
			console.log('radiolist5set_1:'+radiolist5set_1);
			console.log('radiolist6set_1:'+radiolist6set_1);

			console.error('灰太狼');
			console.log('Numset_2:'+Numset_2);
			console.log('Timeset_2:'+Timeset_2);
			console.log('radiolist1set_2:'+radiolist1set_2);
			console.log('radiolist2set_2:'+radiolist2set_2);
			console.log('radiolist3set_2:'+radiolist3set_2);
			console.log('radiolist4set_2:'+radiolist4set_2);
			console.log('radiolist5set_2:'+radiolist5set_2);
			console.log('radiolist6set_2:'+radiolist6set_2);			
		}

		/*
		* 游戏结束时的操作
		* @param 
		* @return 
		*/
		var end = function(){
			console.log('游戏完全结束，此函数用来输出指标');
		};

		return {
			prepare : prepare,
		}
	})();    

	//直接自动执行		
	myObject.prepare();
	
});






