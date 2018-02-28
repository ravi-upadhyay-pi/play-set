var module = module || {};

Card = (function(){

	// Cards are just index in the Card.enumCards list
	// properties of cards indentified by looking
	// up the properties of Card.enumCards
	var Card = function(position){
		this.id = Math.floor(Math.random() * 81);
		this.pos = position;
	};

	// enumerated cards
	Card.enumCards = [];
	for(var i = 0; i < 3; i++)
		for(var j = 0; j < 3; j++)
			for(var k = 0; k < 3; k++)
				for(var l = 0; l < 3; l++)
					Card.enumCards.push([i+1, j, k, l]);


	// private function to check if three 
	// arrtibutes are all same or mutually different
	function attributeCheck(a, b, c)
	{
		if(a == b && b == c)
			return true;
		if(a != b && b != c && a != c)
			return true;
		return false;
	}

	// static method to check if three cards form a set
	Card.checkSet = function(a, b, c){
		for(var i = 0; i < 4; i++){
			if(!attributeCheck(Card.enumCards[a.id][i], Card.enumCards[b.id][i], Card.enumCards[c.id][i]))
				return false;
		}
		return true;
	};

	// create a new card different from the ones in input list
	// TODO see the expected order of this method. If inefficient 
	// find other algorithm
	Card.generateNew = function(listCards, position){
		var temp = new Card(position);
		for(var j = 0; j < listCards.length; j++){
			if(temp.id == listCards[j].id){
				temp = new Card(position);
				j = -1;
			}
		}
		return temp;
	}

	// generate array of all sets. A set is array of id of 3 cards.
	// list of collection of 3 ids will be returned. Collection represents
	// a set. the id corresponds to the enumerated cards index. 
	// the collection will alwasy have the sorted ids
	Card.findAllSets = function(listCards){
		var setList = []
		for(var i = 0; i < listCards.length; i++){
			for(var j = i + 1; j < listCards.length; j++){
				for(var k = j + 1; k < listCards.length; k++){
					if(Card.checkSet(listCards[i], listCards[j], listCards[k]))
						setList.push( Card.Sort( [listCards[i], listCards[j], listCards[k]] ) );
				}
			}
		}
		return setList;
	}	

	Card.Sort = function(listCards){
		return listCards.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);})
	}

	return Card;
})();

module.exports = Card;