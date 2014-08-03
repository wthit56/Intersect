var intersect = {
	lineSeg: {
		withLineSeg: {
			"2D": function(a1x, a1y, a2x, a2y,  b1x, b1y, b2x, b2y, output) {
				var off;
				if(
					(a1x>a2x) ||
					((a1x===a2x)&&(a1y<a2y))
				){
					off=a1x;
					a1x=a2x;
					a2x=off;

					off=a1y;
					a1y=a2y;
					a2y=off;
				}

				if(
					(b1x>b2x)||
					((b1x===b2x)&&(b1y<b2y))
				){
					off=b1x;
					b1x=b2x;
					b2x=off;

					off=b1y;
					b1y=b2y;
					b2y=off;
				}

				if(!output){output = {x:0, y:0};}

				if(a1x===a2x){
					if(b1x===b2x){return null;}
					else{
						//console.log("swap");
						off=a1x; a1x=b1x; b1x=off;
						off=a1y; a1y=b1y; b1y=off;
						off=a2x; a2x=b2x; b2x=off;
						off=a2y; a2y=b2y; b2y=off;
						
						/*
						console.log("a:",a1x,a1y,a2x,a2y);
						console.log("b:",b1x,b1y,b2x,b2y);
						//*/
					}
				}
				if(b1x===b2x){					
					//console.log("vert b", b1x);
					if((a1x>b1x)||(a2x<b1x)){
						return null;
					}
					else if(a1y===a2y){
						//console.log("horizontal a", a1y);
						if((a1x>=b1x)||(a2x<=b1x)){
							return null;
						}
						else{
							output.x=b1x; output.y=a1y;
						}
					}
					else{
						//console.log("sloped a");
						var f=(b1x-a1x) / (a2x-a1x);
						var y = a1y + (f*(a2y-a1y));
						//console.log(b1x, a1x, a2x, a1x);
						//console.log(f, y);
						if((y>=b1y)||(y<=b2y)){
							return null;
						}
						else {
							output.x=b1x; output.y=y;
						}
					}
				}
				else{
					//console.log("sloped lines");
					
					var as = (a2y-a1y) / (a2x-a1x), ai = a1y - (a1x*as),
						bs = (b2y-b1y) / (b2x-b1x), bi = b1y - (b1x*bs);

					/*
					console.log("a = ("+a1x+","+a1y+")-("+a2x+","+a2y+") => y = "+as+"x + "+ai);
					console.log("b = ("+b1x+","+b1y+")-("+b2x+","+b2y+") => y = "+bs+"x + "+bi);
					//*/
					// (as!==bs) &&
					var x = (-ai+bi) / (as-bs), y;

					if((x<=a1x)||(x>=a2x)||(x<=b1x)||(x>=b2x)){
						return null;
					}
					/*	
					console.log(as+"x + "+ai+" = "+bs+"x + "+bi)
					console.log(as+"x + "+-bs+"x = "+-ai+" + "+bi);
					console.log((as-bs)+"x = "+(-ai+bi));
					console.log("/ "+(as-bs));
					console.log("x = "+x);
					//*/
					if(as.toString().length<=bs.toString().length){
						y=(as*x)+ai;
					}
					else {
						y=(bs*x)+bi;
					}

					/*
					ctx.beginPath();
						ctx.circle(x, y, 10/zoom);
						ctx.stroke();

					console.log(x, y, (y > a1y) && (y < a2y));
					*/

					output.x=x;
					output.y=y;
				}
				
				return output;
			}
		},
		withCircle: {
			"2D": function(a1x, a1y, a2x, a2y, cx, cy, cr){
				// line = Ax + B
				// circle = +-sqrt((x-X)^2 + (y-Y)^2)
				
				var off;
				if(a1x>a2x){
					//console.log("swap");
					off = a1x; a1x = a2x; a2x = off;
					off = a1y; a1y = a2y; a2y = off;
				}
				
				if(a1x===a2x){ // vertical
					if((a1x<cx-cr)||(a1x>cx+cr)){
						return null;
					}
					else if((a1x===cx-cr)||(a1x===cx+cr)) {
						return {x:a1x,y:cy};
					}
					else{
						// r^2 = (x-X)^2 + (y-Y)^2
						// 0 = (x-X)^2 + (y-Y)^2 - r^2
						// 0 = (x-A)(x-A) + (y-B)(y-B) - r^2
						// 0 = A^2-xA-xA+x^2+B^2-By-By+y^2-r^2
						// 0 = A^2-2xA+x^2+B^2-2By+y^2-r^2
						// -y^2 = A^2-2xA+x^2+B^2-2By+y^2-r^2
						// y^2 = -A^2+2xA-x^2-B^2+2By-y^2+r^2
						// y = +-sqrt(-A^2+2xA-x^2-B^2+2By-y^2+r^2)
						
						var sqrt = Math.sqrt(((a1x-cx)*(a1x-cx)) - (cr*cr));
						return [
							{x:a1x,y:cy+sqrt},
							{x:a1x,y:cy-sqrt}
						];
						
						// cos(a) = adj/hyp
						// 
						
						//Math.sqrt( ((a1x-cx)*(a1x-cx)) +  );
					}
				}
				else {
					var as = (a2y - a1y) / (a2x - a1x),
						ai = a1y - (a1x * as);

					var x = (as*as) + 1,
						y = 2 * ((ai*as)-cx-(cy*as)),
						z = (cx*cx) - (2*ai*cy) + (cy*cy)+(ai*ai)-(cr*cr);

					var sqrt = (y*y) - (4*x*z);
					//console.log("sqrt:", sqrt);
					if(sqrt===0){
						//console.log("tangent");

						var ix = -y / (2*x);
						if((ix<a1x)||(ix>a2x)){
							return null;
						}
						else{
							return {x:ix, y:(ix*as) + ai};
						}
					}
					else if(sqrt<0){
						return null;
					}
					else {
						//console.log("cross");

						var output;
						sqrt = Math.sqrt(sqrt);
						var x2 = (2*x), ix = (-y + sqrt) / x2;
						if((ix<a1x)||(ix>a2x)){
							return null;
						}
						else{
							output = {x:ix,y:(ix*as)+ai};
						}

						ix = (-y - sqrt) / x2;
						if((ix<a1x)||(ix>a2x)){
							return output ? output : null;
						}
						else{
							//console.log("second");
							var o2 = {x:ix,y:(ix*as)+ai};
							if(output){
								return [output, o2];
							}
							else{return o2;}
						}
					}
				}
			}
		}
	}
};
