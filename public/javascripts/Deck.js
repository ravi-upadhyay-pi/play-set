// require Card
var Card = Card || require('./Card.js');
var module = module || {};

Deck = (function(Card){
	var Deck = function(count, minSet, maxSet){

		// check is such deck can be generated
		if(count > 81 || count < 1 || minSet > maxSet || minSet > ( (count) * (count - 1) ) / 6){
			return null;
		}

		// public members
		this.setsFound = [];
		this.score = 0;
		this.totalSets = [];
		this.cards = [];
		this.selectedCards = [];
		this.isSelected = [];
		this.count = count;
		this.minSet = minSet;
		this.maxSet = maxSet;

		// generate new cards on deck and find all sets
		while(this.cards.length != count || this.totalSets.length < minSet || this.totalSets.length > maxSet){
			this.cards = [];
			for(var i = 0; i < count; i++){
				this.cards.push(Card.generateNew(this.cards, i));
			}
			this.totalSets = Card.findAllSets(this.cards);
		}

		// mark all cards as unselected
		for(var i = 0; i < count; i++){
			this.isSelected.push(false);
		}
	}
	
	// method to toggle card selection 
	Deck.prototype.toggleCardSelection = function(card){
		if(this.isSelected[card.pos] == true){
			for(var i = 0; i < this.selectedCards.length; i++)
				if(card.pos == this.selectedCards[i].pos)
					break;
			this.selectedCards.splice(i, 1);
			this.isSelected[card.pos] = false;
		}
		else{
			this.isSelected[card.pos] = true;
			this.selectedCards.push(card);
		}
	};

	// method to check if new set(selected cards) found. Returns true or false.
	Deck.prototype.checkIfNewSet = function(){
		var isSet = Card.checkSet(this.selectedCards[0], this.selectedCards[1], this.selectedCards[2]);
		if(!isSet)
			return false;
		Card.Sort(this.selectedCards);
		for(var i = 0; i < this.setsFound.length; i++)
			if(this.setsFound[i][0].id == this.selectedCards[0].id && this.setsFound[i][1].id == this.selectedCards[1].id && this.setsFound[i][2].id == this.selectedCards[2].id)
				return false;
		return true;
	};

	// method to clear selection
	Deck.prototype.clearSelection = function(){
		this.isSelected = [];
		this.selectedCards = [];
		for(var i = 0; i < this.count; i++){
			this.isSelected.push(false);
		}
	};

	// puts 3 new cards on deck in place of selected cards
	// ensures that new totalsets on deck is updated
	Deck.prototype.putNewCards = function(){
		while(true){
			// generate 3 new cards that are not on deck with id same as those that are selected
			for(var i = 0; i < 3; i++)
				this.cards.push(Card.generateNew(this.cards, this.selectedCards[i].pos));
			// put those 3 cards in the place of selected cards
			for(var i = 0; i < 3; i++)
				this.cards[this.selectedCards[i].pos] = this.cards[this.count + i];
			// remove last 3 cards
			for(var i = 0; i < 3; i++)
				this.cards.pop();
			// count number of sets. if doesn't fall under constraint put selected cards back
			this.totalSets = Card.findAllSets(this.cards);
			if(this.totalSets.length < this.minSet || this.totalSets.length > this.maxSet)
				for(var i = 0; i < 3; i++)
					this.cards[this.selectedCards[i].pos] = this.selectedCards[i];
			else
				break;
		}
	};
	
	return Deck;
})(Card);

module.exports = Deck;
