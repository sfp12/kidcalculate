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
		//抛物线跳跃的时间和间隔
		var parabola_array = [250, 100];
		//表示单人模式下，电脑的定时器，如果用户点对之后，需要停止single_sto;
		var single_sto = '';		
		//快跳和慢跳点击之后才执行跳跃，需要全局变量来传参数
		var p_a = '';
		var p_left = '';
		//双人模式下，选中的用户个数，为了判断喜洋洋和灰太狼是否都选中。
		var double_users = [0, 0];
		//记录上一次到达终点后的总得分
		var score_array = [0, 0];
		//记录上一次到达终点后的奖励分
		var award_array = [0, 0];
		//记录某一关的反应时间
		var reaction_time_1 = [];
		var reaction_time_2 = [];
		var onestep_one = 0;

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
		var parabola = function(a, left, interval_time, move_distance){
			return new Parabola({
			        el: '#users_'+(a+1),
			        offset: [move_distance, 0],
			        curvature: 0.05,
			        duration: interval_time[0],
			        callback:function(){
			        	if(onestep_one == 0){

			        		if(level == 4 || level == 5 || level == 9 || level == 10 || level == 14 || level == 15){
			            		if(($('#users_'+(a+1)).position().left+14) < left){
					            	setTimeout(function(){
					            		parabolaJump(a, left, interval_time, move_distance);
					            	}, interval_time[1]);			            	
					            }else{
					            	$('.jump').css('display', 'none');
					            	phase(a);
					            }
				            }else{
				            	if(($('#users_'+(a+1)).position().left+1) < left){
					            	setTimeout(function(){
					            		parabolaJump(a, left, interval_time, move_distance);
					            	}, interval_time[1]);			            	
					            }else{
					            	$('.jump').css('display', 'none');
					            	phase(a);
					            }	
				            }			        		

			        	}else{

			        		if(($('#users_'+(a+1)).position().left+1) < left){
				            				            	
				            }else{
				            	$('.jump').css('display', 'none');
				            	phase(a);
				            }

			        	}			            
			            
			        }
			       });
		}
		
		/*
		*根据level取得终点的位置
		*/
		var levelToEndpos = function(level){
			var result = 0;			

			if(level == 1 || level == 2 || level == 6 || level == 7 || level == 11 || level ==12){
				result = 10;
			}else if(level == 3 || level == 8 || level == 13){
				result = 20;				 
			}else if(level == 4 || level == 5 || level == 9 || level == 10 || level == 14 || level ==15){
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

			if(level < 6){
				if(users_step[0] > users_step[1]){
					result = users_step[0];
				}else{
					result = users_step[1];
				}
			}else{
				if(choose_type == 'add'){
	    			//加法
	    			result = users_step[0]+users_step[1];
	    		}else{
	    			//减法
	    			result = Math.abs(users_step[0]-users_step[1]);
	    		}
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
    				Numset_1 += temp*3;
    			}else{
    				radiolist1set_2 += temp*3;
    				Numset_2 += temp*3;
    			}    			
    		}
		}

		/*
		*电脑自动移动时，需要找到它的目标地点
		*/
		var findTarget = function(a){
			var result = 0;
			
			if(now_position[a] != 0){
				var dom_array = $('#users_'+(a+1)+'_tr td');
				for(var i=0, l=dom_array.length; i<l; i++){
					if($(dom_array[i]).text() == now_position[a]){
						result = $(dom_array[i]).position().left;
					}
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
    			//记录准确度
    			radiolist3set_1.push(1);
    			radiolist4set_1 += 1;
    			getBaseScore(a);
			}else{
				//记录计算总次数
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

			result += '<td style="background:url(images/start.png) no-repeat -6px"><p></p></td>';
			if(level == 1 || level == 2 || level == 6 || level == 7 || level == 11 || level == 12){
				for(var i = 1; i < 11; i++){
					$('.road').css('width', '516');
					result += '<td style="background:'+color_tr[i-1]+'; color:'+color_p[i-1]+'; height:50px;"><p style="line-height:50px">'+i+'</p></td>'; 
				}
				$('.road .users_2').css('left', '0');
				$('.road .users_1').css('left', '0');
				$('.road .users_2').css('background', 'url(images/user2_50.png) center no-repeat');
				$('.road .users_1').css('background', 'url(images/user1_50.png) center no-repeat');
			}else if(level == 3 || level == 8 || level == 13){
				for(var i = 1; i < 21; i++){
					$('.road').css('width', '946');
					result += '<td style="background:'+color_tr[(i-1)%10]+'; color:'+color_p[(i-1)%10]+'; height:50px;"><p style="line-height:50px">'+i+'</p></td>';
				}
				$('.road .users_2').css('left', '0');
				$('.road .users_1').css('left', '0');
				$('.road .users_2').css('background', 'url(images/user2_50.png) center no-repeat');
				$('.road .users_1').css('background', 'url(images/user1_50.png) center no-repeat');				 
			}else if(level == 4 || level == 5 || level == 9 || level == 10 || level == 14 || level == 15){
				$('.road').css('width', '987');
				for(var i = 1; i < 31; i++){
					result += '<td style="background:'+color_tr[(i-1)%10]+'; color:'+color_p[(i-1)%10]+'; width:30px; height:33px; line-height:33px"><p style="line-height:33px">'+i+'</p></td>';
				}
				$('.road .users_2').css('left', '13px');
				$('.road .users_1').css('left', '13px');
				$('.road .users_2').css('background', 'url(images/user2_30.png) center no-repeat');
				$('.road .users_1').css('background', 'url(images/user1_30.png) center no-repeat');
			}else{
				return;
			}
			result += '<td style="background:url(images/end.png) no-repeat -6px"><p></p></td>';

			return result;
		}

		/*根据级数返回随机数
		*输入：级数
		*输出：随机数
		*/
		var level_to_step = function(level){
			var result = 0;			

			if(level == 1 || level == 6 || level == 11){
				result = Math.ceil(Math.random()*2);
			}else if(level == 2 || level == 7 || level == 12){
				result = Math.ceil(Math.random()*3);
			}else if(level == 3 || level == 4 || level == 8 || level == 9 || level == 13 || level == 14){
				result = Math.ceil(Math.random()*5);
			}else if(level == 5 || level == 10 || level == 15){
				result = Math.ceil(Math.random()*10);
			}else{
				console.log('level error, in level_to_step, level='+level);
			}

			return result;
		}

		/*
		*计算速度加分，无返回值
		*/
		var speedScore = function(a){

			if(users_time[a] > 1000){

				if(users_time[a] < 2000){
					if(a == 0){
						radiolist2set_1 += 3;
						Numset_1 += 3;
					}else{
						radiolist2set_2 += 3;
						Numset_2 += 3;
					}				
				}else if(users_time[a] < 3000){
					if(a == 0){
						radiolist2set_1 += 2;
						Numset_1 += 2;
					}else{
						radiolist2set_2 += 2;
						Numset_2 += 2;
					}
				}else if(users_time[a] < 4000){
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

			}			

		};

		var parabolaJump = function(a, left, interval_time){

			var user = {};

			if(level == 4 || level == 5 || level == 9 || level == 10 || level == 14 || level == 15){				
				user = parabola(a, left, interval_time, 30);				
			}else{
				user = parabola(a, left, interval_time, 43);
			}
			if($('#users_'+(a+1)).position().left < left){
				user.start();
			}else{
				$('.jump').css('display', 'none');
			    phase(a);
			}	
		}		

		/*
		*如果移动的距离未超过终点,只是为了把startMove切分一下
		*/
		var stepInEnd = function(a){

			if(click_target == -1){
				//来自singleroad
				equal_first_result = 1;
				record_6341(a); 
				
				now_position[a] = +(now_position[a]+step);
				var left_val = findTarget(a);
				$('.jump').css('display', 'block');				
				p_a = a;
				p_left = left_val;
							
			}else{
				//来自trClick
				var pos = $(click_target).text();
				//minus, start， 数字相等，需要得到原地的text，但是为空，需要赋为0
				if(pos == ''){
					pos = 0;
				}
				if(now_position[a]+step == pos){					
					equal_first_result = 1;
					if(single_sto != ''){
						clearTimeout(single_sto);
					}						
					record_6341(a);
						
					var left_val = $(click_target).position().left;	    			
	    			

	    			if(step != 0){
	    				$('.jump').css('display', 'block');	    				
	    				p_a = a;
						p_left = left_val;	    				
	    				now_position[a] = +pos;
	    			}else{
	    				phase(a);
	    			}	    		
	    			
	    				    				        			
	    		}else{
	    			alert('您算错啦！');
	    			click_target == -1;
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
		}

		/*
		*如果移动的距离超过终点,
		*/
		var stepOverEnd = function(a){

			if(click_target == -1){
				//来自singleroad
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

				$('.jump').css('display', 'block');				
				p_a = a;
				p_left = left_val+43;			
			}else{
				//来自trClick
				var pos = $(click_target).text();
				//minus, start， 数字相等，需要得到原地的text，但是为空，需要赋为0
				if(pos == ''){
					pos = 0;
				}				
				if(pos == end_position){				
					equal_first_result = 1;
					if(single_sto != ''){
						clearTimeout(single_sto);
					}						
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
	    			var left_val = $(click_target).position().left;

	    			$('.jump').css('display', 'block');	    			
	    			p_a = a;
					p_left = left_val+43;	    			    
				}else{
					alert('您算错啦！');
					click_target == -1;
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
		}

		/*
		*距离和终点的中转站
		*/
		var stepAndEnd = function(a){

			end_position = levelToEndpos(level);

			if(model == 'double'){

				//如果移动的距离超过终点						
				if(now_position[a]+step >= end_position){

					stepOverEnd(a);

				}else{

					stepInEnd(a);

				}

			}else{

				//如果移动的距离超过终点						
				if(now_position[a]+step >= end_position){

					stepOverEnd(a);

				}else{

					stepInEnd(a);

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
			
			if(e != ''){
				e = e || window.event;
				click_target = e.target || e.srcElement;	
			}else{
				click_target = -1;
			}						

			stepAndEnd(a);
			
		}

		/*
		*tr的点击事件处理程序:单人模式下，给用户添加事件
		*/
		var trClick = function(a, e){			
			
			//判断user click是否完成
			if((click_array[a] == 1) && (click_array[1-a] == 1)){
				//用户点击完成

				//跑动距离
				step = getStep();

				if(model == 'single'){
					//单人模式，不需要它比较大小
					//数字大
					//之前没有点击过
					if(click_array[a+2] == 0){

						//计算反应时间
			    		end_click = Date.now();
						users_time[a] = end_click-start_click;
						if(a == 0){
							reaction_time_1.push(users_time[a])
							Timeset_1.push(users_time[a]);
						}else{
							reaction_time_2.push(users_time[a])
							Timeset_2.push(users_time[a]);
						}

						startMove(a, e);

					}else{
						console.error('click already');
					}
				}else{
					//双人模式，需要它比较大小
					if(users_step[a] < users_step[1-a]){
						
					}else if(users_step[a] == users_step[1-a]){
						//数字相同


						//之前没有点击过
						if(click_array[a+2] == 0){

							//计算反应时间
				    		end_click = Date.now();
							users_time[a] = end_click-start_click;
							if(a == 0){
								reaction_time_1.push(users_time[a])
								Timeset_1.push(users_time[a]);
							}else{
								reaction_time_2.push(users_time[a])
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

							end_click = Date.now();
							users_time[a] = end_click-start_click;
							if(a == 0){
								reaction_time_1.push(users_time[a])
								Timeset_1.push(users_time[a]);
							}else{
								reaction_time_2.push(users_time[a])
								Timeset_2.push(users_time[a]);
							}

							startMove(a, e);

						}else{
							console.error('click already');
						}
					}

				}			
        		
			}else{
				console.error('还有用户未点击');				
			}
		};

		/*
		*a为电脑 数字变气球 负责检查数字大小 决定road点击和变化;都是电脑move的情况
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

						end_click = Date.now();
						users_time[1-user_id] = end_click-start_click;
						if(user_id == 0){
							reaction_time_2.push(users_time[1-user_id])
							Timeset_2.push(users_time[1-user_id]);
						}else{
							reaction_time_1.push(users_time[1-user_id])
							Timeset_1.push(users_time[1-user_id]);
						}

						startMove(1-user_id, '');

					}else{
						console.error('click already');
					}

				}else if(users_step[user_id] == users_step[1-user_id]){					
					//数字大小相同

					//产生一个10-20s的随机数
					var ran_time = Math.random()*10000+10000;
					single_sto = setTimeout(function(){						

						//之前没有点击过
						if(click_array[3-user_id] == 0){

							//计算反应时间
				    		end_click = Date.now();
							users_time[1-user_id] = end_click-start_click;
							if(user_id == 0){
								reaction_time_2.push(users_time[1-user_id])
								Timeset_2.push(users_time[1-user_id]);
							}else{
								reaction_time_1.push(users_time[1-user_id])
								Timeset_1.push(users_time[1-user_id]);
							}

							//这里不需要判断用户的情况，如果没有被cleartimeout，则继续执行
							startMove(1-user_id, '');							

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
		*user的点击事件处理程序
		*/
		var userClick = function(a){			

			//如果没有点击过
			if(click_array[a] == 0){				

				var pos = $('#users_'+(a+1)+'_b').position();
				        
		        $('#users_'+(a+1)+'_b').animate({
		              'top':pos.top - 65 + 'px'
		          }, 150, 'swing', function(){
		            $('#users_'+(a+1)+'_bal').removeClass('balloon').addClass('broke_num');  
		            users_step[a] = level_to_step(level);    
		            $('#users_'+(a+1)+'_bal').html('<p>'+users_step[a]+'</p>');
		          });

		        click_array[a] = 1;
				start_click = Date.now();				

		        setTimeout(function(){
		            $('#users_'+(a+1)+'_b').animate({
		            'top': pos.top + 'px'
		            }, 150, 'swing', function(){	            	

		            	if(model == 'single'){
		            		if(a == user_id){
		            			userClick(1-a);
		            			console.log('电脑开始点击');
		            		}else{
		            			console.log('开始比较大小');
		            			singleRoad();
		            		}
		            	}		                  
		            });
		        }, 150);				
			}
		};

		/*
		*dialog close之后，给气球和road添加的事件
		*
		*/
		var addEvent = function(){			

			if(model == 'double'){

				//点击user的气球			
				$('#users_1_bal').on('click', function(){
					userClick(0);	
				});
				
				//为user 的tr加click事件
				$('#users_1_tr').on('click', function(e){
					//点击tr的事件处理函数
					trClick(0, e);				
				});	

				//点击user的气球			
				$('#users_2_bal').on('click', function(){
					userClick(1);	
				});
				
				//为user 的tr加click事件
				$('#users_2_tr').on('click', function(e){
					//点击tr的事件处理函数
					trClick(1, e);				
				});			

			}else{
			//单人模式

				if(user_id == 0){

					//给1添加点击事件 点击user的气球								
					$('#users_1_bal').on('click', function(){
						userClick(0);	
					});

					//为user 的tr加click事件
					$('#users_1_tr').on('click', function(e){
						//点击tr的事件处理函数
						trClick(0, e);				
					});

				}else{

					//给2添加点击事件 点击user的气球								
					$('#users_2_bal').on('click', function(){
						userClick(1);	
					});

					//为user 的tr加click事件
					$('#users_2_tr').on('click', function(e){
						//点击tr的事件处理函数
						trClick(1, e);				
					});
					
				}

			}

		};

		//程序开始前的准备工作:对话框--addEvent;
		var prepare = function() {
			$('#one-step').on('click', function(){
				$('#one-step').css('border', '1px solid yellow');
				$('#slow-jump').css('border', '');
				$('#fast-jump').css('border', '');
				parabola_array = [250, 100];
				onestep_one = 1;								
				parabolaJump(p_a, p_left, parabola_array);					
			})			

			$('#fast-jump').on('click', function(){
				$('#fast-jump').css('border', '1px solid yellow');
				$('#slow-jump').css('border', '');
				$('#one-step').css('border', '');
				parabola_array = [100, 10];				
				parabolaJump(p_a, p_left, parabola_array);					
			})

			$('#slow-jump').on('click', function(){
				$('#slow-jump').css('border', '1px solid yellow');
				$('#fast-jump').css('border', '');
				$('#one-step').css('border', '');
				parabola_array = [250, 100];
				parabolaJump(p_a, p_left, parabola_array);	
			})

			$('#choose_1').on('click', function(){
				if(model == 'single'){
					user_id = 0;
				}				
				$( "#select_animal" ).dialog( "close" );
				$('#choose_1').css('display', 'none');
	        	$('#choose_2').css('display', 'none');
	        	addEvent();
				
			});

			$('#choose_2').on('click', function(){
				if(model == 'single'){
					user_id = 1;
				}				
				$( "#select_animal" ).dialog( "close" );
				$('#choose_1').css('display', 'none');
	        	$('#choose_2').css('display', 'none');
	        	addEvent();
				
			});

			//单人模式，双人模式对话框
			$('#select_level').dialog({
				resizable: false,
				width:370,
		    	height:470,
		        modal: true,
		        buttons: {
		        	"开始": function(){
		        		level = $('input[name="level"]:checked').val();
		        		if(level == 6 || level == 7 || level == 8 || level == 9 || level == 10){
		        			choose_type = 'add';
		        		}else if(level == 11 || level == 12 || level == 13 || level == 14 || level == 15){
							choose_type = 'minus';
		        		}else{
		        			console.log('no need click ,level = 1, 2, 3, 4, 5');
		        		}
		        		//改变格子
		        		var road_content = level_to_road(level);
		        		
		        		$('tr').html('');
						$('tr').append(road_content);
						
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
					        	$('#choose_1').css('display', 'inline-block');
					        	$('#choose_2').css('display', 'inline-block');
					        	$( "#select_model" ).dialog( "close" );
					            $( "#select_animal" ).dialog({
							      resizable: false,
							      height:190,
							      modal: true				      
							    });					        						            		            
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
				single_sto = '';
				onestep_one = 0;

				//把数字变为气球
				$('#users_1_bal').html('<img src="images/click.png"><p>点这里</p>');
				$('#users_1_bal').removeClass('broke_num').addClass('balloon');
				$('#users_2_bal').html('<img src="images/click.png"><p>点这里</p>');
				$('#users_2_bal').removeClass('broke_num').addClass('balloon');	
				$('.jump').css('display', 'none');	
				radiolist6set_1 = radiolist4set_1/radiolist5set_1;
				radiolist6set_2 = radiolist4set_2/radiolist5set_2;
				out();

				//有没有到终点
				if(end_score == 0){
					//没有到终点
				}else{
					
					//到终点
					now_position = [0, 0];
					//判断是进行下一次游戏还是下一关游戏
			 		var normative_score = normativeScore(end_score);

			 		//每一关结束后，会出现显示结果的对话框，以下为对话框赋值
			 		$('#score_1').text(Numset_1-score_array[0]);
			 		$('#score_2').text(Numset_2-score_array[1]);
			 		$('#award_1').text(radiolist2set_1-award_array[0]);
			 		$('#award_2').text(radiolist2set_2-award_array[1]);
			 		var average_1 = 0;
			 		var average_2 = 0;
			 		for(var i=0; i<reaction_time_1.length; i++){
			 			average_1 += reaction_time_1[i];
			 		}
			 		average_1 = average_1/reaction_time_1.length;
			 		for(var i=0; i<reaction_time_2.length; i++){
			 			average_2 += reaction_time_2[i];
			 		}
			 		average_2 = average_2/reaction_time_2.length;
			 		$('#average_time_1').text(average_1);
			 		$('#average_time_2').text(average_2);

			 		//每一关需要记录的数据 初始化
			 		score_array[0] = Numset_1;
					score_array[1] = Numset_2;
					award_array[0] = radiolist2set_1;
					award_array[1] = radiolist2set_2;
					reaction_time_1 = [];
					reaction_time_2 = [];

					$( "#show_result" ).css('display', 'block');
			 		$( "#show_result" ).dialog({
								      resizable: false,
								      height:190,
								      modal: true,
								      buttons: {
								      	'返回':function(){
								      		$('#select_level').dialog({
												resizable: false,
												width:370,
										    	height:470,
										        modal: true,
										        buttons: {
										        	'开始': function(){
										        		level = $('input[name="level"]:checked').val();
										        		if(level == 6 || level == 7 || level == 8 || level == 9 || level == 10){
										        			choose_type = 'add';
										        		}else if(level == 11 || level == 12 || level == 13 || level == 14 || level == 15){
															choose_type = 'minus';
										        		}else{
										        			console.log('no need click ,level = 1, 2, 3, 4, 5');
										        		}
										        		//改变格子
										        		var road_content = level_to_road(level);
										        		
										        		$('tr').html('');
														$('tr').append(road_content);

														$( "#show_result" ).css('display', 'block');
														$( "#show_result" ).dialog( "close" );
														$( "#select_level" ).dialog( "close" );
										        	}
										        }
										    });
								      		
								      	}
								      }				      
								    });

			 		if(normative_score > 4){
			 			//下一关游戏			 			
			 			if(level == 15){
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
			 				if(level > 10){
			 					choose_type = 'minus';
			 				}
			 							 			
				 			//改变格子			 			
							var road_content = level_to_road(level);
							$('tr').html('');
							$('tr').append(road_content);							
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






