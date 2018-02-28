/* global Card */
/* global Deck */
/* global angular */
var set = angular.module('set', ['ngRoute']);

set.factory('Data', 
function(){
	return {
		icons: ['heart', 'asterisk', 'cloud'],
		deck : {},
		state: 'waiting',
		mode: 'classic',
		modes: ['classic', 'infinite', 'daily'],
		allCards: Card.enumCards,
		topScores: [],
		scoreCard: 
		{
			startTime: null,
			endTime: null,
			timeTaken: {minutes: 0, seconds: 0},
			message: "",
			name: "Anonymous",
			rank: 0
		},
		showScoreCard: false
	};
});

set.controller('bodyController',
function($scope, Data){
	$scope.Data = Data;
});

set.controller('scoreCardController',
function($scope, Data){
	$scope.Data = Data;
	$scope.submitScore = function(){
		$scope.$emit('submitScore');
	};
});

set.controller('navController',
function($scope, Data){

	$scope.Data = Data;

	$scope.generateNewDeck = function(){
		$scope.$emit('generateNewDeck');
	};

	$scope.changeMode = function(mode){
		$scope.Data.mode = mode;
		$scope.generateNewDeck();
	};

	$scope.getHelp = function(){
		$scope.$emit('getHelp');
	};
});


// deck controller
set.controller('deckController',
function($scope, $rootScope, $timeout, $http, Data){

	$scope.Data = Data;
	
	$scope.getList = function(number){
		var list = [];
		for(var i = 0; i < number; i++)
			list.push(i);
		return list;
	};
	
	var initializeNewDeck = function(){
		Data.deck = new Deck(12, 6, 100);
	};
	
	var checkSelection = function(){
		var isSet = Data.deck.checkIfNewSet();
		if (!isSet) Data.state = 'failure';
		else{
			Data.state = 'success';
			Data.deck.score++;
			if(Data.mode == 'classic' || Data.mode == 'daily') 
				Data.deck.setsFound.push(Card.Sort(Data.deck.selectedCards));
			if(Data.mode == 'infinite')
				Data.deck.putNewCards();
		}
	};
	
	var afterSetAttempt = function(){
		Data.deck.clearSelection();
		Data.state = 'waiting';	
		if(Data.deck.setsFound.length == Data.deck.totalSets.length){
			endOfGame();
		}
	};
	
	var endOfGame = function(){
		Data.scoreCard.endTime = new Date();
		var timeTaken = Data.scoreCard.endTime - Data.scoreCard.startTime;
		Data.scoreCard.timeTaken.minutes = Math.floor(timeTaken/(1000*60));	
		Data.scoreCard.timeTaken.seconds = Math.floor((timeTaken/(1000))%60);
		Data.showScoreCard = true;
		
		if(Data.mode == 'daily'){
			Data.scoreCard.rank = getRank();
			Data.topScores.splice(Data.scoreCard.rank, 0, Data.scoreCard);
		}
	};
	
	$rootScope.$on('submitScore', function(){
		$http.put('/api/daily', JSON.stringify(Data.topScores));
		Data.showScoreCard = false;
		Data.mode = 'classic';
		$scope.$emit('generateNewDeck');
	});

	var getRank = function(){
		var timeTaken = Data.scoreCard.endTime - Data.scoreCard.startTime;
		for(var i = 0; i < Data.topScores.length; i++){
			var topTimeTaken = Date.parse(Data.topScores[i].endTime) - Date.parse(Data.topScores[i].startTime);
			if(timeTaken < topTimeTaken)
				break;
		}
		return i;
	}

	// card Click event handler
	$scope.toggleCard = function(position){
		Data.deck.toggleCardSelection(Data.deck.cards[position]);
		if(Data.deck.selectedCards.length == 3){
			$timeout(function(){
				checkSelection();
				$timeout(function(){
					afterSetAttempt();					
				}, 500);
			}, 500);
		}
	};

	// on get help
	$rootScope.$on('getHelp', function(){
		for(var i = 0; i < Data.deck.totalSets.length; i++){
			Data.deck.clearSelection();
			for(var j = 0; j < 3; j++)
				Data.deck.toggleCardSelection(Data.deck.totalSets[i][j]);
			if(Data.deck.checkIfNewSet()){
				Data.deck.toggleCardSelection(Data.deck.totalSets[i][2]);
				break;
			}
		}
	});
	
	// generate New Deck event handler
	$rootScope.$on('generateNewDeck', function(){
		Data.scoreCard.startTime = new Date();
		Data.state = 'waiting';
		Data.showScoreCard = false;
		if(Data.mode == 'daily'){
			$http.get('/api/daily').then(
				function(response){
					Data.topScores = JSON.parse(response.data.topScores);
					Data.deck = JSON.parse(response.data.puzzle);
					Data.deck.__proto__ = Deck.prototype;
				},
				function(){
					Data.mode = 'classic';
					initializeNewDeck();
				}
			)
		}
		if(Data.mode != 'daily'){
			initializeNewDeck();
		}	
	});

	initializeNewDeck();
});
