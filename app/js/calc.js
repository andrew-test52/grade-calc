"use strict";
var weightLock = false, 
	numBoxes,
    $displayForm = "",
    $initForm,
    $displayBtns;

function init(){
	$displayBtns = $("#form-buttons");
	$initForm = $('#initForm');
	$initForm.on('submit', function(e){
		e.preventDefault();
		showCalc();
	});
}

function showCalc(){
	numBoxes = $('#grade-amount').val();
	$(".bg").removeClass("hide");
	$(".sm").addClass("hide");
	createForm(numBoxes);	
}

function createForm(fieldnums){
	var boxes = 1;
	for (var i=0; i<fieldnums; i++)
	{
		$displayForm += addGradeWeight(boxes);
		boxes=boxes+1;
	}
	$("#displayform").append($displayForm);
	addMainBtns();
}

function addGradeWeight(num){
	var newpar = "<p>";
	var gradeboxes = "<span class='gradeboxlabel'>Grade "+num+":</span> <input type='text' name='grade"+num+"' id='grade"+num+"' placeholder='Ex: A,b,C...' pattern='[a-zA-Z-+]+' title='Enter a letter grade.' minlength='1' maxlength='2'/>"
	var weightboxes = "<span class='weighboxlabel'>Weight "+num+":</span> <input type='number' name='weight"+num+"' id='weight"+num+"'placeholder='Ex: 50,10,35,2,...'/>"
	var indibttns = "<input type='button' id='weight-lock"+num+"' class='indiv-weight button' value='Individual Lock' name='weight-lock"+num+"' onclick='lockIndiWeights("+num+");'/>"
	newpar += gradeboxes + weightboxes + indibttns;
	return newpar;
}

function addMainBtns(){
	var calcBtn = "<input type='submit' id='calculate' class='button' value='Calculate' name='calculate'/>";	
	$displayBtns.append(calcBtn);
	var weightBtn = "<a onclick='lockWeights();'><input type='button' id='weight-lock-global' class='button' value='Global Weight Lock' name='weight-lock-global'/></a>";
	$displayBtns.append(weightBtn);
	var startOvBtn = "<a onclick='refresh();'><input type='button' id='refresh' class='button' value='Start Over' name='refresh' /></a>";
	$displayBtns.append(startOvBtn);
}

function lockWeights(){
	if (weightLock == false){
		for (var q=1; q<=numBoxes; q++){
			$('#weight'+q).prop('disabled', true);
			$('#weight-lock'+q).val('Individual Un-Lock');
		}
		$('#weight-lock-global').val('Global Weight Un-Lock');
		weightLock = true;
	}
	else if (weightLock == true){
		for (var q=1; q<=numBoxes; q++){
			$('#weight'+q).prop('disabled', false);
			$('#weight-lock'+q).val('Individual Lock');
		}
		$('#weight-lock-global').val('Global Weight Lock');
		weightLock = false;
	}	
}

function lockIndiWeights(num){
	if ($("#weight"+num).prop('disabled') == true){
		$("#weight"+num).prop('disabled', false);
		$("#weight-lock"+num).val('Individual Lock');
		$('#weight-lock-global').val('Global Weight Lock');
		weightLock = false;
	}
	else{
		$("#weight"+num).prop('disabled', true);
		$("#weight-lock"+num).val('Individual Un-Lock');
		$('#weight-lock-global').val('Global Weight Un-Lock');
		weightLock = true;
	}
}

function startCalc(event){
	event.preventDefault();
	var checkW = weightIsCorrect(numBoxes);
	$(".displaygrade").remove();
	$(".incorrect").remove();
	if (checkW == 0){
		var arr = [];
		for (var i=1; i<=numBoxes; i++)
		{
			arr.push( weightedGrade( (letterToNumber( $('#grade'+i).val().toUpperCase()) ) , (($('#weight'+i).val())/100) ) );
		}
		var total = 0;

		for(var z=0;z<arr.length;z++)
		{
			total = total + arr[z];
		}

		displayGrade(total);
	}
	else{
		$("<p class='incorrect'>Your weights do not equal 100%.</p>").insertAfter(".mainform1");
	}
}

function weightIsCorrect(numBoxes){
	var WeightTrue=100;
	for (var j=1; j<=numBoxes; j++){
		WeightTrue = WeightTrue - ($('#weight'+j).val());
	}
	return WeightTrue;
}

function displayGrade(grade){
	$("<p class='displaygrade'>This student got a " + grade + "! This student gets an " + numberToLetter(grade) + "!</p>").insertAfter(".mainform1");
}

function weightedGrade(grade, weight){
	var val = grade * weight;
	return val;
}

function letterToNumber(letter){
	var numberGrades = {
		'A'  : 98,
		'A-' : 92, 
		'B+' : 88, 
		'B'  : 85, 
		'B-' : 82, 
		'C+' : 78, 
		'C'  : 75, 
		'C-' : 72, 
		'D+' : 68, 
		'D'  : 65, 
		'D-' : 62, 
		'F'  : 62
	};
	return numberGrades[letter];
}

function numberToLetter(number){
	if(number >= 95) return "A";
    if(number >= 90) return "A-";
    if(number >= 87) return "B+";
    if(number >= 84) return "B";
    if(number >= 80) return "B-";
    if(number >= 75) return "C+";
    if(number >= 70) return "C";
    if(number >= 65) return "D";
    return "F"
}

function refresh(){
	location.reload(true);
}

$(document).ready(init);