var canvas = document.body.appendChild(document.createElement("CANVAS"));
canvas.style.cssText = "border:2px inset;";
canvas.width = canvas.height = 500;

CanvasRenderingContext2D.prototype.circle = function(cx, cy, radius){
	this.arc(cx, cy, radius, 0, Math.PI * 2, true);
};

var ctx = canvas.getContext("2d");
//ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(canvas.width, canvas.height); ctx.stroke();
ctx.translate(0, +canvas.height); ctx.scale(1,-1);
var zoom = 100; ctx.scale(zoom, zoom); ctx.lineWidth = 1/zoom;

[
	[
		{start:{x:1,y:1},end:{x:2,y:2}},
		{start:{x:1,y:2},end:{x:2,y:1}},
		{x:1.5,y:1.5}
	],
	[
		{start:{x:1,y:1},end:{x:2,y:2}},
		{start:{x:2,y:1},end:{x:3,y:0}},
		null
	],
	[
		{start:{x:2,y:2},end:{x:2,y:0}},
		{start:{x:1,y:1},end:{x:3,y:0.5}},
		{x:2, y:0.75}
	],
	[
		{start:{x:2,y:2},end:{x:2,y:0}},
		{start:{x:2,y:1},end:{x:4,y:1}},
		null
	]
].forEach((function(){
	function test(a, b, expected) {
		var i = intersect.lineSeg.withLineSeg["2D"](
			a.start.x, a.start.y, a.end.x, a.end.y,
			b.start.x, b.start.y, b.end.x, b.end.y
		);

		ctx.beginPath();
			ctx.moveTo(a.start.x, a.start.y);
			ctx.lineTo(a.end.x, a.end.y);
			ctx.stroke();

		ctx.beginPath();
			ctx.moveTo(b.start.x, b.start.y);
			ctx.lineTo(b.end.x, b.end.y);
			ctx.stroke();

		if (i) {
			ctx.beginPath();
				ctx.circle(i.x, i.y, 10 / zoom);
				ctx.stroke();
		}

		if (
			((expected === null) !== (i === null)) ||
			(
				(expected !== null) &&
				((i.x !== expected.x) || (i.y !== expected.y))
			)
		) {
			console.log("Line a:", a);
			console.log("Line b:", b);
			console.log("Intersect:", i);
			console.log("Expected intersect:", expected);
			throw "Test failed";
		}

		ctx.clearRect(0, 0, canvas.width / zoom, canvas.height / zoom);
	}
	
	return function(input) {
		var a=input[0], b=input[1], expected=input[2];
		
		var off;

		test(a, b, expected);

		off = a.start; a.start=a.end; a.end=off;
		off = b.start; b.start=b.end; b.end=off;
		off=null;
		test(a, b, expected);

		off=a; a=b; b=off; off=null;
		test(a, b, expected);
	}

})());
console.log("Line Segment - Line Segment Intersection tests passed");

[
	[
		{start:{x:1,y:1},end:{x:3,y:3}},
		{x:2,y:2,r:1},
		[
			{x:2.7071067811865475,y:2.7071067811865475},
			{x:1.2928932188134525,y:1.2928932188134525}
		]
	],
	[
		{start:{x:1,y:3},end:{x:3,y:3}},
		{x:2,y:2,r:1},
		{x:2,y:3}
	],
	[
		{start:{x:1,y:1},end:{x:1,y:3}},
		{x:2,y:2,r:1},
		{x:1,y:2}
	],
	[
		{start:{x:1,y:1}, end:{x:1.5, y:3}},
		{x:3,y:2,r:1},
		null
	],
	[
		{start:{x:1,y:1}, end:{x:1, y:3}},
		{x:3,y:2,r:1},
		null
	],
	[
		{start:{x:1,y:4}, end:{x:3, y:4}},
		{x:3,y:2,r:1},
		null
	]

].forEach((function(){
	function test(a, c, expected) {
		var i = intersect.lineSeg.withCircle["2D"](
			a.start.x, a.start.y, a.end.x, a.end.y,
			c.x, c.y, c.r
		);
		
		if(i && i[0] && isNaN(i[0].x)){
 			debugger;
			intersect.lineSeg.withCircle["2D"](
				a.start.x, a.start.y, a.end.x, a.end.y,
				c.x, c.y, c.r
			);
		}
		
		ctx.beginPath();
			ctx.moveTo(a.start.x, a.start.y);
			ctx.lineTo(a.end.x, a.end.y);
			ctx.stroke();
			
		ctx.beginPath();
			ctx.circle(c.x, c.y, c.r);
			ctx.stroke();
			
		if(i){
			var size = (10/zoom), halfSize = size/2;
			if(i.length===2){
				ctx.strokeRect(
					i[0].x-halfSize, i[0].y-halfSize,
					size, size
				);
				ctx.strokeRect(
					i[1].x-halfSize, i[1].y-halfSize,
					size, size
				);
			}
			else{
				ctx.strokeRect(
					i.x-halfSize, i.y+halfSize,
					size, size
				);				
			}
		}
		
		var success;
		if(Array.isArray(expected)){
			success = (
				Array.isArray(i) &&
				(expected[0].x===i[0].x) &&
				(expected[0].y===i[0].y) &&
				(expected[1].x===i[1].x) &&
				(expected[1].y===i[1].y)
			);
		}
		else if(expected === null) {
			success=(i===null);
		}
		else {
			success = (
				(expected.x===i.x) &&
				(expected.y===i.y)
			);
		}

		if(!success) {
			console.log("line:", a);
			console.log("circle:", c);
			console.log("got:", i);
			console.log("expected:", expected);
			throw "Test failed";
		}
		
		ctx.clearRect(0,0,canvas.width/zoom,canvas.height/zoom);
	}
	
	return function(input) {
		var a = input[0], c = input[1], expected = input[2];
		test(a, c, expected);
		
		var off = a.start; a.start=a.end; a.end = off; off=null;
		test(a, c, expected);
	};
})());
console.log("Line Segment - Circle Intersect tests passed");
